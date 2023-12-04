import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

import { typeDefs } from "./api/schema.js";
import { resolvers } from "./api/resolver.js";

const port = process.env.APOLLO_PORT || 20700;
const server = new ApolloServer({
	typeDefs,
	resolvers,
});

const { url } = await startStandaloneServer(server, {
	listen: { port: port },
});

console.log(`Server ready at: ${url}`);
