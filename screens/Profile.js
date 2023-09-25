import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
  Image,
  Switch
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import * as Font from "expo-font";

import firebase from "firebase";
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

let customFonts = {
  "Bubblegum-Sans": require("../assets/fonts/BubblegumSans-Regular.ttf")
};


const foto = require("../assets/profile_img.png");

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontsLoaded: false,
      isEnabled: false,
      light_theme: true,
      profile_image: "",
      name: ""
    };
  }

  toggleSwitch() {
    const previous_state = this.state.isEnabled;
    const theme = !this.state.isEnabled ? "dark" : "light";
    var updates = {};
    updates[
      "/users/" + firebase.auth().currentUser.uid + "/current_theme"
    ] = theme;
    firebase
      .database()
      .ref()
      .update(updates);
    this.setState({ isEnabled: !previous_state, light_theme: previous_state });
  }

  async _loadFontsAsync() {
    await Font.loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  }

  componentDidMount() {
    this._loadFontsAsync();
    this.fetchUser();
  }

  async fetchUser() {
    let theme, name, image;
    await firebase
      .database()
      .ref("/users/" + firebase.auth().currentUser.uid)
      .on("value", function (snapshot) {
        theme = snapshot.val().current_theme;
        name = `${snapshot.val().first_name} ${snapshot.val().last_name}`;
        
      });
    this.setState({
      light_theme: theme === "light" ? true : false,
      isEnabled: theme === "light" ? false : true,
      name: name,
      profile_image: image
    });
  }

  render() {
    if (this.state.fontsLoaded) {
      SplashScreen.hideAsync();
      return (
        <View
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
              >
                App Narração de Histórias
              </Text>
            </View>
          </View>
          <View style={styles.screenContainer}>
            <View style={styles.profileImageContainer}>
              <Image
                source={foto}
                style={styles.profileImage}
              ></Image>
              <Text
                style={
                  this.state.light_theme
                    ? styles.nameTextLight
                    : styles.nameText
                }
              >
                {this.state.name}
              </Text>
            </View>
            <View style={styles.themeContainer}>
              <Text
                style={
                  this.state.light_theme
                    ? styles.themeTextLight
                    : styles.themeText
                }
              >
                Trocar tema
              </Text>

              <Switch
                style={{ transform: [{ scaleX: 1.3 }, { scaleY: 1.3 }] }}
                trackColor={{
                  false: "#767577",
                  true: this.state.light_theme ? "#eee" : "white"
                }}
                thumbColor={this.state.isEnabled ? "#ee8249" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={() => this.toggleSwitch()}
                value={this.state.isEnabled}
              />
            </View>
            <View style={{ flex: 0.3 }} />
          </View>
          <View style={{ flex: 0.08 }} />
        </View>
      );
    } else {
      return <Text>carregando</Text>
    }
  }
}

const styles = StyleSheet.create({
  appTitle: {
    height: "15%",
    display: 'flex',
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row"
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
  appTitleTextLight: {
    color: "black",
    fontSize: RFValue(25),
    fontFamily: "Bubblegum-Sans"
  },
  container: {
    backgroundColor: "#15193c",
    height: "100%"
  },
  containerLight: {
    height: "100%",
    backgroundColor: "white"
  },
  droidSafeArea: {
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : RFValue(35)
  },
  profileImageContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  profileImage: {
    width: RFValue(140),
    height: RFValue(140),
    borderRadius: RFValue(70)
  },
  nameText: {
    color: "white",
    fontSize: RFValue(40),
    fontFamily: "Bubblegum-Sans",
    marginTop: RFValue(20)
  },
  themeContainer: {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: RFValue(20)
  },
  themeText: {
    color: "white",
    fontSize: RFValue(30),
    fontFamily: "Bubblegum-Sans",
    marginRight: RFValue(15)
  },
  screenContainer: {
    flex: 0.85
  },
  nameTextLight: {
    color: "black",
    fontSize: RFValue(40),
    fontFamily: "Bubblegum-Sans",
    marginTop: RFValue(10)
  },
  themeTextLight: {
    color: "black",
    fontSize: RFValue(30),
    fontFamily: "Bubblegum-Sans",
    marginRight: RFValue(15)
  }
});
