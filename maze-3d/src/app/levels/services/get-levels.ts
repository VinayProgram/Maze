// src/services/get-levels.ts

import { db } from "@/firebase";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  getCountFromServer,
  where,
  type DocumentData,
  QueryDocumentSnapshot,
  QueryOrderByConstraint,
} from "firebase/firestore";
import type { SaveLevelDTO } from "./dto/save-level";
import { useQuery } from "@tanstack/react-query";

// Pagination Response Interface (Unchanged)
interface PaginatedMazeLevels {
  mazeLevels: SaveLevelDTO[];
  lastDoc: QueryDocumentSnapshot<DocumentData> | null;
  totalCount: number;
}

const PAGE_SIZE = 9; // Changed to 9 for a nice 3x3 grid

export const getMazeLevels = async (
  lastDoc: QueryDocumentSnapshot<DocumentData> | null = null,
  searchTerm: string = "" // Add searchTerm parameter
): Promise<PaginatedMazeLevels> => {
  try {
    const mazeLevelsRef = collection(db, "maze-levels");
    const sanitizedSearchTerm = searchTerm.trim();

    // --- Base query for counting total documents based on search ---
    const countQuery = sanitizedSearchTerm
      ? query(
          mazeLevelsRef,
          where("title", ">=", sanitizedSearchTerm),
          where("title", "<=", sanitizedSearchTerm + "\uf8ff")
        )
      : mazeLevelsRef;

    const countSnapshot = await getCountFromServer(countQuery);
    const totalCount = countSnapshot.data().count;

    // --- Build the paginated and filtered query ---
    const queryConstraints = [
      orderBy("title"),
      limit(PAGE_SIZE)
    ];

    if (sanitizedSearchTerm) {
      queryConstraints.unshift(where("title", "<=", sanitizedSearchTerm + "\uf8ff") as unknown as QueryOrderByConstraint);
      queryConstraints.unshift(where("title", ">=", sanitizedSearchTerm) as unknown as QueryOrderByConstraint);
    }
    
    if (lastDoc) {
      queryConstraints.push(startAfter(lastDoc) as unknown as QueryOrderByConstraint);
    }
    
    const q = query(mazeLevelsRef, ...queryConstraints);

    const snapshot = await getDocs(q);
    const mazeLevels: SaveLevelDTO[] = snapshot.docs.map((doc) => ({
      ...(doc.data() as SaveLevelDTO),
      id: doc.id, // Ensure document ID is included
    }));

    const newLastDoc =
      snapshot.docs.length > 0
        ? snapshot.docs[snapshot.docs.length - 1]
        : null;

    return {
      mazeLevels,
      lastDoc: newLastDoc,
      totalCount,
    };
  } catch (error) {
    console.error("Error fetching maze levels:", error);
    return { mazeLevels: [], lastDoc: null, totalCount: 0 };
  }
};

// --- Updated React Query Hook ---
export const useMazeLevels = (
  lastDoc: QueryDocumentSnapshot<DocumentData> | null = null,
  searchTerm: string = ""
) =>
  useQuery({
    // Add searchTerm to the queryKey to trigger refetches on change
    queryKey: ["maze-levels", lastDoc, searchTerm],
    queryFn: async () => await getMazeLevels(lastDoc, searchTerm),
    refetchOnWindowFocus: false,
    staleTime: 60 * 60 * 1000, // 1 hour
  });