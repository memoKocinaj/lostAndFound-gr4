import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getCountFromServer,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  where,
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
export const getAllFoundItems = async () => {
  try {
    const q = query(collection(db, "foundItems"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
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
export const getUserFoundItemsCount = async (userId) => {
  try {
    const q = query(
      collection(db, "foundItems"),
      where("userId", "==", userId)
    );
    const querySnapshot = await getCountFromServer(q);
    return querySnapshot.data().count;
  } catch (error) {
    console.error("❌ Firestore ERROR getting found items count:", error);
    throw error;
  }
};

export const getPotentialMatchesCount = async (userId) => {
  try {
    const userLostItems = await getUserLostItems(userId);

    if (userLostItems.length === 0) return 0;

    let totalMatches = 0;

    for (const lostItem of userLostItems) {
      const q = query(
        collection(db, "foundItems"),
        where("name", ">=", lostItem.name.toLowerCase()),
        where("name", "<=", lostItem.name.toLowerCase() + "\uf8ff")
      );

      const querySnapshot = await getDocs(q);
      totalMatches += querySnapshot.size;
    }

    return totalMatches;
  } catch (error) {
    console.error("❌ Firestore ERROR getting matches count:", error);
    return 0;
  }
};

export const getUserFoundItems = async (userId) => {
  try {
    console.log("🔍 Firestore: Getting found items for user:", userId);
    const q = query(
      collection(db, "foundItems"),
      where("userId", "==", userId)
    );
    const querySnapshot = await getDocs(q);
    console.log("📄 Firestore: Found items snapshot size:", querySnapshot.size);
    const items = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log("✅ Firestore: User's found items:", items.length);
    return items;
  } catch (error) {
    console.error("❌ Firestore ERROR getting user's found items:", error);
    throw error;
  }
};

export const getPotentialMatches = async (userId) => {
  try {
    console.log("🔄 Finding potential matches for user:", userId);

    const userLostItems = await getUserLostItems(userId);

    if (userLostItems.length === 0) {
      console.log("📭 No lost items to match");
      return [];
    }

    const allFoundItems = await getAllFoundItems();

    const matches = [];

    userLostItems.forEach((lostItem) => {
      allFoundItems.forEach((foundItem) => {
        if (foundItem.userId === userId) return;

        const matchScore = calculateMatchScore(lostItem, foundItem);

        if (matchScore > 0.3) {
          matches.push({
            lostItem,
            foundItem,
            matchScore,
            reason: getMatchReason(lostItem, foundItem, matchScore),
          });
        }
      });
    });

    matches.sort((a, b) => b.matchScore - a.matchScore);

    console.log(`✅ Found ${matches.length} potential matches`);
    return matches;
  } catch (error) {
    console.error("❌ Error finding matches:", error);
    throw error;
  }
};

export const getPotentialMatchesOptimized = async (userId) => {
  try {
    console.log("🔄 Finding potential matches for user:", userId);

    const userLostItems = await getUserLostItems(userId);

    if (userLostItems.length === 0) {
      console.log("📭 No lost items to match");
      return [];
    }

    const allFoundItems = await getAllFoundItems();

    const otherUsersFoundItems = allFoundItems.filter(
      (item) => item.userId !== userId
    );

    console.log(
      `🔍 Found ${otherUsersFoundItems.length} items from other users`
    );

    const matches = [];

    userLostItems.forEach((lostItem) => {
      otherUsersFoundItems.forEach((foundItem) => {
        const matchScore = calculateMatchScore(lostItem, foundItem);

        if (matchScore > 0.3) {
          matches.push({
            lostItem,
            foundItem,
            matchScore,
            reason: getMatchReason(lostItem, foundItem, matchScore),
          });
        }
      });
    });

    matches.sort((a, b) => b.matchScore - a.matchScore);

    console.log(`✅ Found ${matches.length} potential matches`);
    return matches;
  } catch (error) {
    console.error("❌ Error finding matches:", error);
    throw error;
  }
};

const calculateMatchScore = (lostItem, foundItem) => {
  let score = 0;
  let factors = 0;

  if (lostItem.name && foundItem.name) {
    const nameSimilarity = stringSimilarity(
      lostItem.name.toLowerCase(),
      foundItem.name.toLowerCase()
    );
    score += nameSimilarity * 0.4;
    factors += 0.4;
  }

  if (lostItem.category === foundItem.category) {
    score += 0.3;
    factors += 0.3;
  }

  if (lostItem.lastSeenLocation && foundItem.location) {
    const locationMatch = checkLocationSimilarity(
      lostItem.lastSeenLocation,
      foundItem.location
    );
    score += locationMatch * 0.3;
    factors += 0.3;
  }

  return factors > 0 ? score / factors : 0;
};

const stringSimilarity = (str1, str2) => {
  const words1 = str1.split(" ");
  const words2 = str2.split(" ");

  let matches = 0;
  words1.forEach((word1) => {
    if (
      words2.some((word2) => word2.includes(word1) || word1.includes(word2))
    ) {
      matches++;
    }
  });

  return matches / Math.max(words1.length, words2.length);
};

const checkLocationSimilarity = (loc1, loc2) => {
  if (!loc1 || !loc2) return 0;

  const loc1Lower = loc1.toLowerCase();
  const loc2Lower = loc2.toLowerCase();

  if (loc1Lower === loc2Lower) return 1;

  const words1 = loc1Lower.split(/[ ,]+/);
  const words2 = loc2Lower.split(/[ ,]+/);

  const commonWords = words1.filter(
    (word) => word.length > 3 && words2.includes(word)
  );

  return commonWords.length / Math.max(words1.length, words2.length);
};

const getMatchReason = (lostItem, foundItem, score) => {
  const reasons = [];

  if (stringSimilarity(lostItem.name, foundItem.name) > 0.6) {
    reasons.push("similar name");
  }

  if (lostItem.category === foundItem.category) {
    reasons.push("same category");
  }

  if (
    checkLocationSimilarity(lostItem.lastSeenLocation, foundItem.location) > 0.5
  ) {
    reasons.push("nearby location");
  }

  return reasons.join(" + ") || "potential match";
};
