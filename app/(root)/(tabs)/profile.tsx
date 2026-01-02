import {
  Alert,
  Image,
  ImageSourcePropType,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";


import icons from "@/constants/icons";
import images from "@/constants/images";
import { auth, db } from "@/firebase/config";
import { useRouter } from "expo-router";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
interface SettingsItemProp {
  icon: ImageSourcePropType;
  title: string;
  onPress?: () => void;
  textStyle?: string;
  showArrow?: boolean;
}

const SettingsItem = ({
  icon,
  title,
  onPress,
  textStyle,
  showArrow = true,
}: SettingsItemProp) => (
  <TouchableOpacity
    onPress={onPress}
    className="flex flex-row items-center justify-between py-3"
  >
    <View className="flex flex-row items-center gap-3">
      <Image source={icon} className="size-6" />
      <Text className={`text-lg font-rubik-medium text-black-300 ${textStyle}`}>
        {title}
      </Text>
    </View>

    {showArrow && <Image source={icons.rightArrow} className="size-5" />}
  </TouchableOpacity>
);

const Profile = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [photoURL, setPhotoURL] = useState<string | null>(null);
  useEffect(() => {
    if (!auth.currentUser) return;

    setEmail(auth.currentUser.email || "");

    const userRef = doc(db, "users", auth.currentUser.uid);

    const unsubscribe = onSnapshot(userRef, (snap) => {
      if (!snap.exists()) return;

      const data = snap.data();

      setName(data.name || "");
      setPhone(data.phone || "");
      setPhotoURL(data.photoURL || null); // 🔥 FIX FINAL
    });

    return () => unsubscribe();
  }, []);



  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.replace("/sign-in");
        return;
      }

      setUser(currentUser);
      setEmail(currentUser.email || "");
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);


  const handleLogout = async () => {
    try {
      await signOut(auth);
      Alert.alert("Logout berhasil", "Anda telah keluar dari akun");
      router.replace("/sign-in");
    }catch (error:any){
      Alert.alert("Error", error.message)
    }
  }
  return (
    <SafeAreaView className="h-full bg-white">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-32 px-7"
      >
        <View className="flex flex-row items-center justify-between mt-5">
          <Text className="text-xl font-rubik-bold">Profile</Text>
          <Image source={icons.bell} className="size-5" />
        </View>

        <View className="flex flex-row justify-center mt-5">
          <View className="relative flex flex-col items-center mt-5">
            <Image
              source={
                photoURL
                  ? { uri: photoURL }
                  : images.avatar
              }
              className="relative rounded-full size-44"
            />
            <TouchableOpacity
              className="absolute bottom-11 right-2"
              onPress={() => router.push("/profile/edit")}
            >
              <Image source={icons.edit} className="size-9" />
            </TouchableOpacity>

            <Text className="mt-2 text-2xl font-rubik-bold">
              saya {name || "User"}
            </Text>
          </View>
        </View>

        <View className="flex flex-col mt-10">
          <SettingsItem
            icon={icons.wallet}
            title="Sell Properties"
            onPress={() => router.push("/properties/add")}
          />
          <SettingsItem
            icon={icons.shield}
            title="List Properties"
            onPress={() => router.push("/properties/list")}
          />
        </View>

        {/* <View className="flex flex-col pt-5 mt-5 border-t border-primary-200">
          {settings.slice(2).map((item, index) => (
            <SettingsItem key={index} {...item} />
          ))}
        </View> */}

        <View className="flex flex-col pt-5 mt-5 border-t border-primary-200">
          <SettingsItem
            icon={icons.logout}
            title="Logout"
            textStyle="text-danger"
            showArrow={false}
            onPress={handleLogout}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
