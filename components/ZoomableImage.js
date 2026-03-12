import { Modal, View, Image, TouchableOpacity } from "react-native";
import { useState } from "react";
const defaultImage = require("../assets/agdknaloihgtfgop5zbc.jpg");
export default function ZoomableImage(props) {
  const [zoomVisible, setZoomVisible] = useState(false);
  const [hasError, setHasError] = useState(false);

  const imageSource =
    hasError || !props.imageUrl ? defaultImage : { uri: props.imageUrl };

  return (
    <View>
      <TouchableOpacity onPress={() => setZoomVisible(true)}>
        <Image
          source={imageSource}
          style={props.style}
          onError={() => setHasError(true)}
        />
      </TouchableOpacity>
      <Modal visible={zoomVisible} animationType="fade" transparent>
        <TouchableOpacity
          onPress={() => setZoomVisible(false)}
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.85)",
          }}
        >
          <Image source={imageSource} style={{ width: 390, height: 390 }} />
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
