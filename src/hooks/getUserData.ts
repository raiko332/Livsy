// firebase/getUserName.ts
import { auth, db } from "@/firebase/config";
import { doc, getDoc } from "firebase/firestore";

/**
 * Mengambil nama pengguna dari Firestore berdasarkan UID Firebase Auth.
 * Jika kolom name tidak ditemukan, akan fallback ke displayName atau "User".
 */
export const getUserName = async (): Promise<string> => {
  const currentUser = auth.currentUser;

  if (!currentUser) {
    throw new Error("User belum login");
  }

  try {
    const docRef = doc(db, "users", currentUser.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return data?.name || currentUser.displayName || "User";
    } else {
      return currentUser.displayName || "User";
    }
  } catch (error) {
    console.error("Gagal mengambil data Firestore:", error);
    return currentUser.displayName || "User";
  }
};
