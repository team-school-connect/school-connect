import { gql } from "@apollo/client";

export const GET_ACCOUNT_TYPE_QUERY = gql`
  query getAccountType {
    getAccountType {
      type
    }
  }
`;

export const GET_USERS_SCHOOL_QUERY = gql`
  query getUsersSchool {
    getUsersSchool {
      schoolId
    }
  }
`;

export const GET_SCHOOL_LIST_QUERY = gql`
  query getSchools {
    getSchools {
      name
    }
  }
`;

export const STUDY_ROOM_QUERY = gql`
  query getStudyRooms($page: Int) {
    getStudyRooms(page: $page) {
      totalRows
      studyRooms {
        _id
        roomName
        ownerId
        participantCount
        subject
        createdOn
      }
    }
  }
`;

export const GET_MY_CLASSROOMS = gql`
  query GetMyClassrooms($page: Int) {
    getMyClassrooms(page: $page) {
      total
      classrooms {
        id
        name
        teacher {
          firstName
          lastName
          email
        }
        schoolId
        code
      }
    }
  }
`;

export const GET_CLASSROOM = gql`
  query Query($classId: String) {
    getClassroom(classId: $classId) {
      id
      name
      teacher {
        firstName
        lastName
      }
    }
  }
`;

export const GET_CLASSROOM_ANNOUCEMENTS = gql`
  query Query($page: Int, $classId: String) {
    getAnnouncements(page: $page, classId: $classId) {
      total
      announcements {
        id
        title
        content
        date
      }
    }
  }
`;

export const GET_VOLUNTEER_POSITIONS = gql`
  query Query($page: Int) {
    getVolunteerPositions(page: $page) {
      total
      VolunteerPositions {
        id
        organizationName
        positionName
        positionDescription
        location
        startDate
        endDate
      }
    }
  }
`;
