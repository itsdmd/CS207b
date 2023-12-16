import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";

import { ApolloProvider, gql } from "@apollo/client";
import apolloClient from "../../constants/apollo/client";

import * as storageManager from "../../functions/StorageManager";

import colors from "../../constants/colors";
import * as gstyles from "../../constants/styles";

import CustomButton from "../../components/CustomButton";
import TopBar from "../../components/TopBar";

const HomeScreen = ({ navigation }) => {
    const [sessionId, setSessionId] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        storageManager
            .get("sessionId")
            .then((value) => {
                setSessionId(value);
            })
            .then(() => {
                setLoading(false);
            });
    }, []);

    return (
        <ApolloProvider client={apolloClient}>
            <View style={gstyles.layout.container_100}>
                <TopBar />
                <View style={gstyles.layout.container_80}>
                    {loading ? null : (
                        <Text style={gstyles.text.primary_bold_italic}>
                            {sessionId}
                        </Text>
                    )}
                </View>
            </View>
        </ApolloProvider>
    );
};

export default HomeScreen;
