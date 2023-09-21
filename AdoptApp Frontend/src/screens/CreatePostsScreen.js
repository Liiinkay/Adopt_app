import React from "react";
import { View, ScrollView, Text, StatusBar, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const CreatePostsScreen = () => {
    return (
        <SafeAreaView >
            <StatusBar color={'black'}/>
            <View styles={styles.container}>
                <View styles={styles.subContainer}>
                    <Text>AA</Text>
                </View>
                <View styles={styles.subContainer}>
                    <Text>AA</Text>
                </View>
                <View styles={styles.subContainer}>
                    <Text>AA</Text>
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column', 
    },
    subContainer: {
        flex: 1, 
        backgroundColor: 'black', 
        borderBottomWidth: 1,
        borderColor: 'gray',
    },
})

export default CreatePostsScreen;
