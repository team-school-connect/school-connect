import { gql } from "@apollo/client";

export const SIGNUP_MUTATION = gql`
  mutation Signup(
    $firstName: String!
    $lastName: String!
    $email: String!
    $password: String!
    $schoolId: String!
    $type: String!
  ) {
    signup(
      firstName: $firstName
      lastName: $lastName
      email: $email
      password: $password
      schoolId: $schoolId
      type: $type
    ) {
      code
      success
      message
    }
  }
`;

export const SIGNUP_SCHOOL_MUTATION = gql`
  mutation SignupSchool(
    $firstName: String!
    $lastName: String!
    $email: String!
    $password: String!
    $schoolName: String!
  ) {
    signupSchool(
      firstName: $firstName
      lastName: $lastName
      email: $email
      password: $password
      schoolName: $schoolName
    ) {
      code
      success
      message
    }
  }
`;

export const SIGNIN_MUTATION = gql`
  mutation Signin($email: String!, $password: String!) {
    signin(email: $email, password: $password) {
      code
      success
      message
    }
  }
`;

export const CREATE_STUDY_ROOM_MUTATION = gql`
  mutation CreateStudyRoom($roomName: String, $subject: String) {
    createStudyRoom(roomName: $roomName, subject: $subject) {
      code
      success
      message
    }
  }
`;

export const SIGNOUT_MUTATION = gql`
  mutation Signout {
    signout {
      code
      success
      message
    }
  }
`;

export const JOIN_CLASSROOM_MUTATION = gql`
  mutation Mutation($classCode: String) {
    joinClassroom(classCode: $classCode) {
      code
      success
      message
    }
  }
`;

export const CREATE_CLASSROOM_MUTATION = gql`
  mutation CreateClassroom($name: String) {
    createClassroom(name: $name) {
      id
    }
  }
`;

export const CREATE_ANNOUNCEMENT_MUTATION = gql`
  mutation CreateAnnouncement($title: String, $content: String, $classId: String) {
    createAnnouncement(title: $title, content: $content, classId: $classId) {
      date
    }
  }
`;

export const CREATE_ASSIGNMENT_MUTATION = gql`
  mutation CreateAssignment(
    $name: String
    $description: String
    $classId: String
    $dueDate: String
  ) {
    createAssignment(name: $name, description: $description, classId: $classId, dueDate: $dueDate) {
      id
    }
  }
`;

export const CREATE_VOLUNTEER_POSITION_MUTATION = gql`
  mutation CreateVolunteerPosition(
    $organizationName: String
    $positionName: String
    $positionDescription: String
    $location: String
    $startDate: String
    $endDate: String
  ) {
    createVolunteerPosition(
      organizationName: $organizationName
      positionName: $positionName
      positionDescription: $positionDescription
      location: $location
      startDate: $startDate
      endDate: $endDate
    ) {
      code
      success
      message
    }
  }
`;

export const VERIFY_ACCOUNT_MUTATION = gql`
  mutation VerifyAccount($code: String) {
    verifyAccount(code: $code) {
      code
      success
      message
    }
  }
`;
