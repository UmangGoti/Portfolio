import "react-native-gesture-handler";
import "react-native-get-random-values";
import "./polyfills.js";
import { registerRootComponent } from "expo";
import App from "./App";
import { install } from "react-native-quick-crypto";

install();
registerRootComponent(App);
