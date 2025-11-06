import { Image, Text, View } from "react-native";

import icons from "@/constants/icons";
import images from "@/constants/images";

const Comment = () => {
  return (
    <View className="flex flex-col items-start">
      <View className="flex flex-row items-center">
        <Image source={images.avatar} className="rounded-full size-14" />
        <Text className="ml-3 text-base text-black-300 text-start font-rubik-bold">
          Dharma
        </Text>
      </View>

      <Text className="mt-2 text-base text-black-200 font-rubik">
        nice banget keren propertynya keren banget
      </Text>

      <View className="flex flex-row items-center justify-between w-full mt-4">
        <View className="flex flex-row items-center">
          <Image
            source={icons.heart}
            className="size-5"
            tintColor={"#0061FF"}
          />
          <Text className="ml-2 text-sm text-black-300 font-rubik-medium">
            120
          </Text>
        </View>
        <Text className="text-sm text-black-100 font-rubik">
          20 Januari februari
        </Text>
      </View>
    </View>
  );
};

export default Comment;
