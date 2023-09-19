import React from "react";
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { useNavigation } from "@react-navigation/native";

const PostCard = ({post}) => {
    const { navigate } = useNavigation();

    return(
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

                <View style={styles.footer}>
                    <Text>AAA</Text>
                </View>
            </View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      padding: 10,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderColor: 'lightgrey',
      backgroundColor: 'white',
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
      marginVertical: 10,
      borderRadius: 15,
    },
  
    // footer
    footer: {
      flexDirection: 'row',
      marginVertical: 5,
      justifyContent: 'space-between',
    },
  });

export default PostCard;
