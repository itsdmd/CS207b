import {
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    useWindowDimensions,
    View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { gql } from "@apollo/client";
import apolloClient from "../../constants/apollo/client";

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
    faChevronLeft,
    faHome,
    faRightFromBracket,
    faUserCircle,
} from "@fortawesome/free-solid-svg-icons";

import * as storageManager from "../../functions/StorageManager";
import Logout from "../../functions/ButtonActions/Logout";

import colors from "../../constants/colors";
import * as gstyles from "../../constants/styles";

const TopBar = () => {
    const { height, width } = useWindowDimensions();

    const [leftBtn, setLeftBtn] = useState(faUserCircle);
    const [rightBtn, setRightBtn] = useState(faRightFromBracket);

    const [userObj, setUserObj] = useState({});

    // Fetch user's data from userId
    useEffect(() => {
        storageManager
            .get("userId")
            .then((userId) => {
                apolloClient
                    .query({
                        query: gql`
        					query {
        						user(id: "${userId}") {
        							id
        							fullName
        							profilePicture
        						}
        					}
        				`,
                    })
                    .then((result) => {
                        setUserObj(result.data.user);
                    });
            })
            .catch((err) => {
                console.error(err);
            });

        // Testing
        // setUserObj({
        //     fullName: "User's Full name",
        //     id: "userId",
        //     profilePicture: "PP",
        // });
    }, []);

    return (
        <View
            style={[
                gstyles.layout.container_100,
                {
                    backgroundColor: colors.text_primary,
                    maxHeight: 50,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                },
            ]}>
            <FontAwesomeIcon
                icon={leftBtn}
                style={{ marginLeft: 15 }}
            />

            <Text
                style={[
                    gstyles.text.primary_bold,
                    { color: colors.bg, fontSize: "20px" },
                ]}>
                {userObj.fullName}
            </Text>

            <Pressable onPress={Logout}>
                <FontAwesomeIcon
                    icon={rightBtn}
                    style={{ marginRight: 15 }}
                />
            </Pressable>
        </View>
    );
};

export default TopBar;
