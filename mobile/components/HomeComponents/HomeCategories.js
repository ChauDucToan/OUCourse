import { TouchableOpacity, View, FlatList, Text } from "react-native";
import TextCustom from "../TextCustom";
import { Icon } from "react-native-paper";
import { useContext } from "react";
import { CategoriesContext } from "../../utils/contexts/CategoriesContext";
import { useEffect } from "react";
import { useMemo } from "react";

export const HomeCategories = ({ iconColor = "", theme }) => {
  const { categories, ensureCategories } = useContext(CategoriesContext);
  const topCategories = useMemo(() => categories.slice(0, 12), [categories]);
  useEffect(() => {
    ensureCategories();
  }, [ensureCategories]);
  return (
    <View className="p-5">
      <View className="flex-row gap-3">
        <Icon
          source="tag"
          size={28}
          color={iconColor ? iconColor : theme.colors.slate[600]}
        />
        <TextCustom.TextSection
          text={"Danh mục"}
          style={{ color: theme.colors.slate[500] }}
        />
      </View>
      <FlatList
        className="mt-4"
        horizontal
        data={topCategories}
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
      />
    </View>
  );
};
