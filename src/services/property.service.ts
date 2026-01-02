import { db } from "@/firebase/config";
import {
  uploadCoverImage,
  uploadGalleryImages,
} from "@/src/services/upload.service";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";

/* CREATE PROPERTY */
export const createProperty = async (payload: any) => {
  const coverImageUrl = await uploadCoverImage(
    payload.coverImageUri,
    payload.ownerId
  );

  const galleryImageUrls = await uploadGalleryImages(
    payload.galleryImageUris,
    payload.ownerId
  );

  await addDoc(collection(db, "properties"), {
    title: payload.title,
    type: payload.type,
    listingStatus: payload.listingStatus.toLowerCase(),
    price: payload.price,

    bedrooms: payload.bedrooms,
    bathrooms: payload.bathrooms,
    area: payload.area,
    areaUnit: payload.areaUnit,

    description: payload.description,

    city: payload.city,
    fullAddress: payload.fullAddress,
    location: {
      latitude: payload.latitude,
      longitude: payload.longitude,
    },

    coverImage: coverImageUrl,
    galleryImages: galleryImageUrls,

    ownerId: payload.ownerId,

    isActive: true,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

/* GET MY PROPERTIES */
export const getMyProperties = async (userId: string) => {
  const q = query(
    collection(db, "properties"),
    where("ownerId", "==", userId)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => {
    const data = doc.data();

    return {
      id: doc.id,
      title: data.title,
      city: data.city,
      price: data.price,
      type: data.type,
      status: (data.listingStatus || "draft").toLowerCase(),
      coverImage: data.coverImage,
    };
  });
};

/* UPDATE STATUS */
export const updatePropertyStatus = async (
  propertyId: string,
  status: string
) => {
  const ref = doc(db, "properties", propertyId);

  await updateDoc(ref, {
    listingStatus: status,
    updatedAt: serverTimestamp(),
  });
};

export const getAllProperties = async () => {
  const q = query(
    collection(db, "properties"),
    where("isActive", "==", true)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => {
    const data = doc.data();

    return {
      id: doc.id,
      title: data.title,
      city: data.city,
      price: data.price,
      type: data.type,
      status: (data.listingStatus || "draft").toLowerCase(),
      coverImage: data.coverImage,
    };
  });
};



export const getPropertyById = async (propertyId: string) => {
  const ref = doc(db, "properties", propertyId);
  const snapshot = await getDoc(ref);

  if (!snapshot.exists()) {
    throw new Error("Property not found");
  }

  const data = snapshot.data();

  return {
    id: snapshot.id,
    title: data.title,
    type: data.type,
    listingStatus: data.listingStatus,
    price: data.price,

    bedrooms: data.bedrooms,
    bathrooms: data.bathrooms,
    area: data.area,
    areaUnit: data.areaUnit,

    description: data.description,

    city: data.city,
    fullAddress: data.fullAddress,
    location: data.location,

    coverImage: data.coverImage,
    galleryImages: data.galleryImages || [],

    ownerName: data.ownerName,
    ownerPhone: data.ownerPhone,
  };
};


export const subscribeAllProperties = (
  callback: (data: any[]) => void
) => {
  const q = query(
    collection(db, "properties"),
    where("isActive", "==", true)
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const properties = snapshot.docs.map((doc) => {
      const data = doc.data();

      return {
        id: doc.id,
        title: data.title,
        city: data.city,
        price: data.price,
        type: data.type,
        status: (data.listingStatus || "draft").toLowerCase(),
        coverImage: data.coverImage,
      };
    });

    callback(properties);
  });

  return unsubscribe; // penting untuk cleanup
};


export const updateProperty = async (
  propertyId: string,
  payload: {
    title: string;
    type: string;
    listingStatus: string;
    price: number;

    bedrooms: number;
    bathrooms: number;
    area: number;
    areaUnit: string;

    description: string;

    city: string;
    fullAddress: string;
    latitude: number;
    longitude: number;

    coverImageUri: string;
    galleryImageUris: string[];
    ownerId: string;
  }
) => {
  try {
    const ref = doc(db, "properties", propertyId);

    // upload ulang cover jika URI lokal
    let coverImageUrl = payload.coverImageUri;
    if (payload.coverImageUri.startsWith("file://")) {
      coverImageUrl = await uploadCoverImage(
        payload.coverImageUri,
        payload.ownerId
      );
    }

    // upload gallery baru (jika ada yang lokal)
    const galleryImageUrls = await uploadGalleryImages(
      payload.galleryImageUris,
      payload.ownerId
    );

    await updateDoc(ref, {
      title: payload.title,
      type: payload.type,
      listingStatus: payload.listingStatus,
      price: payload.price,

      bedrooms: payload.bedrooms,
      bathrooms: payload.bathrooms,
      area: payload.area,
      areaUnit: payload.areaUnit,

      description: payload.description,

      city: payload.city,
      fullAddress: payload.fullAddress,
      location: {
        latitude: payload.latitude,
        longitude: payload.longitude,
      },

      coverImage: coverImageUrl,
      galleryImages: galleryImageUrls,

      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Update Property Error:", error);
    throw error;
  }
};


export const deleteProperty = async (propertyId: string) => {
  try {
    const ref = doc(db, "properties", propertyId);
    await deleteDoc(ref);
  } catch (error) {
    console.error("Delete Property Error:", error);
    throw error;
  }
};


export const subscribeMyProperties = (
  userId: string,
  callback: (data: any[]) => void
) => {
  const q = query(
    collection(db, "properties"),
    where("ownerId", "==", userId),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map((doc) => {
      const rawStatus = doc.data().listingStatus || "draft";

      return {
        id: doc.id,
        title: doc.data().title,
        city: doc.data().city,
        price: doc.data().price,
        type: doc.data().type,
        status: rawStatus.toLowerCase(), // 🔥 FIX
        coverImage: doc.data().coverImage || null, // ✅ TAMBAH INI
      };
    });

    callback(data);
  });
};
