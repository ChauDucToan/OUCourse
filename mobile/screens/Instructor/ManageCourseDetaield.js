import React, { useEffect, useState } from "react";
import { View, Dimensions } from "react-native";
import { useRoute } from "@react-navigation/native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import HeaderCustom from "../../components/Header";
import TextCustom from "../../components/TextCustom";
import axiosClient from "../../api/axiosClient";
import { endpoints } from "../../utils/Apis";
import { formatCurrency } from "../../utils/formatCurrency";

const StudentsTab = ({ theme }) => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await axiosClient.get(endpoints.user_view);
        setStudents(res?.data?.results ?? []);
      } catch (error) {
        console.error(error);
      }
    };
    loadData();
  }, []);

  return (
    <View
      style={{ flex: 1, backgroundColor: theme.colors.gray[100], padding: 10 }}
    >
      {students.length === 0 ? (
        <TextCustom.TextMuted
          text="Chưa có học sinh"
          style={{ color: theme.colors.slate[800] }}
        />
      ) : (
        students.map((s) => (
          <View
            key={s.id}
            style={{
              padding: 10,
              marginBottom: 8,
              backgroundColor: theme.colors.slate[200],
              borderRadius: 8,
            }}
          >
            <TextCustom.TextFocus
              text={s.username}
              style={{ color: theme.colors.slate[600] }}
            />
          </View>
        ))
      )}
    </View>
  );
};

const LessonsTab = ({ courseId, theme }) => {
  const [lessons, setLessons] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await axiosClient.get(endpoints.lessons(courseId));
        setLessons(res?.data?.results ?? []);
      } catch (error) {
        console.error(error);
      }
    };
    loadData();
  }, [courseId]);

  return (
    <View
      style={{ flex: 1, backgroundColor: theme.colors.gray[100], padding: 10 }}
    >
      {lessons.length === 0 ? (
        <TextCustom.TextMuted
          text="Chưa có bài học"
          style={{ color: theme.colors.slate[800] }}
        />
      ) : (
        lessons.map((l) => (
          <View
            key={l.id}
            style={{
              padding: 10,
              marginBottom: 8,
              backgroundColor: theme.colors.slate[200],
              borderRadius: 8,
            }}
          >
            <TextCustom.TextFocus
              text={l.subject}
              style={{ color: theme.colors.slate[600] }}
            />
          </View>
        ))
      )}
    </View>
  );
};

const ManageCourseDetailed = () => {
  const route = useRoute();
  const { course, theme } = route.params;

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "students", title: "Sinh viên" },
    { key: "lessons", title: "Bài học" },
  ]);

  const renderScene = SceneMap({
    students: () => <StudentsTab theme={theme} />,
    lessons: () => <LessonsTab courseId={course.id} theme={theme} />,
  });

  return (
    <View
      className="pt-10"
      style={{ flex: 1, backgroundColor: theme.colors.gray[100] }}
    >
      <HeaderCustom />
      <View style={{ padding: 16 }}>
        <TextCustom.TextSection
          text={course.subject}
          style={{ fontSize: 20, color: theme.colors.slate[600] }}
        />
        <TextCustom.TextMuted
          text={`Học phí: ${course.price > 0 ? formatCurrency(course.price) : "Miễn phí"}`}
          style={{ color: theme.colors.slate[500], marginTop: 4 }}
        />
      </View>

      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: Dimensions.get("window").width }}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: "#2563eb" }}
            activeColor={theme.colors.slate[800]}
            inactiveColor={theme.colors.slate[500]}
            labelStyle={{ color: theme.colors.slate[700], fontWeight: "bold" }}
          />
        )}
      />
    </View>
  );
};

export default ManageCourseDetailed;
