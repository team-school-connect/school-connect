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