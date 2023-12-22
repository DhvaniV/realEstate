import { View, Text, StyleSheet, Dimensions, Image, SafeAreaView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { FlatList } from 'react-native-gesture-handler'
import { backgroundColor, text } from './Colors'
import { Scale } from '../Components/Scale'
import CustomHeader from '../Components/CustomHeader'

const screenWidth = Dimensions.get("window").width
const ImagesView = ({route}: any) => {
    const [photos, setPhotos] = useState([])
    useEffect(() => {
        console.log("route.params.images", route.params.photos)
        setPhotos(route.params.photos)
    }, []);

    const renderItem = ({item}: any) => {
        return(
            <View style = {styles.image_View}>

                <Image source = {{uri: item}}
                style = {styles.image}
                />
            </View>
        )
    }
  return (
    <SafeAreaView style= {styles.container}>
        <CustomHeader title={'Images'}/>
        {
            photos.length === 0 ?
            <Text style = {styles.sorry}>Sorry!! No Photos are avalaible</Text>:

      <FlatList
      data={photos}
      renderItem={renderItem}/>
        }
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: backgroundColor,
      justifyContent: 'center'
    },
    image: {
        height: Scale(180),
        width: screenWidth * 0.9,
        borderRadius: Scale(20),
        position: 'relative'
    },
    image_View: {
        margin: Scale(20)
    },
    sorry: {
        fontFamily: 'sans-serif',
        fontWeight: '600',
        fontSize: Scale(15),
        color: text,
        textAlign: 'center',
    }
  });

export default ImagesView