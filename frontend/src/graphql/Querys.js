import {gql} from '@apollo/client';

export const GET_ACCOUNT_TYPE_QUERY = gql`
  query getAccountType {
    getAccountType {
      type
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