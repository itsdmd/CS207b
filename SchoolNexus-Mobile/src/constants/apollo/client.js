import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { APOLLO_SERVER_URL } from "@env";

export const apolloClient = new ApolloClient({
	uri: APOLLO_SERVER_URL,
	cache: new InMemoryCache(),
});
