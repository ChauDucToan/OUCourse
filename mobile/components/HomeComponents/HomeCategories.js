import { TouchableOpacity, View } from "react-native";
import TextCustom from "../TextCustom";
import { FlatList } from "react-native";
import { categories } from "../../mock/data.mock.categories.json";
import { Text } from "react-native";

export const HomeCategories = () => {
  return (
    <View className="p-5">
      <TextCustom.TextSection text={"Danh mục"} />
      <FlatList
        className="mt-4"
        // horizontal
        data={categories}
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
  );
};
