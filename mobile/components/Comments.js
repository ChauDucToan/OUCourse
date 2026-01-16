import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert, // Import thêm Alert
} from "react-native";
import axiosClient from "../api/axiosClient";
import { errorConsole } from "../utils/errorUtils";
import TextCustom from "./TextCustom";
import CommentItem from "./CommentItem";
import { endpoints } from "../utils/Apis";
import { ScrollView } from "react-native";

const Comments = ({ lessonId, theme, user }) => {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [posting, setPosting] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  const fetchComments = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get(endpoints["createComment"](lessonId));
      setComments(res.data.results || []);
      setTotalCount(res.data.count || 0);
    } catch (error) {
      errorConsole(error, "Comments:fetchComments");
    } finally {
      setLoading(false);
    }
  }, [lessonId]);

  useEffect(() => {
    if (lessonId) {
      fetchComments();
    }
  }, [lessonId, fetchComments]);

  const handlePostComment = async () => {
    if (!content.trim()) return;
    try {
      setPosting(true);
      const formData = new FormData();
      formData.append("content", content);
      formData.append("lesson", String(lessonId));

      const res = await axiosClient.post(
        endpoints["createComment"](lessonId),
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      if (res.status === 201) {
        console.log(res.data);

        setComments((prev) => [res.data, ...prev]);
        setTotalCount((prev) => prev + 1);
        setContent("");
      }
    } catch (error) {
      errorConsole(error, "Comments:postComment");
      Alert.alert("Lỗi", "Có lỗi xảy ra khi gửi bình luận.");
    } finally {
      setPosting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const res = await axiosClient.delete(
        endpoints["deleteComment"](commentId),
      );
      if (res.status === 204) {
        setComments((prev) => prev.filter((c) => c.id !== commentId));
        setTotalCount((prev) => prev - 1);
      }
    } catch (error) {
      errorConsole(error, "Comments:deleteComment");
      Alert.alert("Lỗi", "Không thể xóa bình luận.");
    }
  };

  return (
    <View className="mt-6 mb-10 p-3">
      <TextCustom.TextFocus
        style={{ color: theme.colors.slate[600] }}
        className="text-lg font-bold mb-4"
        text="Bình luận"
      />

      <View className="flex-row items-center mb-6">
        <TextInput
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 mr-2 bg-gray-50"
          placeholder="Viết bình luận..."
          value={content}
          onChangeText={setContent}
          multiline
          placeholderTextColor="#9CA3AF"
        />
        <TouchableOpacity
          className="bg-blue-500 px-4 py-2 rounded-lg justify-center h-10"
          onPress={handlePostComment}
          disabled={posting || !content.trim()}
          style={{ opacity: posting || !content.trim() ? 0.6 : 1 }}
        >
          {posting ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <TextCustom.TextFocus
              style={{ color: "white" }}
              className="text-white font-bold"
              text="Gửi"
            />
          )}
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="small" color={theme.colors.primary} />
      ) : (
        <View className="pb-3">
          {Array.isArray(comments) && comments.length > 0 ? (
            comments.map((c) => (
              <CommentItem
                key={c.id}
                comment={c}
                user={user}
                theme={theme}
                onDelete={handleDeleteComment}
              />
            ))
          ) : (
            <TextCustom.TextMuted
              text="Chưa có bình luận nào."
              className="text-center italic"
            />
          )}
        </View>
      )}
    </View>
  );
};

export default Comments;
