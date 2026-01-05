import { Text, TouchableOpacity, View } from "react-native";
import Banner from "../../components/Banner";
import { FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useRef } from "react";
import { useState } from "react";
import { useEffect } from "react";
import fetchCourse from "../../api/courseApi";
import CourseView from "../../components/CourseView";

const categories = require("../../mock/data.mock.categories.json");

const imageBanner = [
  require("../../assets/banner_1.png"),
  require("../../assets/banner_2.png"),
  require("../../assets/banner_3.png"),
  require("../../assets/banner_4.png"),
];

const HomeScreen = () => {
  const navigation = useNavigation();
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [courseData, setCourseData] = useState([]);
  useEffect(() => {
    const interval = setInterval(() => {
      let nextIndex = (currentIndex + 1) % imageBanner.length;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setCurrentIndex(nextIndex);
    }, 5000);

    return () => clearInterval(interval);
  }, [currentIndex]);
  useEffect(() => {
    const loadData = async () => {
      const fetchData = await fetchCourse();
      console.log("FETCH", fetchData.data);
      setCourseData(fetchData.data.results);
    };
    loadData();
  }, []);

  return (
    <View className="flex-1 bg-white">
      <View className="p-5">
        <Text className="text-2xl font-bold mt-12">
          Nay bạn muốn ma thuật gì
        </Text>
        <Text className="text-base text-gray-500 mb-4">Hít đường bằng mũi</Text>
      </View>
      <View>
        <FlatList
          ref={flatListRef}
          data={imageBanner}
          className="mb-4 gap-3"
          horizontal
          pagingEnabled
          decelerationRate="fast"
          snapToAlignment="center"
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <Banner
              navigation={navigation}
              text="🔥 Khóa học React Native"
              subText="Giảm giá 50% trong tuần này"
              item={item}
            />
          )}
        />
      </View>
      <View className="flex-row justify-center mb-3">
        {imageBanner.map((_, index) => (
          <View
            key={index}
            className={`ml-2 mr-2 ${currentIndex === index ? "w-6 rounded-pill h-3 bg-slate-600" : "w-3 h-3 bg-gray-200"} rounded-full`}
          />
        ))}
      </View>
      <View className="p-5">
        <Text className="text-lg font-semibold mb-2">Danh mục</Text>
        <FlatList
          horizontal
          data={categories.categories}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              className="bg-gray-100 rounded-lg px-4 py-3 mr-3"
              onPress={() => console.log("CLICK CATEGORy")}
            >
              <Text className="text-base">{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <FlatList
        data={courseData}
        className="gap-3"
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CourseView navigation={navigation} item={item} />
        )}
      />
    </View>
  );
};

export default HomeScreen;
