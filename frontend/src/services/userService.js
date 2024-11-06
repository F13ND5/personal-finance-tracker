// src/services/userService.js
import { getFirestore, getDoc, doc, setDoc, updateDoc} from "firebase/firestore";
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

export const updateTwoFactorStatus = async (userId, isEnabled) => {
  try {
    const userDocRef = doc(db, "users", userId);
    await updateDoc(userDocRef, { twoFactorEnabled: isEnabled });
  } catch (error) {
    throw new Error("Failed to update 2FA status: " + error.message);
  }
};

// Function to check if 2FA is enabled for a user
export const checkTwoFactorEnabled = async (userId) => {
  try {
    // Reference to the user's document using userId
    const userDocRef = doc(db, "users", userId); 
    const userDoc = await getDoc(userDocRef); // Fetch the document

    if (userDoc.exists()) {
      // Return the 2FA status if it exists, defaulting to false if not
      return userDoc.data().twoFactorEnabled || false;
    } else {
      throw new Error("User not found.");
    }
  } catch (error) {
    console.error("Error checking 2FA status:", error);
    throw error; // Propagate the error for handling in the calling function
  }
};