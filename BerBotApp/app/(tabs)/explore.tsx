import { useJoystick } from '@/hooks/useJoystickContext';
import { useEffect, useRef, useState } from 'react';
import { PermissionsAndroid, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import RNBluetoothClassic, { BluetoothDevice } from 'react-native-bluetooth-classic';
export default function TabTwoScreen() {
  const [device,setDevice] = useState<BluetoothDevice>();
  const [status,setStatus] = useState<string>("not connected");
  const [statusColor, setStatusColor] = useState<string>("red");
  const [disabled, setDisabled] = useState<boolean>(false);
  const [data,setData] = useState<string>();
  const scrollRef =useRef<ScrollView>(null);
  let sub:any;
  const {position} = useJoystick();
  const reqPermissions =async():Promise<boolean>=>{
    if (Platform.OS!=='android') return true;
    try{
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION
      ]);
      return (
        granted['android.permission.BLUETOOTH_SCAN']===PermissionsAndroid.RESULTS.GRANTED &&
        granted['android.permission.BLUETOOTH_CONNECT']===PermissionsAndroid.RESULTS.GRANTED &&
        granted['android.permission.ACCESS_FINE_LOCATION']===PermissionsAndroid.RESULTS.GRANTED &&
        granted['android.permission.ACCESS_COARSE_LOCATION']===PermissionsAndroid.RESULTS.GRANTED 
      )
    }catch(error){
      console.error(error);
      return false;
    }
  }
  useEffect(()=>{
    const sendJoyData= async()=>{
      const data = `${position.x.toFixed(2)},${position.y.toFixed(2)} \n`;
      try{
        if (device && position.x.toFixed(2)!==null){
          console.log("saljem", data);
          await device.write(data);
        }
      }
      catch(e){
        console.error(e);
      }
    }
    sendJoyData();
  },[position,device])
  useEffect(()=>{
    const initPermissions = async()=>{
      const granted = await reqPermissions();
      if(!granted){
        console.warn("Bluetooth permissons not granted");
      }
    }
    initPermissions();
  },[])

  const connectToDevice = async (device:BluetoothDevice):Promise<boolean>=>{
    try{
      const connected = await device.connect();
      console.log("Connected to: ", device.name);
      sub = device.onDataReceived((data1)=>{
        console.log("mi smo dobili: ",data1.data);
        setData(data1.data);
        scrollRef.current?.scrollToEnd({animated:true})
      })
      return connected;
    } catch (error){
      console.error('Connection failed: ',error);
      return false;
    }
  }
  const disconnect= async()=>{
    device?.disconnect();
    setDisabled(false);
    setStatus("not connected");
    setStatusColor("red");
    console.log("disconnected");
    sub.remove();
  }
  const getPairderDevices = async()=>{
    try{
      const devices:BluetoothDevice[]= await RNBluetoothClassic.getBondedDevices();
      console.log("Paired devices:",devices);
      devices.forEach(device => {
        if(device.name==="HC-05"){
          console.log("Evo ga HC-05: ",device);
          setDevice(device);
          connectToDevice(device);
          setDisabled(true);
          setStatus("connected");
          setStatusColor("green");
        }
        else {
          console.log("nema hc05");
          setDisabled(false);
          setStatus("not connected");
          setStatusColor("red");
        }
      });
    } catch(error){
      console.error("Failed", error);
    }
  }

  return (
    <View style={styles.mainContainer}>
      <Text style={styles.text}>Connect to your BerBot</Text>
      <Text style={styles.statusText}>Status: <Text style={{color:statusColor}}>{status}</Text></Text>

      <TouchableOpacity disabled={disabled} onPress={getPairderDevices} style={[styles.button,{backgroundColor:disabled?"gray":"green"}]}>
        <Text style={styles.buttonText}>Connect</Text>
      </TouchableOpacity>
      <TouchableOpacity disabled={!disabled} onPress={disconnect} style={[styles.button2, {backgroundColor:disabled?"red":"gray"}]}>
        <Text style={styles.buttonText}>Disconnect</Text>
      </TouchableOpacity>
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
  statusText:{
    fontSize:25,
    marginTop:10,
    color:"white"
  },
  text:{
    color:"white",
    textAlign:"center",
    marginTop:100,
    fontSize:36
  },
  button:{
    position:"absolute",
    bottom:80,
    borderRadius:50,
    width:"100%",
    justifyContent:"center",
    zIndex:1
  },
  button2:{
    position:"absolute",
    bottom:30,
    zIndex:0,
    borderRadius:50,
    width:"100%",
    justifyContent:"center"
  },
  buttonText:{
    fontSize:20,
    textAlign:"center"
  },
  scrool:{
    flex:1,
    width:'100%',
    marginTop:50,
    padding:10,
    maxHeight:300,
    borderBlockColor:"red"
  },
  dataText:{
    color:"white",
  }

});

