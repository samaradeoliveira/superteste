import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RFValue } from 'react-native-responsive-fontsize';
import * as Font from 'expo-font';
import firebase from 'firebase';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

let customFonts = {
  'Bubblegum-Sans': require('../assets/fonts/BubblegumSans-Regular.ttf'),
};

export default class StoryCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontsLoaded: false,
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
      .ref('/users/' + firebase.auth().currentUser.uid)
      .on('value', (snapshot) => {
        theme = snapshot.val().current_theme;
        this.setState({ light_theme: theme === 'light' });
      });
  };

  render() {
    if (this.state.fontsLoaded) {
      SplashScreen.hideAsync();
      return (
        <TouchableOpacity
          style={
            this.state.light_theme ? styles.containerLight : styles.container
          }
          onPress={() => {
            this.props.navigation.navigate('História', {
              story: this.props.story,
            });
          }}>
          <SafeAreaView style={styles.droidSafeArea} />
          <View
            style={
              this.state.light_theme
                ? styles.cardContainerLight
                : styles.cardContainer
            }>
            <Image
              source={require('../assets/story_image_1.png')}
              style={styles.storyImage}></Image>

            <View style={styles.titleContainer}>
              <Text
                style={
                  this.state.light_theme
                    ? styles.storyTitleTextLight
                    : styles.storyTitleText
                }>
                {this.props.story.title}
              </Text>
              <Text
                style={
                  this.state.light_theme
                    ? styles.storyAuthorTextLight
                    : styles.storyAuthorText
                }>
                {this.props.story.author}
              </Text>
              <Text
                style={
                  this.state.light_theme
                    ? styles.descriptionTextLight
                    : styles.descriptionText
                }>
                {this.props.story.description}
              </Text>
            </View>
            <View style={styles.actionContainer}>
              <View style={styles.likeButton}>
                <Ionicons
                  name={'heart'}
                  size={RFValue(30)}
                  color={this.state.light_theme ? 'black' : 'white'}
                />
                <Text
                  style={
                    this.state.light_theme
                      ? styles.likeTextLight
                      : styles.likeText
                  }>
                  12k
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      );
    } else {
      return <Text>Carregando</Text>;
    }
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#15193c',
    height: '100%',
  },
  containerLight: {
    backgroundColor: 'white',
    height: '100%',
  },
  droidSafeArea: {
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  cardContainer: {
    margin: RFValue(13),
    backgroundColor: '#2f345d',
    borderRadius: RFValue(20),
  },
  storyImage: {
    resizeMode: 'contain',
    width: '95%',
    alignSelf: 'center',
    height: RFValue(250),
  },
  titleContainer: {
    paddingLeft: RFValue(20),
    justifyContent: 'center',
  },
  storyTitleText: {
    fontSize: RFValue(25),
    fontFamily: 'Bubblegum-Sans',
    color: 'white',
  },
  storyAuthorText: {
    fontSize: RFValue(18),
    fontFamily: 'Bubblegum-Sans',
    color: 'white',
  },
  descriptionText: {
    fontFamily: 'Bubblegum-Sans',
    fontSize: 13,
    color: 'white',
    paddingTop: RFValue(10),
  },
  actionContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: RFValue(10),
  },
  likeButton: {
    width: RFValue(160),
    height: RFValue(40),
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#eb3948',
    borderRadius: RFValue(30),
  },
  likeText: {
    color: 'white',
    fontFamily: 'Bubblegum-Sans',
    fontSize: RFValue(25),
    marginLeft: RFValue(5),
  },
  cardContainerLight: {
    margin: RFValue(13),

    backgroundColor: 'white',
    borderRadius: RFValue(20),
    shadowColor: 'rgb(0, 0, 0)',
    shadowOffset: {
      width: 3,
      height: 3,
    },
    shadowOpacity: RFValue(0.5),
    shadowRadius: RFValue(5),
    elevation: RFValue(2),
  },
  storyTitleTextLight: {
    fontFamily: 'Bubblegum-Sans',
    fontSize: RFValue(25),
    color: 'black',
  },
  storyAuthorTextLight: {
    fontFamily: 'Bubblegum-Sans',
    fontSize: RFValue(18),
    color: 'black',
  },
  descriptionTextLight: {
    fontFamily: 'Bubblegum-Sans',
    fontSize: RFValue(13),
    color: 'black',
  },
  likeTextLight: {
    fontFamily: 'Bubblegum-Sans',
    fontSize: RFValue(25),
    marginLeft: RFValue(5),
  },
});
