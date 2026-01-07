import { View } from "react-native";
import HeaderCustom from "../Header";
import ListItem from "../ListItem";
import { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { ScrollView } from "react-native";

const InstructorDashboard = () => {
  const [selectionInstructor, setSelectionInstructor] = useState([]);
  const nav = useNavigation();
  useEffect(() => {
    const data = require("../../mock/data.config.instructor.json");
    setSelectionInstructor(data);
  }, []);
  return (
    <View className="pt-10 bg-white">
      <HeaderCustom text={"Trang quản lý của Giảng viên"} />
      <ScrollView className="p-5">
        <ListItem
          mapJson={selectionInstructor}
          navigation={nav}
          header="Quản lý"
        />
      </ScrollView>
    </View>
  );
};
export default InstructorDashboard;
