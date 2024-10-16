'use strict';

import {Dimensions, Platform} from 'react-native';
import DeviceInfo, {platformApiLevel} from 'expo-device';
import AppInfo from 'expo-application';

export default class Device {
  static getDeviceWidth() {
    return Dimensions.get('window').width;
  }

  static getDeviceHeight() {
    return Dimensions.get('window').height;
  }

  static isIos() {
    return Platform.OS === 'ios';
  }

  static isAndroid() {
    return Platform.OS === 'android';
  }

  static isLandscape() {
    return this.getDeviceWidth() > this.getDeviceHeight();
  }

  static getDeviceType() {
    return DeviceInfo.getDeviceTypeAsync();
  }

  static getDeviceAPILevel() {
    const apiLevel = platformApiLevel();
    return apiLevel;
  }

  static getAppId() {
    return AppInfo.applicationId();
  }

  static getAppVersion() {
    return AppInfo.nativeApplicationVersion();
  }

  static getBuildNumber() {
    return AppInfo.nativeBuildVersion();
  }

  static getVersionWithBuildNumber() {
    return Device.getAppVersion() + '.' + Device.getBuildNumber();
  }
}
