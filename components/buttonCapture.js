import {
  SafeAreaView,
  
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ButtonCapture(props) {
  return (
    <SafeAreaView>
      <View>
        <TouchableOpacity
          style={props.style}
          activeOpacity={0.8}
          onPress={props.onPress}>
          <Text style={props.textStyle}>CAPTURER</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}


