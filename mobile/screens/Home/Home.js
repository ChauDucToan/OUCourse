import { View } from "react-native";
import { useState } from "react";
import { useEffect } from "react";
import fetchCourse from "../../api/courseApi";
import CourseView from "../../components/CourseView";
import { results } from "../../mock/data.mock.courses.json";
import { HomeHeader } from "../../components/HomeComponents/HomeHeader";
import { HomeCategories } from "../../components/HomeComponents/HomeCategories";
import { HomeBanner } from "../../components/HomeComponents/HomeBanner";
import { HomeCourseList } from "../../components/HomeComponents/HomeCourseList";
import HomePromotion from "../../components/HomeComponents/HomePromotion";
import colors from "tailwindcss/colors";
import { Animated } from "react-native";
import { useRef } from "react";
import TextCustom from "../../components/TextCustom";
import { useContext } from "react";
import { MyColorContext } from "../../utils/contexts/MyColorContext";
const HEADER_MAX_HEIGHT = 140; // Chiều cao lúc đầu của Header gốc
const HEADER_MIN_HEIGHT = 80;
const HomeScreen = () => {
  const [courseData, setCourseData] = useState([]);
  const { theme } = useContext(MyColorContext);
  const scrollY = useRef(new Animated.Value(0)).current;
  const coursesFree = results.filter((course) => course.price <= 0);
  const coursesExpensive = results.filter((course) => course.price >= 500000);
  useEffect(() => {
    const loadData = async () => {
      const fetchData = await fetchCourse();
      console.log("FETCH", fetchData.data);
      setCourseData(fetchData.data.results);
    };
    loadData();
  }, []);
  const headerTitleOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  // 3. Hiệu ứng thu nhỏ Header hoặc bóc tách (Ví dụ: dịch chuyển Header)
  const headerTranslate = scrollY.interpolate({
    inputRange: [0, HEADER_MAX_HEIGHT],
    outputRange: [0, 0],
    extrapolate: "clamp",
  });

  const render = () => {
    return (
      <View
        style={{
          backgroundColor: theme.colors.gray[100],
        }}
      >
        <HomeHeader
          text={"Hôm nay bạn muốn học gì?"}
          subText={"Tiếp tục hành trình khai phá tri thức"}
          theme={theme}
        />
        <HomeBanner theme={theme} />
        <HomeCategories theme={theme} />
        <HomeCourseList
          data={coursesFree}
          text="Top thịnh hành"
          textClass={{ color: theme.colors.yellow[500] }}
          iconColor={theme.colors.yellow[500]}
          icon="star"
          theme={theme}
        />
        <HomePromotion />
        <HomeCourseList
          data={coursesExpensive}
          text="Khóa học cao cấp"
          icon="cash-multiple"
          textClass={{ color: theme.colors.violet[600] }}
          iconColor={theme.colors.violet[600]}
          theme={theme}
        />
      </View>
    );
  };
  return (
    <View
      className="flex-1 "
      style={{
        backgroundColor: theme.colors.gray[100],
      }}
    >
      <Animated.View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: HEADER_MIN_HEIGHT,
          zIndex: 1000,
          elevation: 5,
          opacity: headerTitleOpacity,
          transform: [{ translateY: headerTranslate }],
          justifyContent: "center",
          alignItems: "center",
          borderBottomWidth: 1,
          borderBottomColor: "#eee",
          backgroundColor: theme.colors.gray[100],
          backgroundColor: theme.colors.gray[100],
        }}
      >
        <TextCustom.TextSection
          style={{ color: theme.colors.black }}
          className="mt-8"
          text="OUCourse"
        />
      </Animated.View>
      <Animated.FlatList
        ListHeaderComponent={render}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true },
        )}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default HomeScreen;
