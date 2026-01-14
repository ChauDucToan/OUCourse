import { View } from "react-native";

import { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { ScrollView } from "react-native";
import ListItem from "../../components/ListItem";
import HeaderCustom from "../../components/Header";
import { MyColorContext } from "../../utils/contexts/MyColorContext";

const InstructorDashboard = () => {
  const navigation = useNavigation();
  const [selectionInstructor, setSelectionInstructor] = useState([]);
  const { theme } = useColors();
  useEffect(() => {
    const data = require("../../mock/data.config.instructor.json");
    setSelectionInstructor(data);
  }, []);
  return (
    <View
      className="pt-10 flex-1"
      style={{
        backgroundColor: theme.colors.gray[100],
      }}
    >
      <HeaderCustom text={"Trang quản lý của Giảng viên"} />
      <ScrollView className="p-5 flex-1">
        <ListItem
          mapJson={selectionInstructor}
          navigation={navigation}
          header="Quản lý"
          theme={theme}
        />
      </ScrollView>
    </View>
  );
};
export default InstructorDashboard;
