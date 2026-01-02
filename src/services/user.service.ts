import { auth, db, storage } from "@/firebase/config";
import { updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

/**
 * Upload photo profile ke Firebase Storage
 */
const uploadProfileImage = async (
  uri: string,
  userId: string
): Promise<string> => {
  const response = await fetch(uri);
  const blob = await response.blob();

  const imageRef = ref(
    storage,
    `profile-images/${userId}/avatar.jpg`
    );
  await uploadBytes(imageRef, blob);

  return await getDownloadURL(imageRef);
};

/**
 * Update user profile
 */
export const updateUserProfile = async (payload: {
  name: string;
  phone: string;
  photoUri?: string | null;
}) => {
  if (!auth.currentUser) {
    throw new Error("User not authenticated");
  }

  const userId = auth.currentUser.uid;

  let photoURL: string | undefined;

  // 1️⃣ Upload foto jika diganti
  if (payload.photoUri) {
    photoURL = await uploadProfileImage(payload.photoUri, userId);
  }

  // 2️⃣ Update Firestore
    const updateData: any = {
    name: payload.name,
    phone: payload.phone,
    };

    if (photoURL) {
    updateData.photoURL = photoURL;
    }

    await updateDoc(doc(db, "users", userId), updateData);

  // 3️⃣ Update Auth Profile
  await updateProfile(auth.currentUser, {
    displayName: payload.name,
    ...(photoURL && { photoURL }),
  });
};
