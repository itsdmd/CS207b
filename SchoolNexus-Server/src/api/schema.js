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
        schoolId: String
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
    
    query Authenticate($userId: String!, $sessionId: String!) {
        authenticate(userId: $userId, sessionId: $sessionId)
    }
    
    type Subject {
        id: String
        name: String
    }
    
    query Subject($id: String, $name: String) {
        subject(id: $id, name: $name) {
            id
            name
        }
    }
    
    type Query {
        getUser(
            id: String
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
        ): [User]
        login(userId: String!, password: String!): AuthToken
        logout(userId: String!): AuthToken
        authenticate(userId: String!, sessionId: String!): Boolean
        subject(id: String, name: String): Subject
    }
`;
