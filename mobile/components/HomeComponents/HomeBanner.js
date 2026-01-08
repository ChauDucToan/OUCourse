import { FlatList } from "react-native";
import { View } from "react-native";
import Banner from "../Banner";

import { useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { useEffect } from "react";

import { images } from "../../mock/data.mock.banner.json";

export const HomeBanner = ({ theme }) => {
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const nav = useNavigation();
  useEffect(() => {
    const interval = setInterval(() => {
      let nextIndex = (currentIndex + 1) % images.length;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setCurrentIndex(nextIndex);
    }, 5000);

    return () => clearInterval(interval);
  }, [currentIndex]);
  return (
    <View>
      <FlatList
        ref={flatListRef}
        data={images}
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
        {images.map((_, index) => (
          <View
            key={index}
            className={`ml-2 mr-2 rounded-full ${
              currentIndex === index ? "w-6 h-3" : "w-3 h-3"
            }`}
            style={{
              backgroundColor:
                currentIndex === index
                  ? theme.colors.slate[500]
                  : theme.colors.gray[200],
            }}
          />
        ))}
      </View>
    </View>
  );
};
