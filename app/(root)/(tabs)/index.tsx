import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Card, FeaturedCard } from "@/components/Cards";
import Filters from "@/components/Filters";
import Search from "@/components/Search";

import icons from "@/constants/icons";
import images from "@/constants/images";

import { auth, db } from "@/firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  doc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";

import * as Location from "expo-location";
import { useRouter } from "expo-router";

/* ================= TYPES ================= */

interface Property {
  id: string;
  title: string;
  city: string;
  fullAddress: string;
  price: number;
  type: string;
  listingStatus: "available" | "reserved" | "sold";
  status: string;
  coverImage?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
}

/* ================= HELPERS ================= */

// Haversine formula
const getDistanceInKm = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/* ================= SCREEN ================= */

const Home = () => {
  type PropertyCategory = "All" | "House" | "Villa" | "Apartment";
  const [activeCategory, setActiveCategory] =
  useState<PropertyCategory>("All");
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("User");
  const [photoURL, setPhotoURL] = useState<string | null>(null);

  const [properties, setProperties] = useState<Property[]>([]);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const filteredProperties = useMemo(() => {
    let data = [...properties];

    // 🔍 SEARCH
    if (searchText.trim()) {
      const q = searchText.toLowerCase();
      data = data.filter((p) => {
        const priceMatch = String(p.price).includes(q);
        return (
          p.title?.toLowerCase().includes(q) ||
          p.city?.toLowerCase().includes(q) ||
          p.fullAddress?.toLowerCase().includes(q) ||
          priceMatch
        );
      });
    }

    // 🏠 CATEGORY FILTER
    if (activeCategory !== "All") {
      data = data.filter(
        (p) => p.type === activeCategory
      );
    }

    return data;
  }, [properties, searchText, activeCategory]);
  const recommendedProperties = filteredProperties.slice(0, 10);

  /* ================= AUTH + USER ================= */

  useEffect(() => {
    let unsubscribeUser: (() => void) | undefined;
    let unsubscribeProperties: (() => void) | undefined;

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.replace("/sign-in");
        return;
      }

      // 🔹 USER PROFILE REALTIME
      const userRef = doc(db, "users", user.uid);
      unsubscribeUser = onSnapshot(userRef, (snap) => {
        if (!snap.exists()) return;
        const data = snap.data();
        setName(data.name || "User");
        setPhotoURL(data.photoURL || null);
      });

      // 🔹 PROPERTIES REALTIME
      const q = query(
        collection(db, "properties"),
        where("listingStatus", "in", ["available", "sold", "reserved"])

      );

      unsubscribeProperties = onSnapshot(q, (snap) => {
        const list: Property[] = snap.docs.map((d) => ({
          ...(d.data() as Omit<Property, "id">),
          id: d.id,
        }));
        setProperties(list);
        setLoading(false);
      });
    });

    return () => {
      unsubscribeAuth();
      unsubscribeUser && unsubscribeUser();
      unsubscribeProperties && unsubscribeProperties();
    };
  }, []);

  /* ================= LOCATION ================= */

  useEffect(() => {
    const getUserLocation = async () => {
      const { status } =
        await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") return;

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setUserLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
    };

    getUserLocation();
  }, []);

  /* ================= NEAR YOU ================= */

  const nearYouProperties =
    userLocation && properties.length > 0
      ? properties
          .filter((p) => p.location)
          .map((p) => ({
            ...p,
            distance: getDistanceInKm(
              userLocation.latitude,
              userLocation.longitude,
              p.location!.latitude,
              p.location!.longitude
            ),
          }))
          .sort((a, b) => a.distance - b.distance)
          .slice(0, 5)
      : [];

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <View className="items-center justify-center flex-1">
        <ActivityIndicator size="large" color="#3369bd" />
      </View>
    );
  }

  /* ================= UI ================= */

  return (
    <SafeAreaView className="h-full bg-white">
      <FlatList
          data={recommendedProperties}
          numColumns={2}
          keyExtractor={(item) => item.id}
          columnWrapperClassName="flex gap-5 px-5"
          contentContainerClassName="pb-10"
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <Card
              title={item.title}
              city={item.city}
              price={item.price}
              image={item.coverImage}
              type={item.type}
              listingStatus={item.listingStatus}
              onPress={() => router.push(`/properties/${item.id}`)}
            />
          )}
        
        ListHeaderComponent={
          <View className="px-5">
            {/* HEADER */}
            <View className="flex-row items-center justify-between mt-5">
              <View className="flex-row">
                <Image
                  source={
                    photoURL ? { uri: photoURL } : images.avatar
                  }
                  className="rounded-full size-12"
                />
                <View className="ml-2">
                  <Text className="text-xs text-black-100">
                    Welcome
                  </Text>
                  <Text className="text-base font-rubik-medium">
                    {name}
                  </Text>
                </View>
              </View>
              <Image source={icons.person} className="size-6" />
            </View>

            <Search
              value={searchText}
              onChangeText={setSearchText}
            />

            {/* NEAR YOU */}
            {nearYouProperties.length > 0 && (
              <View className="my-5">
                <Text className="text-xl font-rubik-bold">
                  Near You
                </Text>

                <FlatList
                  data={nearYouProperties}
                  keyExtractor={(item) => item.id}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerClassName="flex gap-5 mt-4"
                  renderItem={({ item }) => (
                    <FeaturedCard
                      title={item.title}
                      city={item.city}
                      image={item.coverImage}
                      onPress={() =>
                        router.push(`/properties/${item.id}`)
                      }
                    />
                  )}
                />
                
              </View>
            )}

            {/* RECOMMENDATION */}
            <View className="mt-5">
              <Text className="text-xl font-rubik-bold">
                Our Recommendation
              </Text>
              <Filters
                active={activeCategory}
                onChange={(category) =>
                  setActiveCategory(category as PropertyCategory)
                }
              />
            </View>
            
          </View>
        }
         ListFooterComponent={
          <View className="px-5 mt-5 mb-10">
            {filteredProperties.length > 8 ? (
              
              <TouchableOpacity
                onPress={() => router.push("/explore")}
                className="mx-5 mt-6 py-4 rounded-full bg-primary-300"
              >
                <Text className="text-center text-white font-rubik-bold text-base">
                  Cari Lebih Banyak Lagi
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>
          }
        
      />
      
    </SafeAreaView>
  );
};

export default Home;
