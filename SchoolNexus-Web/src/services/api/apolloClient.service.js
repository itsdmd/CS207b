import { ApolloClient, InMemoryCache } from "@apollo/client";

export default new ApolloClient({
    uri: "http://localhost:20700",
    cache: new InMemoryCache(),
});
