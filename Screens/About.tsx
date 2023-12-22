import { View, Image } from 'react-native'
import React, { useEffect } from 'react'
import { StyleSheet } from 'react-native';
import { backgroundColor } from './Colors';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Info from './Info';
import Schools from './Schools';
import { infoIcon, schoolIcon } from './assests';
const Tab = createBottomTabNavigator();


const About = ({route}: any) => {
  return (
    <View style = {styles.container}>
       <Tab.Navigator>
       <Tab.Screen name="Schools" component={Schools}  
         options={{
          tabBarIcon: ({ color, size }) => (
           <Image source={schoolIcon}/>
          ),
        }}
        initialParams={{ data: route.params.data.nearby_schools.schools }}
         />
        <Tab.Screen name="Info" component={Info}  
         options={{
          tabBarIcon: ({ color, size }) => (
           <Image source={infoIcon}/>
          ),
        }}
        initialParams={{ data: route.params.data.description.text }}
        />
      </Tab.Navigator>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: backgroundColor
    },
  });
export default About