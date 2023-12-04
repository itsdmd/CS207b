import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

import { typeDefs } from "./graphql/schema.js";
import { resolvers } from "./graphql/resolver.js";

const port = process.env.APOLLO_PORT || 20700;
const server = new ApolloServer({
	typeDefs,
	resolvers,
});

const { url } = await startStandaloneServer(server, {
	listen: { port: port },
});

console.log(`Server ready at: ${url}`);
