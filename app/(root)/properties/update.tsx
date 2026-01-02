import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import FormField from "@/components/FormField";
import MapPicker from "@/components/MapPicker";
import { Section } from "@/components/Section";
import SelectField from "@/components/SelectField";

import {
  AreaUnit,
  Property,
  PropertyStatus,
  PropertyType,
} from "@/constants/property";

import { auth } from "@/firebase/config";
import {
  getPropertyById,
  updateProperty,
} from "@/src/services/property.service";

// ================= SCREEN =================
export default function UpdatePropertyScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [loading, setLoading] = useState(false);

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

  // ================= LOAD PROPERTY =================
  useEffect(() => {
    if (!id) return;

    const loadProperty = async () => {
      try {
        const data = await getPropertyById(id);

        setForm({
          title: data.title,
          type: data.type,
          status: data.listingStatus,
          price: data.price,

          bedrooms: data.bedrooms,
          bathrooms: data.bathrooms,
          area: data.area,
          areaUnit: data.areaUnit,

          description: data.description,
          coverImage: data.coverImage,
          gallery: data.galleryImages || [],

          location: {
            city: data.city,
            address: data.fullAddress,
            latitude: data.location.latitude,
            longitude: data.location.longitude,
          },
        });
      } catch {
        Alert.alert("Error", "Failed to load property");
        router.back();
      }
    };

    loadProperty();
  }, [id]);

  // ================= SUBMIT =================
  const handleSubmit = async () => {
    if (!auth.currentUser || !id) return;

    try {
      setLoading(true);

      await updateProperty(id, {
        title: form.title,
        type: form.type,
        listingStatus: form.status,
        price: form.price,

        bedrooms: form.bedrooms,
        bathrooms: form.bathrooms,
        area: form.area,
        areaUnit: form.areaUnit,

        description: form.description,

        city: form.location.city,
        fullAddress: form.location.address,
        latitude: form.location.latitude,
        longitude: form.location.longitude,

        coverImageUri: form.coverImage,
        galleryImageUris: form.gallery,
        ownerId: auth.currentUser.uid,
      });

      Alert.alert("Success", "Property updated successfully");
      router.back();
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to update property");
    } finally {
      setLoading(false);
    }
  };

  // ================= IMAGE PICKER =================
  const pickCoverImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      quality: 0.7,
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!result.canceled) {
      setForm({ ...form, coverImage: result.assets[0].uri });
    }
  };

  const pickGalleryImages = async () => {
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

  // ================= UI =================
  return (
    <View style={styles.wrapper}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Update Property</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <Section title="Basic Information">
          <FormField
            label="Property Title"
            value={form.title}
            onChangeText={(v) => setForm({ ...form, title: v })}
          />

          <SelectField
            label="Property Type"
            value={form.type}
            onValueChange={(v) =>
              setForm({ ...form, type: v as PropertyType })
            }
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

        <Section title="Description">
          <FormField
            label="Property Description"
            value={form.description}
            multiline
            onChangeText={(v) =>
              setForm({ ...form, description: v })
            }
          />
        </Section>

        <Section title="Price">
          <FormField
            label="Price"
            value={String(form.price)}
            keyboardType="numeric"
            onChangeText={(v) =>
              setForm({ ...form, price: Number(v) })
            }
          />
        </Section>

        <Section title="Specification">
          <FormField
            label="Bedrooms"
            value={String(form.bedrooms)}
            keyboardType="numeric"
            onChangeText={(v) =>
              setForm({ ...form, bedrooms: Number(v) })
            }
          />
          <FormField
            label="Bathrooms"
            value={String(form.bathrooms)}
            keyboardType="numeric"
            onChangeText={(v) =>
              setForm({ ...form, bathrooms: Number(v) })
            }
          />
          <FormField
            label="Area"
            value={String(form.area)}
            keyboardType="numeric"
            onChangeText={(v) =>
              setForm({ ...form, area: Number(v) })
            }
          />
          <SelectField
            label="Area Unit"
            value={form.areaUnit}
            onValueChange={(v) =>
              setForm({ ...form, areaUnit: v as AreaUnit })
            }
            items={[
              { label: "m²", value: "m2" },
              { label: "sqft", value: "sqft" },
            ]}
          />
        </Section>

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
          <MapPicker
            latitude={form.location.latitude}
            longitude={form.location.longitude}
            onSelectLocation={(lat, lng) =>
              setForm({
                ...form,
                location: {
                  ...form.location,
                  latitude: lat,
                  longitude: lng,
                },
              })
            }
          />
        </Section>

        <Section title="Media">
          <TouchableOpacity
            style={styles.mediaBtn}
            onPress={pickCoverImage}
          >
            <Text style={styles.mediaText}>Change Cover Image</Text>
          </TouchableOpacity>

          {form.coverImage && (
            <Image
              source={{ uri: form.coverImage }}
              style={{ height: 180, marginTop: 12, borderRadius: 12 }}
            />
          )}

          <TouchableOpacity
            style={[styles.mediaBtn, { marginTop: 12 }]}
            onPress={pickGalleryImages}
          >
            <Text style={styles.mediaText}>
              Upload Gallery ({form.gallery.length}/5)
            </Text>
          </TouchableOpacity>
        </Section>

        <TouchableOpacity
          style={styles.submitBtn}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.submitText}>
            {loading ? "Updating..." : "Update Property"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

// ================= STYLES =================
const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: "#F8FAFC" },
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
  headerTitle: { fontSize: 18, fontWeight: "700" },
  container: { padding: 16, paddingBottom: 40 },
  mediaBtn: {
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
  },
  mediaText: { fontWeight: "600" },
  submitBtn: {
    marginTop: 16,
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
