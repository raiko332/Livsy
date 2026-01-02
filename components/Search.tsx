import React from "react";
import { Image, TextInput, TouchableOpacity, View } from "react-native";

import icons from "@/constants/icons";

/* ================= TYPES ================= */

export type SortOption =
  | "priceAsc"
  | "priceDesc"
  | "areaAsc"
  | "areaDesc"
  | "distance";

interface SearchProps {
  value: string;
  onChangeText: (text: string) => void;

  /** ketika icon filter ditekan */
  onOpenFilter?: () => void;
}

/* ================= COMPONENT ================= */

const Search = ({
  value,
  onChangeText,
  onOpenFilter,
}: SearchProps) => {
  return (
    <View className="flex flex-row items-center justify-between w-full px-4 rounded-lg bg-accent-100 border border-primary-100 mt-5 py-2">
      {/* SEARCH INPUT */}
      <View className="flex-1 flex flex-row items-center">
        <Image source={icons.search} className="size-5" />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder="Search properties..."
          className="text-sm font-rubik text-black-300 ml-2 flex-1"
        />
      </View>

      {/* FILTER ICON */}
      {onOpenFilter && (
        <TouchableOpacity onPress={onOpenFilter}>
          <Image source={icons.filter} className="size-5" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Search;
