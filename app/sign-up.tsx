import { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import images from "@/constants/images";
import { auth, db } from "@/firebase/config";
import { Link, useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";

const SignUp = () => {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password || !phone) {
      Alert.alert(
        "Warning",
        "Nama, Email, Nomor HP, dan Password wajib diisi"
      );
      return;
    }

    try {
      setLoading(true);

      // 1. Register ke Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      // 2. Simpan data user ke Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: name,
        email: email,
        phone: phone,
        photoURL: "",
        role: "user",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      Alert.alert("Success", "Akun berhasil dibuat");
      router.replace("/sign-in");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="h-full bg-white">
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <Image source={images.newYork} className="w-full h-2/6" />

        <View className="p-10 bg-white rounded-t-[40px] flex flex-col gap-6 -mt-10">
          {/* Name */}
          <View className="flex flex-col w-full gap-2">
            <Text className="text-base font-rubik text-black-300">Name</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="John Doe"
              className="px-6 py-4 border-b border-black-100 rounded-xl"
            />
          </View>

          {/* Email */}
          <View className="flex flex-col w-full gap-2">
            <Text className="text-base font-rubik text-black-300">Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="example@mail.com"
              keyboardType="email-address"
              autoCapitalize="none"
              className="px-6 py-4 border-b border-black-100 rounded-xl"
            />
          </View>

          {/* Phone */}
          <View className="flex flex-col w-full gap-2">
            <Text className="text-base font-rubik text-black-300">
              Nomor HP
            </Text>
            <TextInput
              value={phone}
              onChangeText={setPhone}
              placeholder="08xxxxxxxxxx"
              keyboardType="phone-pad"
              className="px-6 py-4 border-b border-black-100 rounded-xl"
            />
          </View>

          {/* Password */}
          <View className="flex flex-col w-full gap-2">
            <Text className="text-base font-rubik text-black-300">
              Password
            </Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Masukkan password"
              secureTextEntry
              className="px-6 py-4 border-b border-black-100 rounded-xl"
            />
          </View>

          <TouchableOpacity
            onPress={handleRegister}
            disabled={loading}
            className="w-full py-4 mt-8 rounded-full shadow-md bg-primary-300 shadow-zinc-300"
          >
            <Text className="text-lg text-center text-white font-rubik">
              {loading ? "Loading..." : "Sign Up"}
            </Text>
          </TouchableOpacity>

          {/* Divider */}
          <View className="flex flex-row items-center justify-center my-4">
            <View className="h-[1px] bg-gray-200 flex-1" />
            <Text className="px-3 text-gray-400">or</Text>
            <View className="h-[1px] bg-gray-200 flex-1" />
          </View>

          <Text className="text-base text-center font-rubik text-black-300">
            Already have an account?{" "}
            <Link href="/sign-in" className="font-bold text-primary-300">
              Sign In
            </Link>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;
