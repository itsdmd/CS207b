import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

import * as user from "./queries/user.js";

const typeDefs = `#graphql
  type User {
    username: String!
    password: String
  }

  type Query {
    userByUsername(username: String!): User
  }
`;

const resolvers = {
	Query: {
		userByUsername(parent, args, contextValue, info) {
			return user.getUserByUsername(args.username);
		},
	},
};

const port = process.env.PORT || 20700;
const server = new ApolloServer({
	typeDefs,
	resolvers,
});

const { url } = await startStandaloneServer(server, {
	listen: { port: port },
});

console.log(`Server ready at: ${url}`);
