// CustomButton.js
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, SafeAreaView, Image, Platform } from 'react-native';
import { about, back } from '../Screens/assests';
import { grey, headingTxt, primaryColor, white } from '../Screens/Colors';
import { Scale } from './Scale';

const CustomHeader = ({ onPress, title, source, color, navigation } : any) => {
  return (
    <SafeAreaView style = {styles.header}>

    <View style={[styles.button, {backgroundColor: color}]} onPress={onPress}>
        <Image source={source}
        style = {styles.image}/>
      <Text style={styles.buttonText}>{title}</Text>
      <TouchableOpacity
      onPress={navigation}>
      <Image
       source={about}
      style = {styles.about}
      />
      </TouchableOpacity>
    </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        backgroundColor: white,
        shadowColor: grey,
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.18,
        shadowRadius: 1.0,
        zIndex: 999,
      },
      android: {
        backgroundColor: white,
        shadowColor: grey,
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.18,
        shadowRadius: 1.0,
        elevation: 3,
      },
    }),
  },
  buttonText: {
    color: headingTxt,
    fontSize: 20,
    textAlign: 'center',
    fontWeight: '700',
  },
  header: {
    justifyContent: 'center'
  },
  image: {
    justifyContent: 'flex-start',
    marginRight: '30%',
  },
  about: {
    marginLeft: '50%'
  }
});

export default CustomHeader;
