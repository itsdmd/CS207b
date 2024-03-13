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
    }
    
    type Classs {
        id: String
        name: String
        schoolId: String
        userId: [String]
        formTeacherId: String
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
    
    type School {
        id: String
        name: String
        address: String
    }
    
    query School($id: String!) {
        school(id: $id) {
            id
            name
            address
        }
    }
    
    type TimetableEntry {
        id: String
        semesterId: String
        schoolId: String
        classsId: String
        classsName: String
        timeSlot: String
        dayOfWeek: String
        subjectName: String
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
        ): [User]
        classs(id: String, name: String, schoolId: String, userId: String, formTeacherId: String): Classs
        login(userId: String!, password: String!): AuthToken
        logout(userId: String!): AuthToken
        authenticate(userId: String!, sessionId: String!): Boolean
        subject(id: String, name: String): Subject
        
        schoolById(id: String!): School
        schoolByUserId(userId: String!): School
        schoolByClasssId(classsId: String!): School
        
        classsInSchool(schoolId: String!): [Classs]
        userByClasssId(userId: String!): [Classs]
        classsByUserId(userId: String!): [Classs]
        
        timetableEntryByUserId(userId: String!): [TimetableEntry]
    }
`;
