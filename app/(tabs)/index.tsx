import { StatusBar } from "expo-status-bar";
import { Image, StyleSheet, View, Text, Pressable } from "react-native";
import ImageViewer from "../../components/ImageViewer";
import Button from "../../components/Button";
import * as ImagePicker from "expo-image-picker";
import { useState, useRef } from "react";
import IconButton from "../../components/IconButton";
import CircleButton from "../../components/CircleButton";
import EmojiPicker from "../../components/EmojiPicker";
import EmojiList from "../../components/EmojiList";
import EmojiSticker from "../../components/EmojiSticker";
import * as MediaLibrary from "expo-media-library";
import { captureRef } from "react-native-view-shot";

// 4 Add gestures
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { MaterialIcons } from "@expo/vector-icons";

const PlaceholderImage = require("../../assets/images/background-image.png");

export default function HomeScreen() {
  const [selectedImage, setSelectedImage] = useState(null);
  // アプリの画面がロードされたら、falseに設定して、画像を選ぶ前にオプションが表示されないようにします
  // この変数の値は、ユーザーがメディアライブラリから画像を選ぶか、プレースホルダ画像の使用を決定したときにtrueに設定されます。
  const [showAppOptions, setShowAppOptions] = useState(false);

  // モーダルを表示するかどうか
  const [isModalVisible, setIsModalVisible] = useState(false);

  // 選択した絵文字の画像オブジェクト
  const [pickedEmoji, setPickedEmoji] = useState(null);

  // メディアライブラリーにアクセス許可を求める
  const [status, requestPermission] = MediaLibrary.usePermissions();

  const imageRef = useRef();

  if (status === null) {
    requestPermission();
  }

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
    setIsModalVisible(true);
  };

  const onModalClose = () => {
    setIsModalVisible(false);
  };

  const onSaveImageAsync = async () => {
    try {
      // result (string) -- 結果画像の型。 - 'tmpfile' -- (デフォルト) 一時ファイルの uri を返す。
      // - 'base64' -- base64エンコードされた画像。
      // - 'data-uri' -- base64 エンコードされた画像に data-uri 接頭辞をつけたもの。
      // captureRefはスクリーンショットした画像を返す(file:// ~.pngなど)
      const localUri = await captureRef(imageRef, {
        height: 440,
        quality: 1,
      });

      // 画像を保存
      await MediaLibrary.saveToLibraryAsync(localUri);
      if (localUri) {
        alert("Saved!");
      }
    } catch (e) {
      console.log("エラー");
    }
  };

  return (
    <GestureHandlerRootView style={styles.content}>
      <View style={styles.imageContainer}>
        <View ref={imageRef} collapsable={false}>
          <ImageViewer
            placeholderImageSource={PlaceholderImage}
            selectedImage={selectedImage}
          />
          {pickedEmoji && (
            <EmojiSticker imageSize={40} stickerSource={pickedEmoji} />
          )}
        </View>
      </View>
      {showAppOptions ? (
        <View style={styles.optionsContainer}>
          <View style={styles.optionsRow}>
            {/* <IconButton icon="refresh" label="Reset" onPress={onReset} /> */}
            <Pressable onPress={onReset}>
              <MaterialIcons name="refresh" size={24} color="#fff" />
              <Text>Reset</Text>
            </Pressable>
            <CircleButton onPress={onAddSticker} />
            {/*押されたら絵文字のモーダルを表示*/}
            {/* <IconButton
              icon="save-alt"
              label="Save"
              onPress={onSaveImageAsync}
            /> */}
            <Pressable onPress={onSaveImageAsync}>
              <MaterialIcons name="save-alt" size={24} color="#fff" />
              <Text>Save</Text>
            </Pressable>
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

      <EmojiPicker isVisible={isModalVisible} onClose={onModalClose}>
        <EmojiList onSelect={setPickedEmoji} onCloseModal={onModalClose} />
      </EmojiPicker>

      <StatusBar style="light" backgroundColor="#ffcc00" />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  content: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    // backgroundColor: "#25292e",
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
