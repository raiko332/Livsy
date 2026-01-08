import icons from "@/constants/icons";
import images from "@/constants/images";
import { STATUS_CONFIG } from "@/constants/property";
import { subscribeMyProperties } from "@/src/services/property.service";
import { router } from "expo-router";
import { useEffect, useState } from "react";

import {
  Alert,
  FlatList,
  Image,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import NoResults from "@/components/NoResults";

import { auth } from "@/firebase/config";
import {
  deleteProperty,
  updatePropertyStatus
} from "@/src/services/property.service";

/* ================= TYPES ================= */

interface Property {
  id: string;
  title: string;
  city: string;
  price: number;
  type: string;
  status: keyof typeof STATUS_CONFIG;
  coverImage?: string | null; // ✅ TAMBAH
}

/* ================= CARD ================= */

const Card = ({
  item,
  onEditStatus,
  onUpdate,
  onDelete,
}: {
  item: Property;
  onEditStatus: (item: Property) => void;
  onUpdate: (item: Property) => void;
  onDelete: (item: Property) => void;
}) => {
  const status = STATUS_CONFIG[item.status] || STATUS_CONFIG["draft"];

  return (
    <View className="relative w-1/2 px-3 py-4 mt-4 bg-white rounded-lg shadow-lg shadow-black-100/70">
      <View className="absolute z-50 flex-row items-center px-2 py-1 rounded-full top-5 right-5 bg-white/90">
        <Text className="text-xs font-rubik-bold text-primary-300">
          {item.type}
        </Text>
      </View>

      <Image
        source={
          item.coverImage
            ? { uri: item.coverImage }
            : images.japan
        }
        className="w-full h-40 rounded-lg"
      />

      <View className="mt-2">
        <Text className="text-base font-rubik-bold text-black-300">
          {item.title}
        </Text>
        <Text className="text-xs font-rubik text-black-100">
          {item.city}
        </Text>

        <View className="flex-row items-center gap-2 mt-2">
          <View className={`px-3 py-1 rounded-full ${status.bg}`}>
            <Text className={`text-xs font-rubik-bold ${status.text}`}>
              {status.label}
            </Text>
          </View>

          {/* EDIT STATUS */}
          <TouchableOpacity
            onPress={() => onEditStatus(item)}
            className="p-1 bg-gray-100 rounded-full"
          >
            <Image source={icons.edit} className="w-4 h-4" />
          </TouchableOpacity>

          {/* UPDATE */}
          <TouchableOpacity
            onPress={() => onUpdate(item)}
            className="p-1 bg-gray-100 rounded-full"
          >
            <Image source={icons.updateData} className="w-4 h-4" />
          </TouchableOpacity>

          {/* DELETE */}
          <TouchableOpacity
            onPress={() => onDelete(item)}
            className="p-1 bg-red-100 rounded-full"
          >
            <Image source={icons.deleteData} className="w-4 h-4" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

/* ================= SCREEN ================= */

export default function ListProperty() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [selected, setSelected] = useState<Property | null>(null);
  const [statusModalVisible, setStatusModalVisible] = useState(false);

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedProperty, setSelectedProperty] =
    useState<Property | null>(null);

  /* ================= LOAD DATA ================= */

  useEffect(() => {
    if (!auth.currentUser) return;

    const unsubscribe = subscribeMyProperties(
      auth.currentUser.uid,
      (data) => {
        setProperties(data);
      }
    );

    return () => unsubscribe();
  }, []);

  /* ================= HANDLERS ================= */

  const handleEditStatus = (item: Property) => {
    setSelected(item);
    setStatusModalVisible(true);
  };

  const handleChangeStatus = async (status: Property["status"]) => {
    if (!selected) return;

    try {
      await updatePropertyStatus(selected.id, status);
    } catch {
      Alert.alert("Error", "Failed to update status");
    } finally {
      setStatusModalVisible(false);
      setSelected(null);
    }
  };

  const handleDeletePress = (item: Property) => {
    setSelectedProperty(item);
    setDeleteModalVisible(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedProperty?.id) {
      setDeleteModalVisible(false);
      return;
    }

    try {
      await deleteProperty(selectedProperty.id);

      Alert.alert(
        "Berhasil",
        `Properti "${selectedProperty.title}" berhasil dihapus`
      );
    } catch (error) {
      Alert.alert("Error", "Gagal menghapus properti");
    } finally {
      setDeleteModalVisible(false);
      setSelectedProperty(null); 
    }
  };


  /* ================= UI ================= */

  const sellProperties = properties.filter((p) => p.status === "available");

  return (
    <SafeAreaView className="flex-1 bg-white">
      <FlatList
        data={sellProperties}
        keyExtractor={(item) => item.id}
        numColumns={2}
        ListEmptyComponent={
          <NoResults
            title="No Sell Properties"
            subtitle="You don't have any properties for sale"
          />
        }
        renderItem={({ item }) => (
          <Card
            item={item}
            onEditStatus={handleEditStatus}
            onUpdate={(item) =>
              router.push(`/properties/update?id=${item.id}`)
            }
            onDelete={handleDeletePress}
          />
        )}
        columnWrapperClassName="flex px-5 gap-5"
        contentContainerClassName="pb-32"
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

      {/* ===== STATUS MODAL ===== */}
      <Modal transparent animationType="slide" visible={statusModalVisible}>
        <View className="justify-end flex-1 bg-black/40">
          <View className="p-5 bg-white rounded-t-2xl">
            <Text className="mb-4 text-lg font-rubik-bold">
              Change Property Status
            </Text>

            {Object.entries(STATUS_CONFIG).map(([key, value]) => (
              <TouchableOpacity
                key={key}
                onPress={() =>
                  handleChangeStatus(key as Property["status"])
                }
                className="py-3"
              >
                <Text className={`text-base font-rubik ${value.text}`}>
                  {value.label}
                </Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              onPress={() => setStatusModalVisible(false)}
              className="items-center py-3 mt-4"
            >
              <Text className="text-red-500 font-rubik-bold">
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ===== DELETE MODAL ===== */}
      <Modal transparent animationType="slide" visible={deleteModalVisible}>
        <View className="justify-end flex-1 bg-black/40">
          <View className="p-5 bg-white rounded-t-2xl">
            <Text className="mb-4 text-lg font-rubik-bold">
              Delete Property
            </Text>

            <Text className="mb-6 text-base text-black-200">
              Apakah anda yakin akan menghapus{" "}
              <Text className="font-rubik-bold text-black-300">
                {selectedProperty?.title}
              </Text>
              ?
            </Text>

            <TouchableOpacity
              onPress={handleConfirmDelete}
              className="py-3 mb-3 bg-red-500 rounded-lg"
            >
              <Text className="text-center text-white font-rubik-bold">
                Ya, Hapus
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setDeleteModalVisible(false);
                setSelectedProperty(null);
              }}
              className="items-center py-3"
            >
              <Text className="text-black-300 font-rubik-bold">
                Tidak
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
