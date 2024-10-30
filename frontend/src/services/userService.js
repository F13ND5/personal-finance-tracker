// src/services/userService.js
import { getFirestore, getDoc, doc, setDoc} from "firebase/firestore";
const db = getFirestore();

/**
 * Fetches the user profile data from Firestore.
 * @param {string} userId - The ID of the user.
 * @returns {Promise<Object>} - The user's profile data.
 */
export const getUserProfile = async (userId) => {
  try {
    const userDocRef = doc(db, "users", userId);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      return userDoc.data();
    } else {
      console.warn("No such user profile exists!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

/**
 * Updates the user profile data in Firestore.
 * @param {string} userId - The ID of the user.
 * @param {Object} userData - The updated profile data.
 * @returns {Promise<void>}
 */
export const updateUserProfile = async (userId, userData) => {
  try {
    const userDocRef = doc(db, "users", userId);
    await setDoc(userDocRef, userData, { merge: true });
    console.log("User profile updated successfully");
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};
