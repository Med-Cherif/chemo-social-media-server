export default `#graphql
    type User {
        _id: String
        username: String
        name: String
        email: String
        gender: Gender
    }

    type AuthSuccessResponse {
        accessToken: String!
        user: User
    }

    enum Gender {
        MALE
        FEMALE
        PREFER_NOT_TO_SAY
    }

    # Inputs
    input RegisterInput {
        username: String!
        name: String!
        email: String!
        password: String!
        passwordConfirmation: String!
        gender: Gender!
    }

    input LoginInput {
        field: String!
        password: String!
    }
    
    type Mutation {
        register(data: RegisterInput): AuthSuccessResponse #DONE
        login(data: LoginInput): AuthSuccessResponse #DONE
        
        updatePassword(password: String!, passwordConfirmation: String!): AuthSuccessResponse
    }
`;
