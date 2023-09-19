import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const PostDetailScreen = ({ navigation }) => {
    const {
        params: { post },
      } = useRoute();
    return(
        <SafeAreaView>
            <View>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back-circle" size={30}/>
                </TouchableOpacity>
                <Text>AAAAAA</Text>
                <Image
                />
                <Text>{post.id}</Text>
            </View>
        </SafeAreaView>
    )
}

export default PostDetailScreen;
