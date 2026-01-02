import React from "react";
import { ScrollView, Text, TouchableOpacity } from "react-native";

import { categories } from "@/constants/data";

interface FiltersProps {
  active: string;
  onChange: (value: string) => void;
}

const Filters = ({ active, onChange }: FiltersProps) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="mt-3 mb-2"
    >
      {categories.map((item, index) => {
        const isActive = active === item.category;

        return (
          <TouchableOpacity
            key={index}
            onPress={() => onChange(item.category)}
            className={`mr-4 px-4 py-2 rounded-full ${
              isActive
                ? "bg-primary-300"
                : "bg-primary-100 border border-primary-200"
            }`}
          >
            <Text
              className={`text-sm ${
                isActive
                  ? "text-white font-rubik-bold"
                  : "text-black-300 font-rubik"
              }`}
            >
              {item.title}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

export default Filters;
