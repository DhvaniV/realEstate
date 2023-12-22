import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  SafeAreaView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import Carousel from 'react-native-snap-carousel';
import PaginationDot from 'react-native-animated-pagination-dot';
import {Scale} from '../Components/Scale';
import {
  backgroundColor,
  black,
  blue,
  grey,
  headingTxt,
  primaryColor,
  shadowColor,
  white,
  yellow,
} from './Colors';
import {
  back,
  bathroomIcon,
  bedIcon,
  built,
  heartIcon,
  infoIcon,
  redHeartIcon,
  shareIcon,
} from './assests';
import Share from 'react-native-share';
import CustomHeader from '../Components/CustomHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';

const screenWidth = Dimensions.get('window').width;

const sliderWidth = Math.round(Dimensions.get('window').width);
const itemWidth = sliderWidth;

const ProductInfo = ({route, navigation}: any) => {
  const {url} = route.params;
  const [postData, setPostData] = useState([]);
  const [activeSlide, setActiveSlide] = React.useState(0);
  const [product, setProduct] = useState({});
  const [photos, setPhotos] = useState([]);
  const [proprtyID, setPropertyID] = useState('');
  const [likedPhotos, setLikedPhotos] = useState([]);
  const [loader, setLoader] = useState(true);
  const [isLiked, setIsLiked] = useState(false);

  const makeApiCall = async (id: any) => {
    setLoader(true);
    try {
      const response = await axios.request({
        method: 'GET',
        url: 'https://realtor.p.rapidapi.com/properties/v3/detail',
        params: {
          property_id: id,
        },
        headers: {
          'X-RapidAPI-Key':
            'c83ad0c78cmshc4a5a6610e02f49p1fc659jsndc70c52ff8ab',
          'X-RapidAPI-Host': 'realtor.p.rapidapi.com',
        },
      });

      let arrayofImages = response.data.data.home.photos.map(
        (item: any) => item.href,
      );
      setPostData(arrayofImages);

      const likedArray = await AsyncStorage.getItem('productList');
      let LikedList = JSON.parse(likedArray!!);
      setLikedPhotos(LikedList);

      if (LikedList.includes(response.data.data.home.property_id.toString())) {
        console.log('liked ', response.data.data.home.property_id, LikedList, {
          isLiked: true,
          ...response.data.data.home,
        });
        setIsLiked(true);
      } else {
        setIsLiked(false);
      }
      setProduct(response.data.data.home);
      setLoader(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLike = async (photoId: any) => {
    if (isLiked) {
      const temp = likedPhotos.filter(item => item !== proprtyID);
      setIsLiked(false);
      setLikedPhotos(temp);
      await AsyncStorage.setItem('productList', JSON.stringify(temp));
    } else {
      const temp = likedPhotos;
      temp.push(proprtyID);
      setIsLiked(true);
      setLikedPhotos(temp);
      await AsyncStorage.setItem('productList', JSON.stringify(temp));
    }
  };

  const shareLink = async (href: string) => {
    try {
      const options = {
        title: 'Share Images',
        urls: postData,
        type: 'image/jpg',
        url: href, // Specify the MIME type of the images
      };

      const result = await Share.open(options);
    } catch (error) {
      console.log(error);
    }
  };

  const renderSlider = ({item}: any) => {
    return (
      <View style={styles.image}>
        <Image source={{uri: item}} style={styles.image} />
        <TouchableOpacity style={styles.textView}>
          <Text style={styles.text}>new</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleLike(item.property_id)}
          style={styles.heartIcon}>
          <Image source={isLiked ? redHeartIcon : heartIcon} />
        </TouchableOpacity>
      </View>
    );
  };

  const goToWebView = (urlLink: any) => {
    navigation.navigate('WebView', {url: urlLink});
  };

  const DATA = [
    {
      id: '1',
      title: 'House View',
    },
    {
      id: '2',
      title: 'Porch',
    },
    {
      id: '3',
      title: 'Laundry Room',
    },
    {
      id: '4',
      title: 'Kitchen',
    },
    {
      id: '5',
      title: 'Road View',
    },
    {
      id: '6',
      title: 'Garage',
    },
  ];

  const setImages = (title: any) => {
    if (title === 'Garage') {
      let photoArray = product.photos
        .filter((item: any) =>
          item.tags.some((item1: any) => item1.label === 'garage'),
        )
        .map((photo: any) => photo.href);
      setPhotos(photoArray);
    } else if (title === 'Road View') {
      let photoArray = product.photos
        .filter((item: any) =>
          item.tags.some((item1: any) => item1.label === 'Road View'),
        )
        .map((photo: any) => photo.href);
      setPhotos(photoArray);
    } else if (title === 'Kitchen') {
      let photoArray = product.photos
        .filter((item: any) =>
          item.tags.some((item1: any) => item1.label === 'kitchen'),
        )
        .map((photo: any) => photo.href);
      setPhotos(photoArray);
    } else if (title === 'Laundry Room') {
      let photoArray = product.photos
        .filter((item: any) =>
          item.tags.some((item1: any) => item1.label === 'laundry_room'),
        )
        .map((photo: any) => photo.href);
      setPhotos(photoArray);
    } else if (title === 'Porch') {
      let photoArray = product.photos
        .filter((item: any) =>
          item.tags.some((item1: any) => item1.label === 'porch'),
        )
        .map((photo: any) => photo.href);
      setPhotos(photoArray);
    } else if (title === 'House View') {
      let photoArray = product.photos
        .filter((item: any) =>
          item.tags.some((item1: any) => item1.label === 'house_view'),
        )
        .map((photo: any) => photo.href);
      setPhotos(photoArray);
    } else {
      setPhotos(postData);
    }
    navigation.navigate('ImagesView', {photos: photos});
  };

  const renderItem = ({item}: any) => {
    return (
      <TouchableOpacity
        onPress={() => setImages(item.title)}
        style={styles.listing_View}>
        <Text style={styles.text_School}>{item.title}</Text>
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    let product_id = route.params.propertyId;
    setPropertyID(route.params.propertyId);
    makeApiCall(product_id);
  }, []);
  return (
    <>
      <CustomHeader
        title={'Property Info'}
        color={white}
        source={back}
        navigation={() => navigation.navigate('InfoApp')}
      />
      <SafeAreaView style={styles.container}>
        <View style={styles.mainContainer}>
          {loader ? (
            <ActivityIndicator size="large" color={grey} />
          ) : (
            <>
              <View>
                <Carousel
                  data={postData}
                  renderItem={item => renderSlider(item)}
                  sliderWidth={sliderWidth}
                  itemWidth={itemWidth}
                  onSnapToItem={index => setActiveSlide(index)}
                  loop
                  inactiveSlideScale={1}
                />
                <View style={styles.paginationContainerView}>
                  <PaginationDot
                    activeDotColor={blue}
                    curPage={activeSlide}
                    maxPage={30}
                  />
                </View>
              </View>
              <View style={styles.desc}>
                <TouchableOpacity
                  style={styles.underline}
                  onPress={() => goToWebView(product.mortgage.rates_url)}>
                  <Text>Get A Home Mortgage Pre-Approval Today</Text>
                </TouchableOpacity>
                <View style={styles.typeView}>
                  <View
                    style={[
                      styles.circleYellow,
                      {
                        backgroundColor:
                          product.flags.is_contingent ||
                          product.flags.is_pending
                            ? yellow
                            : '#028A0F',
                      },
                    ]}
                  />
                  {product.flags.is_pending ? (
                    <Text style={styles.houseType}>Contigent</Text>
                  ) : product.flags.is_pending ? (
                    <Text style={styles.houseType}>Pending</Text>
                  ) : product.description.type === 'multi_family' ? (
                    <Text style={styles.houseType}>
                      Multi-family home for sale
                    </Text>
                  ) : (
                    <Text style={styles.houseType}>House for sale</Text>
                  )}
                </View>
                <Text style={styles.priceText}>${product.list_price}</Text>
                <View style={styles.homeDesc}>
                  {product.description.beds && (
                    <View style={styles.horizontal}>
                      <Text style={styles.data}>
                        {product.description.beds}
                      </Text>
                      <Image source={bedIcon} />
                    </View>
                  )}

                  {product.description.baths && (
                    <View style={styles.horizontal}>
                      <Text style={styles.data}>
                        {product.description.baths}
                      </Text>
                      <Image source={bathroomIcon} />
                    </View>
                  )}

                  {product.description.sqft && (
                    <View style={styles.horizontal}>
                      <Text style={styles.data}>
                        {product.description.sqft}
                      </Text>
                      <Text style={styles.headingTxt}>sqft</Text>
                    </View>
                  )}

                  {product.description.lot_sqft && (
                    <View style={styles.horizontal}>
                      <Text style={styles.data}>
                        {product.description.lot_sqft}
                      </Text>
                      <Text style={styles.headingTxt}>sqft lot</Text>
                    </View>
                  )}
                </View>
                <View style={styles.row}>
                  <View>
                    <Image source={built} />
                    <Text>{product.description.year_built}</Text>
                  </View>
                  <Text style={styles.address}>
                    {product.location.address.line}{' '}
                    {product.location.address.street_number}{' '}
                    {product.location.address.street_name}{' '}
                    {product.location.address.street_suffix}{' '}
                    {product.location.address.city}{' '}
                    {product.location.address.state}
                  </Text>
                </View>

                <Text style={styles.different_View}>
                  Diffrent Views of Area
                </Text>
                <FlatList data={DATA} renderItem={renderItem} numColumns={2} />
              </View>
            </>
          )}
        </View>
        <View style={styles.bottom}>
          <View style={styles.button}>
            <TouchableOpacity
              onPress={() => shareLink(product.href)}
              style={styles.share_View}>
              <Text>Share this home</Text>
              <Image source={shareIcon} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('About', {data: product})}
              style={styles.share_View}>
              <Text>About this house</Text>
              <Image source={infoIcon} />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: backgroundColor,
  },
  image: {
    height: Scale(180),
    width: screenWidth * 0.9,
    borderRadius: Scale(20),
    position: 'relative',
  },
  paginationContainerView: {
    position: 'absolute',
    width: '100%',
    bottom: 10,
    alignItems: 'center',
  },
  mainContainer: {
    marginHorizontal: Scale(20),
    marginTop: Scale(20),
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
    backgroundColor: blue,
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
  houseType: {
    fontSize: Scale(12),
    fontFamily: 'serif',
    fontWeight: '300',
  },
  desc: {
    marginHorizontal: Scale(10),
    marginTop: Scale(5),
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
    marginVertical: Scale(10),
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
  underline: {
    borderBottomColor: black,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: Scale(10),
    width: itemWidth * 0.7,
  },
  share_View: {
    backgroundColor: grey,
    paddingVertical: Scale(8),
    paddingHorizontal: Scale(5),
    borderRadius: Scale(10),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: itemWidth * 0.4,
    marginHorizontal: Scale(5),
  },
  address: {
    fontFamily: 'sans-serif',
    fontWeight: '700',
    fontSize: Scale(12),
    marginBottom: Scale(10),
    textAlign: 'center',
  },
  text_School: {
    fontFamily: 'sans-serif',
    fontWeight: '700',
    fontSize: Scale(15),
    marginVertical: Scale(5),
    color: shadowColor,
  },
  listing_View: {
    marginTop: Scale(10),
    borderColor: black,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: Scale(10),
    backgroundColor: primaryColor,
    width: itemWidth * 0.35,
    alignItems: 'center',
    marginHorizontal: Scale(10),
  },
  row: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  different_View: {
    justifyContent: 'center',
    fontFamily: 'sans-serif',
    fontWeight: '700',
    fontSize: Scale(15),
    textAlign: 'center',
    marginTop: Scale(15),
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bottom: {
    position: 'absolute',
    bottom: Scale(30),
    marginHorizontal: Scale(25),
  },
  heartIcon: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: 16,
  },
});

export default ProductInfo;
