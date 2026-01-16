import { View, Image, TouchableOpacity, Alert } from "react-native";
import TextCustom from "./TextCustom";
import moment from "moment";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Text } from "react-native";
import { endpoints } from "../utils/Apis";
import { errorConsole } from "../utils/errorUtils";
import axiosClient from "../api/axiosClient";

const REACTIONS = {
  2: { icon: "❤️", label: "Tim" },
  3: { icon: "😂", label: "Haha" },
  4: { icon: "😢", label: "Buồn" },
  5: { icon: "😮", label: "Wow" },
};

const CommentItem = ({ comment, user, theme, onDelete }) => {
  const isOwner = user && comment.user.id === user.id;

  const [showReactions, setShowReactions] = useState(false);
  const [currentReaction, setCurrentReaction] = useState(null);
  const [reactionCount, setReactionCount] = useState(0);

  const handleReact = async (type) => {
    try {
      if (currentReaction === type) {
        const res = await axiosClient.delete(
          endpoints.deleteCommentReact(comment.id),
        );
        if (res.status === 204) {
          setCurrentReaction(null);
          setReactionCount((prev) => (prev > 0 ? prev - 1 : 0));
        }
      } else {
        const res = await axiosClient.post(
          endpoints["createCommentReact"](comment.id),
          {
            type: type,
          },
        );
        console.log(res.status);
        if (res.status === 200) {
          if (currentReaction === null) {
            setReactionCount((prev) => prev + 1);
          }
          setCurrentReaction(type);
        }
      }
    } catch (error) {
      errorConsole(error, "CommentItem:handleReact");
    } finally {
      setShowReactions(false);
    }
  };

  const handleDelete = () => {
    Alert.alert("Xác nhận", "Bạn có chắc chắn muốn xóa bình luận này không?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: () => onDelete(comment.id),
      },
    ]);
  };

  const timeAgo = moment(comment.created_date).fromNow();

  return (
    <View
      className="flex-row mb-4 p-3 rounded-xl"
      style={{ backgroundColor: theme.colors.gray[300] }}
    >
      <View className="mr-3">
        {comment.user.avatar ? (
          <Image
            source={{ uri: comment.user.avatar }}
            className="w-10 h-10 rounded-full"
          />
        ) : (
          <View className="w-10 h-10 rounded-full bg-gray-300 justify-center items-center">
            <TextCustom.TextFocus
              text={comment.user.username?.charAt(0).toUpperCase()}
              className="text-lg font-bold"
            />
          </View>
        )}
      </View>

      <View className="flex-1">
        <View className="flex-row justify-between items-start">
          <TextCustom.TextFocus
            text={
              comment.user.first_name
                ? `${comment.user.last_name} ${comment.user.first_name}`
                : comment.user.username
            }
            className="font-bold text-base"
            style={{ color: theme.colors.slate[800] }}
          />
          <TextCustom.TextMuted
            text={timeAgo}
            className="text-xs"
            style={{ color: theme.colors.slate[800] }}
          />
        </View>

        <TextCustom.TextNoFocus
          text={comment.content}
          className="mt-1 text-sm"
          style={{ color: theme.colors.slate[600] }}
        />
        <View className="flex-row items-center justify-between mt-1 relative">
          <View className="flex-row ">
            <TouchableOpacity
              onPress={() => setShowReactions(!showReactions)}
              className="flex-row items-center px-2 py-1 rounded-full bg-gray-100 mr-2"
            >
              {currentReaction ? (
                <Text style={{ fontSize: 16 }}>
                  {REACTIONS[currentReaction].icon}
                </Text>
              ) : (
                <Ionicons
                  name="happy-outline"
                  size={18}
                  color={theme.colors.slate[500]}
                />
              )}

              {reactionCount > 0 && (
                <Text
                  className="ml-1 text-xs font-bold"
                  style={{ color: theme.colors.slate[600] }}
                >
                  {reactionCount}
                </Text>
              )}
            </TouchableOpacity>

            {showReactions && (
              <View
                className="flex-row bg-white shadow-lg rounded-full px-2 py-1 absolute left-10 -top-8 border border-gray-200"
                style={{ elevation: 5, zIndex: 100 }}
              >
                {Object.keys(REACTIONS).map((key) => {
                  const typeId = parseInt(key);
                  return (
                    <TouchableOpacity
                      key={typeId}
                      onPress={() => handleReact(typeId)}
                      className="mx-1"
                    >
                      <Text style={{ fontSize: 20 }}>
                        {REACTIONS[typeId].icon}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>

          {isOwner && (
            <TouchableOpacity onPress={handleDelete} className="ml-2 pt-1">
              <Ionicons name="trash-outline" size={18} color="red" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

export default CommentItem;
