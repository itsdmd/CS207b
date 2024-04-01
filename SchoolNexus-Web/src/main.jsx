import React from "react";
import ReactDOM from "react-dom/client";
import { ApolloProvider } from "@apollo/client";

import GlobalRouter from "./services/router/GlobalRouter.jsx";
import apolloClient from "./services/api/apolloClient.service.js";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <ApolloProvider client={apolloClient}>
            <GlobalRouter />
        </ApolloProvider>
    </React.StrictMode>
);
