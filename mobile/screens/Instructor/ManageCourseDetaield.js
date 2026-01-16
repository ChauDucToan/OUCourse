import React, { useEffect, useState } from "react";
import { View, Dimensions } from "react-native";
import { useRoute } from "@react-navigation/native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import HeaderCustom from "../../components/Header";
import TextCustom from "../../components/TextCustom";
import axiosClient from "../../api/axiosClient";
import { endpoints } from "../../utils/Apis";
import { formatCurrency, roundFloat } from "../../utils/formatNumber";
import { errorConsole } from "../../utils/errorUtils";
import { ActivityIndicator } from "react-native-paper";
import { relativeTimeRounding } from "moment/moment";

const CardStudent = ({ studentName, studentEmail, theme }) => {
  return (
    <View
      style={{
        backgroundColor: theme.colors.slate[200],
        borderColor: theme.colors.gray[500],
      }}
    >
      <TextCustom.TextFocus
        text={studentName}
        style={{ color: theme.colors.slate[400] }}
      />
      <TextCustom.TextMuted text={studentEmail} />
    </View>
  );
};
const StudentsTab = ({ theme, totalStudent, chartData }) => {
  return (
    <View
      style={{ flex: 1, backgroundColor: theme.colors.gray[100], padding: 10 }}
    >
      {totalStudent === 0 ? (
        <TextCustom.TextMuted
          text="Chưa có học sinh"
          style={{ color: theme.colors.slate[300] }}
        />
      ) : (
        <View>
          <TextCustom.TextMuted
            text={`Khóa học này có ${totalStudent} học sinh`}
            style={{ color: theme.colors.slate[800] }}
          />
          {chartData?.map((student) => {
            return (
              <CardStudent
                studentName={student.username}
                studentEmail={student.email}
                theme={theme}
              />
            );
          })}
        </View>
      )}
    </View>
  );
};

const LessonsTab = ({ courseId, theme, revuneDetailed, totalStudent = 0 }) => {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const res = await axiosClient.get(endpoints["lessons"](courseId));
        setLessons(res?.data?.results ?? []);
        setLoading(false);
      } catch (error) {
        errorConsole(error, "ManageCourseDetaield:lessonTab");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [courseId]);

  return (
    <View
      style={{ flex: 1, backgroundColor: theme.colors.gray[100], padding: 10 }}
    >
      {loading ? (
        <ActivityIndicator />
      ) : lessons.length === 0 ? (
        <TextCustom.TextMuted
          text="Chưa có bài học"
          style={{ color: theme.colors.slate[800] }}
        />
      ) : (
        lessons.map((l) => (
          <View
            key={l.id}
            className="p-3 mb-2 rounded-xl flex-row justify-between"
            style={{
              backgroundColor: theme.colors.slate[200],
            }}
          >
            <TextCustom.TextFocus
              text={l.subject}
              style={{ color: theme.colors.slate[600] }}
            />
            {revuneDetailed?.subject.map((eachLesson) => {
              if (eachLesson.subject === l.subject && totalStudent !== 0) {
                let progress = roundFloat(
                  eachLesson.completed_count / totalStudent,
                );
                return (
                  <TextCustom.TextFocus
                    style={{ color: theme.colors.slate[600] }}
                  >
                    {`${progress} %`}
                  </TextCustom.TextFocus>
                );
              }
              return (
                <TextCustom.TextFocus
                  style={{ color: theme.colors.slate[600] }}
                >
                  0%
                </TextCustom.TextFocus>
              );
            })}
            <TextCustom.TextFocus style={{ color: theme.colors.slate[600] }} />
          </View>
        ))
      )}
    </View>
  );
};

const ManageCourseDetailed = () => {
  const route = useRoute();
  const { course, theme } = route.params;
  const [loading, setLoading] = useState(false);
  const [index, setIndex] = useState(0);

  const [courseStats, setCourseStats] = useState({});
  const [revenue, setRevenue] = useState({});

  const [routes] = useState([
    { key: "students", title: "Sinh viên" },
    { key: "lessons", title: "Bài học" },
  ]);
  useEffect(() => {
    setLoading(true);
    const loadData = async () => {
      try {
        const res = await axiosClient.get(endpoints["courseStats"](course.id));
        if (res.status === 200) {
          setCourseStats(res.data);
          console.log(res.data);
        }
      } catch (error) {
        errorConsole(error, "MangeCourseDetailed:getCourseStats");
      }
    };
    loadData();
  }, [course]);
  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await axiosClient.get(endpoints["user_view"], {
          params: {
            course_id: course.id,
          },
        });
        if (res.status === 200) {
          setRevenue(res.data);
          console.log(res.data);
        }
      } catch (error) {
        errorConsole(error, "ManageCourseDetailed:getRevenue");
      }
    };
    loadData();
  }, []);
  const renderScene = SceneMap({
    students: () => (
      <StudentsTab
        theme={theme}
        totalStudent={courseStats?.total_students}
        chartData={revenue.chart_data}
      />
    ),
    lessons: () => (
      <LessonsTab
        courseId={course.id}
        theme={theme}
        revuneDetailed={revenue.details}
        totalStudent={courseStats?.total_students}
      />
    ),
  });
  console.log(revenue);

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
        {course.price != 0 && (
          <TextCustom.TextMuted
            text={`Tổng doanh thu của khóa này: ${revenue?.summary}`}
            style={{ color: theme.colors.slate[500], marginTop: 4 }}
          />
        )}
      </View>

      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: Dimensions.get("window").width }}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            style={{
              backgroundColor: theme.colors.gray[200],
            }}
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
