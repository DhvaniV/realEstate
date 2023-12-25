import {View, Text, StyleSheet, SafeAreaView, Image} from 'react-native';
import React from 'react';
import {back} from '../Screens/assests';
import {Scale} from './Scale';
import {headingTxt} from '../Screens/Colors';
import {TouchableOpacity} from 'react-native';

const CustomHeader = ({onBack, about, title, navigation, onBackPress}: any) => {
  return (
    <SafeAreaView>
      <View style={styles.row}>
        <TouchableOpacity onPress={onBackPress}>
          <Image source={onBack} />
        </TouchableOpacity>
        <Text style={styles.headertext}>{title}</Text>
        <TouchableOpacity onPress={navigation}>
          <Image source={about} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: Scale(10),
  },
  headertext: {
    fontFamily: 'sans-serif',
    fontSize: Scale(15),
    color: headingTxt,
  },
});

export default CustomHeader;
