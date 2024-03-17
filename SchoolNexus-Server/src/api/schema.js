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
        usa: [USA]
        uca: [UCA]
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
    
    type USA {
        id: String
        userId: String
        user: User
        schoolId: String
        school: School
    }
    
    type UCA {
        id: String
        userId: String
        user: User
        classsId: String
        classs: Classs
    }
    
    type School {
        id: String
        name: String
        address: String
        principalId: String
    }
    
    type Classs {
        id: String
        name: String
        grade: Int
        schoolId: String
        formTeacherId: String
    }
    
    type TimetableEntry {
        id: String
        semesterId: String
        schoolId: String
        classsId: String
        classsName: String
        timeSlot: Int
        dayOfWeek: Int
        subjectName: String
    }
    
    type TimetableEntryAttendence {
        id: String
        timetableEntryId: String
        userId: String
        isPresent: Boolean
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
        newUser(
            id: String!
            password: String!
            fullName: String!
            dateOfBirth: String
            gender: String!
            email: String
            phoneNumber: String
            address: String
            profilePicture: String
            accountType: String!
        ): User
        deleteUser(id: String!): User
        login(userId: String!, password: String!): AuthToken
        logout(userId: String!): AuthToken
        authenticate(userId: String!, sessionId: String!): Boolean
        subject(id: String, name: String): Subject
        
        school(id: String, name: String, address: String): [School]
        schoolById(id: String!): School
        schoolByUserId(userId: String!): School
        schoolByClasssId(classsId: String!): School
        newUSA(userId: String!, schoolId: String!): USA
        deleteUSA(id: String!): USA
        
        classs(id: String, name: String, schoolId: String, formTeacherId: String): [Classs]
        classsByUserId(userId: String!): [Classs]
        getFormTeachersOfSchool(schoolId: String!): [User]
        getNonFormTeachersOfSchool(schoolId: String!): [User]
        newClasss(name: String!, schoolId: String!, grade: String!, formTeacherId: String!): Classs
        deleteClasss(id: String!): Classs
        userByClasssId(classsId: String!): [User]
        userBySchoolId(schoolId: String!): [User]
        getUCA(userId: String, classsId: String): [UCA]
        newUCA(userId: String!, classsId: String!): UCA
        deleteUCA(id: String!): UCA
        
        timetableEntry(id: String, semesterId: String, weekOfSemester: Int, schoolId: String, classsId: String, dayOfWeek: String, timeSlot: String): [TimetableEntry]
        timetableEntryByUserId(userId: String!): [TimetableEntry]
        newTimetableEntry(semesterId: String!, schoolId: String!, classsId: String!, dayOfWeek: String!, timeSlot: String!): TimetableEntry
        timetableEntryAttendence(timetableEntryId: String, userId: String): [TimetableEntryAttendence]
        newTimetableEntryAttendence(timetableEntryId: String!, userId: String!, isPresent: Boolean): TimetableEntryAttendence
        
    }
`;
