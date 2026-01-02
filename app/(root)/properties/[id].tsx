import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Image,
  Linking,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { auth, db } from "@/firebase/config";
import { doc, onSnapshot } from "firebase/firestore";

import MapPicker from "@/components/MapPicker";
import icons from "@/constants/icons";
import images from "@/constants/images";

/* ================= TYPES ================= */

interface Property {
  id: string;
  title: string;
  type: string;
  price: number;

  bedrooms: number;
  bathrooms: number;
  area: number;
  areaUnit: string;

  description: string;

  city: string;
  fullAddress: string;
  location: {
    latitude: number;
    longitude: number;
  };

  coverImage: string;
  galleryImages: string[];

  ownerId: string;
}

interface Owner {
  name: string;
  phone: string;
  photoURL?: string;
}

/* ================= SCREEN ================= */

export default function PropertyDetail() {
  const [buyerName, setBuyerName] = useState<string>("Pengguna Livsy");
  const { id } = useLocalSearchParams<{ id: string }>();
  const windowHeight = Dimensions.get("window").height;

  const [property, setProperty] = useState<Property | null>(null);
  const [owner, setOwner] = useState<Owner | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) return;

    const ref = doc(db, "users", auth.currentUser.uid);

    const unsubscribe = onSnapshot(ref, (snap) => {
      if (!snap.exists()) return;

      const data = snap.data();
      setBuyerName(data.name || "Pengguna Livsy");
    });

    return () => unsubscribe();
  }, []);

  /* ================= REALTIME PROPERTY ================= */

  useEffect(() => {
    if (!id) return;

    const ref = doc(db, "properties", id);

    const unsubscribe = onSnapshot(ref, (snap) => {
      if (!snap.exists()) {
        router.back();
        return;
      }

      setProperty({
        ...(snap.data() as Omit<Property, "id">),
        id: snap.id,
      });

      setLoading(false);
    });

    return () => unsubscribe();
  }, [id]);

  /* ================= REALTIME OWNER ================= */

  useEffect(() => {
    if (!property?.ownerId) return;

    const ref = doc(db, "users", property.ownerId);

    const unsubscribe = onSnapshot(ref, (snap) => {
      if (!snap.exists()) return;

      const data = snap.data();

      setOwner({
        name: data.name,
        phone: data.phone,
        photoURL: data.photoURL,
      });
    });

    return () => unsubscribe();
  }, [property?.ownerId]);

  /* ================= BUY PROPERTY (WHATSAPP) ================= */

  const handleBuyProperty = async () => {
    if (!property || !owner) {
      Alert.alert("Error", "Data properti belum siap");
      return;
    }

    if (!owner.phone) {
      Alert.alert(
        "Error",
        "Nomor WhatsApp pemilik tidak tersedia"
      );
      return;
    }

    const ownerName = owner.name || "Pemilik Properti";

    const phone = owner.phone.startsWith("0")
      ? `62${owner.phone.slice(1)}`
      : owner.phone;

    const message = `
Hai saya ${buyerName} pengguna aplikasi Livsy,
maaf mengganggu ${ownerName},
saya berminat untuk membeli ${property.title}
yang beralamat di ${property.fullAddress},
mohon petunjuknya ya!
    `.trim();

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(
      message
    )}`;

    const supported = await Linking.canOpenURL(url);

    if (!supported) {
      Alert.alert(
        "Error",
        "WhatsApp tidak tersedia di perangkat ini"
      );
      return;
    }

    Linking.openURL(url);
  };

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!property) return null;

  /* ================= UI ================= */

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-44"
      >
        {/* COVER */}
        <View className="relative w-full" style={{ height: windowHeight / 2 }}>
          <Image
            source={{ uri: property.coverImage }}
            className="size-full"
            resizeMode="cover"
          />

          <Image
            source={images.whiteGradient}
            className="absolute top-0 w-full"
          />

          <View
            className="absolute inset-x-7"
            style={{ top: Platform.OS === "ios" ? 70 : 20 }}
          >
            <TouchableOpacity
              onPress={() => router.back()}
              className="size-11 bg-primary-200 rounded-full items-center justify-center"
            >
              <Image source={icons.backArrow} className="size-5" />
            </TouchableOpacity>
          </View>
        </View>

        <View className="px-5 mt-7 gap-2">
          {/* TITLE */}
          <Text className="text-2xl font-rubik-extrabold">
            {property.title}
          </Text>

          <View className="px-4 py-2 rounded-full bg-primary-100 self-start">
            <Text className="text-xs font-rubik-bold text-primary-300">
              {property.type}
            </Text>
          </View>

          {/* SPECS */}
          <View className="flex-row items-center mt-5">
            <Text className="mr-4">{property.bedrooms} Beds</Text>
            <Text className="mr-4">{property.bathrooms} Baths</Text>
            <Text>
              {property.area} {property.areaUnit}
            </Text>
          </View>

          {/* OWNER */}
          <View className="mt-6 border-t pt-6">
            <Text className="text-xl font-rubik-bold">Owner</Text>

            <View className="flex-row items-center mt-4">
              <Image
                source={
                  owner?.photoURL
                    ? { uri: owner.photoURL }
                    : images.avatar
                }
                className="size-14 rounded-full"
              />

              <View className="ml-3">
                <Text className="text-lg font-rubik-bold">
                  {owner?.name || "Unknown"}
                </Text>
                <Text className="text-sm text-black-200">
                  {owner?.phone || "-"}
                </Text>
              </View>
            </View>
          </View>

          {/* OVERVIEW */}
          <View className="mt-7">
            <Text className="text-xl font-rubik-bold">Overview</Text>
            <Text className="mt-2 text-black-200">
              {property.description}
            </Text>
          </View>

          {/* GALLERY */}
          {property.galleryImages?.length > 0 && (
            <View className="mt-7">
              <Text className="text-xl font-rubik-bold">Gallery</Text>
              <FlatList
                data={property.galleryImages}
                horizontal
                keyExtractor={(_, i) => i.toString()}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                  <Image
                    source={{ uri: item }}
                    className="size-40 rounded-xl mr-4"
                  />
                )}
                className="mt-3"
              />
            </View>
          )}

          {/* LOCATION */}
          <View className="mt-7">
            <Text className="text-xl font-rubik-bold">Location</Text>
            <MapPicker
              latitude={property.location.latitude}
              longitude={property.location.longitude}
              onSelectLocation={() => {}}
            />
          </View>
        </View>
      </ScrollView>

      {/* BUY */}
      <View className="absolute bottom-0 w-full bg-white border-t p-7 rounded-t-2xl">
        <Text className="text-xs text-black-200">Price</Text>
        <Text className="text-2xl font-rubik-bold text-primary-300">
          Rp {property.price.toLocaleString("id-ID")}
        </Text>

        <TouchableOpacity
          onPress={handleBuyProperty}
          className="mt-5 py-3 rounded-full bg-primary-300"
        >
          <Text className="text-lg text-center text-white font-rubik-bold">
            Buy Property
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
