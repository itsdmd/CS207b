export const typeDefs = `#graphql
    type User {
        id: String
        password: String
        fullName: String
        dateOfBirth: String
        gender: String
        email: String
        phoneNumber: String
        address: String
        profilePicture: String
        accountType: String
        createdAt: String
        updatedAt: String
        classsId: String
    }

    type AuthToken {
        success: Boolean
        msg: String
    }
    
    mutation Login($userId: String!, $password: String!) {
        login(userId: $userId, password: $password) {
            msg, success
        }
    }
    
    mutation Logout($userId: String!) {
        logout(userId: $userId) {
            msg, success
        }
    }
    
    mutation Authenticate($userId: String!, $sessionId: String!) {
        authenticate(userId: $userId, sessionId: $sessionId)
    }
    
    type Query {
        user(
            id: String
            fullName: String
            dateOfBirth: String
            gender: String
            email: String
            phoneNumber: String
            address: String
            profilePicture: String
            accountType: String
            createdAt: String
            updatedAt: String
            classsId: String
        ): [User]
        login(userId: String!, password: String!): AuthToken
        logout(userId: String!): AuthToken
        authenticate(userId: String!, sessionId: String!): Boolean
    }
`;
