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
        id: String
    }
    
    type Query {
        user(id: String!): User
    }
`;
