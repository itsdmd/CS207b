// Provide a service to make API calls to the backend

import axios from "axios";
import * as dotenv from "dotenv";
dotenv.config();

const API_URL = process.env.APOLLO_URL;

export const api = {
    async userById(id) {
        const response = await axios.post(API_URL, {
            query: `
				query {
					userById(id: "${id}") {
						id
						password
						fullName
						dateOfBirth
						gender
						email
						phoneNumber
						address
						profilePicture
						accountType
						classsId
						schoolId
					}
				}
			`,
        });
        return response.data.data.userById;
    },
    async login(userId, password) {
        const response = await axios.post(API_URL, {
            query: `
				mutation {
					login(userId: "${userId}", password: "${password}") {
						sessionId
					}
				}
			`,
        });
        return response.data.data.login;
    },
    async logout(userId, password) {
        const response = await axios.post(API_URL, {
            query: `
				mutation {
					logout(userId: "${userId}", password: "${password}")
				}
			`,
        });
        return response.data.data.logout;
    },
    async authenticate(userId, sessionId) {
        const response = await axios.post(API_URL, {
            query: `
				mutation {
					authenticate(userId: "${userId}", sessionId: "${sessionId}")
				}
			`,
        });
        return response.data.data.authenticate;
    },
};
