import React from "react";
import { View, Button } from "react-native";
import { Input } from "react-native-elements";
import { Formik } from "formik";

export const RepoFormScreen = ({ route }) => {
  console.log(route.params.accessToken);
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
