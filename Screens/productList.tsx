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
  TextInput,
  Modal,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {Scale, screenHeight, screenWidth} from '../Components/Scale';
import {
  backgroundColor,
  blue,
  grey,
  headingTxt,
  light_grey,
  lightest_grey,
  primaryColor,
  shadowColor,
  teal,
  white,
  yellow,
} from './Colors';
import {
  about,
  back,
  bathroomIcon,
  bedIcon,
  heartIcon,
  locationIcon,
  redHeartIcon,
  search,
} from './assests';
import CustomButton from '../Components/CustomHeader';
import CustomHeader from '../Components/CustomHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {houseList, listing} from '../Components/constants';

const productList = ({navigation}: any) => {
  const [postData, setPostData] = useState<any[]>([]);
  const [likedPhotos, setLikedPhotos] = useState([]);
  const [searchText, setsearchText] = useState('');
  const [searchList, setSearchList] = useState<any[]>([]);
  const [showList, setShowList] = useState(false);
  const [finalList, setfinalList] = useState<any[]>([]);

  //options for API call
  const options = {
    method: 'POST',
    url: 'https://realtor.p.rapidapi.com/properties/v3/list',
    headers: {
      'content-type': 'application/json',
      'X-RapidAPI-Key': '648e39489emsh5156d12b21156e2p1b6224jsn7c30748b9949',
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

  //Api call
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

  //like functionality to like the house
  const handleLike = async (photoId: any) => {
    const newArray = listing.map((obj: any) => {
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
    setSearchList(listing);
    let list = listing.map(item => item.location?.address?.city);
    setSearchList(list);
    console.log('house listing:', listing);
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

  //House Listing View
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
            (item.flags.is_new_listing && (
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
            ))}
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
          <View style={styles.map}>
            <Image source={locationIcon} />
            <Text style={styles.location_txt}>
              {item.location.address.city} {item.location.address.state}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.priceText}>${item.list_price}</Text>
            <View style={styles.homeDesc}>
              {item.description.beds && (
                <View style={styles.horizontal}>
                  <Text style={styles.data}>{item.description.beds}</Text>
                  <Image source={bedIcon} />
                </View>
              )}

              {item.description.baths && (
                <View style={styles.horizontal}>
                  <Text style={styles.data}>{item.description.baths}</Text>
                  <Image source={bathroomIcon} />
                </View>
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const handleSearch = (text: string) => {
    console.log('test', text);
    let finalArray = listing.filter(
      item => item.location.address.city === text,
    );
    console.log('array', finalArray);
    setfinalList(finalArray);
    setShowList(false);
  };

  const listingSearchList = () => {
    setShowList(true);
  };

  const searchListRender = ({item}: any) => {
    return (
      <TouchableOpacity style={styles.list} onPress={() => handleSearch(item)}>
        <Text>{item}</Text>
        <Image source={locationIcon} />
      </TouchableOpacity>
    );
  };
  const handleSearchList = text => {
    setsearchText(text);
    setShowList(true);

    // Filter the data based on the search text
    const filteredData = searchList.filter(item => item.includes(text));

    console.log('filteredData', filteredData);
    setSearchList(filteredData);
    // Update the displayed data
    // setData(filteredData);
  };
  return (
    <>
       <CustomHeader
        title={'Home Listing'}
        source={back}
        onBackPress={() => navigation.goBack()}
        onBack={back}
      />

      <SafeAreaView style={styles.container}>
        {postData.length === 0 ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={teal} />
          </View>
        ) : (
          <View style={styles.top}>
            <View style={styles.searchBarView}>
              <Image source={search} />
              <TextInput
                style={styles.searchBar}
                placeholder="Search..."
                value={searchText}
                onChangeText={handleSearchList}
                onFocus={() => listingSearchList()}
              />
            </View>
            <FlatList
              data={finalList.length === 0 ? listing : finalList}
              renderItem={renderItem}
              showsVerticalScrollIndicator={false}
            />
          </View>
        )}
      </SafeAreaView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={showList}
        onRequestClose={() => {
          setShowList(false);
        }}>
        <View style={styles.centeredView}>
          <FlatList data={searchList} renderItem={searchListRender} />
        </View>
      </Modal>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: backgroundColor,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  image: {
    height: screenHeight * 0.2,
    width: screenWidth * 0.85,
    borderRadius: Scale(15),
    position: 'relative',
    margin: Scale(10),
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
    marginHorizontal: Scale(15),
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
    top: 20,
    left: 20,
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
    marginLeft: Scale(5),
    marginRight: Scale(3),
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
    alignSelf: 'flex-end',
    position: 'absolute',
    bottom: Scale(15),
    right: Scale(20),
    marginStart: Scale(15),
  },
  top: {marginTop: Scale(10)},
  map: {
    flexDirection: 'row',
    marginTop: Scale(10),
    marginLeft: Scale(-5),
    alignItems: 'center',
  },
  location_txt: {
    fontFamily: 'sans-serif',
    fontSize: Scale(12),
    fontWeight: '300',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  searchBar: {
    height: 40,
    marginLeft: Scale(10),
  },
  searchBarView: {
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 10,
    marginHorizontal: Scale(15),
    borderRadius: Scale(15),
    flexDirection: 'row',
    alignItems: 'center',
  },
  centeredView: {
    marginTop: screenHeight * 0.17,
    backgroundColor: white,
    marginHorizontal: Scale(30),
    borderRadius: Scale(10),
  },
  list: {
    borderBottomColor: light_grey,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginTop: Scale(15),
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Scale(20),
  },
});
export default productList;
