import * as ImagePicker from "expo-image-picker";
export const getMimeType = (fileUri) => {
  const extension = fileUri.split(".").pop().toLowerCase();
  switch (extension) {
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "gif":
      return "image/gif";
    case "heic":
      return "image/heic";

    case "mp4":
      return "video/mp4";
    case "mov":
      return "video/quicktime";
    case "avi":
      return "video/x-msvideo";
    case "mkv":
      return "video/x-matroska";

    default:
      return "application/octet-stream";
  }
};

export const pickImage = async () => {
  let { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (status !== "granted") {
    alert("Permissions denied!");
  } else {
    const result = await ImagePicker.launchImageLibraryAsync();
    if (!result.canceled) return result.assets[0];
  }
};

export const pickVideo = async () => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== "granted") return alert("Permissions denied!");

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Videos,
    quality: 1,
  });

  if (!result.canceled) return result.assets[0];
};
