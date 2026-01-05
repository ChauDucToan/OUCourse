import { FlatList } from "react-native";
import { View } from "react-native";
import Banner from "../Banner";
import { useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { useEffect } from "react";

const imageBanner = [
  require("../../assets/banner_1.png"),
  require("../../assets/banner_2.png"),
  require("../../assets/banner_3.png"),
  require("../../assets/banner_4.png"),
];

export const HomeBanner = () => {
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const nav = useNavigation();
  useEffect(() => {
    const interval = setInterval(() => {
      let nextIndex = (currentIndex + 1) % imageBanner.length;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setCurrentIndex(nextIndex);
    }, 5000);

    return () => clearInterval(interval);
  }, [currentIndex]);
  return (
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
            navigation={nav}
            text="🔥Khóa học React Native"
            subText="Giảm giá 50% trong tuần này"
            item={item}
          />
        )}
      />
      <View className="flex-row justify-center mb-3">
        {imageBanner.map((_, index) => (
          <View
            key={index}
            className={`ml-2 mr-2 ${currentIndex === index ? "w-6 rounded-pill h-3 bg-slate-500" : "w-3 h-3 bg-gray-200"} rounded-full`}
          />
        ))}
      </View>
    </View>
  );
};
