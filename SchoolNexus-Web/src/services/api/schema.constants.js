import { gql } from "@apollo/client";

export const getUserGql = (userObj) => gql`
	query {
		getUser(
			id: "${userObj.id}"
			fullName: "${userObj.fullName}"
			dateOfBirth: "${userObj.dateOfBirth}"
			gender: "${userObj.gender}"
			email: "${userObj.email}"
			phoneNumber: "${userObj.phoneNumber}"
			address: "${userObj.address}"
			profilePicture: "${userObj.profilePicture}"
			accountType: "${userObj.accountType}"
		) {
			id
			fullName
			dateOfBirth
			gender
			email
			phoneNumber
			address
			profilePicture
			accountType
			createdAt
			updatedAt
			usa {
				id
				schoolId
				school {
					id
					name
					address
				}
			}
			uca {
				id
				classsId
				classs {
					id
					name
				}
			}
            tsa {
                id
                subjectId
                subject {
                    id
                    name
                }
            }
		}
	}
`;

export const newUserGql = (userObj) => gql`
	query {
		newUser(
			id: "${userObj.id}"
			password: "${userObj.password}"
			fullName: "${userObj.fullName}"
			dateOfBirth: "${userObj.dateOfBirth}"
			gender: "${userObj.gender}"
			email: "${userObj.email}"
			phoneNumber: "${userObj.phoneNumber}"
			address: "${userObj.address}"
			profilePicture: "${userObj.profilePicture}"
			accountType: "${userObj.accountType}"
		) {
			id
			fullName
			dateOfBirth
			gender
			email
			phoneNumber
			address
			profilePicture
			accountType
			createdAt
			updatedAt
		}
	}
`;

export const deleteUserGql = (userId) => gql`
	query {
		deleteUser(id: "${userId}") {
			id
			fullName
			dateOfBirth
			gender
			email
			phoneNumber
			address
			profilePicture
			accountType
			createdAt
			updatedAt
		}
	}
`;

export const userBySchoolIdGql = (schoolId) => gql`
	query {
		userBySchoolId(schoolId: "${schoolId}") {
			id
			fullName
			dateOfBirth
			gender
			email
			phoneNumber
			address
			profilePicture
			accountType
			createdAt
			updatedAt
		}
	}
`;

export const userByClasssIdGql = (classsId) => gql`
	query {
		userByClasssId(classsId: "${classsId}") {
			id
			fullName
			dateOfBirth
			gender
			email
			phoneNumber
			address
			profilePicture
			accountType
			createdAt
			updatedAt
		}
	}
`;

export const subjectGql = (subjectObj) => gql`
	query {
		subject(
			id: "${subjectObj.id}"
			name: "${subjectObj.name}"
		) {
			id
			name
		}
	}
`;

export const newTSAGql = (tsaObj) => gql`
	query {
		newTSA(
			teacherId: "${tsaObj.userId}"
			subjectId: "${tsaObj.subjectId}"
		) {
			id
			teacherId
			subjectId
		}
	}
`;

export const getTSAGql = (tsaObj) => gql`
    query {
        getTSA(
            teacherId: "${tsaObj.teacherId}"
            subjectId: "${tsaObj.subjectId}"
        ) {
            id
            teacherId
            teacher {
                id
                fullName
                dateOfBirth
                gender
                email
                phoneNumber
                address
                profilePicture
                accountType
                createdAt
                updatedAt
            }
            subjectId
            subject {
                id
                name
            }
        }
    }
`;

export const schoolGql = (schoolObj) => gql`
	query {
		school(
			id: "${schoolObj.id}"
			name: "${schoolObj.name}"
			address: "${schoolObj.address}"
		) {
			id
			name
			address
			principalId
		}
	}
`;

export const newSchoolGql = (schoolObj) => gql`
	query {
		newSchool(
			name: "${schoolObj.name}"
			address: "${schoolObj.address}"
		) {
			id
			name
			address
		}
	}
`;

export const deleteSchoolGql = (schoolId) => gql`
	query {
		deleteSchool(id: "${schoolId}") {
			id
			name
			address
		}
	}
`;

export const schoolByUserIdGql = (userId) => gql`
	query {
		schoolByUserId(userId: "${userId}") {
			id
			name
			address
		}
	}
`;

export const getUSAGql = (usaObj) => gql`
	query {
		getUSA(
			userId: "${usaObj.userId}"
			schoolId: "${usaObj.schoolId}"
		) {
			id
			userId
			user {
				id
				fullName
				dateOfBirth
				gender
				email
				phoneNumber
				address
				profilePicture
				accountType
			}
			schoolId
			school {
				id
				name
				address
			}
		}
	}
`;

export const newUSAGql = (usaObj) => gql`
	query {
		newUSA(
			userId: "${usaObj.userId}"
			schoolId: "${usaObj.schoolId}"
		) {
			id
			userId
			schoolId
		}
	}
`;

export const deleteUSAGql = (usaId) => gql`
	query {
		deleteUSA(id: "${usaId}") {
			id
			userId
			schoolId
		}
	}
`;

export const classsGql = (classsObj) => gql`
	query {
		classs(
			id: "${classsObj.id}"
			name: "${classsObj.name}"
			schoolId: "${classsObj.schoolId}"
			formTeacherId: "${classsObj.formTeacherId}"
		) {
			id
			name
			schoolId
			formTeacherId
		}
	}
`;

export const newClasssGql = (classsObj) => gql`
	query {
		newClasss(
			name: "${classsObj.name}"
			schoolId: "${classsObj.schoolId}"
			grade: "${classsObj.grade}"
			formTeacherId: "${classsObj.formTeacherId}"
		) {
			id
			name
			schoolId
			grade
			formTeacherId
		}
	}
`;

export const deleteClasssGql = (classsId) => gql`
	query {
		deleteClasss(id: "${classsId}") {
			id
			name
			schoolId
			grade
			formTeacherId
		}
	}
`;

export const getUCAGql = (ucaObj) => gql`
	query {
		getUCA(
			userId: "${ucaObj.userId}"
			classsId: "${ucaObj.classsId}"
		) {
			id
			userId
			user {
				id
				fullName
				dateOfBirth
				gender
				email
				phoneNumber
				address
				profilePicture
				accountType
			}
			classsId
			classs {
				id
				name
				grade
				schoolId
				formTeacherId
			}
		}
	}
`;

export const newUCAGql = (ucaObj) => gql`
	query {
		newUCA(
			userId: "${ucaObj.userId}"
			classsId: "${ucaObj.classsId}"
		) {
			id
			userId
			classsId
		}
	}
`;

export const deleteUCAGql = (ucaId) => gql`
	query {
		deleteUCA(id: "${ucaId}") {
			id
		}
	}
`;

export const getFormTeachersOfSchoolGql = (schoolId) => gql`
	query {
		getFormTeachersOfSchool(schoolId: "${schoolId}") {
			id
			fullName
			dateOfBirth
			gender
			email
			phoneNumber
			address
			profilePicture
			accountType
			createdAt
			updatedAt
		}
	}
`;

export const getNonFormTeachersOfSchoolGql = (schoolId) => gql`
	query {
		getNonFormTeachersOfSchool(schoolId: "${schoolId}") {
			id
			fullName
			dateOfBirth
			gender
			email
			phoneNumber
			address
			profilePicture
			accountType
			createdAt
			updatedAt
		}
	}
`;

export const loginGql = (userId, password) => gql`
	query {
		login(userId: "${userId}", password: "${password}") {
			msg
			success
		}
	}
`;

export const logoutGql = (userId) => gql`
	query {
		logout(userId: "${userId}") {
			msg
			success
		}
	}
`;

export const authenticateGql = (userId, sessionId) => gql`
	query {
		authenticate(userId: "${userId}", sessionId: "${sessionId}")
	}
`;

export const timetableEntryGql = (timetableEntryObj) => gql`
	query {
		timetableEntry(
			semesterId: "${timetableEntryObj.semesterId}"
			schoolId: "${timetableEntryObj.schoolId}"
			classsId: "${timetableEntryObj.classsId}"
			dayOfWeek: "${timetableEntryObj.dayOfWeek}"
			timeSlot: "${timetableEntryObj.timeSlot}"
		) {
			id
			semesterId
			schoolId
			classsId
			classsName
			timeSlot
			dayOfWeek
			subjectName
		}
	}
`;

export const timetableEntryByUserIdGql = (userId) => gql`
		query {
		timetableEntryByUserId(userId: "${userId}") {
			semesterId
			schoolId
			classsId
			classsName
			dayOfWeek
			timeSlot
			subjectName
		}
	}
`;

export const newTimetableEntryGql = (timetableEntryObj) => gql`
	query {
		newTimetableEntry(
			semesterId: "${timetableEntryObj.semesterId}"
			schoolId: "${timetableEntryObj.schoolId}"
			classsId: "${timetableEntryObj.classsId}"
			dayOfWeek: "${timetableEntryObj.dayOfWeek}"
			timeSlot: "${timetableEntryObj.timeSlot}"
		) {
			id
			semesterId
			schoolId
			classsId
			classsName
			timeSlot
			dayOfWeek
			subjectName
		}
	}
`;

export const timetableEntryAttendenceGql = (teaObj) => gql`
	query {
		timetableEntryAttendence(
			userId: "${teaObj.userId}"
			timetableEntryId: "${teaObj.timetableEntryId}"
			attended: "${teaObj.attended}"
		) {
			userId
			timetableEntryId
			attended
		}
	}
`;

export const newTimetableEntryAttendenceGql = (teaObj) => gql`
	query {
		newTimetableEntryAttendence(
			userId: "${teaObj.userId}"
			timetableEntryId: "${teaObj.timetableEntryId}"
		) {
			userId
			timetableEntryId
			isPresent
		}
	}
`;

export const deleteTimetableEntryAttendenceGql = (teaObj) => gql`
	query {
		deleteTimetableEntryAttendence(
			userId: "${teaObj.userId}"
			timetableEntryId: "${teaObj.timetableEntryId}"
		) {
			id
			userId
			timetableEntryId
		}
	}
`;

export const getGradeTypeGql = (gradeTypeObj) => gql`
    query {
        getGradeType(
            id: "${gradeTypeObj.id}"
            name: "${gradeTypeObj.name}"
            multiplier: "${gradeTypeObj.multiplier}"
        ) {
            id
            name
            multiplier
        }
    }
`;

export const getStudentGradesGql = (sgObj) => gql`
    query {
        getStudentGrades(
            studentId: "${sgObj.studentId}"
            graderId: "${sgObj.graderId}"
            subjectId: "${sgObj.subjectId}"
            semesterId: "${sgObj.semesterId}"
            typeId: "${sgObj.typeId}"
        ) {
			id
			studentId
			graderId
			grader {
				fullName
				gender
				email
				accountType
				profilePicture
			}
			subjectId
			subject {
				name
			}
			semesterId
            typeId
			type {
				name
				multiplier
			}
			value
		}
    }
`;

export const newStudentGradeGql = (sgObj) => gql`
    query {
        newStudentGrade(
            studentId: "${sgObj.studentId}"
            graderId: "${sgObj.graderId}"
            subjectId: "${sgObj.subjectId}"
            semesterId: "${sgObj.semesterId}"
            typeId: "${sgObj.typeId}"
            value: "${sgObj.value}"
        ) {
			id
			studentId
			graderId
			subjectId
			semesterId
			typeId
			value
        }
    }
`;
