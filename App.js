import { NetworkConnectionPrompt } from "./src/components";
import RootNavigator from "./src/navigation/RootNavigator";

const App = () => {
  return (
    <>
      <RootNavigator />
      <NetworkConnectionPrompt />
    </>
  );
};

export default App;
