import { StatusBar } from "expo-status-bar";
import React from "react";
import { View, Button, StyleSheet } from "react-native";
import { GITHUB_TOKEN } from "../GITHUB_TOKEN";

export const LoginScreen = ({ navigation }) => {
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

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
