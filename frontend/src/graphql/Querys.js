import {gql} from '@apollo/client';

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
      School {
        schoolId
        schoolName
      }
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