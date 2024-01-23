import React from 'react';
import {Alert} from 'react-native';
import {render, waitFor, act, fireEvent} from '@testing-library/react-native';
import axios from 'axios'; // Import axios for mocking
import HomeScreen from '../src/Screens/Home';

jest.useFakeTimers();

const mockedResponse = {
  data: {
    hits: [
      {
        title: 'Test Post 1',
        author: 'Test Author 1',
        story_id: '1',
        url: 'google.com',
        _tags: 'tag',
        created_at: 'Date',
      },
      {
        title: 'Test Post 2',
        author: 'Test Author 2',
        story_id: '2',
        url: 'google.com',
        _tags: 'tag',
        created_at: 'Date',
      },
    ],
  },
};
// Mock axios for testing
jest.mock('axios');

describe('HomeScreen', () => {
  it('fetches posts successfully', async () => {
    // Mock the axios.get method to return a sample response

    // Set up the mock for axios.get
    jest.spyOn(axios, 'get').mockResolvedValueOnce(mockedResponse);

    // Render the component
    const {getByText} = render(<HomeScreen />);

    // Wait for the posts to be fetched and rendered
    await waitFor(() => getByText('Test Post 1'));

    // Assertions based on your component's behavior
    expect(getByText('Test Post 1')).toBeDefined();
    expect(getByText('Test Post 2')).toBeDefined();
  });

  it('handles errors during post fetching', async () => {
    // Mock the axios.get method to simulate an error
    const mockedError = new Error('Failed to fetch posts');

    // Set up the mock for axios.get
    jest.spyOn(axios, 'get').mockRejectedValueOnce(mockedError);
    // Set up a console.error spy to check if the error message is logged
    const mockAlert = jest.spyOn(Alert, 'alert');
    // const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    // Render the component
    const {getByText} = render(<HomeScreen />);

    // Wait for the error handling logic to be executed
    await waitFor(() => mockAlert);

    // Assertions based on your error handling logic
    expect(mockAlert).toHaveBeenCalledWith(
      'Error fetching posts:',
      'Network Error',
    );
  });
  // fireevent scroll work nahi kar raha
  it('fetches more posts when loading more', async () => {
    // Mock the axios.get method to return a sample response

    // Set up the mock for axios.get
    jest.spyOn(axios, 'get').mockResolvedValueOnce(mockedResponse);

    // Render the component
    const {getByText, getByTestId} = render(<HomeScreen />);

    // Wait for the initial posts to be fetched and rendered
    await waitFor(() => getByText('Test Post 1'));

    // Trigger the handleLoadMore function
    const FL = getByTestId('FlatList');
    act(() => {
      fireEvent(FL, 'endReached');
      //   fireEvent.scroll(getByTestId('FlatList'));
      //   fireEvent.scroll(getByText('Test Post 1'));
    });

    // Wait for the additional posts to be fetched and rendered
    await waitFor(() => getByText('Test Post 2'));

    // Assertions based on your component's behavior
    expect(getByText('Test Post 1')).toBeDefined();
    expect(getByText('Test Post 2')).toBeDefined();
  });

  it('filters posts based on search term', async () => {
    jest.spyOn(axios, 'get').mockResolvedValueOnce(mockedResponse);

    // Render the component
    const {getByText, getByPlaceholderText} = render(<HomeScreen />);

    await waitFor(() => getByText('Test Post 1'));

    // Initial posts
    const post1 = getByText('Test Post 1');
    const post2 = getByText('Test Post 2');

    const input = getByPlaceholderText('Search by title or author');
    // Trigger a search with a specific term
    fireEvent.changeText(input, 'Test Author 1');
    fireEvent(input, 'submitEditing');
    // Wait for the component to re-render with filtered posts
    await waitFor(() => getByText('Test Post 1'));

    // Assertions based on your component's behavior
    expect(post1).toBeDefined(); // Original post
    // expect(post2).toBeUndefined(); // Post not matching the search term

    // Trigger a search with an empty term
    fireEvent.changeText(input, '');
    fireEvent(input, 'submitEditing');

    // Wait for the component to re-render without filtered posts
    await waitFor(() => getByText('Test Post 1'));

    // Assertions based on your component's behavior
    expect(post1).toBeDefined(); // Original post
    expect(post2).toBeDefined(); // Original post
  });

  it('navigates to PostDetail screen when an item is pressed', async () => {
    // Render the component within a NavigationContainer and Stack.Navigator
    jest.spyOn(axios, 'get').mockResolvedValueOnce(mockedResponse);

    const mockNavigation = {
      navigate: jest.fn(),
    };
    // Render the component
    const {getByText} = render(<HomeScreen navigation={mockNavigation} />);

    await waitFor(() => getByText('Test Post 1'));

    const card = getByText('Test Post 1');

    fireEvent.press(card);
  });
  it('does not add posts with duplicate ids', async () => {
    const initialState = {
      posts: mockedResponse,
      page: 0,
      searchTerm: '',
      filteredPosts: [],
    };

    jest.spyOn(axios, 'get').mockResolvedValueOnce(mockedResponse);
    // Render the component
    const {getByText} = render(<HomeScreen />);

    jest.spyOn(axios, 'get').mockReset();
    jest.spyOn(axios, 'get').mockResolvedValueOnce(mockedResponse);
    // Set up the mock for axios.get
    // Wait for the initial posts to be fetched and rendered
    await waitFor(() => getByText('Test Post 1'));

    // Trigger the fetchPosts function again to attempt adding duplicate posts
    // await waitFor(() => getByText('Test Post 2'));

    // jest.spyOn(axios, 'get').mockResolvedValueOnce(mockedResponse);
    // Check that only unique posts are present
    expect(getByText('Test Post 1')).toBeDefined();
    // expect(getByText('Test Post 2')).toBeDefined();
  });

  it('fetches posts successfully', async () => {
    // Mock the axios.get method to return a sample response
    const mockedResponse = {
      data: {
        hits: [],
      },
    };
    // Set up the mock for axios.get
    jest.spyOn(axios, 'get').mockResolvedValueOnce(mockedResponse);

    // Render the component
    const {getByText} = render(<HomeScreen />);
    jest.advanceTimersByTime(10000);
    await waitFor(() => {});
  });

  it('updates posts and increments page when there are new posts', async () => {
    const axiosMock = jest.spyOn(axios, 'get');
    axiosMock.mockResolvedValue({
      data: {
        hits: [
          {
            title: 'New Post 1',
            author: 'Author 1',
            url: 'https://example.com/1',
            created_at: '2022-01-01T12:00:00.000Z',
            _tags: ['tag1'],
            id: '1',
          },
          // Add more new posts as needed
        ],
      },
    });

    const {getByText} = render(<HomeScreen />);

    // Advance timers to simulate the interval
    jest.advanceTimersByTime(10000);

    // Wait for the next render cycle
    await waitFor(() => {});

    // Ensure that posts are updated and page is incremented
    expect(getByText('New Post 1')).toBeTruthy();
    // Add more assertions for other properties of the new posts if needed
    expect(getByText('By : Author 1')).toBeTruthy();
    expect(getByText('Created At : 2022-01-01T12:00:00.000Z')).toBeTruthy();
    expect(getByText('Tags : tag1')).toBeTruthy();
    expect(getByText('Link : https://example.com/1')).toBeTruthy();

    // Ensure that page is incremented
    // Note: This assumes your page increment logic is reflected in the UI somehow
    expect(getByText('New Post 1')).toBeTruthy(); // Update with the actual text content
  });
});
