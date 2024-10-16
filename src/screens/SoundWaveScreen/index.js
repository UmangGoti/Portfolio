import {useTheme} from '@react-navigation/native';
import {Canvas, RoundedRect} from '@shopify/react-native-skia';
import React, {useEffect, useMemo, useState} from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {normalize, typography} from '../../theme';

const {width: sW, height: sH} = Dimensions.get('screen');
const marginHorizontal = 20;
const paddingHorizontal = 10;
const timerTextWidth = 45;
const spikeCanvasW = sW - 70 - timerTextWidth - marginHorizontal * 2;
const spikeCanvasH = 40;

const r = 3; //Spike border radius
const w = 5; //Spike width
const d = 5; //Distance between two spikes

//min & max value for generating random height spike
const min = 5;
const max = spikeCanvasH;

const time = 80; //in miliseconds

const millisToMinutesAndSeconds = millis => {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return (
    (minutes < 10 ? '0' : '') +
    minutes +
    ':' +
    (seconds < 10 ? '0' : '') +
    seconds
  );
};

const Draw = React.memo(({spikes}) => {
  return <>{spikes.map(item => item)}</>;
});

let spikes = [];

const SoundWaveScreen = () => {
  const [start, setStart] = useState(false);
  const [count, setCount] = useState(0);
  const [timer, setTimer] = useState(0);

  const {colors} = useTheme();
  const styles = createStyle(colors);

  const [amplitudes, setAmplitudes] = useState([]);
  const maxSpikes = useMemo(() => (spikeCanvasW / (w + d)).toFixed(0), []);

  const takeLast = (array, n) => {
    if (n >= array.length) {
      return array.slice();
    } else {
      return array.slice(array.length - n, array.length);
    }
  };

  const addAmplitudes = React.useCallback(
    amp => {
      var norm = Math.min(amp.toFixed(0) / 2, spikeCanvasH);

      setAmplitudes(prev => [...prev, norm]);
      spikes = [];
      const amps = takeLast(amplitudes, maxSpikes); // Use prev instead of prevAmplitudes
      const newSpikes = amps.map((value, i) => {
        const key = `Spikes-${i}`;
        const x = spikeCanvasW - i * (w + d);
        return (
          <RoundedRect
            key={key}
            x={x}
            y={spikeCanvasH / 2 - value / 2}
            width={w}
            height={value}
            r={r}
            color={'white'}
          />
        );
      });
      spikes = [...spikes.slice(-maxSpikes), ...newSpikes];
    },
    [amplitudes, maxSpikes],
  );

  useEffect(() => {
    let interval;
    if (start) {
      interval = setInterval(() => {
        setCount(count + 1);
        setTimer(timer + 75);
        addAmplitudes(Math.floor(Math.random() * (max - min + 1) + min));
      }, time);
    }
    return () => clearInterval(interval);
  }, [start, count, addAmplitudes]);
  //transform: [{rotateY: '180deg'}] for starting left side
  return (
    <View style={styles.container}>
      <View height={normalize(20)} />
      <React.Fragment>
        <View
          style={{
            flexDirection: 'row',
            borderRadius: 50,
            backgroundColor: colors.blue,
            marginHorizontal: marginHorizontal,
            paddingHorizontal: paddingHorizontal,
            alignItems: 'center',
          }}>
          <View
            style={{
              width: 5,
              height: 5,
              backgroundColor: colors.red,
              borderRadius: 50,
              margin: 5,
            }}
          />
          <Text
            style={{
              color: colors.white,
              fontSize: 15,
              width: timerTextWidth,
              ...typography.fontStyles.nunitoBold,
            }}>
            {millisToMinutesAndSeconds(timer)}
          </Text>
          <Canvas
            style={{
              width: spikeCanvasW,
              height: spikeCanvasH,
              marginRight: 8,
              transform: [{rotateY: '180deg'}],
            }}>
            <Draw spikes={spikes} />
          </Canvas>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              setStart(!start);
            }}
            style={{
              width: 30,
              height: 30,
              borderColor: colors.red,
              borderWidth: 3,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 50,
            }}>
            <View
              style={{
                width: '90%',
                height: '90%',
                backgroundColor: colors.red,
                borderRadius: 50,
              }}
            />
          </TouchableOpacity>
        </View>
      </React.Fragment>
    </View>
  );
};

export default SoundWaveScreen;

const createStyle = colors => {
  return StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
    },
  });
};
