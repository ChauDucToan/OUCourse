import { View } from "react-native";
import { FlatList } from "react-native";

import { useState } from "react";
import { useEffect } from "react";

import fetchCourse from "../../api/courseApi";
import { results } from "../../mock/data.mock.courses.json";
import { HomeHeader } from "../../components/HomeComponents/HomeHeader";
import { HomeCategories } from "../../components/HomeComponents/HomeCategories";
import { HomeBanner } from "../../components/HomeComponents/HomeBanner";
import { HomeCourseList } from "../../components/HomeComponents/HomeCourseList";

const HomeScreen = () => {
  const [courseData, setCourseData] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const fetchData = await fetchCourse();
      console.log("FETCH", fetchData.data);
      setCourseData(fetchData.data.results);
    };
    loadData();
  }, []);

  const render = () => {
    return (
      <View>
        <HomeHeader />
        <HomeBanner />
        <HomeCategories />
        <HomeCourseList data={results} text="Top thịnh hành" />
      </View>
    );
  };
  return (
    <View className="flex-1 bg-white">
      <FlatList ListHeaderComponent={render} />
    </View>
  );
};

export default HomeScreen;
