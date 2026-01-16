import { TouchableOpacity, View, FlatList, Text } from "react-native";
import TextCustom from "../TextCustom";
import { Icon } from "react-native-paper";

import { useEffect } from "react";
import { useState } from "react";
import { useCategories } from "../../hooks/useCategories";

export const HomeCategories = ({
  icon = "",
  text = "",
  iconColor = "",
  theme,
  sizeIcon = 28,
}) => {
  const { categories, ensureCategories } = useCategories();
  const [count, setCount] = useState(20);

  const loadMore = () => {
    setCount((prev) => prev + 20);
  };
  useEffect(() => {
    ensureCategories();
  }, [ensureCategories]);
  return (
    <View className="p-5">
      <View className={`flex-row gap-3 ${text !== "" ? "mb-3" : ""}`}>
        <Icon
          source={icon}
          size={sizeIcon}
          color={iconColor ? iconColor : theme.colors.slate[600]}
        />
        <TextCustom.TextSection
          text={text}
          style={{ color: theme.colors.slate[500] }}
        />
      </View>
      <FlatList
        className="mt-1"
        horizontal
        data={categories.slice(0, count)}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            className=" rounded-lg px-4 py-3 mr-3 "
            style={{
              backgroundColor: theme.colors.slate[500],
            }}
            onPress={() => {
              setActiveId(item.id);
            }}
          >
            <Text
              style={{
                color: theme.colors.slate[200],
              }}
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
        onEndReached={loadMore}
        onEndReachedThreshold={0.7}
      />
    </View>
  );
};
