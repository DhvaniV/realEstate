import {
  View,
  Text,
  Button,
  Alert,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
  Dimensions,
  Platform,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {Scale} from '../Components/Scale';
import {
  backgroundColor,
  blue,
  grey,
  headingTxt,
  primaryColor,
  shadowColor,
  yellow,
} from './Colors';
import {back, bathroomIcon, bedIcon, heartIcon, redHeartIcon} from './assests';
import CustomButton from '../Components/CustomHeader';
import CustomHeader from '../Components/CustomHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';

const screenWidth = Dimensions.get('window').width;

const productList = ({navigation}: any) => {
  const [postData, setPostData] = useState<any[]>([]);
  const [likedPhotos, setLikedPhotos] = useState([]);
  const options = {
    method: 'POST',
    url: 'https://realtor.p.rapidapi.com/properties/v3/list',
    headers: {
      'content-type': 'application/json',
      'X-RapidAPI-Key': 'c83ad0c78cmshc4a5a6610e02f49p1fc659jsndc70c52ff8ab',
      'X-RapidAPI-Host': 'realtor.p.rapidapi.com',
    },
    data: {
      limit: 200,
      offset: 0,
      postal_code: '90004',
      status: ['for_sale', 'ready_to_build'],
      sort: {
        direction: 'desc',
        field: 'list_date',
      },
    },
  };

  const makeApiCall = async () => {
    try {
      const response = await axios.request(options);
      let data = response.data.data.home_search.results.map((obj: any) => ({
        isLiked: false,
        ...obj,
      }));

      setPostData(data);
    } catch (error) {
      console.log('first, erro', error);
    }
  };

  const goToProductView = async (propertyId: any) => {
    await AsyncStorage.setItem('productList', JSON.stringify(likedPhotos));
    navigation.navigate('ProductInfo', {propertyId: propertyId});
  };

  const handleLike = async (photoId: any) => {
    const newArray = postData.map((obj: any) => {
      if (obj.property_id === photoId) {
        if (obj.isLiked) {
          const updatedArray = likedPhotos.filter(
            value => value !== obj.property_id,
          );
          setLikedPhotos(updatedArray);
        } else {
          setLikedPhotos(prev => prev.concat(obj.property_id));
        }
        obj.isLiked = !obj.isLiked;
        return obj;
      }
      return obj;
    });
    setPostData(newArray);
  };

  useEffect(() => {
    makeApiCall();
  }, []);
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      if (postData) {
        // console.log("Dhv", postData);
        const data = await AsyncStorage.getItem('productList');
        const parsed = JSON.parse(data);
        const abc = postData.map(item => {
          parsed.map(obj => {
            console.log('Dhv', obj);
            if (item.property_id === obj) {
              item.isLiked = true;
              return item;
            }
          });
        });
        console.log(abc, 'New \n\n\n\n');
      }
    });

    return unsubscribe;
  }, [navigation]);

  const renderItem = ({item}: any) => {
    return (
      <TouchableOpacity
        onPress={() => goToProductView(item.property_id)}
        style={styles.productView}>
        <View style={styles.imageContainer}>
          <Image
            source={{uri: item.primary_photo.href}}
            style={styles.image}
            resizeMode="cover"
          />
          {item.flags.is_coming_soon ||
          item.flags.is_new_construction ||
          item.flags.is_new_listing ? (
            <View
              style={[
                styles.textView,
                {
                  backgroundColor: item.flags.is_new_construction
                    ? grey
                    : item.flags.is_coming_soon
                    ? yellow
                    : blue,
                },
              ]}>
              <Text style={styles.text}>
                {item.flags.is_new_construction ? (
                  <Text>New Construction</Text>
                ) : item.flags.is_coming_soon ? (
                  <Text>Coming Soon</Text>
                ) : item.flags.is_new_listing ? (
                  <Text>New</Text>
                ) : null}
              </Text>
            </View>
          ) : null}
          <TouchableOpacity
            onPress={() => handleLike(item.property_id)}
            style={styles.heartIcon}>
            <Image source={item?.isLiked ? redHeartIcon : heartIcon} />
          </TouchableOpacity>
        </View>
        <View style={styles.desc}>
          <View style={styles.typeView}>
            <View
              style={[
                styles.circleYellow,
                {
                  backgroundColor:
                    item.flags.is_contingent || item.flags.is_pending
                      ? yellow
                      : '#028A0F',
                },
              ]}
            />
            {item.flags.is_contingent ? (
              <Text style={styles.houseType}>Contigent</Text>
            ) : item.flags.is_pending ? (
              <Text style={styles.houseType}>Pending</Text>
            ) : item.description.type === 'multi_family' ? (
              <Text style={styles.houseType}>Multi-family home for sale</Text>
            ) : (
              <Text style={styles.houseType}>House for sale</Text>
            )}
          </View>
          <Text style={styles.priceText}>${item.list_price}</Text>
          <View style={styles.homeDesc}>
            {item.description.beds ? (
              <View style={styles.horizontal}>
                <Text style={styles.data}>{item.description.beds}</Text>
                <Image source={bedIcon} />
              </View>
            ) : (
              <></>
            )}

            {item.description.baths ? (
              <View style={styles.horizontal}>
                <Text style={styles.data}>{item.description.baths}</Text>
                <Image source={bathroomIcon} />
              </View>
            ) : (
              <></>
            )}

            {item.description.sqft ? (
              <View style={styles.horizontal}>
                <Text style={styles.data}>{item.description.sqft}</Text>
                <Text style={styles.headingTxt}>sqft</Text>
              </View>
            ) : (
              <></>
            )}

            {item.description.lot_sqft ? (
              <View style={styles.horizontal}>
                <Text style={styles.data}>{item.description.lot_sqft}</Text>
                <Text style={styles.headingTxt}>sqft lot</Text>
              </View>
            ) : (
              <></>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <>
      <View style={styles.header}>
        <CustomHeader
          title={'House Listing'}
          navigation={() => navigation.navigate('InfoApp')}
          source={back}
        />
      </View>
      <SafeAreaView style={styles.container}>
        {postData.length === 0 ? (
          <ActivityIndicator size="large" color={primaryColor} />
        ) : (
          <View style={styles.top}>
            <FlatList
              data={postData}
              renderItem={renderItem}
              showsVerticalScrollIndicator={false}
            />
          </View>
        )}
      </SafeAreaView>
    </>
  );
};
const styles = StyleSheet.create({
  header: {
    marginBottom: Scale(10),
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: backgroundColor,
  },
  image: {
    height: Scale(150),
    width: screenWidth * 0.9,
    borderRadius: Scale(20),
    position: 'relative',
  },
  productView: {
    borderRadius: Scale(20),
    ...Platform.select({
      ios: {
        shadowColor: shadowColor,
        shadowOffset: {width: 5, height: 4},
        shadowOpacity: 0.3,
        shadowRadius: 3,
      },
      android: {
        elevation: 5,
      },
    }),
    marginBottom: Scale(25),
    backgroundColor: primaryColor,
    paddingBottom: Scale(20),
  },
  houseType: {
    fontSize: Scale(12),
    fontFamily: 'serif',
    fontWeight: '300',
  },
  desc: {
    marginHorizontal: Scale(10),
    marginTop: Scale(5),
  },
  typeView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Scale(5),
  },
  circleYellow: {
    width: Scale(10),
    height: Scale(10),
    borderRadius: Scale(10),
    marginRight: Scale(5),
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontSize: Scale(10),
    fontWeight: 'bold',
  },
  textView: {
    borderRadius: Scale(10),
    paddingVertical: Scale(2),
    paddingHorizontal: Scale(5),
    position: 'absolute',
    top: 10,
    left: 10,
  },
  priceText: {
    fontFamily: 'sans-serif',
    fontSize: Scale(14),
    fontWeight: '800',
    marginTop: Scale(5),
  },
  homeDesc: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  data: {
    fontFamily: 'sans-serif',
    fontSize: Scale(12),
    fontWeight: '500',
    marginTop: Scale(5),
  },
  headingTxt: {
    marginTop: Scale(3),
    marginLeft: Scale(3),
    color: headingTxt,
  },
  horizontal: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heartIcon: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: 16,
  },
  top: {marginTop: Scale(20)},
});
export default productList;
