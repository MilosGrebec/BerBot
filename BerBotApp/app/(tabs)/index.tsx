import { useJoystick } from '@/hooks/useJoystickContext';
import { useRef } from 'react';
import { Animated, PanResponder, StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  const {setPosition} = useJoystick();
  const pan = useRef(new Animated.ValueXY()).current;
   const panResponder = useRef(

    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,

      onPanResponderMove: (_, gesture) => {
        const maxRadius = 50;
        const { dx, dy } = gesture;
        const distance = Math.sqrt(dx * dx + dy * dy);

        let clampedX = dx;
        let clampedY = dy;

        if (distance > maxRadius) {
          const ratio = maxRadius / distance;
          clampedX = dx * ratio;
          clampedY = dy * ratio;
        }
        pan.setValue({ x: clampedX, y: clampedY });
        const normalizedX = clampedX / maxRadius;
        const normalizedY = clampedY / maxRadius;
        setPosition({x:normalizedX,y:normalizedY})
      },

      onPanResponderRelease: () => {
        setPosition({x:0.0,y:0.0});
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false
        }).start();
      }
    })
  ).current;
  return (
    <View style={styles.mainContainer}>
      <Text style={styles.mainT}>BerBot</Text>
      <View style={styles.baseCircle}>
        <Animated.View
         {...panResponder.panHandlers}
         style={[styles.handleCircle,
          {transform:pan.getTranslateTransform()}
         ]}/>
      </View>
      <Text style={styles.bottomText}>Move your <Text style={{color:"red"}}>BerBot</Text> with circle above</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer:{
    backgroundColor:"#1E2022",
    flex:1,
    textAlign:"center",
    alignItems:"center"
  },
  mainT:{
    color:"white",
    fontSize:50,
    fontFamily:"InriaSans-Regular",
    textAlign:"center",
    marginTop:70
  },
  baseCircle: {
    marginTop:250,
    width: 250,
    height: 250,
    backgroundColor: 'black',
    borderRadius: 150,
    justifyContent: 'center',
    alignItems: 'center'
  },
  handleCircle: {
    width: 130,
    height: 130,
    backgroundColor: 'goldenrod',
    borderRadius: 90,
    position: 'absolute'
  },
  bottomText:{
    fontSize:20,
    marginTop:25,
    color:"white",
    fontFamily:"InriaSans-Regular"
  }
});
