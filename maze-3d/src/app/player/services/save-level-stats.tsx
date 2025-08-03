"use client";
import { db } from "@/firebase";
import {
  addDoc,
  collection,
  doc,
  updateDoc,
  increment,
} from "firebase/firestore";
import type { PlayerStatsDTO } from "../dto/type";
import { useMutation } from "@tanstack/react-query";

/**
 * Saves a player's game session stats to the 'player-stats' collection.
 * @param {PlayerStatsDTO} stats - The player stats object.
 */
export const savePlayerStats = async (stats: PlayerStatsDTO) => {
  try {
    const statsCollection = collection(db, "player-stats");
    const docRef = await addDoc(statsCollection, stats);
    console.log("Player stats stored with ID: ", docRef.id);
  } catch (error) {
    console.error("Error saving player stats: ", error);
  }
};

/**
 * Updates the like count for a specific maze level.
 * It safely increments or decrements the count on the server.
 * @param {string} levelId - The ID of the maze level document to update.
 * @param {boolean} liked - True to increment the like count, false to decrement.
 */
export const updateLevelLikeCount = async (
  levelId: string,
  liked: boolean
) => {
  // Ensure levelId is a non-empty string before proceeding
  if (!levelId) {
    console.error("Error: Invalid levelId provided.");
    return;
  }

  try {
    const levelDocRef = doc(db, "maze-levels", levelId);
    console.log(levelDocRef)
    // Use the Firestore 'increment' utility for safe, atomic updates.
    // This prevents race conditions if multiple users like a level at once.
    await updateDoc(levelDocRef, {
      likes: increment(liked ? 1 : -1),
    });

    console.log(`Successfully updated like count for level: ${levelId}`);
  } catch (error) {
    console.error(`Error updating like count for level ${levelId}:`, error);
  }
};

const useMutationLikeSaveStats=()=>{
 return  useMutation({
    mutationFn: async(stats:PlayerStatsDTO)=>await savePlayerStats(stats),
    onSuccess:()=>{
      console.log("Like count updated successfully");
    },
    onError:()=>{
      console.log("Error updating like count");
    }
  })
}

export const useSaveLikeCount = ()=>{
  return  useMutation({
    mutationFn: async(stats:{levelId:string,liked:boolean})=>await updateLevelLikeCount(stats.levelId,stats.liked),
    onSuccess:()=>{
      console.log("Like count updated successfully");
    },
    onError:()=>{
      console.log("Error updating like count");
    }
  })
}

export default useMutationLikeSaveStats