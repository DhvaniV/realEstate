import {View, Text, StyleSheet, FlatList, Image} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  backgroundColor,
  black,
  blue,
  grey,
  headingTxt,
  primaryColor,
  shadowColor,
  yellow,
} from './Colors';
import {Scale} from '../Components/Scale';
import {locationIcon, startIcon} from './assests';

const Schools = ({route}: any) => {
  const [postData, setPostData] = useState([]);
  useEffect(() => {
    console.log('about data', route.params.data);
    setPostData(route.params.data);
  }, []);

  const gradeRenderItem = ({item}: any) => {
    console.log('first', item);
    return (
      <View style={styles.grade}>
        <Text>{item}</Text>
      </View>
    );
  };

  const renderItem = ({item}: any) => {
    return (
      <View style={styles.mainView}>
        <View style={styles.row}>
          {item.assigned ? (
            <View style={styles.assigned_View}>
              <Text style={styles.assigned_Text}>Assigned</Text>
            </View>
          ) : (
            <></>
          )}
          {item.rating ? (
            <View style={styles.rating_View}>
              <Image source={startIcon} />
              <Text style={styles.rating_text}>{item.rating}</Text>
            </View>
          ) : (
            <></>
          )}
        </View>
        <Text style={styles.schoolNameText}>{item.name}</Text>
        {item.district.name ? (
          <View style={styles.horizontal}>
            <Text style={styles.address}>{item.district.name}</Text>
            <Image source={locationIcon} />
          </View>
        ) : (
          <></>
        )}
        <View style={styles.row}>
          <Text style={[styles.address, {color: headingTxt}]}>
            {item.funding_type === 'public' ? (
              <Text>PUBLIC</Text>
            ) : (
              <Text>PRIVATE</Text>
            )}
          </Text>
          <Text style={styles.miles}>{item.distance_in_miles} miles</Text>
        </View>
        <View style={styles.grade_View}>
          <Text style={styles.gradeTxt}>Grades</Text>
          <FlatList
            data={item.grades}
            renderItem={gradeRenderItem}
            horizontal
          />
        </View>
        <View style={styles.row1}>
          <View style={styles.student_View}>
            <Text style={styles.studen_txt}>
              Total Students:{item.student_count}
            </Text>
          </View>
        </View>
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <FlatList data={postData} renderItem={renderItem} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: backgroundColor,
  },
  mainView: {
    margin: Scale(10),
    borderRadius: Scale(20),
    backgroundColor: primaryColor,
    padding: Scale(10),
  },
  address: {
    fontFamily: 'sans-serif',
    fontWeight: '700',
    fontSize: Scale(12),
    marginBottom: Scale(10),
    textAlign: 'center',
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  schoolNameText: {
    fontFamily: 'sans-serif',
    fontWeight: '700',
    fontSize: Scale(20),
    color: yellow,
    textAlign: 'center',
    marginBottom: Scale(10),
  },
  assigned_View: {
    backgroundColor: blue,
    padding: Scale(5),
    width: '18%',
    borderRadius: Scale(20),
    marginBottom: Scale(5),
  },
  assigned_Text: {
    fontFamily: 'sans-serif',
    fontSize: Scale(10),
    fontWeight: '500',
    color: shadowColor,
    textAlign: 'center',
  },
  rating_text: {
    color: primaryColor,
    marginLeft: Scale(2),
  },
  rating_View: {
    flexDirection: 'row',
    backgroundColor: blue,
    borderRadius: Scale(20),
    alignItems: 'center',
    paddingHorizontal: Scale(8),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  miles: {
    textAlign: 'right',
  },
  studen_txt: {
    color: grey,
    fontWeight: '600',
    fontSize: Scale(15),
  },
  student_View: {
    backgroundColor: yellow,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Scale(5),
    borderRadius: Scale(20),
    width: '50%',
  },
  row1: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  grade_View: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Scale(10),
  },
  grade: {
    borderRadius: Scale(20),
    paddingHorizontal: Scale(5),
    backgroundColor: grey,
    paddingVertical: Scale(2),
    marginRight: Scale(3),
  },
  gradeTxt: {
    marginBottom: Scale(2),
  },
});

export default Schools;
