import images from "@/constants/images";
import { Image, Text, TouchableOpacity, View } from "react-native";

/* ================= TYPES ================= */

export type ListingStatus = "available" | "reserved" | "sold";

interface BaseCardProps {
  title: string;
  city: string;
  price?: number;
  type?: string;
  listingStatus?: ListingStatus; // ✅ BARU
  image?: string;
  onPress?: () => void;
}

/* ================= STATUS CONFIG ================= */

const STATUS_CONFIG: Record<
  ListingStatus,
  { label: string; bg: string; text: string }
> = {
  available: {
    label: "Available",
    bg: "bg-green-100",
    text: "text-green-600",
  },
  reserved: {
    label: "Reserved",
    bg: "bg-yellow-100",
    text: "text-yellow-600",
  },
  sold: {
    label: "Sold",
    bg: "bg-red-100",
    text: "text-red-600",
  },
};

/* ================= FEATURED CARD ================= */

export const FeaturedCard = ({
  title,
  city,
  price,
  type,
  listingStatus,
  image,
  onPress,
}: BaseCardProps) => {
  const status = listingStatus
    ? STATUS_CONFIG[listingStatus]
    : null;

  return (
    <TouchableOpacity
      onPress={onPress}
      className="relative flex flex-col items-start w-60 h-80"
    >
      <Image
        source={image ? { uri: image } : images.japan}
        className="size-full rounded-2xl"
      />

      <Image
        source={images.cardGradient}
        className="absolute bottom-0 size-full rounded-2xl"
      />

      {/* TYPE */}
      {type && (
        <View className="absolute top-5 left-5 bg-white/90 px-3 py-1.5 rounded-full">
          <Text className="text-xs font-rubik-bold text-primary-300">
            {type}
          </Text>
        </View>
      )}

      {/* STATUS */}
      {status && (
        <View
          className={`absolute top-5 right-5 px-3 py-1.5 rounded-full ${status.bg}`}
        >
          <Text className={`text-xs font-rubik-bold ${status.text}`}>
            {status.label}
          </Text>
        </View>
      )}

      <View className="absolute flex flex-col items-start bottom-5 inset-x-5">
        <Text
          className="text-xl text-white font-rubik-extrabold"
          numberOfLines={1}
        >
          {title}
        </Text>
        <Text className="text-base text-white font-rubik" numberOfLines={1}>
          {city}
        </Text>

        {price !== undefined && (
          <Text className="mt-1 text-base text-white font-rubik-bold">
            Rp {price.toLocaleString("id-ID")}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

/* ================= NORMAL CARD ================= */

export const Card = ({
  title,
  city,
  price,
  type,
  listingStatus,
  image,
  onPress,
}: BaseCardProps) => {
  const status = listingStatus
    ? STATUS_CONFIG[listingStatus]
    : null;

  return (
    <TouchableOpacity
      className="relative flex-1 w-full px-3 py-4 mt-4 bg-white rounded-lg shadow-lg shadow-black-100/70"
      onPress={onPress}
    >
      {/* TYPE */}
      {type && (
        <View className="absolute z-50 top-5 left-5 bg-white/90 px-2 py-1 rounded-full">
          <Text className="text-xs font-rubik-bold text-primary-300">
            {type}
          </Text>
        </View>
      )}

      {/* STATUS */}
      {status && (
        <View
          className={`absolute z-50 top-5 right-5 px-2 py-1 rounded-full ${status.bg}`}
        >
          <Text className={`text-xs font-rubik-bold ${status.text}`}>
            {status.label}
          </Text>
        </View>
      )}

      <Image
        source={image ? { uri: image } : images.japan}
        className="w-full h-40 rounded-lg"
      />

      <View className="flex flex-col mt-2">
        <Text className="text-base font-rubik-bold text-black-300">
          {title}
        </Text>
        <Text className="text-xs font-rubik text-black-100">
          {city}
        </Text>

        {price !== undefined && (
          <Text className="mt-2 text-base font-rubik-bold text-primary-300">
            Rp {price.toLocaleString("id-ID")}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};
