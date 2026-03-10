import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";

export default function ButtonCapture(props) {
  return (
    <SafeAreaView>
      <View>
        <TouchableOpacity
          style={[props.style, !props.disabled || { opacity: 0.4 }]}
          activeOpacity={0.8}
          onPress={props.onPress}
          disabled={props.disabled}
        >
          <Text style={props.textStyle}>CAPTURER</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
