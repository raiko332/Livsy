import { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import images from "@/constants/images";
import { auth, db } from "@/firebase/config";
import { Link, useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const SignUp = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    if (!name || !email || !password){
      Alert.alert("Warning", "Nama, Email, dan Password Wajib Di Isi")
      return;
    }
    try{
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: name,
        email: email,
        createdAt: new Date().toISOString(),
      });
      Alert.alert("Success", "Akun Berhasil dibuat")
      router.push("/sign-in")
    }catch(error: any){
      Alert.alert("error" + error.message);
    }
  };

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
              Name
            </Text>
            <TextInput
              value = {name}
              onChangeText={setName}
              placeholder="John doe"
              className="px-6 py-4 border-b focus:border-primary-300 border-black-100 rounded-xl"
            ></TextInput>
          </View>
          <View className="flex flex-col w-full gap-2 text-start">
            <Text className="text-base text-start font-rubik text-black-300">
              Email
            </Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Masukkan email"
              keyboardType="email-address"
              placeholder="example@mail.com"
              className="px-6 py-4 border-b focus:border-primary-300 border-black-100 rounded-xl"
            ></TextInput>
          </View>
          <View className="flex flex-col w-full gap-2 text-start">
            <Text className="text-base text-start font-rubik text-black-300">
              Password
            </Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Masukkan password"
              secureTextEntry
              className="px-6 py-4 border-b focus:border-primary-300 border-black-100 rounded-xl"
            ></TextInput>
          </View>
          <TouchableOpacity
             onPress={handleRegister}
            className="w-full py-4 mt-8 rounded-full shadow-md bg-primary-300 shadow-zinc-300"
          >
            <Text className="text-lg text-center text-white font-rubik ">
              Sign Up
            </Text>
          </TouchableOpacity>
          {/* Divider */}
          <View className="flex flex-row items-center justify-center my-4">
            <View className="h-[1px] bg-gray-200 flex-1" />
            <Text className="px-3 text-gray-400">or</Text>
            <View className="h-[1px] bg-gray-200 flex-1" />
          </View>
          <Text className="text-base text-center font-rubik text-black-300">
            Dont have Account?{" "}
            <Link href={"/sign-in"} className="font-bold text-primary-300">
              Sign In
            </Link>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;
