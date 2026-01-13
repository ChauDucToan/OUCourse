import { View } from "react-native";
import HeaderCustom from "../../components/Header";
import { useRoute } from "@react-navigation/native";
import TextCustom from "../../components/TextCustom";
import { formatCurrency } from "../../utils/formatCurrency";
import { useEffect } from "react";
import axiosClient from "../../api/axiosClient";
import { endpoints } from "../../utils/Apis";
import { useState } from "react";

const MangeCourseDetailed = () => {
  const route = useRoute();
  const { course, theme } = route.params;
  const [students, setStudents] = useState({});
  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await axiosClient.get(endpoints.user_view);
        setStudents(res);
      } catch (error) {
        console.log("Day");
        console.error(error);
      }
    };

    loadData();
    console.log(students);
  }, []);
  return (
    <View className="pt-10" style={{ backgroundColor: theme.colors.gray[100] }}>
      <HeaderCustom />
      <View style={{ backgroundColor: theme.colors.slate[100] }}>
        <View className="p-4">
          <TextCustom.TextSection
            className="text-2xl "
            style={{ color: theme.colors.slate[500] }}
            text={course.subject}
          />
        </View>
        <View className="flex-row justify-end gap-4 p-2">
          <View
            className="p-4 rounded-xl border"
            style={{
              backgroundColor: theme.colors.slate[300],
              borderColor: theme.colors.gray[400],
            }}
          >
            <TextCustom.TextNoFocus
              className="text-base"
              style={{
                color:
                  course.price > 0
                    ? theme.colors.slate[500]
                    : theme.colors.green[500],
              }}
              text={`Học phí: ${course.price > 0 ? formatCurrency(course.price) : "Miễn phí"}`}
            />
          </View>
          <View
            className="p-4 rounded-xl border"
            style={{
              backgroundColor: theme.colors.slate[300],
              borderColor: theme.colors.gray[400],
            }}
          >
            <TextCustom.TextMuted
              className="text-base "
              style={{ color: theme.colors.slate[500] }}
              text={`Số lượng học sinh: ${students}`}
            />
          </View>
        </View>
        <View
          className="p-2"
          style={{ backgroundColor: theme.colors.slate[200] }}
        >
          <TextCustom.TextSection
            className="text-xl"
            style={{ color: theme.colors.slate[500] }}
            text={"Danh sách các học sinh đang tham gia"}
          />
        </View>
        <View></View>
      </View>
    </View>
  );
};
export default MangeCourseDetailed;
