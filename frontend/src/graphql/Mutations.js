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
