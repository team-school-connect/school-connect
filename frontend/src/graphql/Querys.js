import {gql} from '@apollo/client';

const ACCOUNT_TYPE_ENUM_QUERY = gql`
  query GetEnum {
    __type(name: "AccountType") {
      enumValues {
        STUDENT
        SCHOOL_ADMIN
        TEACHER
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