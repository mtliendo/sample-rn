import React from "react";
import { Text } from "react-native";
import { useQuery } from "@apollo/client";
import { ListItem } from "react-native-elements";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import { GET_REPOS } from "../queries/GET_REPOS";

export const HomeScreen = ({ route, navigation }) => {
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
            accessToken: route.params.githubToken,
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
