import { ScrollView } from "react-native";
import HeaderCustom from "../../components/Header";
import { View } from "react-native";
import { useEffect } from "react";
import { useState } from "react";
import axiosClient from "../../api/axiosClient";
import { endpoints } from "../../utils/Apis";

const UserLearning = () => {
  const [corse, setCourse] = useState(null);
  useEffect(() => {
    const loadData = async () => {
      const res = axiosClient.get(endpoints.courses);
    };
  });
  return (
    <View className="bg-slate-50 pt-10 flex-1">
      <HeaderCustom text="Danh sách bài học của tôi" />
      <View className="bg-white"></View>
    </View>
  );
};

export default UserLearning;
