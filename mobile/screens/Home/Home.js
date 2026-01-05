import { Text, TouchableOpacity, View } from "react-native";
import Banner from "../../components/Banner";
<<<<<<< HEAD
import { FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useRef } from "react";
import { useState } from "react";
import { useEffect } from "react";
import fetchCourse from "../../api/courseApi";
import CourseView from "../../components/CourseView";
import { getTokens } from "../../utils/tokenUtils";

const categories = require("../../mock/data.mock.categories.json");
=======
import { TextInput } from "react-native";
import { FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useRef } from "react";
import { ScrollView } from "react-native";
import { useState } from "react";
import { useEffect } from "react";

const categories = [
  { id: "1", name: "Lập trình" },
  { id: "2", name: "Thiết kế" },
  { id: "3", name: "Marketing" },
];
>>>>>>> 9371c906eb323960f6cc838b74faaf7cd0d160e3

const imageBanner = [
  require("../../assets/banner_1.png"),
  require("../../assets/banner_2.png"),
  require("../../assets/banner_3.png"),
  require("../../assets/banner_4.png"),
];
<<<<<<< HEAD

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
=======

const Home = () => {
  const navigation = useNavigation();
  const flatListRef = useRef(null);

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      let nextIndex = (currentIndex + 1) % imageBanner.length;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setCurrentIndex(nextIndex);
    }, 5000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <ScrollView className="flex-1 bg-white p-6">
      <Text className="text-2xl font-bold mt-4">
        👋 Nay bạn muốn ma thuật gì
      </Text>
      <Text className="text-base text-gray-500 mb-4">Hít đường bằng mũi</Text>
      <TextInput
        className="border border-gray-300 rounded-lg px-3 py-2 mb-6"
        placeholder="Tìm khóa học..."
        onFocus={() => navigation.getParent()?.navigate("Search")}
      />

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
>>>>>>> 9371c906eb323960f6cc838b74faaf7cd0d160e3
      <View className="flex-row justify-center mb-3">
        {imageBanner.map((_, index) => (
          <View
            key={index}
<<<<<<< HEAD
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
=======
            className={`ml-2 mr-2 ${currentIndex === index ? "w-3 h-3 bg-slate-600" : "w-3 h-3 bg-gray-200"} rounded-full`}
          />
        ))}
      </View>

      <Text className="text-lg font-semibold mb-2">Danh mục</Text>
      <FlatList
        horizontal
        data={categories}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            className="bg-gray-100 rounded-lg px-4 py-3 mr-3"
            onPress={() =>
              navigation.navigate("Category", {
                categoryId: item.id,
                categoryName: item.name,
              })
            }
          >
            <Text className="text-base">{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </ScrollView>
>>>>>>> 9371c906eb323960f6cc838b74faaf7cd0d160e3
  );
};

export default HomeScreen;
