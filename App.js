import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import { Clipboard, Dimentions, StyleSheet, TextInput, Text, View, Button } from 'react-native';
import {Constants, BarCodeScanner} from "expo-barcode-scanner";
import * as ScreenOrientation from 'expo-screen-orientation';

export default function App() {
  const [cameraPermission, setCameraPermission] = useState("unknown");
  const [text, setText] = useState("not yet scanned");
  const [camera, setCamera] = useState("front");

  const [code, setCode] = useState({type:'', data:''});
  
  const askForCameraPermission = () => {
    askForCameraPermissionAsync();
  }

  const askForCameraPermissionAsync = async() => {
    console.log("requesting");
    let rc = await BarCodeScanner.requestPermissionsAsync()
    setCameraPermission(rc.status)
  }

  useEffect((x)=>{
    askForCameraPermission();
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
  });

  const barcodeScanned = ({ type, data }) => {
    console.log("barcode scaned");
    console.log("type=", type);
    console.log("data=", data);
    setCode({type, data});
  }

  if (cameraPermission == "unknown" || cameraPermission == "denied"){
    return (
      <View style={styles.container}>
        <Text>{cameraPermission}</Text>
        <Button title="Allow Camera" onPress={askForCameraPermission} />
      </View>
    );
  
  }

  return (
    <View style={styles.container}>
      <View style={styles.barcodebox}>
          <BarCodeScanner type={camera} style={{width:400, height:300}} onBarCodeScanned={barcodeScanned} />
      </View>

      <View style={{ flexDirection: 'row' }}>
        <View style={{ padding: 10 }}>
          <Button title={camera} onPress={()=>{
            if (camera == "front") setCamera("back");
            else setCamera("front");
          }} />
        </View>
        <View style={{ padding: 10 }}>
          <Button title={"Reset"} onPress={()=>{
              setCode({type:"", data:""});
          }} />
        </View>
        <View style={{ padding: 10 }}>
          <Button title={"Copy"} onPress={()=>{
              Clipboard.setString(code.data)
          }} />
        </View>
      </View>

      <TextInput 
        multiline={true}
        editable={false}
        numberOfLines={20}
        style={{
          backgroundColor: 'lightblue',
          width: 400
        }}
        value={code.data}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  barcodebox: {
    backgroundColor: 'tomato',
    alignItems: 'center',
    justifyContent: 'center',
    width: 400,
    height: 300,
    overflow: 'hidden',
    borderRadius: 30
  },
  maintext: {
    fontSize: 20,
    margin: 20
  }
});
