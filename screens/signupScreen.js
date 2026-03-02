import { useState } from "react";
import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
View,
} from "react-native";
import { useDispatch } from "react-redux";

export default function signupScreen() {
  const dispatch = useDispatch();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");



  const handlesubmit = () => {







};


  return (
    <KeyboardAvoidingView>
      <View style={styles.container}>
        <Text style={styles.title}>Inscription</Text>
        <TextInput placeholder="Email" onChangeText={(value)=> setEmail(value)} value={email} style={styles.inputEmail} />
<TextInput placeholder="username" onChangeText={(value) => setUsername(value)} value={username} style={styles.inputUsername}/>
<TextInput placeholder="password" onChangeText={(value) => setPassword(value)} value ={password} style={styles.inputPassword}/>
<TouchableOpacity onPress={(handlesubmit)}>
<Text style={styles.textButton}>S'inscrire</Text>
</TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create ({
container: {
flex: 1,
backgroundColor: "#ffffff",
alignItem: 'center',
justifyContent: 'center',

}




})
















