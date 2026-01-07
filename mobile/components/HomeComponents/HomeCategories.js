import { TouchableOpacity, View, FlatList, Text } from "react-native";
import TextCustom from "../TextCustom";
import { Icon } from "react-native-paper";
import { MyColorContext } from "../../utils/contexts/MyColorContext";

import { useContext } from "react";
import { categories } from "../../mock/data.mock.categories.json";

export const HomeCategories = ({ iconColor = "" }) => {
  const { theme } = useContext(MyColorContext);

  return (
    <View className="p-5">
      <View className="flex-row gap-3">
        <Icon
          source="tag"
          size={28}
          color={iconColor ? iconColor : theme.colors.slate[600]}
        />
        <TextCustom.TextSection text={"Danh mục"} />
      </View>
      <FlatList
        className="mt-4"
        horizontal
        data={categories}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            className=" rounded-lg px-4 py-3 mr-3 "
            style={{
              backgroundColor: theme.colors.blue[100],
            }}
            onPress={() => {
              setActiveId(item.id);
            }}
          >
            <Text>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};
