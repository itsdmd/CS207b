import { gql } from "@apollo/client";

export const userGql = (userObj) => gql`
				query {
					user(
						id: "${userObj.id}"
						fullName: "${userObj.fullName}"
						dateOfBirth: "${userObj.dateOfBirth}"
						gender: "${userObj.gender}"
						email: "${userObj.email}"
						phoneNumber: "${userObj.phoneNumber}"
						address: "${userObj.address}"
						profilePicture: "${userObj.profilePicture}"
						accountType: "${userObj.accountType}"
						createdAt: "${userObj.createdAt}"
						updatedAt: "${userObj.updatedAt}"
						classsId: "${userObj.classsId}"
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
				classsId
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
