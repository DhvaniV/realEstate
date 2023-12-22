import { View, Text, StyleSheet, ScrollView } from 'react-native'
import React, { useEffect } from 'react'
import { Scale } from '../Components/Scale';
import { backgroundColor, text } from './Colors';

const Info = ({route}: any) => {
  
  return (
    <ScrollView style={styles.container}
    showsVerticalScrollIndicator={false}>
      <Text style = {styles.text}>{route.params.data}</Text>
    </ScrollView>
  )
}


const styles = StyleSheet.create({
  text: {
    fontFamily: 'sans-serif',
    fontSize: Scale(15),
    margin: Scale(15),
    color: text
  },
  container: {
    flex: 1,
    backgroundColor: backgroundColor
  }
});
export default Info