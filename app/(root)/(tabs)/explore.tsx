import { Card } from "@/components/Cards";
import Search from "@/components/Search";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList, Modal, Text, TextInput, TouchableOpacity, View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { db } from "@/firebase/config";
import {
  collection,
  onSnapshot,
  query
} from "firebase/firestore";

import * as Location from "expo-location";

/* ================= TYPES ================= */

interface Property {
  id: string;
  title: string;
  description: string;
  city: string;
  fullAddress: string;
  type: string;
  price: number;
  area: number;
  bedrooms: number;
  bathrooms: number;

  listingStatus: "available" | "reserved" | "sold";

  coverImage?: string;

  location?: {
    latitude: number;
    longitude: number;
  };
}

/* ================= HELPERS ================= */

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

  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
};

/* ================= SCREEN ================= */

export default function Explore() {
  const ITEMS_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState<Property[]>([]);
  const [filterStatus, setFilterStatus] = useState<
  "available" | "reserved" | "sold" | null
  >(null);
  const [searchText, setSearchText] = useState("");

  const [sortOption, setSortOption] = useState<
    "priceAsc" | "priceDesc" | "areaAsc" | "areaDesc" | "distance" | null
  >(null);

  const [filterBedrooms, setFilterBedrooms] = useState<number | null>(null);
  const [filterBathrooms, setFilterBathrooms] = useState<number | null>(null);
  const [filterArea, setFilterArea] = useState<number | null>(null);

  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  /* ================= LOAD DATA ================= */

  useEffect(() => {
    const q = query(collection(db, "properties"));

    const unsubscribe = onSnapshot(q, (snap) => {
      const list: Property[] = snap.docs.map((d) => ({
        ...(d.data() as Omit<Property, "id">),
        id: d.id,
      }));

      setProperties(list);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  /* ================= LOCATION ================= */

  useEffect(() => {
    (async () => {
      const { status } =
        await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      const loc = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
    })();
  }, []);

  /* ================= FILTER LOGIC ================= */

  const filteredProperties = useMemo(() => {
    let data = [...properties];

    /* 🔍 SEARCH */
    if (searchText.trim()) {
      const q = searchText.toLowerCase();

      data = data.filter((p) => {
        const priceMatch = String(p.price).includes(q);

        return (
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.city.toLowerCase().includes(q) ||
          p.fullAddress.toLowerCase().includes(q) ||
          priceMatch
        );
      });
    }
    /* 📌 FILTER STATUS */
    if (filterStatus) {
      data = data.filter(
        (p) => p.listingStatus === filterStatus
      );
    
    }
    
    /* 🛏 FILTER INPUT USER (APPROXIMATE) */
    if (filterBedrooms !== null) {
      data = data.sort(
        (a, b) =>
          Math.abs(a.bedrooms - filterBedrooms) -
          Math.abs(b.bedrooms - filterBedrooms)
      );
    }

    if (filterBathrooms !== null) {
      data = data.sort(
        (a, b) =>
          Math.abs(a.bathrooms - filterBathrooms) -
          Math.abs(b.bathrooms - filterBathrooms)
      );
    }

    if (filterArea !== null) {
      data = data.sort(
        (a, b) =>
          Math.abs(a.area - filterArea) -
          Math.abs(b.area - filterArea)
      );
    }

    /* 🔁 SORT SYSTEM */
    if (sortOption === "priceAsc") {
      data.sort((a, b) => a.price - b.price);
    }

    if (sortOption === "priceDesc") {
      data.sort((a, b) => b.price - a.price);
    }

    if (sortOption === "areaAsc") {
      data.sort((a, b) => a.area - b.area);
    }

    if (sortOption === "areaDesc") {
      data.sort((a, b) => b.area - a.area);
    }

    if (sortOption === "distance" && userLocation) {
      data = data
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
        .sort((a: any, b: any) => a.distance - b.distance);
    }

    return data;
  }, [
    properties,
    searchText,
    sortOption,
    filterBedrooms,
    filterBathrooms,
    filterArea,
    userLocation,
    filterStatus,
  ]);
  const totalPages = Math.ceil(
    filteredProperties.length / ITEMS_PER_PAGE
  );
  const paginatedProperties = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return filteredProperties.slice(start, end);
  }, [filteredProperties, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchText, sortOption, filterStatus, filterBedrooms, filterBathrooms, filterArea]);
  /* ================= UI ================= */

  if (loading) {
    return (
      <View className="items-center justify-center flex-1">
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <SafeAreaView className="h-full bg-white">
      <FlatList
        data={paginatedProperties}
        keyExtractor={(item) => item.id}
        numColumns={2}
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
        contentContainerClassName="pb-32"
        columnWrapperClassName="flex gap-5 px-5"
        ListHeaderComponent={
          <View className="px-5">
            <Search
              value={searchText}
              onChangeText={setSearchText}
              onOpenFilter={() => setFilterModalVisible(true)}
            />

            <View className="mt-5">
              <Text className="text-xl font-rubik-bold">
                Found {filteredProperties.length} Properties
              </Text>
            </View>
          </View>
        }
        ListFooterComponent={
          totalPages > 1 ? (
            <View className="flex-row justify-center items-center gap-3 my-6">
              {Array.from({ length: totalPages }).map((_, index) => {
                const page = index + 1;
                return (
                  <TouchableOpacity
                    key={page}
                    onPress={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded-full ${
                      page === currentPage
                        ? "bg-primary-300"
                        : "bg-gray-200"
                    }`}
                  >
                    <Text
                      className={`font-rubik-bold ${
                        page === currentPage
                          ? "text-white"
                          : "text-black-300"
                      }`}
                    >
                      {page}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : null
        }
      />
      {/* ================= FILTER MODAL ================= */}
      <Modal
        visible={filterModalVisible}
        transparent
        animationType="slide"
      >
        <View className="flex-1 justify-end bg-black/40">
          <View className="bg-white rounded-t-2xl p-5">

            <Text className="text-xl font-rubik-bold mb-4">
              Filter Properties
            </Text>

            {/* ===== SORT OPTIONS ===== */}
            <Text className="font-rubik-medium mb-2">Sort By</Text>

            {[
              { label: "Price: Low to High", value: "priceAsc" },
              { label: "Price: High to Low", value: "priceDesc" },
              { label: "Area: Small to Large", value: "areaAsc" },
              { label: "Area: Large to Small", value: "areaDesc" },
              { label: "Nearest Location", value: "distance" },
            ].map((opt) => (
              <TouchableOpacity
                key={opt.value}
                onPress={() => {
                  setSortOption(opt.value as any);
                  setFilterModalVisible(false);
                }}
                className="py-3"
              >
                <Text className="text-base">{opt.label}</Text>
              </TouchableOpacity>
            ))}

            {/* ===== USER INPUT FILTER ===== */}
            <View className="mt-4">
              <Text className="font-rubik-medium mb-2">
                Custom Filters
              </Text>

              <TextInput
                placeholder="Bedrooms (e.g. 2)"
                keyboardType="numeric"
                className="border rounded-lg px-3 py-2 mb-2"
                onChangeText={(v) =>
                  setFilterBedrooms(v ? Number(v) : null)
                }
              />

              <TextInput
                placeholder="Bathrooms (e.g. 1)"
                keyboardType="numeric"
                className="border rounded-lg px-3 py-2 mb-2"
                onChangeText={(v) =>
                  setFilterBathrooms(v ? Number(v) : null)
                }
              />

              <TextInput
                placeholder="Area (e.g. 200 m²)"
                keyboardType="numeric"
                className="border rounded-lg px-3 py-2"
                onChangeText={(v) =>
                  setFilterArea(v ? Number(v) : null)
                }
              />
            </View>
            {/* ===== STATUS FILTER ===== */}
            <Text className="font-rubik-medium mt-4 mb-2">
              Property Status
            </Text>

            {[
              { label: "Available", value: "available" },
              { label: "Reserved", value: "reserved" },
              { label: "Sold", value: "sold" },
            ].map((status) => (
              <TouchableOpacity
                key={status.value}
                onPress={() =>
                  setFilterStatus(status.value as any)
                }
                className="py-2 flex-row items-center justify-between"
              >
                <Text>{status.label}</Text>

                {filterStatus === status.value && (
                  <Text className="text-primary-300 font-bold">
                    ✓
                  </Text>
                )}
              </TouchableOpacity>
            ))}
            {/* ===== ACTIONS ===== */}
            <View className="flex-row justify-between mt-6">
              <TouchableOpacity
                onPress={() => {
                  setSortOption(null);
                  setFilterBedrooms(null);
                  setFilterBathrooms(null);
                  setFilterArea(null);
                  setFilterStatus(null);
                  setFilterModalVisible(false);
                }}
              >
                <Text className="text-red-500">Reset</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setFilterModalVisible(false)}
              >
                <Text className="text-primary-300 font-rubik-bold">
                  Apply
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}
