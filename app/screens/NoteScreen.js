import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableWithoutFeedback,
  Keyboard,
  FlatList,
} from "react-native";
import React, { useState, useEffect } from "react";
import colors from "../misc/colors";
import Searchbar from "../componenets/Searchbar";
import RoundIconBtn from "../componenets/RoundIconBtn";
import NoteInputModel from "../componenets/NoteInputModel";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Note from "../componenets/Note";
import { useNotes } from "../context/NoteProvider";
import NotFound from "../componenets/NotFound";

const reverseData = (data) => {
  return data.sort((a, b) => {
    const aInt = parseInt(a.time);
    const bInt = parseInt(b.time);
    if (aInt < bInt) return 1;
    if (aInt == bInt) return 0;
    if (aInt > bInt) return -1;
  });
};

const NoteScreen = ({ user, navigation }) => {
  const [greet, setGreet] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const { notes, setNotes, findNotes } = useNotes();
  const [searchQuery, setSearchQuery] = useState("");
  const [resultNotFound, setResultNotFound] = useState(false);
  const findGreet = () => {
    const hrs = new Date().getHours();
    if (hrs === 0 || hrs < 12) return setGreet("Morning");
    if (hrs === 1 || hrs < 17) return setGreet("Afternoon");
    setGreet("Evevning");
  };

  useEffect(() => {
    findGreet();
  }, []);

  const reverseNote = reverseData(notes);

  const handleOnSubmit = async (title, desc) => {
    const note = { id: Date.now(), title, desc, time: Date.now() };
    const updatedNote = [...notes, note];
    setNotes(updatedNote);
    await AsyncStorage.setItem("notes", JSON.stringify(updatedNote));
  };

  const handleOnSearchInput = async (text) => {
    setSearchQuery(text);
    if (!text.trim()) {
      setSearchQuery("");
      setResultNotFound(false);
      return await findNotes();
    }
    const filteredNotes = notes.filter((note) => {
      if (note.title.toLowerCase().includes(text.toLowerCase())) {
        return note;
      }
    });
    if (filteredNotes.length) {
      setNotes([...filteredNotes]);
    } else {
      setResultNotFound(true);
    }
  };

  const handleOnClear = async () => {
    setSearchQuery("");

    await findNotes();
  };

  const openNote = (note) => {
    navigation.navigate("NoteDetails", { note });
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={colors.LIGHT} />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <Text style={styles.header}>{`Good ${greet} ${user.name}`}</Text>
          {notes.length ? (
            <Searchbar
              value={searchQuery}
              onClear={handleOnClear}
              onChangeText={handleOnSearchInput}
              containerStyle={{ marginVertical: 20 }}
            />
          ) : null}
          {resultNotFound ? (
            <NotFound />
          ) : (
            <FlatList
              data={reverseNote}
              key={2}
              numColumns={2}
              columnWrapperStyle={{
                justifyContent: "space-between",
                marginBottom: 15,
              }}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <Note onPress={() => openNote(item)} item={item} />
              )}
            />
          )}
          {!notes.length ? (
            <View
              style={[
                StyleSheet.absoluteFillObject,
                styles.emptyHeaderContainer,
              ]}
            >
              <Text style={styles.emptyHeader}>Add Notes</Text>
            </View>
          ) : null}
        </View>
      </TouchableWithoutFeedback>
      <RoundIconBtn
        antIconName="plus"
        style={styles.addBtn}
        onPress={() => setModalVisible(true)}
      />
      <NoteInputModel
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleOnSubmit}
      />
    </>
  );
};

export default NoteScreen;

const styles = StyleSheet.create({
  header: {
    fontSize: 25,
    fontWeight: "bold",
    marginTop: 30,
  },
  container: {
    paddingHorizontal: 20,
    flex: 1,
    zIndex: 1,
  },
  emptyHeader: {
    fontSize: 30,
    textTransform: "uppercase",
    fontWeight: "bold",
    opacity: 0.2,
  },
  emptyHeaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    zIndex: -1,
  },
  addBtn: {
    position: "absolute",
    right: 15,
    bottom: 50,
    zIndex: 1,
  },
});
