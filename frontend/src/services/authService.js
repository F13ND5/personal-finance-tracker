// src/services/authService.js
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  PhoneAuthProvider,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
} from "firebase/firestore";
import { auth } from "../firebaseConfig.js";

const db = getFirestore();

// Sign up user
export const signUp = async (email, password, userData) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Get the user ID
    const userId = userCredential.user.uid;

    // Create a user document in Firestore
    await setDoc(doc(db, "users", userId), {
      fullName: userData.fullName,
      dateOfBirth: userData.dateOfBirth,
      phoneNumber: userData.phoneNumber,
      address: userData.address,
      occupation: userData.occupation,
      profileImage: userData.profileImage,
      email: email, // Store email as well
    });

    return userCredential;
  } catch (error) {
    throw error;
  }
};

// Sign in user
export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

// Sign out user
export const logOut = async () => {
  await signOut(auth);
};

export const getUserDataByEmail = async (email) => {
  try {
    // Create a reference to the users collection
    const usersCollectionRef = collection(db, "users");

    // Create a query to find the user by their email
    const q = query(usersCollectionRef, where("email", "==", email));

    // Get the documents matching the query
    const querySnapshot = await getDocs(q);

    // Check if any user documents were found
    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0]; // Get the first document found
      return userDoc.data(); // Returns the user data
    } else {
      throw new Error("User not found");
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

// Enable 2FA for a user
export const checkTwoFactorEnabled = async (email) => {
  try {
    // Create a reference to the users collection
    const usersCollectionRef = collection(db, 'users');
    
    // Create a query to find the user by their email
    const q = query(usersCollectionRef, where("email", "==", email));
    
    // Get the documents matching the query
    const querySnapshot = await getDocs(q);
    
    // Check if any user documents were found
    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0]; // Get the first document found
      return userDoc.data().twoFactorEnabled || false; // Check if 2FA is enabled
    } else {
      throw new Error("User not found.");
    }
  } catch (error) {
    console.error("Error checking 2FA status:", error);
    throw error; // Propagate the error
  }
};

// Verify 2FA code
export const sendOtp = async (phoneNumber) => {
  try {
    const appVerifier = window.recaptchaVerifier; // Ensure you've set up reCAPTCHA
    const confirmationResult = await auth.signInWithPhoneNumber(
      phoneNumber,
      appVerifier
    );
    return confirmationResult; // This will return the confirmationResult object needed for verification
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw error; // Propagate the error
  }
};

// Verify 2FA code
export const verifyOtpService = async (verificationId, otp) => {
  try {
    const credential = PhoneAuthProvider.credential(verificationId, otp);
    const userCredential = await auth.signInWithCredential(credential);
    return userCredential; // This will return the user credential object
  } catch (error) {
    console.error("Error verifying OTP:", error);
    throw error; // Propagate the error
  }
};

export { auth };
