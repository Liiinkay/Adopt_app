import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, StatusBar, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import PostListScreen from "./PostListScreen";
import { SafeAreaView } from "react-native-safe-area-context";
import user from "../assets/data/user";

const HomeScreen = ({navigation}) => {
    const { navigate } = useNavigation();
    return (
        <View style={{flex: 1}}>
           <PostListScreen/>
        </View>

    )
}

const styles = StyleSheet.create({
    headerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#AEFAFF',
      paddingVertical: 12,
      paddingHorizontal: 16,
    },
    userImage: {
        width: 45,
        height: 45,
        borderRadius: 50,
    },
    userImageContainer: {
        flexDirection: "row-reverse",
        flex: 1,
    },
    postTypeContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 5,
        padding: 5,
        flexDirection: 'row',
        alignItems: 'center'
    },
    menuIcon: {
      marginRight: 16,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#1E1E1E',
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 16,
    },
    postContainer: {
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
    },
    itemTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    author: {
        fontSize: 14,
        color: '#888',
        marginBottom: 4,
    },
    score: {
        fontSize: 14,
        color: '#888',
    },
});

export default HomeScreen;
