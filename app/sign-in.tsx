import React from "react";
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import images from "@/constants/images";

const SignIn = () => {
  return (
    <SafeAreaView className="h-full bg-white">
      <ScrollView
        contentContainerStyle={{
          height: "100%",
        }}
      >
        <Image source={images.newYork} className="w-full h-2/6" />

        <View className="p-10 bg-white rounded-t-[40px] flex flex-col-1 gap-6 -mt-10">
          <View className="flex flex-col w-full gap-2 text-start">
            <Text className="text-base text-start font-rubik text-black-300">
              Email
            </Text>
            <TextInput
              placeholder="example@mail.com"
              className="px-6 py-4 border-b focus:border-primary-300 border-black-100 rounded-xl"
            ></TextInput>
          </View>
          <View className="flex flex-col w-full gap-2 text-start">
            <Text className="text-base text-start font-rubik text-black-300">
              Password
            </Text>
            <TextInput
              placeholder="Input Password"
              className="px-6 py-4 border-b focus:border-primary-300 border-black-100 rounded-xl"
            ></TextInput>
          </View>
          <TouchableOpacity
            onPress={() => {}}
            className="w-full py-4 mt-8 rounded-full shadow-md bg-primary-300 shadow-zinc-300"
          >
            <Text className="text-lg text-center text-white font-rubik ">
              Sign in
            </Text>
          </TouchableOpacity>
          {/* Divider */}
          <View className="flex flex-row items-center justify-center my-4">
            <View className="h-[1px] bg-gray-200 flex-1" />
            <Text className="px-3 text-gray-400">or</Text>
            <View className="h-[1px] bg-gray-200 flex-1" />
          </View>
          <Text className="text-base text-center mt-14 font-rubik text-black-300">
            Dont have Account?
            <Text className="font-bold text-primary-300"> Sign Up</Text>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
