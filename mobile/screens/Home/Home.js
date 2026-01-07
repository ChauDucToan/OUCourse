import { View } from "react-native";
import { useState } from "react";
import { useEffect } from "react";

import fetchCourse from "../../api/courseApi";
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
const HEADER_MAX_HEIGHT = 140; // Chiều cao lúc đầu của Header gốc
const HEADER_MIN_HEIGHT = 80;
const HomeScreen = () => {
  const [courseData, setCourseData] = useState([]);

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
      <View>
        <HomeHeader
          text={"Hôm nay bạn muốn học gì?"}
          subText={"Tiếp tục hành trình khai phá tri thức"}
        />
        <HomeBanner />
        <HomeCategories />
        <HomeCourseList
          data={coursesFree}
          text="Top thịnh hành"
          textClass="text-yellow-500"
          iconColor={colors.yellow[500]}
          icon="star"
        />
        <HomePromotion />
        <HomeCourseList
          data={coursesExpensive}
          text="Khóa học cao cấp"
          icon="cash-multiple"
          textClass="text-purple-700"
          iconColor={colors.purple[700]}
        />
      </View>
    );
  };
  return (
    <View className="flex-1 bg-white">
      <Animated.View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: HEADER_MIN_HEIGHT,
          backgroundColor: "white",
          zIndex: 1000,
          elevation: 5,
          opacity: headerTitleOpacity,
          transform: [{ translateY: headerTranslate }],
          justifyContent: "center",
          alignItems: "center",
          borderBottomWidth: 1,
          borderBottomColor: "#eee",
        }}
      >
        {/* <HomeHeader text="OUCourse" subText="ok" />*/}
        <TextCustom.TextSection className="mt-8" text="OUCourse" />
        {/* <Text>OUCourse</Text>*/}
      </Animated.View>{" "}
      <Animated.FlatList
        ListHeaderComponent={render}
        // ListFooterComponent={HomePromotion}
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
