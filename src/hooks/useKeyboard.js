import {useEffect, useRef, useState} from 'react';
import {Keyboard, Platform} from 'react-native';

const useKeyboard = () => {
  // State to track whether the keyboard is open or not
  const [isOpen, setIsOpen] = useState(false);

  // State to store the keyboard height when it appears
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  // Refs to store the listeners for showing and hiding the keyboard
  const keyboardHideListener = useRef(null);
  const keyboardShowListener = useRef(null);

  // Callback to handle when the keyboard is shown
  const onKeyboardShow = e => {
    // Set the height of the keyboard from the event's endCoordinates
    setKeyboardHeight(e.endCoordinates.height);
    // Update the state to indicate that the keyboard is open
    setIsOpen(true);
  };

  // Callback to handle when the keyboard is hidden
  const onKeyboardHide = () => {
    // Reset the keyboard height to 0 when hidden
    setKeyboardHeight(0);
    // Update the state to indicate that the keyboard is closed
    setIsOpen(false);
  };

  useEffect(() => {
    // Add listeners for keyboard show and hide events
    keyboardShowListener.current = Keyboard.addListener(
      'keyboardDidShow',
      onKeyboardShow,
    );
    keyboardHideListener.current = Keyboard.addListener(
      'keyboardDidHide',
      onKeyboardHide,
    );

    // Cleanup the listeners when the component is unmounted or updated
    return () => {
      keyboardShowListener.current?.remove();
      keyboardHideListener.current?.remove();
    };
  }, []);

  // Return the state of whether the keyboard is open, its height, and the platform (iOS or Android)
  return {
    isOpen: isOpen,
    keyboardHeight: keyboardHeight,
    keyboardPlatform: Platform.OS,
  };
};

export default useKeyboard;
