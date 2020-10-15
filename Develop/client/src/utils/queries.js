import gql from 'graphql-tag';

export const GET_ME = gql`
  query books {
    books {
      _id
      title
      author
      pages
    }
  }
`;
