import { ApolloClient, InMemoryCache } from "@apollo/client";
import { APOLLO_SERVER_URL } from "@env";

export default new ApolloClient({
	uri: APOLLO_SERVER_URL,
	cache: new InMemoryCache(),
});
