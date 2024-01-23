import React, {Component} from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
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
      console.error('Error fetching posts:', error);
    }
  };

  handleLoadMore = () => {
    this.fetchPosts();
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
      onPress={() =>
        this.props.navigation.navigate('PostDetail', {post: item})
      }>
      <View>
        <Text>{item.title}</Text>
        <Text>{item.author}</Text>
        <Text>{item.created_at}</Text>
      </View>
    </TouchableOpacity>
  );

  render() {
    const {searchTerm, filteredPosts} = this.state;
    const dataToRender = searchTerm ? filteredPosts : this.state.posts;

    return (
      <View>
        <TextInput
          placeholder="Search by title or author"
          value={searchTerm}
          onChangeText={text => this.setState({searchTerm: text})}
          onSubmitEditing={this.handleSearch}
        />
        <FlatList
          data={dataToRender}
          renderItem={this.renderItem}
          keyExtractor={item => item.id}
          onEndReached={this.handleLoadMore}
          onEndReachedThreshold={0.1}
        />
      </View>
    );
  }
}

export default HomeScreen;
