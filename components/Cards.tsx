import images from "@/constants/images";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface Props {
  onPress?: () => void;
}

export const FeaturedCard = ({ onPress }: Props) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="relative flex flex-col items-start w-60 h-80"
    >
      <Image source={images.japan} className="size-full rounded-2xl" />

      <Image
        source={images.cardGradient}
        className="absolute bottom-0 size-full rounded-2xl"
      />

      <View className="flex flex-row items-center bg-white/90 px-3 py-1.5 rounded-full absolute top-5 right-5">
        <Text className="ml-1 text-xs font-rubik-bold text-primary-300">
          Villa
          {/* property type */}
        </Text>
      </View>

      <View className="absolute flex flex-col items-start bottom-5 inset-x-5">
        <Text
          className="text-xl text-white font-rubik-extrabold"
          numberOfLines={1}
        >
          Japan City Light
        </Text>
        <Text className="text-base text-white font-rubik" numberOfLines={1}>
          Japan ni bos
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export const Card = ({ onPress }: Props) => {
  return (
    <TouchableOpacity
      className="relative flex-1 w-full px-3 py-4 mt-4 bg-white rounded-lg shadow-lg shadow-black-100/70"
      onPress={onPress}
    >
      <View className="absolute z-50 flex flex-row items-center p-1 px-2 rounded-full top-5 right-5 bg-white/90">
        <Text className="text-xs font-rubik-bold text-primary-300 ml-0.5">
          House
        </Text>
      </View>

      <Image source={images.japan} className="w-full h-40 rounded-lg" />

      <View className="flex flex-col mt-2">
        <Text className="text-base font-rubik-bold text-black-300">Japan</Text>
        <Text className="text-xs font-rubik text-black-100">Gianyar</Text>

        <View className="flex flex-row items-center justify-between mt-2">
          <Text className="text-base font-rubik-bold text-primary-300">
            Rp200.000...
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
