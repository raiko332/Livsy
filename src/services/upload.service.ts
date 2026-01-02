import { storage } from "@/firebase/config";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

/**
 * Helper: convert local URI to Blob
 */
const uriToBlob = async (uri: string): Promise<Blob> => {
  const response = await fetch(uri);
  return await response.blob();
};

/**
 * Upload satu gambar (Cover Image)
 * Path: property-images/{userId}/cover_xxx.jpg
 */
export const uploadCoverImage = async (
  uri: string,
  userId: string
): Promise<string> => {
  const blob = await uriToBlob(uri);

  const fileName = `property-images/${userId}/cover_${Date.now()}.jpg`;
  const imageRef = ref(storage, fileName);

  await uploadBytes(imageRef, blob);
  return await getDownloadURL(imageRef);
};

/**
 * Upload banyak gambar (Gallery) - maksimal 5
 * Path: property-images/{userId}/gallery_xxx.jpg
 */
export const uploadGalleryImages = async (
  images: string[],
  userId: string
): Promise<string[]> => {
  if (images.length > 5) {
    throw new Error("Maksimal upload 5 gambar");
  }

  const uploadPromises = images.map(async (uri, index) => {
    const blob = await uriToBlob(uri);

    const fileName = `property-images/${userId}/gallery_${Date.now()}_${index}.jpg`;
    const imageRef = ref(storage, fileName);

    await uploadBytes(imageRef, blob);
    return await getDownloadURL(imageRef);
  });

  return await Promise.all(uploadPromises);
};
