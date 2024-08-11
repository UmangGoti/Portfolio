import { Text } from "react-native";
import { strings } from "./i18";
import { NetworkConnectionPrompt } from "./src/components";
import RootNavigator from "./src/navigation/RootNavigator";

const App = () => {
  return (
    <>
      {/* <Text>{strings('MyProfile.name')}</Text> */}
      <RootNavigator />
      <NetworkConnectionPrompt />
    </>
  );
};

export default App;
