import React from "react";
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import PostListScreen from "./PostListScreen";
import AppHeader from "../components/Header";
import { SafeAreaView } from "react-native-safe-area-context";

const HomeScreen = () => {
    return (
        <View style={{flex: 1}}>
            <SafeAreaView style={styles.headerContainer}>
                <StatusBar color={'black'}/>
                <TouchableOpacity style={styles.menuIcon}>
                    <Ionicons name="menu" size={24} color="#1E1E1E" />
                </TouchableOpacity>
                <Text style={styles.title}>Adopción</Text>
            </SafeAreaView>
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
    menuIcon: {
      marginRight: 16,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#fff',
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
