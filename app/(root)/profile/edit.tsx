import { auth, db } from "@/firebase/config";
import { updateUserProfile } from "@/src/services/user.service";
import * as ImagePicker from "expo-image-picker";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

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

import icons from "@/constants/icons";
import images from "@/constants/images";
import { router } from "expo-router";

const EditProfile = () => {
  const [photo, setPhoto] = useState<string | null>(null);
  const [name, setName] = useState("Wisnu");
  const [phone, setPhone] = useState("08xxxxxxxxxx");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const loadUser = async () => {
        if (!auth.currentUser) return;
        setEmail(auth.currentUser.email || "");
        const snap = await getDoc(
        doc(db, "users", auth.currentUser.uid)
        );

        if (snap.exists()) {
        const data = snap.data();
        setName(data.name || "");
        setPhone(data.phone || "");
        setPhoto(data.photoURL || null);
        }
    };

  loadUser();
}, []);

  /* ================= IMAGE PICKER ================= */

  const handleChangePhoto = () => {
    Alert.alert("Ganti Foto Profile", "Pilih sumber foto", [
        {
        text: "Kamera",
        onPress: openCamera,
        },
        {
        text: "Galeri",
        onPress: openGallery,
        },
        {
        text: "Batal",
        style: "cancel",
        },
    ]);
    };

    const openCamera = async () => {
        const { status } =
            await ImagePicker.requestCameraPermissionsAsync();

        if (status !== "granted") {
            Alert.alert(
            "Permission ditolak",
            "Akses kamera diperlukan untuk mengambil foto"
            );
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
        });

        if (!result.canceled) {
            setPhoto(result.assets[0].uri);
        }
        };

    const openGallery = async () => {
        const { status } =
            await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== "granted") {
            Alert.alert(
            "Permission ditolak",
            "Akses galeri diperlukan untuk memilih foto"
            );
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
        });

        if (!result.canceled) {
            setPhoto(result.assets[0].uri);
        }
        };


    


  /* ================= SUBMIT ================= */

    const handleSubmit = async () => {
    try {
        await updateUserProfile({
        name,
        phone,
        photoUri: photo,
        });

        Alert.alert(
        "Success",
        "Profile berhasil diubah",
        [{ text: "OK", onPress: () => router.back() }]
        );
    } catch (error: any) {
        Alert.alert(
        "Error",
        error.message || "Gagal mengubah profile"
        );
    }
    };


  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerClassName="px-5 pb-10">
        {/* HEADER */}
        <View className="flex-row items-center mt-4 mb-6">
          <TouchableOpacity onPress={() => router.back()}>
            <Image source={icons.backArrow} className="size-6" />
          </TouchableOpacity>
          <Text className="ml-4 text-xl font-rubik-bold">
            Edit Profile
          </Text>
        </View>

        {/* PHOTO */}
        <View className="items-center mb-8">
          <Image
            source={
              photo
                ? { uri: photo }
                : images.avatar
            }
            className="w-32 h-32 rounded-full"
          />

          <TouchableOpacity
            onPress={handleChangePhoto}
            className="mt-3 px-4 py-2 rounded-full bg-primary-300"
          >
            <Text className="text-white font-rubik-bold">
              Ganti Foto
            </Text>
          </TouchableOpacity>
        </View>

        {/* FORM */}
        <View className="gap-4">
          {/* NAME */}
          <View>
            <Text className="mb-1 font-rubik text-black-300">
              Nama
            </Text>
            <TextInput
              value={name}
              onChangeText={setName}
              className="px-4 py-3 border rounded-xl border-black-100"
            />
          </View>

          {/* PHONE */}
          <View>
            <Text className="mb-1 font-rubik text-black-300">
              Nomor HP
            </Text>
            <TextInput
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              className="px-4 py-3 border rounded-xl border-black-100"
            />
          </View>

          {/* EMAIL */}
          <View>
            <Text className="mb-1 font-rubik text-black-300">
              Email
            </Text>
            <TextInput
              value={email}
              editable={false}
              className="px-4 py-3 border rounded-xl border-black-100 bg-gray-100"
            />
          </View>

          {/* PASSWORD */}
          <View>
            <Text className="mb-1 font-rubik text-black-300">
              Password
            </Text>
            <TextInput
              value="********"
              editable={false}
              secureTextEntry
              className="px-4 py-3 border rounded-xl border-black-100 bg-gray-100"
            />
          </View>
        </View>

        {/* SUBMIT */}
        <TouchableOpacity
          onPress={handleSubmit}
          className="mt-8 py-4 rounded-full bg-primary-300"
        >
          <Text className="text-center text-white font-rubik-bold text-lg">
            Ubah Profile
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditProfile;
