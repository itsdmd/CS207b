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
        classsId: String
        schoolId: String
    }

    type AuthToken {
        sessionId: String
    }
    
    mutation Login($userId: String!, $password: String!) {
        login(userId: $userId, password: $password) {
            sessionId
        }
    }
    
    mutation Logout($userId: String!, $password: String!) {
        logout(userId: $userId, password: $password)
    }
    
    mutation Authenticate($userId: String!, $password: String!, $sessionId: String!) {
        authenticate(userId: $userId, password: $password, sessionId: $sessionId)
    }
    
    type Query {
        user(id: String!): User
        login(userId: String!, password: String!): AuthToken
        logout(userId: String!, password: String!): Boolean
        authenticate(userId: String!, password: String!, sessionId: String!): Boolean
    }
`;
