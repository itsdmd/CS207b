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
					}
				}
			`;

export const setUserGql = (userObj) => gql`
				query {
					setUser(
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

export const schoolByUserIdGql = (userId) => gql`
				query {
					schoolByUserId(userId: "${userId}") {
						id
						name
						address
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

export const timetableEntryGql = (userId) => gql`
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
