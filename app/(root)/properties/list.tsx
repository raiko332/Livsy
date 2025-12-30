import icons from "@/constants/icons";
import images from "@/constants/images";
import { STATUS_CONFIG } from "@/constants/property";
import { router } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  Image,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

/* ================= TYPES ================= */

interface Property {
  id: number;
  title: string;
  city: string;
  price: string;
  type: string;
  status: keyof typeof STATUS_CONFIG;
}

interface CardProps {
  item: Property;
  onEditStatus: (item: Property) => void;
}

/* ================= CARD ================= */

const Card = ({ item, onEditStatus }: CardProps) => {
  const status = STATUS_CONFIG[item.status];

  return (
    <View className="relative w-1/2 px-3 py-4 mt-4 bg-white rounded-lg shadow-lg shadow-black-100/70">
      {/* TYPE */}
      <View className="absolute z-50 flex-row items-center px-2 py-1 rounded-full top-5 right-5 bg-white/90">
        <Text className="text-xs font-rubik-bold text-primary-300">
          {item.type}
        </Text>
      </View>

      <Image source={images.japan} className="w-full h-40 rounded-lg" />

      <View className="mt-2">
        <Text className="text-base font-rubik-bold text-black-300">
          {item.title}
        </Text>
        <Text className="text-xs font-rubik text-black-100">{item.city}</Text>

        {/* STATUS + EDIT */}
        <View className="flex-row items-center gap-2 mt-2">
          <View className={`px-3 py-1 rounded-full ${status.bg}`}>
            <Text className={`text-xs font-rubik-bold ${status.text}`}>
              {status.label}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => onEditStatus(item)}
            className="p-1 bg-gray-100 rounded-full"
          >
            <Image source={icons.edit} className="w-4 h-4" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

/* ================= SCREEN ================= */

export default function ListProperty() {
  const [properties, setProperties] = useState<Property[]>([
    {
      id: 1,
      title: "Japan Villa",
      city: "Gianyar",
      price: "Rp200.000.000",
      type: "House",
      status: "draft",
    },
    {
      id: 2,
      title: "Ubud House",
      city: "Ubud",
      price: "Rp350.000.000",
      type: "Villa",
      status: "available",
    },
    {
      id: 3,
      title: "Denpasar Apartment",
      city: "Denpasar",
      price: "Rp150.000.000",
      type: "Apartment",
      status: "reserved",
    },
  ]);

  const [selected, setSelected] = useState<Property | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleEditStatus = (item: Property) => {
    setSelected(item);
    setModalVisible(true);
  };

  const handleChangeStatus = (status: Property["status"]) => {
    if (!selected) return;

    setProperties((prev) =>
      prev.map((item) => (item.id === selected.id ? { ...item, status } : item))
    );

    setModalVisible(false);
    setSelected(null);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <FlatList
        data={properties}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        renderItem={({ item }) => (
          <Card item={item} onEditStatus={handleEditStatus} />
        )}
        columnWrapperClassName="flex px-5 gap-5"
        contentContainerClassName="pb-32"
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View className="px-5 mt-5">
            <View className="flex-row items-center justify-between">
              <TouchableOpacity
                onPress={() => router.back()}
                className="items-center justify-center rounded-full bg-primary-200 size-11"
              >
                <Image source={icons.backArrow} className="size-5" />
              </TouchableOpacity>

              <Text className="text-xl font-rubik-bold text-black-300">
                My Properties
              </Text>
            </View>
          </View>
        }
      />

      {/* ================= MODAL ================= */}
      <Modal transparent animationType="slide" visible={modalVisible}>
        <View className="justify-end flex-1 bg-black/40">
          <View className="p-5 bg-white rounded-t-2xl">
            <Text className="mb-4 text-lg font-rubik-bold">
              Change Property Status
            </Text>

            {Object.entries(STATUS_CONFIG).map(([key, value]) => (
              <TouchableOpacity
                key={key}
                onPress={() => handleChangeStatus(key as Property["status"])}
                className="py-3"
              >
                <Text className={`text-base font-rubik ${value.text}`}>
                  {value.label}
                </Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              className="items-center py-3 mt-4"
            >
              <Text className="text-red-500 font-rubik-bold">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
