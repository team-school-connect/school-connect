const { gql } = require("apollo-server-express");

const typeDefs = gql`
  scalar Upload

  type File {
    filename: String!
    mimetype: String!
    encoding: String!
  }

  type MutationResponse {
    code: String!
    success: Boolean!
    message: String!
  }

  enum AccountType {
    STUDENT
    SCHOOL_ADMIN
    TEACHER
  }

  type School {
    name: String
    id: ID
  }

  type User {
    firstName: String
    lastName: String
    email: String
    password: String
    schoolId: ID
    type: AccountType
  }

  type StudyRoom {
    _id: ID
    roomName: String
    ownerId: String
    participantCount: Int
    subject: String
    createdOn: String
  }

  type StudyRoomPage {
    totalRows: Int
    studyRooms: [StudyRoom]
  }

  type VolunteerPosition {
    id: ID
    organizationName: String
    positionName: String
    positionDescription: String
    location: String
    startDate: String
    endDate: String
  }

  type Classroom {
    id: ID
    name: String
    teacher: User
    schoolId: ID
    code: String
  }

  type ClassroomPage {
    total: Int
    classrooms: [Classroom]
  }

  type ClassroomUsers {
    userEmail: String
    classId: String
    className: String
  }

  type Announcement {
    id: ID
    title: String
    content: String
    class: Classroom
    date: String
  }

  type Assignment {
    id: ID
    name: String
    description: String
    classId: ID
    dueDate: String
    date: String
    submitted: String
  }

  type Submission {
    id: ID
    assignmentId: ID
    userId: ID
    date: String
  }

  type AnnouncementPage {
    total: Int
    announcements: [Announcement]
  }

  type AssignmentPage {
    total: Int
    assignments: [Assignment]
  }

  type SubmissionPage {
    total: Int
    submissions: [Submission]
  }

  type AccountTypeResponse {
    type: AccountType
  }
  type UsersSchool {
    schoolId: String
  }

  type SchoolList {
    Schools: [School]
  }

  type VolunteerPosition {
    id: ID
    organizationName: String
    positionName: String
    positionDescription: String
    location: String
    startDate: String
    endDate: String
  }

  type VolunteerPositionPage {
    total: Int
    VolunteerPositions: [VolunteerPosition]
  }

  type Query {
    checkLogin: String
    checkTeacherOnly: String
    getAccountType: AccountTypeResponse
    getUsersSchool: UsersSchool
    getStudyRooms(page: Int): StudyRoomPage
    getMyClassrooms(page: Int): ClassroomPage
    getAnnouncements(page: Int, classId: String): AnnouncementPage
    getSchools: [School]
    getClassroom(classId: String): Classroom
    getAssignment(assignmentId: String): Assignment
    getAssignments(classId: String, page: Int): AssignmentPage
    getStudentSubmissions(classId: String, assignmentId: String, page: Int): SubmissionPage
    getVolunteerPositions(page: Int): VolunteerPositionPage
    getSingleVolunteerPosition(_id: ID): VolunteerPosition
  }

  type Mutation {
    # create new user and school in db
    signupSchool(
      firstName: String
      lastName: String
      email: String
      password: String
      schoolName: String
    ): MutationResponse

    # for students and teachers
    signup(
      firstName: String
      lastName: String
      email: String
      password: String
      schoolId: String
      type: String
    ): MutationResponse
    signin(email: String, password: String): MutationResponse

    signout: MutationResponse

    verifyAccount(code: String): MutationResponse

    requestResetPassword(email: String): MutationResponse
    resetPassword(email: String, tempPassword: String, newPassword: String): MutationResponse

    createClassroom(name: String): Classroom
    createAnnouncement(title: String, content: String, classId: String): Announcement
    joinClassroom(classCode: String): MutationResponse

    createStudyRoom(roomName: String, subject: String): MutationResponse

    createAssignment(
      name: String
      description: String
      classId: String
      dueDate: String
    ): Assignment

    createVolunteerPosition(
      organizationName: String
      positionName: String
      positionDescription: String
      location: String
      startDate: String
      endDate: String
    ): MutationResponse

    submitAssignment(assignmentId: String, file: Upload!): Boolean
    testUpload(file: Upload!): Boolean
  }
`;

module.exports = typeDefs;