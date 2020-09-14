import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { gql, useQuery } from "@apollo/client";

const GITHUB_TOKEN = "49fe420ef16ba4140865b60b1c2ba46227afa46b";
const client = new ApolloClient({
  uri: "https://api.github.com/graphql",
  cache: new InMemoryCache(),
  headers: {
    Authorization: "Bearer 49fe420ef16ba4140865b60b1c2ba46227afa46b",
  },
});

const GET_REPOS = gql`
  query {
    viewer {
      repositories(last: 10) {
        cursor
        edges {
          node {
            id
            name
          }
        }
      }
    }
  }
`;
const LoginScreen = ({ navigation }) => {
  const [githubToken, setGithubToken] = React.useState(null);

  const handleGithubAuth = () => {
    setGithubToken(GITHUB_TOKEN);
    navigation.navigate("Home", { githubToken: githubToken });
  };
  return (
    <View style={styles.container}>
      <Button title="Login with Github" onPress={handleGithubAuth} />
      <StatusBar style="auto" />
    </View>
  );
};

const HomeScreen = ({ route }) => {
  const { data, loading, error } = useQuery(GET_REPOS);

  if (loading) return <Text>Loading..</Text>;
  if (error) {
    console.log(error);
    return <Text>ERROR</Text>;
  }
  if (!data) return <Text>Not found</Text>;
  console.log(data);
  return <Text>I am the home screen {route.params.githubToken}</Text>;
};

const Stack = createStackNavigator();

export default function App() {
  return (
    <ApolloProvider client={client}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </ApolloProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
