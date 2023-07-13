import {
  StyleSheet,
  Text,
  TextInput,
  View,
  StatusBar,
  Dimensions,
} from "react-native";
import React, { useState } from "react";
import color from "../misc/colors";
import RoundIconBtn from "../componenets/RoundIconBtn";
import AsyncStorage from "@react-native-async-storage/async-storage";
export default function Intro({ onFinish }) {
  const [name, setName] = useState("");
  const handleChange = (text) => {
    setName(text);
  };

  const handleSubmit = async () => {
    const user = { name };
    await AsyncStorage.setItem("user", JSON.stringify(user));
    if (onFinish) onFinish();
  };

  return (
    <>
      <StatusBar hidden />
      <View style={styles.container}>
        <Text style={styles.inputTitle}>Enter the name to continue</Text>
        <TextInput
          value={name}
          onChangeText={handleChange}
          placeholder="Enter Name"
          style={styles.textInput}
        />
        {name.trim().length >= 3 ? (
          <RoundIconBtn antIconName="arrowright" onPress={handleSubmit} />
        ) : null}
      </View>
    </>
  );
}
const width = Dimensions.get("window").width - 50;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  textInput: {
    borderWidth: 2,
    borderColor: color.PRIMARY,
    color: color.PRIMARY,
    width,
    height: 50,
    borderRadius: 10,
    padding: 15,
    fontSize: 20,
    marginBottom: 15,
  },
  inputTitle: {
    alignSelf: "flex-start",
    paddingLeft: 25,
    opacity: 0.5,
    marginBottom: 5,
  },
});
