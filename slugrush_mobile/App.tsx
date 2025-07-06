import React from 'react';
import { WebView } from 'react-native-webview';
import { View, ActivityIndicator, Platform, StatusBar } from 'react-native';

export default function App() {
  return (
    <View style={{ flex: 1, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }}>
      <WebView
        source={{ uri: 'http://10.0.0.168:3000' }}
        startInLoadingState
        renderLoading={() => <ActivityIndicator size="large" style={{ flex: 1 }} />}
      />
    </View>
  );
}
