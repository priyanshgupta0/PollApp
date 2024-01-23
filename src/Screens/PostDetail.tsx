import React, {Component} from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import {Post} from './Home';

const mobileW = Dimensions.get('window').width;
const mobileH = Dimensions.get('window').height;

class PostDetailScreen extends Component<{route: any}> {
  render() {
    const {post}: {post: Post} = this.props.route.params;

    return (
      <View style={styles.container}>
        <Text style={styles.title}>Title: {post.title}</Text>
        <Text style={styles.auther}>Author: {post.author}</Text>
        <Text style={styles.text}>Created At: {post.created_at}</Text>
        <Text style={styles.text}>URL: {post.url}</Text>
        <Text style={styles.text}>
          Raw JSON: {JSON.stringify(post, null, 2)}
        </Text>
      </View>
    );
  }
}

export default PostDetailScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  title: {
    fontSize: mobileW * 0.05,
    color: 'black',
    fontWeight: 'bold',
  },
  auther: {
    fontSize: mobileW * 0.04,
    color: 'black',
    fontWeight: 'bold',
  },
  text: {
    fontSize: mobileW * 0.035,
    color: 'black',
    fontWeight: 'bold',
  },
});
