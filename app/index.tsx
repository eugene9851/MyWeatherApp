import { View } from "react-native";

export default function Index() {
  return (
    <View style={{ flex: 1 }}>
      <View style={{ backgroundColor: "red", flex: 1 }}></View>
      <View style={{ backgroundColor: "blue", flex: 1 }}></View>
      <View style={{ backgroundColor: "green", flex: 1 }}></View>
    </View>
  );
}
