import React, {Component} from 'react';
import {View, Text, FlatList, TextInput, TouchableOpacity} from 'react-native';
import {Post} from './Home';

class PostDetailScreen extends Component<{route: any}> {
  render() {
    const {post}: {post: Post} = this.props.route.params;

    return (
      <View>
        <Text>Title: {post.title}</Text>
        <Text>Author: {post.author}</Text>
        <Text>URL: {post.url}</Text>
        <Text>Created At: {post.created_at}</Text>
        <Text>Raw JSON: {JSON.stringify(post, null, 2)}</Text>
      </View>
    );
  }
}

export default PostDetailScreen;
