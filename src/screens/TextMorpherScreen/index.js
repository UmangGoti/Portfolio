import {useTheme} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {fontPixel, typography} from '../../theme';

// Function to generate a random character from a defined set
const getRandomChar = () => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:,.<>?/~`'-= "; // Set of possible characters
  return chars.charAt(Math.floor(Math.random() * chars.length)); // Randomly select one character from the set
};

// TextMorpher component to gradually morph a string from random characters into the target string
const TextMorpher = ({targetString}) => {
  // useState hook to manage the displayed text, initially set to underscores of target string's length
  const [displayedText, setDisplayedText] = useState(
    '_'.repeat(targetString.length),
  );

  const {colors} = useTheme();
  const styles = createStyle(colors);

  useEffect(() => {
    let currentText = displayedText.split(''); // Convert the displayed text to an array of characters

    let intervalId = setInterval(() => {
      let allMatched = true; // Flag to check if all characters have morphed into the target string

      // Loop through each character to see if it matches the target string
      for (let i = 0; i < currentText?.length; i++) {
        if (currentText[i] !== targetString[i]) {
          allMatched = false; // If a character doesn't match, flag it
          currentText[i] = getRandomChar(); // Replace it with a random character
        }
      }

      setDisplayedText(currentText.join('')); // Update the displayed text with the new character array

      // Stop the interval if all characters have matched the target string
      if (allMatched) {
        clearInterval(intervalId);
      }
    }, 20); // Adjust interval timing to control the speed of morphing

    return () => clearInterval(intervalId); // Clean up the interval on component unmount
  }, []);

  return <Text style={styles.morpherText}>{displayedText}</Text>; // Render the morphed text with the appropriate styling
};

// Main screen component that utilizes the TextMorpher component
const TextMorpherScreen = () => {
  const {colors} = useTheme();
  const styles = createStyle(colors);
  return (
    <View style={styles.container}>
      <TextMorpher targetString={'Umang M. Goti'} />
      <TextMorpher targetString={`I'm Mobile app developer.`} />
    </View>
  );
};

const createStyle = colors => {
  return StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.backgroundColor,
    },
    morpherText: {
      ...typography.fontStyles.nunitoBold,
      fontSize: fontPixel(30),
      color: colors.text,
    },
  });
};

export default TextMorpherScreen;
