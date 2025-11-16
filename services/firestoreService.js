import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
  getDocs,
  orderBy,
  serverTimestamp,
  getCountFromServer,
} from "firebase/firestore";
import { db } from "../config/firebase";

export const addLostItem = async (item, userId) => {
  try {
    const docRef = await addDoc(collection(db, "lostItems"), {
      name: item.name,
      description: item.description,
      lastSeenLocation: item.lastSeenLocation,
      category: item.category,
      date: item.date,
      type: "lost",
      userId: userId,
      imageUri: item.imageUri || null,
      locationCoords: item.locationCoords || null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    throw error;
  }
};
export const addFoundItem = async (item, userId) => {
  try {
    const docRef = await addDoc(collection(db, "foundItems"), {
      name: item.name,
      location: item.location,
      category: item.category,
      date: item.date,
      type: "found",
      userId: userId,
      imageUri: item.imageUri || null,
      locationCoords: item.locationCoords || null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    throw error;
  }
};
export const getUserLostItems = async (userId) => {
  try {
    console.log("🔍 Firestore: Getting items for user:", userId);

    const q = query(
      collection(db, "lostItems"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    console.log("📄 Firestore: Query snapshot size:", querySnapshot.size);

    const items = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log("✅ Firestore: Total items found:", items.length);
    return items;
  } catch (error) {
    console.error("❌ Firestore ERROR:", error);
    throw error;
  }
};





export const deleteItem = async (collectionName, itemId) => {
  try {
    await deleteDoc(doc(db, collectionName, itemId));
  } catch (error) {
    throw error;
  }
};

export const getUserLostItemsCount = async (userId) => {
  try {
    const q = query(collection(db, "lostItems"), where("userId", "==", userId));
    const querySnapshot = await getCountFromServer(q);
    return querySnapshot.data().count;
  } catch (error) {
    console.error("❌ Firestore ERROR getting lost items count:", error);
    throw error;
  }
};
