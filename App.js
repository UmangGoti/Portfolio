import { setLocale, strings } from "./i18";

const { Text } = require("react-native");

const App = () => {
  return (
    <>
      <Text>{strings('MyProfile.name')}</Text>
    </>
  );
};

export default App;
