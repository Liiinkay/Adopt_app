import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';

import posts from '../assets/data/posts';
import PostCard from '../components/PostCard';

const PostListScreen = () => {
  const post = posts;

  return (
    <View style={styles.container}>
      <FlatList
        data={post}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PostCard post={item} />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default PostListScreen;
