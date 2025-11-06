import { router } from "expo-router";
import {
  Dimensions,
  FlatList,
  Image,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import Comment from "@/components/Comment";
import { facilities } from "@/constants/data";
import icons from "@/constants/icons";
import images from "@/constants/images";
const Property = () => {
  const windowHeight = Dimensions.get("window").height;

  return (
    <View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-32 bg-white"
      >
        <View className="relative w-full" style={{ height: windowHeight / 2 }}>
          <Image
            source={images.newYork}
            className="size-full"
            resizeMode="cover"
          />
          <Image
            source={images.whiteGradient}
            className="absolute top-0 z-40 w-full"
          />

          <View
            className="absolute z-50 inset-x-7"
            style={{
              top: Platform.OS === "ios" ? 70 : 20,
            }}
          >
            <View className="flex flex-row items-center justify-between w-full">
              <TouchableOpacity
                onPress={() => router.back()}
                className="flex flex-row items-center justify-center rounded-full bg-primary-200 size-11"
              >
                <Image source={icons.backArrow} className="size-5" />
              </TouchableOpacity>

              <View className="flex flex-row items-center gap-3">
                <Image
                  source={icons.heart}
                  className="size-7"
                  tintColor={"#191D31"}
                />
                <Image source={icons.send} className="size-7" />
              </View>
            </View>
          </View>
        </View>

        <View className="flex gap-2 px-5 mt-7">
          <Text className="text-2xl font-rubik-extrabold">
            Japan Black Market
          </Text>

          <View className="flex flex-row items-center gap-3">
            <View className="flex flex-row items-center px-4 py-2 rounded-full bg-primary-100">
              <Text className="text-xs font-rubik-bold text-primary-300">
                Villa
              </Text>
            </View>

            <View className="flex flex-row items-center gap-2">
              <Image source={icons.star} className="size-5" />
              <Text className="mt-1 text-sm text-black-200 font-rubik-medium">
                4.5 (10 reviews)
              </Text>
            </View>
          </View>

          <View className="flex flex-row items-center mt-5">
            <View className="flex flex-row items-center justify-center rounded-full bg-primary-100 size-10">
              <Image source={icons.bed} className="size-4" />
            </View>
            <Text className="ml-2 text-sm text-black-300 font-rubik-medium">
              1 Beds
            </Text>
            <View className="flex flex-row items-center justify-center rounded-full bg-primary-100 size-10 ml-7">
              <Image source={icons.bath} className="size-4" />
            </View>
            <Text className="ml-2 text-sm text-black-300 font-rubik-medium">
              2 Baths
            </Text>
            <View className="flex flex-row items-center justify-center rounded-full bg-primary-100 size-10 ml-7">
              <Image source={icons.area} className="size-4" />
            </View>
            <Text className="ml-2 text-sm text-black-300 font-rubik-medium">
              3 sqft
            </Text>
          </View>

          <View className="w-full mt-5 border-t border-primary-200 pt-7">
            <Text className="text-xl text-black-300 font-rubik-bold">
              Agent
            </Text>

            <View className="flex flex-row items-center justify-between mt-4">
              <View className="flex flex-row items-center">
                <Image
                  source={images.avatar}
                  className="rounded-full size-14"
                />

                <View className="flex flex-col items-start justify-center ml-3">
                  <Text className="text-lg text-black-300 text-start font-rubik-bold">
                    Wisnu Ganteng
                  </Text>
                  <Text className="text-sm text-black-200 text-start font-rubik-medium">
                    Wisnu@gmail.com
                  </Text>
                </View>
              </View>

              <View className="flex flex-row items-center gap-3">
                <Image source={icons.chat} className="size-7" />
                <Image source={icons.phone} className="size-7" />
              </View>
            </View>
          </View>

          <View className="mt-7">
            <Text className="text-xl text-black-300 font-rubik-bold">
              Overview
            </Text>
            <Text className="mt-2 text-base text-black-200 font-rubik">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi
              laudantium nesciunt ea quos rerum voluptate repudiandae architecto
              odio ullam facilis!
            </Text>
          </View>

          <View className="mt-7">
            <Text className="text-xl text-black-300 font-rubik-bold">
              Facilities
            </Text>

            {facilities.length > 0 && (
              <View className="flex flex-row flex-wrap items-start justify-start gap-5 mt-2">
                <View className="flex flex-col items-center flex-1 min-w-16 max-w-20">
                  <View className="flex items-center justify-center rounded-full size-14 bg-primary-100">
                    <Image source={icons.bed} className="size-6" />
                  </View>

                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    className="text-black-300 text-sm text-center font-rubik mt-1.5"
                  >
                    Bedroom
                  </Text>
                </View>
                <View className="flex flex-col items-center flex-1 min-w-16 max-w-20">
                  <View className="flex items-center justify-center rounded-full size-14 bg-primary-100">
                    <Image source={icons.bath} className="size-6" />
                  </View>

                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    className="text-black-300 text-sm text-center font-rubik mt-1.5"
                  >
                    Shower
                  </Text>
                </View>
              </View>
            )}
          </View>

          <View className="mt-7">
            <Text className="text-xl text-black-300 font-rubik-bold">
              Gallery
            </Text>
            <FlatList
              contentContainerStyle={{ paddingRight: 20 }}
              data={[1, 2, 3, 4]}
              keyExtractor={(item) => item.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <Image source={images.newYork} className="size-40 rounded-xl" />
              )}
              contentContainerClassName="flex gap-4 mt-3"
            />
          </View>

          <View className="mt-7">
            <Text className="text-xl text-black-300 font-rubik-bold">
              Location
            </Text>
            <View className="flex flex-row items-center justify-start gap-2 mt-4">
              <Image source={icons.location} className="w-7 h-7" />
              <Text className="text-sm text-black-200 font-rubik-medium">
                Gianyar
              </Text>
            </View>

            <Image
              source={images.map}
              className="w-full mt-5 h-52 rounded-xl"
            />
          </View>

          <View className="mt-7">
            <View className="flex flex-row items-center justify-between">
              <View className="flex flex-row items-center">
                <Image source={icons.star} className="size-6" />
                <Text className="ml-2 text-xl text-black-300 font-rubik-bold">
                  5 (2 reviews)
                </Text>
              </View>

              <TouchableOpacity>
                <Text className="text-base text-primary-300 font-rubik-bold">
                  View All
                </Text>
              </TouchableOpacity>
            </View>

            <View className="mt-5">
              <Comment />
            </View>
          </View>
        </View>
      </ScrollView>

      <View className="absolute bottom-0 w-full bg-white border-t border-l border-r rounded-t-2xl border-primary-200 p-7">
        <View className="flex flex-row items-center justify-between gap-10">
          <View className="flex flex-col items-start">
            <Text className="text-xs text-black-200 font-rubik-medium">
              Price
            </Text>
            <Text
              numberOfLines={1}
              className="text-2xl text-primary-300 text-start font-rubik-bold"
            >
              $200
            </Text>
          </View>

          <TouchableOpacity className="flex flex-row items-center justify-center flex-1 py-3 rounded-full shadow-md bg-primary-300 shadow-zinc-400">
            <Text className="text-lg text-center text-white font-rubik-bold">
              Book Now
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Property;
