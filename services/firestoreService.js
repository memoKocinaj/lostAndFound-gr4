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

