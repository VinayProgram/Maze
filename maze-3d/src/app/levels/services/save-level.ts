"use client";
import { db, storage } from "@/firebase";
import {
  addDoc,
  collection,
} from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import type { SaveLevelDTO } from "./dto/save-level";


export const saveMazeLevel = async (MazeLevel:SaveLevelDTO) => {
  try {
    const MazeLevelsCollection = collection(db, "maze-levels");
    const docRef = await addDoc(MazeLevelsCollection, MazeLevel);
    console.log("MazeLevel stored with ID: ", docRef.id);
  } catch (error) {
    console.error("Error saving MazeLevel: ", error);
  }
};

export const SingleMazeLevelImage = (image: File | null): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (image) {
      const storageRef = ref(storage, `MazeLevels/${image.name}`);
      const uploadTask = uploadBytesResumable(storageRef, image);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          console.error("Error uploading image:", error);
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref)
            .then((downloadURL) => {
              resolve(downloadURL);
            })
            .catch((error) => {
              console.error("Error getting download URL:", error);
              reject(error);
            });
        }
      );
    } else {
      reject(new Error("No image provided"));
    }
  });
};




