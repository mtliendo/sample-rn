import { gql } from "@apollo/client";

export const GET_REPOS = gql`
  query {
    viewer {
      repositories(last: 30) {
        edges {
          cursor
          node {
            owner {
              login
            }
            id
            name
          }
        }
      }
    }
  }
`;
