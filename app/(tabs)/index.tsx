import { StatusBar } from "expo-status-bar";
import {
  Image,
  StyleSheet,
  Platform,
  View,
  Text,
  ViewBase,
} from "react-native";
import ImageViewer from "./componets/ImageViewer";
import Button from "./componets/Button";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import IconButton from "./componets/IconButton";
import CircleButton from "./componets/CircleButton";

const PlaceholderImage = require("../../assets/images/background-image.png");

export default function HomeScreen() {
  const [selectedImage, setSelectedImage] = useState(null);
  // アプリの画面がロードされたら、falseに設定して、画像を選ぶ前にオプションが表示されないようにします
  // この変数の値は、ユーザーがメディアライブラリから画像を選ぶか、プレースホルダ画像の使用を決定したときにtrueに設定されます。
  const [showAppOptions, setShowAppOptions] = useState(false);

  const pickImageAsync = async () => {
    // launchImageLibraryAsync() メソッドは、選択された画像に関する情報を含むオブジェクトを返します
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true, // iosとandroidでは画像の切り取りを可能にするwebでは不可能
      quality: 1,
    });
    if (!result.canceled) {
      console.log(result);
      setSelectedImage(result.assets[0].uri);
      setShowAppOptions(true);
    } else {
      alert("You did not select any image.");
    }
  };

  const onReset = () => {
    setShowAppOptions(false);
  };

  const onAddSticker = () => {
    //
  };

  const onSaveImageAsync = async () => {
    //
  };

  return (
    <View style={styles.content}>
      {/* <Text style={{ color: "#fff" }}>Good</Text> */}
      {/* <Image source={PlaceholderImage} style={styles.image} /> */}
      <View style={styles.imageContainer}>
        <ImageViewer
          placeholderImageSource={PlaceholderImage}
          selectedImage={selectedImage}
        />
      </View>
      {showAppOptions ? (
        <View style={styles.optionsContainer}>
          <View style={styles.optionsRow}>
            <IconButton icon="refresh" label="Reset" onPress={onReset} />
            <CircleButton onPress={onAddSticker} />
            <IconButton
              icon="save-alt"
              label="Save"
              onPress={onSaveImageAsync}
            />
          </View>
        </View>
      ) : (
        <View style={styles.footerContainer}>
          <Button
            label="Choose a photo"
            theme="primary"
            onPress={pickImageAsync}
          />
          <Button
            label="Use this photo"
            onPress={() => setShowAppOptions(true)}
            theme=""
          />
        </View>
      )}

      <StatusBar style="light" backgroundColor="#ffcc00" />
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#25292e",
    flex: 1,
  },
  imageContainer: {
    flex: 1,
    paddingTop: 58,
  },
  image: {
    width: 320,
    height: 440,
    borderRadius: 18,
  },
  footerContainer: {
    flex: 1 / 3,
    alignItems: "center",
  },
  optionsContainer: {
    position: "absolute",
    bottom: 80,
  },
  optionsRow: {
    alignItems: "center",
    flexDirection: "row",
  },
});
