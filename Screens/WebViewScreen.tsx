import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import WebView from 'react-native-webview';

const WebViewScreen = ({route}: any) => {
  const {url} = route.params;
  return (
    <View style={styles.container}>
      <WebView source={{uri: url}} style={styles.webview} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
});

export default WebViewScreen;
