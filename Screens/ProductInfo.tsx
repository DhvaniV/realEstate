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
  Modal,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import axios from 'axios';
import Carousel from 'react-native-snap-carousel';
import PaginationDot from 'react-native-animated-pagination-dot';
import {Scale, screenHeight} from '../Components/Scale';
import {
  backgroundColor,
  black,
  blue,
  grey,
  headingTxt,
  light_grey,
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
  built,
  heartIcon,
  infoIcon,
  locationIcon,
  menu,
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
  const [modal, setModal] = useState(false);

  const makeApiCall = async (id: any) => {
    setLoader(true);
    try {
      const response = await axios.request({
        method: 'GET',
        url: 'https://realtor.p.rapidapi.com/properties/v3/detail',
        params: {
          property_id: '9796455368',
        },
        headers: {
          'X-RapidAPI-Key':
            '648e39489emsh5156d12b21156e2p1b6224jsn7c30748b9949',
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
        <TouchableOpacity
          onPress={() => setModal(true)}
          style={styles.textView}>
          <Image source={menu} />
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
    setModal(false);
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
  const NUM_OF_LINES = 5;
  const [showMore, setShowMore] = useState(false);
  useEffect(() => {
    let product_id = route.params.propertyId;
    setPropertyID(route.params.propertyId);
    makeApiCall(product_id);
  }, []);

  const onTextLayout = useCallback((e : any) => {
    console.log(e.nativeEvent.lines.length);
  }, []);
  return (
    <>
      <CustomHeader
        title={'About App'}
        source={back}
        onBackPress={() => navigation.goBack()}
        onBack={back}
      />
      <View style={styles.container}>
        <View style={styles.mainContainer}>
          {loader ? (
            <View style={styles.center}>
              <ActivityIndicator size="large" color={teal} />
            </View>
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
                    activeDotColor={'#303030'}
                    curPage={activeSlide}
                    maxPage={30}
                  />
                </View>
              </View>
              <View style={styles.desc}>
                <TouchableOpacity
                  style={styles.underline}
                  onPress={() => goToWebView(product.mortgage.rates_url)}>
                  <Text style={styles.mortgageTxt}>
                    Get A Home Mortgage Pre-Approval by today
                  </Text>
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
                <View style={styles.addressView}>
                  <Image source={locationIcon} />
                  <Text style={styles.address}>
                    {product.location.address.line}{' '}
                    {product.location.address.street_number}{' '}
                    {product.location.address.street_name}{' '}
                    {product.location.address.street_suffix}{' '}
                    {product.location.address.city}{' '}
                    {product.location.address.state}
                  </Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.priceText}>${product.list_price}</Text>
                  <TouchableOpacity onPress={() => shareLink(product.href)}>
                    <Image source={shareIcon} />
                  </TouchableOpacity>
                </View>
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
                  <View style={styles.horizontal}>
                    <Text>{product.description.year_built}</Text>
                    <Image source={built} />
                  </View>
                </View>
                <Text style={styles.different_View}>Description</Text>
                <View style={styles.description_View}>
                  <Text
                    style={styles.descriptionTxt}
                    onTextLayout={onTextLayout}>
                    {product.description.text}
                  </Text>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('About', {data: product})
                    }>
                    <Text style={styles.readMore}>...Read More</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          )}
        </View>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modal}
        onRequestClose={() => {
          setModal(false);
        }}>
        <View style={styles.list}>
          <FlatList data={DATA} renderItem={renderItem} numColumns={2} />
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
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
    marginTop: Scale(15),
  },
  text: {
    color: 'white',
    fontSize: Scale(10),
    fontWeight: 'bold',
  },
  textView: {
    position: 'absolute',
    top: 10,
    left: 10,
  },
  typeView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Scale(10),
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
    marginVertical: Scale(5),
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
    marginRight: Scale(2),
  },
  headingTxt: {
    marginTop: Scale(3),
    marginLeft: Scale(3),
    color: '#101010',
  },
  horizontal: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0E0E0',
    paddingVertical: Scale(5),
    paddingHorizontal: Scale(10),
    borderRadius: Scale(10),
  },
  underline: {
    marginBottom: Scale(10),
    width: itemWidth * 0.8,
    textAlign: 'center',
    marginTop: Scale(10),
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
    alignSelf: 'flex-end',
    position: 'absolute',
    bottom: Scale(15),
    right: Scale(20),
    marginStart: Scale(15),
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  addressView: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: Scale(10),
    backgroundColor: light_grey,
    paddingVertical: Scale(8),
    borderRadius: Scale(10),
    paddingHorizontal: Scale(5),
  },
  mortgageTxt: {
    color: '#0000FF',
  },
  descriptionTxt: {
    color: shadowColor,
    fontSize: Scale(12),
  },
  description_View: {
    height: screenHeight * 0.12,
    marginTop: Scale(5),
  },
  list: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Scale(20),
    position: 'absolute',
    bottom: 0,
    backgroundColor: light_grey,
    paddingBottom: Scale(15),
    borderTopEndRadius: Scale(20),
    borderTopLeftRadius: Scale(20),
  },
  readMore: {
    fontSize: Scale(12),
    color: '#0000FF',
  },
});

export default ProductInfo;
