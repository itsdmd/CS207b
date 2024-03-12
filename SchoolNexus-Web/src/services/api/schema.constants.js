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
				timetableEntryByUserId(userId: "${userId}")
}
`;
