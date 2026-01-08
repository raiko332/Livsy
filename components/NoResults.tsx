import React from "react";
import { View, Text, Image } from "react-native";

import images from "@/constants/images";

const NoResults = ({
  title = "No Result",
  subtitle = "We could not find any result",
}: {
  title?: string;
  subtitle?: string;
}) => {
  return (
    <View className="flex items-center my-5">
      <Image
        source={images.noResult}
        className="w-11/12 h-80"
        resizeMode="contain"
      />
      <Text className="text-2xl font-rubik-bold text-black-300 mt-5">
        {title}
      </Text>
      <Text className="text-base text-black-100 mt-2">
        {subtitle}
      </Text>
    </View>
  );
};

export default NoResults;
