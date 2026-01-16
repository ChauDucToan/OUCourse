import { View } from "react-native";
import { useEffect } from "react";
import { HomeHeader } from "../../components/HomeComponents/HomeHeader";
import { HomeCategories } from "../../components/HomeComponents/HomeCategories";
import { HomeBanner } from "../../components/HomeComponents/HomeBanner";
import { HomeCourseList } from "../../components/HomeComponents/HomeCourseList";
import HomePromotion from "../../components/HomeComponents/HomePromotion";
import { useRef } from "react";
import TextCustom from "../../components/TextCustom";
import { Animated } from "react-native";
import { useMemo } from "react";
import { useCourses } from "../../hooks/useCourses";
import { ActivityIndicator } from "react-native";
import { useColors } from "../../hooks/useColors";
import { useUser } from "../../hooks/useUser";

const HEADER_MAX_HEIGHT = 140;
const HEADER_MIN_HEIGHT = 80;

const HomeScreen = () => {
  const { theme } = useColors();
  const scrollY = useRef(new Animated.Value(0)).current;
  const { courses, ensureHomeCourses, loadingCourses } = useCourses();
  const [user] = useUser();
  const courseFree = useMemo(
    () => courses.filter((c) => (c?.price ?? 0) <= 0),
    [courses],
  );

  const courseExpensive = useMemo(
    () => courses.filter((c) => (c?.price ?? 0) >= 10000),
    [courses],
  );

  useEffect(() => {
    ensureHomeCourses();
  }, [ensureHomeCourses]);

  const headerTitleOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const headerTranslate = scrollY.interpolate({
    inputRange: [0, HEADER_MAX_HEIGHT],
    outputRange: [0, 0],
    extrapolate: "clamp",
  });
  console.log(user);
  const render = () => {
    return (
      <View
        style={{
          backgroundColor: theme.colors.gray[100],
        }}
      >
        <HomeHeader
          text={`Hôm nay ${user?.last_name ? user.last_name : "bạn"} muốn học gì?`}
          subText={"Tiếp tục hành trình khai phá tri thức"}
          theme={theme}
        />
        <HomeBanner theme={theme} />
        <HomeCategories icon="tag" text="Danh mục" theme={theme} />
        {loadingCourses ? (
          <ActivityIndicator size="large" color={theme.colors.primary} />
        ) : (
          <HomeCourseList
            data={courseFree}
            text="Top thịnh hành"
            textClass={{ color: theme.colors.yellow[500] }}
            iconColor={theme.colors.yellow[500]}
            icon="star"
            theme={theme}
          />
        )}

        <HomePromotion />
        {loadingCourses ? (
          <ActivityIndicator size="large" color={theme.colors.primary} />
        ) : (
          <HomeCourseList
            data={courseExpensive}
            text="Khóa học cao cấp"
            icon="cash-multiple"
            textClass={{ color: theme.colors.violet[600] }}
            iconColor={theme.colors.violet[600]}
            theme={theme}
          />
        )}
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
