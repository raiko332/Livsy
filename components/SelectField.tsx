import { Picker } from "@react-native-picker/picker";
import { StyleSheet, Text, View } from "react-native";

interface SelectItem {
  label: string;
  value: string;
}

interface SelectFieldProps {
  label: string;
  value: string;
  items: SelectItem[];
  onValueChange: (v: string) => void;
}

export default function SelectField({
  label,
  value,
  items,
  onValueChange,
}: SelectFieldProps) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.pickerWrapper}>
        <Picker selectedValue={value} onValueChange={onValueChange}>
          {items.map((item) => (
            <Picker.Item
              key={item.value}
              label={item.label}
              value={item.value}
            />
          ))}
        </Picker>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 14,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
  },
});
