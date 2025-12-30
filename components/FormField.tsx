import { StyleSheet, Text, TextInput, View } from "react-native";

interface FormFieldProps {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  keyboardType?: "default" | "numeric";
  multiline?: boolean;
}

export default function FormField({
  label,
  value,
  onChangeText,
  keyboardType = "default",
  multiline = false,
}: FormFieldProps) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && styles.textarea]}
        value={value}
        keyboardType={keyboardType}
        multiline={multiline}
        onChangeText={onChangeText}
      />
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
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
  },
  textarea: {
    height: 100,
    textAlignVertical: "top",
  },
});
