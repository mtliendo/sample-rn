import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { gql, useQuery } from "@apollo/client";
import { ListItem, Input } from "react-native-elements";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import { Formik } from "formik";

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
      repositories(last: 30) {
        edges {
          cursor
          node {
            owner {
              login
            }
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

const HomeScreen = ({ route, navigation }) => {
  const { data, loading, error } = useQuery(GET_REPOS);

  if (loading) return <Text>Loading..</Text>;
  if (error) {
    console.log(error);
    return <Text>ERROR</Text>;
  }
  if (!data) return <Text>Not found</Text>;

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("RepoFormScreen", {
            repoName: item.node.name,
            accessToken: GITHUB_TOKEN,
            owner: item.node.owner.login,
          });
        }}
      >
        <ListItem key={item} bottomDivider>
          <ListItem.Content>
            <ListItem.Title>{item.node.name}</ListItem.Title>
          </ListItem.Content>
        </ListItem>
      </TouchableOpacity>
    );
  };
  return (
    <FlatList
      data={data.viewer.repositories.edges}
      renderItem={renderItem}
      keyExtractor={(item) => item.node.id}
    />
  );
};

export const RepoFormScreen = ({ route }) => {
  const handleFormSubmit = (values) => {
    console.log("the values", values);
    fetch(
      `https://api.github.com/repos/${route.params.owner}/${route.params.repoName}/issues`,
      {
        method: "post",
        headers: { Authorization: `Bearer ${route.params.accessToken}` },
        body: JSON.stringify({ title: values.title, body: values.body }),
      }
    )
      .then((res) => res.json())
      .then((status) => console.log("the status", status))
      .catch((e) => console.log("the error", e));
  };

  return (
    <Formik initialValues={{ title: "", body: "" }} onSubmit={handleFormSubmit}>
      {({ handleChange, handleBlur, handleSubmit, values }) => (
        <View>
          <Input
            placeholder="Issue Title"
            onChangeText={handleChange("title")}
            onBlur={handleBlur("title")}
            value={values.title}
          />
          <Input
            placeholder="Issue Description"
            onChangeText={handleChange("body")}
            onBlur={handleBlur("body")}
            value={values.body}
          />
          <Button onPress={handleSubmit} title="Create Issue" />
        </View>
      )}
    </Formik>
  );
};

const Stack = createStackNavigator();

export default function App() {
  return (
    <ApolloProvider client={client}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="RepoFormScreen" component={RepoFormScreen} />
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
