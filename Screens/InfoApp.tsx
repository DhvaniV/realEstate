import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  Dimensions,
} from 'react-native';
import React from 'react';
import {backgroundColor, shadowColor, teal, white} from './Colors';
import CustomHeader from '../Components/CustomHeader';
import {back} from './assests';
import {Scale} from '../Components/Scale';
import {TouchableOpacity} from 'react-native';
const screenWidth = Dimensions.get('window').width;

const InfoApp = () => {
  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader title={'About App'} source={back} />

      <View>
        <View style={styles.center}>
          <Image
            source={{
              uri: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg',
            }}
            height={200}
            width={screenWidth * 0.7}
          />
        </View>
        <Text style={styles.description}>Desription:-</Text>

        <Text style={styles.desc_text}>
          A good description should be a narrative. It should tell the story of
          your property. It should focus on the emotions that the property and
          its amenities evoke. This is where you can describe the style of the
          property, the history of those who have operated there, and the
          importance of its place in the neighborhood.
        </Text>
      </View>

      <TouchableOpacity style={styles.bottom}>
        <Text style={styles.text}>InfoApp</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: backgroundColor,
  },
  bottom: {
    padding: Scale(15),
    borderRadius: Scale(12),
    alignItems: 'center',
    backgroundColor: teal,
    position: 'absolute',
    bottom: 20,
    left: 10,
    right: 10,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Scale(10),
  },
  text: {
    fontSize: Scale(15),
    fontFamily: 'sans-serif',
    fontWeight: '500',
    color: white,
  },
  description: {
    fontSize: Scale(15),
    fontWeight: '500',
    fontFamily: 'sans-serif',
    marginTop: Scale(20),
    marginHorizontal: Scale(15),
  },
  desc_text: {
    fontFamily: 'sans-serif',
    fontSize: Scale(15),
    fontWeight: '400',
    color: shadowColor,
    marginHorizontal: Scale(20),
    marginTop: Scale(10),
  },
});
export default InfoApp;
