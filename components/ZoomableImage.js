import { Modal, View, Image, TouchableOpacity } from "react-native";
import { useState } from "react";

export default function ZoomableImage(props) {
  const [zoomVisible, setZoomVisible] = useState(false);

  return (
    <View>
      {/* Image de l'astre */}
      <TouchableOpacity onPress={() => setZoomVisible(true)}>
        <Image source={{ uri: props.imageUrl }} style={props.style} />
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
          <Image
            source={{ uri: props.imageUrl }}
            style={{ width: 390, height: 390 }}
          />
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
