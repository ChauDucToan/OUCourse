import { TouchableOpacity, View, FlatList, Text } from "react-native";
import TextCustom from "../TextCustom";
import { categories } from "../../mock/data.mock.categories.json";

export const HomeCategories = () => {
  return (
    <View className="p-5">
      <TextCustom.TextSection text={"Danh mục"} />
      <FlatList
        className="mt-4"
        horizontal
        data={categories}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            className="bg-slate-500  rounded-lg px-4 py-3 mr-3 "
            onPress={() => {
              setActiveId(item.id);
            }}
          >
            <Text className="text-base text-white">{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};
