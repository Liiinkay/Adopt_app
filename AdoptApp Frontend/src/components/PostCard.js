import React from "react";
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import LikeButton from "./LikeButton";
import SaveButton from "./SaveButton";
import ShareButton from "./ShareButton";

const PostCard = ({post}) => {
    const { navigate } = useNavigation();

    return(
        <View style={styles.cardContainer}>
            <Pressable style={styles.container}
            onPress={() => {
                navigate("PostDetailScreen", { post });
            }}
            >
                <Image src={post.user.image} style={styles.userImage} />
                <View style={styles.mainContainer}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.name}>{post.user.name}</Text>
                        <Text style={styles.username}>{post.user.username} · 2h</Text>
                    </View>

                    <Text style={styles.content}>{post.content}</Text>

                    {post.image && <Image src={post.image} style={styles.image} />}
                </View>
            </Pressable>
            <View style={styles.footer}>
                <View style={{flexDirection: 'row'}}>
                    <View style={styles.buttonContainer}>
                        <LikeButton/>
                    </View>
                    <View style={styles.buttonContainer}>
                        <SaveButton/>
                    </View>
                    <View style={styles.buttonContainer}>
                        <ShareButton/>
                    </View>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    cardContainer: {
        borderColor: 'lightgrey',
        backgroundColor: 'white',
        borderBottomWidth: StyleSheet.hairlineWidth,
        marginVertical: 1,
    },
    container: {
        flexDirection: 'row',
        marginVertical:5,
      padding: 10,
    },
    userImage: {
      width: 45,
      height: 45,
      borderRadius: 50,
    },
    mainContainer: {
      marginLeft: 10,
      flex: 1,
    },
    name: {
      fontWeight: '600',
    },
    username: {
      color: 'gray',
      marginLeft: 5,
    },
    content: {
      lineHeight: 20,
      marginTop: 5,
    },
    image: {
      width: '100%',
      aspectRatio: 16 / 9,
      marginTop: 10,
      borderRadius: 15,
    },
  
    // footer
    footer: {
      flexDirection: 'row-reverse',
      marginBottom: 5,
      justifyContent: 'space-between',
    },
    buttonContainer: {
        paddingHorizontal: 10,
    }
  });

export default PostCard;
