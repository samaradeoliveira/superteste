import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
  Image,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { FlatList } from 'react-native-gesture-handler';
import StoryCard from './StoryCard';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import firebase from 'firebase';

SplashScreen.preventAutoHideAsync();

let customFonts = {
  'Bubblegum-Sans': require('../assets/fonts/BubblegumSans-Regular.ttf'),
};

let stories = require('./temp_stories.json');

export default class Feed extends Component {
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

  renderItem = ({ item: story }) => {
    return <StoryCard story={story} navigation={this.props.navigation} />;
  };

  keyExtractor = (item, index) => index.toString();

  render() {
    if (this.state.fontsLoaded) {
      SplashScreen.hideAsync();
      return (
        <View
          style={
            this.state.light_theme ? styles.containerLight : styles.container
          }>
          <SafeAreaView style={styles.droidSafeArea} />
          <View style={styles.appTitle}>
            <View style={styles.appIcon}>
              <Image
                source={require('../assets/logo.png')}
                style={styles.iconImage}></Image>
            </View>
            <View style={styles.appTitleTextContainer}>
              <Text
                style={
                  this.state.light_theme
                    ? styles.appTitleTextLight
                    : styles.appTitleText
                }>
                App Narração de Histórias
              </Text>
            </View>
          </View>
          
            <FlatList
              keyExtractor={this.keyExtractor}
              data={stories}
              renderItem={this.renderItem}
            />
         
         
        </View>
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
    height: '100%',
    backgroundColor: 'white',
  },
  droidSafeArea: {
    marginTop:
      Platform.OS === 'android' ? StatusBar.currentHeight : RFValue(35),
  },
  appTitle: {
    height: '15%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  appIcon: {
    width: 50,
    height: 50,
  },
  iconImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  appTitleTextContainer: {
    marginLeft: 20,
  },
  appTitleText: {
    color: 'white',
    fontSize: RFValue(25),
    fontFamily: 'Bubblegum-Sans',
  },
  appTitleTextLight: {
    color: 'black',
    fontSize: RFValue(25),
    fontFamily: 'Bubblegum-Sans',
  },
  cardContainer: {
    height: '70%',
    backgroundColor:'#15193c'
  },
  cardcontainerLight: {
    height: '70%',
     backgroundColor:'white'
  },
});
