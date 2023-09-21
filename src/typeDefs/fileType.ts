export default `#graphql
    scalar Upload
    type File {
      _id: ID
      originalName: String
      name: String
      url: String
      size: Float
    }

    type Mutation {
      uploadFile(file: Upload): String
    }
`;
