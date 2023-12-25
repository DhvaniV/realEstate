import { View, Text } from 'react-native'
import React, { createContext } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack';
import productList from './Screens/productList';
import WebViewScreen from './Screens/WebViewScreen';
import ProductInfo from './Screens/ProductInfo';
import Schools from './Screens/Schools';
import About from './Screens/About';
import ImagesView from './Screens/ImagesView';
import Info from './Screens/Info'
import InfoApp from './Screens/InfoApp';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
      <Stack.Screen name="InfoApp" component={InfoApp} options={{ headerShown: false }} />
        <Stack.Screen name="productList" component={productList}
          options={{ headerShown: false }} />
        <Stack.Screen name="ProductInfo" component={ProductInfo}
          options={{ headerShown: false }} />
        <Stack.Screen name="WebView" component={WebViewScreen} />
        <Stack.Screen name="About" component={About} options={{ headerShown: false }} />
        <Stack.Screen name="ImagesView" component={ImagesView}
          options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App