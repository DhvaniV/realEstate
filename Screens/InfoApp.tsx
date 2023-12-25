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
import {Scale, screenHeight} from '../Components/Scale';
import {TouchableOpacity} from 'react-native';
const screenWidth = Dimensions.get('window').width;

const InfoApp = ({navigation}: any) => {
  return (
    <View style={styles.container}>
      <View>
        <View style={styles.center}>
          <Image
            source={{
              uri: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg',
            }}
            height={screenHeight * 0.55}
            width={screenWidth}
          />
        </View>
        <Text style={styles.description}>
          Choose your dream house from your App
        </Text>

        <Text style={styles.desc_text}>
          A good description should be a narrative. It should tell the story of
          your property. It should focus on the emotions that the property and
          its amenities evoke.
        </Text>
      </View>
      <View style={styles.bottom_View}>
        <TouchableOpacity
          style={styles.bottom}
          onPress={() => navigation.navigate('productList')}>
          <Text style={styles.text}>Register Now</Text>
        </TouchableOpacity>
        <Text style={styles.loginTxt}>Already have an account? Login In</Text>
      </View>
    </View>
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
    marginHorizontal: Scale(15),
    marginTop: Scale(25),
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: Scale(15),
    fontFamily: 'sans-serif',
    fontWeight: '500',
    color: white,
  },
  description: {
    fontSize: Scale(18),
    fontWeight: '700',
    fontFamily: 'sans-serif',
    marginTop: Scale(20),
    marginHorizontal: Scale(25),
    textAlign: 'center',
  },
  desc_text: {
    fontFamily: 'sans-serif',
    fontSize: Scale(15),
    fontWeight: '400',
    color: shadowColor,
    marginHorizontal: Scale(20),
    marginTop: Scale(10),
    textAlign: 'center',
  },
  loginTxt: {
    textAlign: 'center',
    marginTop: Scale(15),
  },
  bottom_View: {
    justifyContent: 'flex-end',
    flex: 1,
    marginBottom: Scale(20),
  },
});
export default InfoApp;
