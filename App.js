import * as Font from 'expo-font';
import {useEffect} from 'react';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {NetworkConnectionPrompt} from './src/components';
import RootNavigator from './src/navigation/RootNavigator';
import store, {persistor} from './src/redux/store/store';

const App = () => {
  useEffect(() => {
    const loadFonts = async () => {
      try {
        await Font.loadAsync({
          'Nunito-Black.ttf': require('./src/assets/fonts/Nunito-Black.ttf'),
          'Nunito-Bold.ttf': require('./src/assets/fonts/Nunito-Bold.ttf'),
          'Nunito-ExtraBold.ttf': require('./src/assets/fonts/Nunito-ExtraBold.ttf'),
          'Nunito-ExtraLight.ttf': require('./src/assets/fonts/Nunito-ExtraLight.ttf'),
          'Nunito-Light.ttf': require('./src/assets/fonts/Nunito-Light.ttf'),
          'Nunito-Medium.ttf': require('./src/assets/fonts/Nunito-Medium.ttf'),
          'Nunito-Regular.ttf': require('./src/assets/fonts/Nunito-Regular.ttf'),
          'Nunito-SemiBold.ttf': require('./src/assets/fonts/Nunito-SemiBold.ttf'),
          'SpaceMono-Regular.ttf': require('./src/assets/fonts/SpaceMono-Regular.ttf'),
          // Add more fonts here
        });
      } catch (error) {
        console.error('Error loading fonts', error);
      }
    };

    loadFonts();
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RootNavigator />
        <NetworkConnectionPrompt />
      </PersistGate>
    </Provider>
  );
};

export default App;
