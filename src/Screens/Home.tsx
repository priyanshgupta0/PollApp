import React, {Component} from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';

const mobileW = Dimensions.get('window').width;
const mobileH = Dimensions.get('window').height;

export interface Post {
  title: string;
  author: string;
  url: string;
  created_at: string;
  _tags: string[];
  id: string;
}

export interface State {
  posts: Post[];
  page: number;
  searchTerm: string;
  filteredPosts: Post[];
}

class HomeScreen extends Component<any, State> {
  constructor(props: {}) {
    super(props);
    this.state = {
      posts: [],
      page: 0,
      searchTerm: '',
      filteredPosts: [],
    };
  }

  apiEndpoint = process.env.API_EndPiont; //processing apiendpoint form .env

  componentDidMount() {
    this.fetchPosts();
    this.intervalId = setInterval(this.fetchPosts, 10000);
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  intervalId: any;

  fetchPosts = async () => {
    try {
      const {page} = this.state;
      const response = await axios.get(`${this.apiEndpoint}&page=${page}`);
      const newPosts: Post[] = response.data.hits.map((hit: any) => ({
        title: hit.title,
        author: hit.author,
        url: hit.url,
        created_at: hit.created_at,
        _tags: hit._tags,
        id: hit.story_id,
      }));

      const uniqueNewPosts = newPosts.filter(
        newPost => !this.state.posts.some(post => post.id === newPost.id),
      );

      if (uniqueNewPosts.length > 0) {
        this.setState(prevState => ({
          posts: [...prevState.posts, ...uniqueNewPosts],
          page: prevState.page + 1,
        }));
      }
    } catch (error) {
      Alert.alert('Error fetching posts:', 'Network Error');
    }
  };

  handleLoadMore = () => {
    this.fetchPosts();
    clearInterval(this.intervalId);
    this.intervalId = setInterval(this.fetchPosts, 10000);
  };

  handleSearch = () => {
    const {searchTerm, posts} = this.state;

    if (!searchTerm) {
      // If searchTerm is empty, reset to the original list of posts
      this.setState({
        filteredPosts: [],
      });
      return;
    }

    // Filter posts based on title or author containing the searchTerm
    const filteredPosts = posts.filter(
      post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.author.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    this.setState({
      filteredPosts,
    });
  };

  renderItem = ({item}: {item: Post}) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        this.props.navigation.navigate('PostDetail', {post: item})
      }>
      <View>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.auther}>By : {item.author}</Text>
        <Text style={styles.text}>Created At : {item.created_at}</Text>
        <Text style={styles.text}>Tags : {item._tags}</Text>
        <Text style={styles.text}>Link : {item.url}</Text>
      </View>
    </TouchableOpacity>
  );

  render() {
    const {searchTerm, filteredPosts} = this.state;
    const dataToRender = searchTerm ? filteredPosts : this.state.posts;

    return (
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Search by title or author"
          value={searchTerm}
          onChangeText={text => this.setState({searchTerm: text})}
          onSubmitEditing={this.handleSearch}
        />
        <FlatList
          testID="FlatList"
          data={dataToRender}
          renderItem={this.renderItem}
          keyExtractor={item => item.id}
          onEndReached={this.handleLoadMore}
          onEndReachedThreshold={0.3}
          ListFooterComponent={
            <ActivityIndicator size="large" color="#0000ff" />
          }
        />
      </View>
    );
  }
}

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  input: {
    height: 40,
    borderColor: 'black',
    borderWidth: mobileW * 0.005,
    borderRadius: 3,
    marginBottom: 16,
    padding: mobileW * 0.01,
    margin: mobileW * 0.02,
  },
  card: {
    borderWidth: mobileW * 0.005,
    margin: mobileW * 0.005,
    padding: mobileW * 0.01,
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
