"use client";
import { db, storage } from "@/firebase";
import {
  type DocumentData,
  QueryDocumentSnapshot,
  addDoc,
  collection,
  doc,
  getCountFromServer,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
  startAfter,
  where,
} from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

export const saveMazeLevel = async (MazeLevel:{}) => {
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

export const MazeLevelS_LIMIT = 20; // Number of MazeLevels to fetch per batch



export const getAndDisplayMazeLevels = async (
  lastVisible?: QueryDocumentSnapshot<DocumentData> | null
) => {
  try {
    let MazeLevelsQuery;

    // Build the query to fetch MazeLevels
    if (lastVisible) {
      MazeLevelsQuery = query(
        collection(db, "MazeLevels"),
        orderBy("timestamp", "desc"), // Order MazeLevels by timestamp
        startAfter(lastVisible), // Start after the last document from the previous batch
        limit(MazeLevelS_LIMIT) // Limit the number of MazeLevels to fetch
      );
    } else {
      MazeLevelsQuery = query(
        collection(db, "MazeLevels"),
        orderBy("timestamp", "desc"),
        limit(MazeLevelS_LIMIT)
      );
    }

    // Get the MazeLevel documents
    const querySnapshot = await getDocs(MazeLevelsQuery);

    // Fetch MazeLevels and their like counts
    const MazeLevels = await Promise.all(
      querySnapshot.docs.map(async (doc) => {
        const data = doc.data();

        // Query the likes subcollection to get the number of likes
        const likesSnapshot = await getDocs(collection(db, "MazeLevels", doc.id, "likes"));
        const likeCount = likesSnapshot.size; // Get the number of likes

        return {
          MazeLevelId: doc.id,   // Unique MazeLevel ID
          id: data.id,
          title: data.title,        
          content: data.content,
          author: data.author,
          timestamp: data.timestamp.toDate(),
          tags: data.tags,
          image: data.image,
          likes: likeCount, // Return the number of likes
          authorId: data.authorId
        };
      })
    );

    // Get the last visible document for pagination
    const lastVisibleDoc = querySnapshot.docs[querySnapshot.docs.length - 1];

    return { MazeLevels, lastVisibleDoc };
  } catch (error) {
    console.error("Error fetching MazeLevels: ", error);
    return { MazeLevels: [], lastVisibleDoc: null };
  }
};

export const getAndDisplayPersonalMazeLevels = async (
  authorId?: string,
) => {
  try {
    const MazeLevelsQuery = query(
        collection(db, "MazeLevels"),
        where("authorId", "==", authorId),
      );
    const querySnapshot = await getDocs(MazeLevelsQuery);
    const MazeLevels = await Promise.all(
      querySnapshot.docs.map(async (doc) => {
        const data = doc.data();
        const likesSnapshot = await getDocs(collection(db, "MazeLevels", doc.id, "likes"));
        const likeCount = likesSnapshot.size;
        return {
          MazeLevelId: doc.id,
          id: data.id,
          title: data.title,
          content: data.content,
          author: data.author,
          timestamp: data.timestamp.toDate(),
          tags: data.tags,
          image: data.image,
          likes: likeCount,
          authorId: data.authorId,
        };
      })
    );
    return { MazeLevels };
  } catch (error) {
    console.error("Error fetching MazeLevels: ", error);
    return { MazeLevels: [], lastVisibleDoc: null };
  }
};


export const getMazeLevelById = async (MazeLevelId: string) => {
  try {
    const MazeLevelRefQuery = query(
      collection(db, "MazeLevels"),
      where('id', '==', MazeLevelId),
      limit(1)
    );

    // Fetch the documents
    const MazeLevelSnap = await getDocs(MazeLevelRefQuery);

    // Check if the document exists
    if (!MazeLevelSnap.empty) {
      // Get the first document from the snapshot
      const doc = MazeLevelSnap.docs[0];
      const data = doc.data();

      return {
        id: doc.id, // Using the document ID from Firestore
        title: data.title,
        content: data.content,
        author: data.author,
        timestamp: data.timestamp.toDate(),
        tags: data.tags,
        image: data.image,
        likes: data.likes,
        authorId:data.authorId
      };
    } else {
      console.log("No such MazeLevel!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching MazeLevel: ", error);
    throw error;
  }
};

export const likeMazeLevel = async (likeDTO: {liked:boolean, byUser:string, levelId:string, authorId:string}) => {
  const { liked, byUser, levelId, authorId } = likeDTO;

  try {
    const likeRef = doc(db, `maze-levels/${levelId}/likes/${byUser}`);

    if (liked) {
      // Add like
      await setDoc(likeRef, {
        byUser,
        levelId,
        authorId,
        liked: true
      });
      console.log(`Level ${levelId} liked by user ${byUser}`);
    } else {
      // Remove like
      console.log(`Like removed for level ${levelId} by user ${byUser}`);
    }
  } catch (error) {
    console.error("Error liking level: ", error);
    throw error;
  }
};


export const getLikesForMazeLevel = async (levelId: string) => {
  try {
    const likesQuery = query(collection(db, `maze-levels/${levelId}/likes`));
    const querySnapshot = await getDocs(likesQuery);

    const likes = querySnapshot.docs.map(doc => doc.data());
    return likes;
  } catch (error) {
    console.error("Error fetching likes: ", error);
    throw error;
  }
};





export const getLikeCountForMazeLevel = async (levelId: string) => {
  try {
    // Reference to the 'likes' subcollection of the specific MazeLevel
    const likesCollection = collection(db, `maze-levels/${levelId}/likes`);
    
    // Create a query and count the documents in the collection
    const likesQuery = query(likesCollection);
    const aggregateSnapshot = await getCountFromServer(likesQuery);
    console.log(aggregateSnapshot.data())
    // Return the count of documents (likes)
    return aggregateSnapshot.data().count;
  } catch (error) {
    console.error("Error fetching like count: ", error);
    throw error;
  }
};