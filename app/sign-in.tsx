import images from "@/constants/images";
import { auth, db } from "@/firebase/config";
import * as Google from "expo-auth-session/providers/google";
import { Link, useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { GoogleAuthProvider, signInWithCredential, signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
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

WebBrowser.maybeCompleteAuthSession();

const SignIn = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ✅ Google Sign-In Request (Expo SDK 51+)
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: "399467459791-gr0h5h59nr9iv562656m0ci0u9r343a5.apps.googleusercontent.com",
  });

  useEffect(() => {
    const handleGoogleResponse = async () => {
      if (response?.type === "success") {
        const { id_token } = response.params;
        const credential = GoogleAuthProvider.credential(id_token);

        try {
          const result = await signInWithCredential(auth, credential);
          const user = result.user;

          // 🔹 Simpan user baru ke Firestore jika belum ada
          const userRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userRef);
          if (!userSnap.exists()) {
            await setDoc(userRef, {
              uid: user.uid,
              name: user.displayName || "User",
              email: user.email,
              createdAt: new Date().toISOString(),
              provider: "google",
            });
          }

          Alert.alert("Sukses", `Selamat datang, ${user.displayName || "User"}!`);
          router.push("/"); // Pindah ke halaman utama
        } catch (error: any) {
          Alert.alert("Error", error.message);
        }
      }
    };

    handleGoogleResponse();
  }, [response]);

  // --- Login Email/Password ---
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Peringatan", "Email dan Password wajib diisi!");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert("Sukses", "Login berhasil!");
      router.push("/"); // Ganti dengan halaman setelah login
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <SafeAreaView className="h-full bg-white">
      <ScrollView
        contentContainerStyle={{
          height: "100%",
        }}
      >
        {/* Gambar Header */}
        <Image source={images.newYork} className="w-full h-2/6" />

        <View className="p-10 bg-white rounded-t-[40px] flex flex-col gap-6 -mt-10">
          {/* Input Email */}
          <View className="flex flex-col w-full gap-2 text-start">
            <Text className="text-base text-start font-rubik text-black-300">Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              placeholder="example@mail.com"
              className="px-6 py-4 border-b focus:border-primary-300 border-black-100 rounded-xl"
            />
          </View>

          {/* Input Password */}
          <View className="flex flex-col w-full gap-2 text-start">
            <Text className="text-base text-start font-rubik text-black-300">Password</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder="Input Password"
              className="px-6 py-4 border-b focus:border-primary-300 border-black-100 rounded-xl"
            />
          </View>

          {/* Tombol Sign In */}
          <TouchableOpacity
            onPress={handleLogin}
            className="w-full py-4 mt-8 rounded-full shadow-md bg-primary-300 shadow-zinc-300"
          >
            <Text className="text-lg text-center text-white font-rubik">
              Sign In
            </Text>
          </TouchableOpacity>

          {/* Divider */}
          <View className="flex flex-row items-center justify-center my-4">
            <View className="h-[1px] bg-gray-200 flex-1" />
            <Text className="px-3 text-gray-400">or</Text>
            <View className="h-[1px] bg-gray-200 flex-1" />
          </View>

          {/* Tombol Login dengan Google */}
          <TouchableOpacity
            onPress={() => promptAsync()}
            disabled={!request}
            className="flex flex-row items-center justify-center gap-2 py-4 rounded-full border border-gray-300"
          >
            <Image
              source={{
                uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png",
              }}
              style={{ width: 20, height: 20 }}
            />
            <Text className="text-lg font-rubik text-gray-700">Sign in with Google</Text>
          </TouchableOpacity>

          {/* Link ke Register */}
          <Text className="text-base text-center font-rubik text-black-300 mt-4">
            Don’t have an account?{" "}
            <Link href={"/sign-up"} className="font-bold text-primary-300">
              Sign Up
            </Link>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
