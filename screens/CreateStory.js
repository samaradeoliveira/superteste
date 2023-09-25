import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
  Image,
  ScrollView,
  TextInput,
  KeyboardAvoidingView
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import DropDownPicker from "react-native-dropdown-picker";
import * as Font from "expo-font";
import * as SplashScreen from 'expo-splash-screen';

import firebase from "firebase";
SplashScreen.preventAutoHideAsync();

let customFonts = {
  "Bubblegum-Sans": require("../assets/fonts/BubblegumSans-Regular.ttf")
};

export default class CreateStory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontsLoaded: false,
      previewImage: "image_1",
      dropdownHeight: 40,
      light_theme: true,
    };
  }

  async _loadFontsAsync() {
    await Font.loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  }

  componentDidMount() {
    this._loadFontsAsync();
    this.fetchUser();
  }

 fetchUser = () => {
    let theme;
    firebase
      .database()
      .ref("/users/" + firebase.auth().currentUser.uid)
      .on("value", snapshot => {
        theme = snapshot.val().current_theme;
        this.setState({ light_theme: theme === "light" });
      });
  };


  render() {
    if (this.state.fontsLoaded) {
      SplashScreen.hideAsync();
      let preview_images = {
        image_1: require("../assets/story_image_1.png"),
        image_2: require("../assets/story_image_2.png"),
        image_3: require("../assets/story_image_3.png"),
        image_4: require("../assets/story_image_4.png"),
        image_5: require("../assets/story_image_5.png")
      };

      return (
        <KeyboardAvoidingView behavior="padding" 
         style={
            this.state.light_theme ? styles.containerLight : styles.container
          }
        
        >
          <SafeAreaView style={styles.droidSafeArea} />
          <View style={styles.appTitle}>
            <View style={styles.appIcon}>
              <Image
                source={require("../assets/logo.png")}
                style={styles.iconImage}
              ></Image>
            </View>
            <View style={styles.appTitleTextContainer}>
              <Text 
               style={
                  this.state.light_theme
                    ? styles.appTitleTextLight
                    : styles.appTitleText
                }
              
              >Nova História</Text>
            </View>
          </View>
          <View style={styles.fieldsContainer}>
            <ScrollView>
              <Image
                source={preview_images[this.state.previewImage]}
                style={styles.previewImage}
              ></Image>
              <View style={{ height: RFValue(this.state.dropdownHeight) }}>
                <DropDownPicker
                  items={[
                    { label: "Imagem 1", value: "image_1" },
                    { label: "Imagem 2", value: "image_2" },
                    { label: "Imagem 3", value: "image_3" },
                    { label: "Imagem 4", value: "image_4" },
                    { label: "Imagem 5", value: "image_5" }
                  ]}
                  defaultValue={this.state.previewImage}
                  containerStyle={{
                   height: 40,
                    borderRadius: RFValue(20),
                    marginBottom: RFValue(20),
                    marginHorizontal: RFValue(10)
                  }}
                  onOpen={() => {
                    this.setState({ dropdownHeight: 170 });
                  }}
                  onClose={() => {
                    this.setState({ dropdownHeight: 40 });
                  }}
                  style={{backgroundColor: "transparent" }}
                  itemStyle={{
                    justifyContent: "flex-start"
                  }}
                  dropDownStyle={{ backgroundColor: this.state.light_theme ? "#eee" : "#2f345d" }}
                  labelStyle={{
                    color: "white",
                    fontFamily: "Bubblegum-Sans"
                  }}
                  arrowStyle={
                    this.state.light_theme
                      ? styles.dropdownLabelLight
                      : styles.dropdownLabel
                  }
                  onChangeItem={item =>
                    this.setState({
                      previewImage: item.value
                    })
                  }
                />
              </View>

              <TextInput
               style={
                    this.state.light_theme
                      ? styles.inputFontLight
                      : styles.inputFont
                  }
                onChangeText={title => this.setState({ title })}
                placeholder={"Título"}
                placeholderTextColor={this.state.light_theme ? "black" : "white"}
              />

              <TextInput
                style={[
                  this.state.light_theme
                      ? styles.inputFontLight
                      : styles.inputFont,
                    styles.inputFontExtra,
                    styles.inputTextBig,
                    {height: 100}
                ]}
                onChangeText={description => this.setState({ description })}
                placeholder={"Descrição"}
                multiline={true}
                numberOfLines={4}
                placeholderTextColor={this.state.light_theme ? "black" : "white"}
              />
              <TextInput
                style={[
                  this.state.light_theme
                      ? styles.inputFontLight
                      : styles.inputFont,
                    styles.inputFontExtra,
                    styles.inputTextBig,
                    {height: 200}
                ]}
                onChangeText={story => this.setState({ story })}
                placeholder={"História"}
                multiline={true}
                numberOfLines={20}
                placeholderTextColor={this.state.light_theme ? "black" : "white"}
              />

              <TextInput
                style={[
                   this.state.light_theme
                      ? styles.inputFontLight
                      : styles.inputFont,
                    styles.inputFontExtra,
                    styles.inputTextBig,
                    {height: 100}
                ]}
                onChangeText={moral => this.setState({ moral })}
                placeholder={"Moral da História"}
                multiline={true}
                numberOfLines={4}
                placeholderTextColor={ this.state.light_theme ? "black" : "white"}
              />
            </ScrollView>
          </View>
          <View style={{ flex: 0.08 }} />
        </KeyboardAvoidingView>
      );
    } else {
      return <Text>Carregando</Text>
    }
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#15193c",
    height: "100%"
  },
  containerLight: {
    flex: 1,
    backgroundColor: "white"
  },
  droidSafeArea: {
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : RFValue(35)
  },
  appTitle: {
    height: "15%",
    display: 'flex',
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row"
  },
   appTitleTextLight: {
    color: "black",
    fontSize: RFValue(28),
    fontFamily: "Bubblegum-Sans"
  },
  appIcon: {
    width: 50,
    height: 50
  },
  iconImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain"
  },
  appTitleTextContainer: {
    marginLeft: 20
  },
  appTitleText: {
    color: "white",
    fontSize: RFValue(25),
    fontFamily: "Bubblegum-Sans",
  },
  fieldsContainer: {
    height: "68%"
  },
  previewImage: {
    width: '93%',
    height: RFValue(200),
    alignSelf: 'center',
    borderRadius: RFValue(10),
    marginVertical: RFValue(10),
    // resizeMode: 'contain',
  },
  inputFont: {
    height: RFValue(40),
    borderColor: 'white',
    borderWidth: RFValue(1),
    borderRadius: RFValue(10),
    paddingLeft: RFValue(10),
    color: 'white',
    marginTop: RFValue(10),
    fontFamily: 'Bubblegum-Sans',
  },
  inputFontExtra: {
    marginTop: RFValue(15),
  },
  inputFontLight: {
    height: RFValue(40),
    borderColor: "black",
    borderWidth: RFValue(1),
    borderRadius: RFValue(10),
    paddingLeft: RFValue(10),
    color: "black",
    fontFamily: "Bubblegum-Sans"
  },
  inputTextBig: {
    textAlignVertical: 'top',
    padding: RFValue(5),
  },
   dropdownLabel: {
    color: "white",
    fontFamily: "Bubblegum-Sans"
  },
  dropdownLabelLight: {
    color: "black",
    fontFamily: "Bubblegum-Sans"
  },
});
