const {
  ConflictError,
  UserInputError,
  ForbiddenError,
  ApolloError,
} = require("apollo-server-core");
const User = require("../models/User");
const School = require("../models/School");
const VerificationCode = require("../models/VerificationCode");
const ResetPassword = require("../models/ResetPassword");
const validator = require("validator");
const bcrypt = require("bcrypt");
const { sendVerificationCode, onVerificationCodeSentError } = require("../verification");
const { sendPasswordReset, onPasswordResetSentError } = require("../resetPassword");

const UserResolver = {
  mutation: {
    signupSchool: async (parent, args, context) => {
      const { firstName, lastName, email, password, schoolName } = args;
      if (!validator.isEmail(email)) throw new UserInputError(`${email} is not a valid email`);
      const user = await User.findOne({ email });
      if (user) throw new ConflictError("user already exists");
      const school = await School.findOne({ name: schoolName });
      if (school) throw new ConflictError("school already exists");
      const hash = await bcrypt.hash(password, 10);
      if (!hash) throw new ApolloError("Something went wrong");
      const resUser = await User.create({
        firstName,
        lastName,
        email,
        hash,
        type: "SCHOOL_ADMIN",
        schoolId: schoolName,
      });
      if (!resUser) throw new ApolloError("Something went wrong");
      const resSchool = await School.create({ name: schoolName });
      if (!resSchool) throw new ApolloError("Something went wrong");

      try {
        await sendVerificationCode(resUser._id, email);
      } catch (err) {
        console.log(err);
        onVerificationCodeSentError(resUser._id, schoolName);
        throw new ApolloError("internal server error");
      }

      return { code: 200, success: true, message: "user and school created" };
    },
    signup: async (parent, args, context) => {
      const { firstName, lastName, email, password, type, schoolId } = args;
      if (!validator.isEmail(email)) throw new UserInputError(`${email} is not a valid email`);
      let user = context.session.user;

      if (((user && user.type !== "SCHOOL_ADMIN") || !user) && args.type === "TEACHER") {
        throw new ForbiddenError("cannot create teacher account");
      }

      if (type === "SCHOOL_ADMIN") throw new UserInputError("cannot create school admin");
      const school = await School.findOne({ name: schoolId });
      if (!school) throw new NotFoundError("school does not exist");
      const findUser = await User.findOne({ email });
      if (findUser) throw new ConflictError("user already exists");
      const hash = await bcrypt.hash(password, 10);
      if (!hash) throw new ApolloError("internal server error");
      const resUser = await User.create({ firstName, lastName, email, hash, type, schoolId });
      if (!resUser) throw new ApolloError("internal server error");

      try {
        await sendVerificationCode(resUser._id, email);
      } catch (err) {
        console.log(err);
        onVerificationCodeSentError(resUser._id);
        throw new ApolloError("internal server error");
      }

      return { code: 200, success: true, message: "user created" };
    },
    verifyAccount: async (parent, args, context) => {
      const { code: inputCode } = args;

      //Check if code exists
      const verifyRes = await VerificationCode.findOne({ code: inputCode });

      if (verifyRes === null) throw new NotFoundError("The verification link does not exist.");

      //Activate the userisVerified

      const user = await User.findByIdAndUpdate(verifyRes.userId, {
        isVerified: true,
      }).exec();

      //Delete code from database
      VerificationCode.deleteOne({ code: inputCode }).exec();

      return { code: 200, success: true, message: "user verified" };
    },
    signin: async (parent, args, context) => {
      const { email, password } = args;
      if (!validator.isEmail(email)) throw new UserInputError(`${email} is not a valid email`);
      const user = await User.findOne({ email });
      if (!user) throw new ForbiddenError("access denied");
      const resPassword = await bcrypt.compare(password, user.hash);
      if (!resPassword) throw new ForbiddenError("access denied");
      context.session.user = user;

      if (!user.isVerified)
        throw new UnverifiedError(
          "Your account is not verified! Check your email for a verification link."
        );
      return { code: 200, success: true, message: "user logged in" };
    },
    signout: (parent, args, context) => {
      context.session.destroy();
      return { code: 200, success: true, message: "user logged out" };
    },
    requestResetPassword: async (parent, args, content) => {
      const { email } = args;
      if (!validator.isEmail(email)) throw new UserInputError(`${email} is not a valid email`);

      const user = await User.findOne({ email });

      if (user == null) {
        return { code: 200, success: true, message: "email sent if valid" };
      }

      try {
        await sendPasswordReset(user._id, email);
        return { code: 200, success: true, message: "email sent if valid" };
      } catch (err) {
        console.log(err);
        onPasswordResetSentError(user._id);
        throw new ApolloError("Something went wrong. Try again later.");
      }
    },
    resetPassword: async (parent, args, content) => {
      const { email, tempPassword, newPassword } = args;

      if (!newPassword) throw new UserInputError("New password is not valid.");

      const user = await User.findOne({ email });

      if (user == null) throw new NotFoundError("User with the email provided doesn't exist");

      const passwordEntry = await ResetPassword.findOne({ userId: user._id });

      if (passwordEntry == null)
        throw new NotFoundError(
          "Reset password expired or does not exist. Please request for a new password reset."
        );

      const isValid = await bcrypt.compare(tempPassword, passwordEntry.hash);
      if (!isValid) {
        throw new ForbiddenError("access denied");
      }

      //change the password
      try {
        const newHash = await bcrypt.hash(newPassword, 10);
        await User.findByIdAndUpdate(user._id, { hash: newHash });
        ResetPassword.deleteMany({ userId: user._id }).exec();
        return { code: 200, success: true, message: "email sent if valid" };
      } catch (err) {
        console.log(err);
        throw new ApolloError("internal server error");
      }
    },
  },
  query: {
    getAccountType: (parent, args, context) => {
      return { type: context.session.user.type };
    },
    getUsersSchool: (parent, args, context) => {
      return { schoolId: context.session.user.schoolId };
    },
  }
};

module.exports = UserResolver;
