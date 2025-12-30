import FormField from "@/components/FormField";
import SelectField from "@/components/SelectField";
import * as ImagePicker from "expo-image-picker";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Section } from "@/components/Section";
import {
  AreaUnit,
  Property,
  PropertyStatus,
  PropertyType,
} from "@/constants/property";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";

// ================= SCREEN =================
export default function AddPropertyScreen() {
  const [form, setForm] = useState<Property>({
    title: "",
    type: "House",
    status: "Draft",
    price: 0,
    bedrooms: 1,
    bathrooms: 1,
    area: 0,
    areaUnit: "m2",
    description: "",
    coverImage: "",
    gallery: [],
    location: {
      city: "",
      address: "",
      latitude: 0,
      longitude: 0,
    },
  });

  const handleSubmit = () => {
    if (!form.title || !form.location.city || !form.location.address) {
      Alert.alert("Validation", "Please fill all required fields");
      return;
    }

    console.log("ADD PROPERTY PAYLOAD:", form);
    Alert.alert("Success", "Property saved as draft");
  };

  // ================= IMAGE PICKER =================
  const requestPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission required", "Please allow gallery access");
      return false;
    }
    return true;
  };

  const pickCoverImage = async () => {
    Alert.alert("Cover Image", "Choose source", [
      {
        text: "Camera",
        onPress: async () => {
          const permission = await ImagePicker.requestCameraPermissionsAsync();
          if (permission.status !== "granted") {
            Alert.alert("Permission required", "Camera access needed");
            return;
          }

          const result = await ImagePicker.launchCameraAsync({
            quality: 0.7,
            allowsEditing: true,
            aspect: [4, 3],
          });

          if (!result.canceled) {
            setForm({ ...form, coverImage: result.assets[0].uri });
          }
        },
      },
      {
        text: "Gallery",
        onPress: async () => {
          const allowed = await requestPermission();
          if (!allowed) return;

          const result = await ImagePicker.launchImageLibraryAsync({
            quality: 0.7,
            allowsEditing: true,
            aspect: [4, 3],
          });

          if (!result.canceled) {
            setForm({ ...form, coverImage: result.assets[0].uri });
          }
        },
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const pickGalleryImages = async () => {
    const allowed = await requestPermission();
    if (!allowed) return;

    if (form.gallery.length >= 5) {
      Alert.alert("Limit reached", "Maximum 5 images allowed");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: true,
      quality: 0.7,
      selectionLimit: 5 - form.gallery.length,
    });

    if (!result.canceled) {
      const uris = result.assets.map((asset) => asset.uri);

      setForm({
        ...form,
        gallery: [...form.gallery, ...uris].slice(0, 5),
      });
    }
  };

  return (
    <View style={styles.wrapper}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Property</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* BASIC INFO */}
        <Section title="Basic Information">
          <FormField
            label="Property Title"
            value={form.title}
            onChangeText={(v) => setForm({ ...form, title: v })}
          />

          <SelectField
            label="Property Type"
            value={form.type}
            onValueChange={(v) => setForm({ ...form, type: v as PropertyType })}
            items={[
              { label: "House", value: "House" },
              { label: "Apartment", value: "Apartment" },
              { label: "Villa", value: "Villa" },
            ]}
          />

          <SelectField
            label="Property Status"
            value={form.status}
            onValueChange={(v) =>
              setForm({ ...form, status: v as PropertyStatus })
            }
            items={[
              { label: "Draft", value: "draft" },
              { label: "Available", value: "available" },
              { label: "Reserved", value: "reserved" },
              { label: "Sold", value: "sold" },
            ]}
          />
        </Section>

        {/* PRICE */}
        <Section title="Price">
          <FormField
            label="Price"
            value={String(form.price)}
            keyboardType="numeric"
            onChangeText={(v) => setForm({ ...form, price: Number(v) })}
          />
        </Section>

        {/* SPECIFICATION */}
        <Section title="Specification">
          <FormField
            label="Bedrooms"
            value={String(form.bedrooms)}
            keyboardType="numeric"
            onChangeText={(v) => setForm({ ...form, bedrooms: Number(v) })}
          />

          <FormField
            label="Bathrooms"
            value={String(form.bathrooms)}
            keyboardType="numeric"
            onChangeText={(v) => setForm({ ...form, bathrooms: Number(v) })}
          />

          <FormField
            label="Area"
            value={String(form.area)}
            keyboardType="numeric"
            onChangeText={(v) => setForm({ ...form, area: Number(v) })}
          />

          <SelectField
            label="Area Unit"
            value={form.areaUnit}
            onValueChange={(v) => setForm({ ...form, areaUnit: v as AreaUnit })}
            items={[
              { label: "m²", value: "m2" },
              { label: "sqft", value: "sqft" },
            ]}
          />
        </Section>

        {/* DESCRIPTION */}
        <Section title="Description">
          <FormField
            label="Property Description"
            value={form.description}
            multiline
            onChangeText={(v) => setForm({ ...form, description: v })}
          />
        </Section>

        {/* LOCATION */}
        <Section title="Location">
          <FormField
            label="City"
            value={form.location.city}
            onChangeText={(v) =>
              setForm({
                ...form,
                location: { ...form.location, city: v },
              })
            }
          />

          <FormField
            label="Full Address"
            value={form.location.address}
            onChangeText={(v) =>
              setForm({
                ...form,
                location: { ...form.location, address: v },
              })
            }
          />

          <FormField
            label="Latitude"
            value={String(form.location.latitude)}
            keyboardType="numeric"
            onChangeText={(v) =>
              setForm({
                ...form,
                location: {
                  ...form.location,
                  latitude: Number(v),
                },
              })
            }
          />

          <FormField
            label="Longitude"
            value={String(form.location.longitude)}
            keyboardType="numeric"
            onChangeText={(v) =>
              setForm({
                ...form,
                location: {
                  ...form.location,
                  longitude: Number(v),
                },
              })
            }
          />
        </Section>

        {/* MEDIA */}
        <Section title="Media">
          <TouchableOpacity style={styles.mediaBtn} onPress={pickCoverImage}>
            <Text style={styles.mediaText}>
              {form.coverImage ? "Change Cover Image" : "Upload Cover Image"}
            </Text>
          </TouchableOpacity>

          {form.coverImage && (
            <Image
              source={{ uri: form.coverImage }}
              style={{ height: 180, borderRadius: 12, marginTop: 12 }}
            />
          )}
        </Section>

        {/* Gallery */}
        <Section title="Gallery">
          <TouchableOpacity style={styles.mediaBtn} onPress={pickGalleryImages}>
            <Text style={styles.mediaText}>
              Upload Gallery Image ({form.gallery.length}/5)
            </Text>
          </TouchableOpacity>

          <View
            style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 12 }}
          >
            {form.gallery.map((uri, index) => (
              <Image
                key={index}
                source={{ uri }}
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 10,
                  marginRight: 8,
                  marginBottom: 8,
                }}
              />
            ))}
          </View>
        </Section>

        {/* SUBMIT */}
        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
          <Text style={styles.submitText}>Save Property</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

// ================= STYLES =================
const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    height: 60,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  mediaBtn: {
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
  },
  mediaText: {
    fontWeight: "600",
  },
  submitBtn: {
    marginTop: 10,
    backgroundColor: "#2563EB",
    paddingVertical: 16,
    borderRadius: 12,
  },
  submitText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "700",
    fontSize: 16,
  },
});
