import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import icons from "@/constants/icons";

import { Card, FeaturedCard } from "@/components/Cards";
import Filters from "@/components/Filters";
import Search from "@/components/Search";
import images from "@/constants/images";
import { auth } from "@/firebase/config";
import { getUserName } from "@/src/hooks/getUserData";
import { useRouter } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";


const Home = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState<string>("User");
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        // 🚪 Jika belum login, paksa ke halaman login
        router.replace("/sign-in");
        return;
      }
      const fetchedName = await getUserName();
      setName(fetchedName);
      setLoading(false);
    });
    return () => unsubscribe();
  },[])

  if (loading) {
    return (
      <View className="items-center justify-center flex-1">
        <ActivityIndicator size="large" color="#3369bd" />
      </View>
    );
  }

  return (
    <SafeAreaView className="h-full bg-white">
      <FlatList
        data={[1, 2, 3, 4]}
        renderItem={({ item }) => (
          <Card onPress={() => router.push("/properties/1")} />
        )}
        numColumns={2}
        keyExtractor={(item) => item.toString()}
        contentContainerClassName="pb-32"
        columnWrapperClassName="flex gap-5 px-5"
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View className="px-5">
            {/* headr */}
            <View className="flex flex-row items-center justify-between mt-5">
              <View className="flex flex-row">
                <Image
                  source={images.avatar}
                  className="rounded-full size-12"
                />

                <View className="flex flex-col items-start justify-center ml-2">
                  <Text className="text-xs font-rubik text-black-100">
                    Email {name}
                  </Text>
                  <Text className="text-base font-rubik-medium text-black-300">
                    {name}
                  </Text>
                </View>
              </View>
              <Image source={icons.person} className="size-6" />
            </View>

            {/* search */}
            <Search />

            {/* card carousel */}
            <View className="my-5">
              <View className="flex flex-row items-center justify-between">
                <Text className="text-xl font-rubik-bold text-black-300">
                  Featured
                </Text>
                <TouchableOpacity>
                  <Text className="text-base font-rubik-bold text-primary-300">
                    See all
                  </Text>
                </TouchableOpacity>
              </View>
              <FlatList
                data={[1, 2, 3, 4]}
                renderItem={({ item }) => (
                  <FeaturedCard onPress={() => router.push("/properties/1")} />
                )}
                keyExtractor={(item) => item.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerClassName="flex gap-5 mt-5"
              />
            </View>

            {/* main card  */}
            <View className="mt-5">
              <View className="flex flex-row items-center justify-between">
                <Text className="text-xl font-rubik-bold text-black-300">
                  Our Recommendation
                </Text>
                <TouchableOpacity>
                  <Text className="text-base font-rubik-bold text-primary-300">
                    See all
                  </Text>
                </TouchableOpacity>
              </View>
              <Filters />
            </View>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default Home;
