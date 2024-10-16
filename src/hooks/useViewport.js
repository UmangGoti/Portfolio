import {useState} from 'react';
import {Dimensions} from 'react-native';

/**
 * Custom hook to track the visibility of elements within a viewport.
 * @param {Array} dataRefs - Array of references to elements to be tracked.
 * @param {number} threshold - The percentage of visibility required to consider an element as visible (0 to 1).
 * @returns {Object} - Object containing the index of the currently visible element and the handleScroll function.
 */
const useViewport = (dataRefs, threshold = 1) => {
  // State to keep track of the index of the currently visible element
  const [visibleIndex, setVisibleIndex] = useState(null);

  // Get the height of the device screen
  const screenHeight = Dimensions.get('window').height;

  /**
   * Function to check if an element meets the visibility threshold within the viewport.
   * @param {number} y - The y-coordinate of the element.
   * @param {number} height - The height of the element.
   * @param {number} index - The index of the element in the list.
   */
  const checkVisibility = (y, height, index) => {
    // Define the top and bottom boundaries of the viewport
    const viewportTop = 0;
    const viewportBottom = screenHeight;

    // Calculate the top and bottom coordinates of the element
    const elementTop = y;
    const elementBottom = y + height;

    // Calculate the visible height of the element
    const elementVisibleHeight =
      Math.min(elementBottom, viewportBottom) -
      Math.max(elementTop, viewportTop);
    const elementHeight = height;
    const visibilityRatio = elementVisibleHeight / elementHeight;

    // Check if the visible height of the element meets the threshold
    const isVisible = visibilityRatio >= threshold;

    // If the element meets the threshold, update the visible index state
    if (isVisible) {
      setVisibleIndex(index);
    }
  };

  /**
   * Function to handle the scroll event and check visibility of elements.
   * Iterates through all element references and measures their positions.
   */
  const handleScroll = () => {
    dataRefs.forEach((ref, index) => {
      if (ref && ref.current) {
        ref.current.measure((x, y, width, height, pageX, pageY) => {
          checkVisibility(pageY, height, index);
        });
      }
    });
  };

  return {visibleIndex, handleScroll};
};

export default useViewport;
