 import * as ExpoDevice from "expo-device";
import { useMemo, useState } from "react";
import { PermissionsAndroid, Platform } from "react-native";
import { BleManager, Device } from "react-native-ble-plx";

interface BluetoothLowEnergyApi{
    requestPermissions():Promise<boolean>;
    scanforPeripherals():void;
    allDevices:Device[];
}
function useBLE(): BluetoothLowEnergyApi{
    const bleManager = useMemo(()=> new BleManager(),[])
    const [allDevices,setAllDevices]= useState<Device[]>([]);

    const requestAndroid31Permisiions = async ()=>{
        const bluetoothScanPermissions = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,{
                title:"Scan Permission",
                message:"App requires Bluetooth Scanning",
                buttonPositive:"OK",
            }
        );
        const bluetoothConnectPermissions = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,{
                title:"Connection Permission",
                message:"App requires Bluetooth Connecting",
                buttonPositive:"OK",
            }
        );
        const bluetoothFineLocationPermissions = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,{
                title:"Scan Permission",
                message:"App requires fine location",
                buttonPositive:"OK",
            }
        );
        return (
            bluetoothConnectPermissions ==="granted" &&
            bluetoothScanPermissions ==="granted"&&
            bluetoothFineLocationPermissions==="granted"
        );
    };
      const requestPermissions = async () => {
    if (Platform.OS === "android") {
      if ((ExpoDevice.platformApiLevel ?? -1) < 31) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Location Permission",
            message: "Bluetooth Low Energy requires Location",
            buttonPositive: "OK",
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        const isAndroid31PermissionsGranted =
          await requestAndroid31Permisiions();

        return isAndroid31PermissionsGranted;
      }
    } else {
      return true;
    }
  };
    const isDuplicateDevice =(devices:Device[], nextDevice:Device)=>
        devices.findIndex((device)=> nextDevice.id===device.id)>-1;
    const scanforPeripherals = ()=>{
        bleManager.startDeviceScan(null,null,(error,device)=>{
            if (error){
                console.log(error);
            }
            if (device){
                console.log(device);
                console.log("Naziv" + device.name)
            }
            if (device && device.name?.includes("HC-05")){
                console.log(device.name)
                setAllDevices((prevState)=>{
                    if (!isDuplicateDevice(prevState,device)){
                        return [...prevState,device];
                    }
                    return prevState;
                });
            }
        });
    };
    return{
        scanforPeripherals,
        requestPermissions,
        allDevices
    }

}
export default useBLE;