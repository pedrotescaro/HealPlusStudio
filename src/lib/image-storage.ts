"use client";

import { getDatabase, ref, set, get, child } from 'firebase/database';
import { initializeFirebase } from '@/firebase';
import { v4 as uuidv4 } from 'uuid';

// This might be null if Firebase is not initialized yet.
let realtimeDb: ReturnType<typeof getDatabase> | null = null;

try {
  const { database } = initializeFirebase();
  realtimeDb = database;
} catch (e) {
  console.error("Failed to initialize Firebase Realtime Database in ImageStorageService:", e);
}


type ImageMetadata = {
  fileName: string;
  mimeType: string;
  createdAt: string;
};

type StoredImage = {
  dataUri: string;
  metadata: ImageMetadata;
};

export class ImageStorageService {
  /**
   * Saves an image as a data URI to a specific path in Realtime Database.
   * @param dataUri - The base64 data URI of the image.
   * @param userId - The ID of the user uploading the image.
   * @param path - The main path (e.g., 'profile-pictures', 'wound-images').
   * @param metadata - Additional metadata for the image.
   * @returns The unique ID of the stored image.
   */
  static async saveImageWithPath(
    dataUri: string,
    userId: string,
    path: string,
    metadata: { fileName: string; mimeType: string }
  ): Promise<string> {
    if (!realtimeDb) {
      throw new Error("Realtime Database is not initialized.");
    }
    const imageId = uuidv4();
    const imageRef = ref(realtimeDb, `images/${userId}/${path}/${imageId}`);
    const storedImage: StoredImage = {
      dataUri,
      metadata: {
        ...metadata,
        createdAt: new Date().toISOString(),
      },
    };
    await set(imageRef, storedImage);
    return imageId;
  }

  /**
   * Retrieves an image from the Realtime Database.
   * @param userId - The ID of the user who owns the image.
   * @param imageId - The ID of the image to retrieve.
   * @returns The stored image object or null if not found.
   */
  static async getImage(userId: string, imageId: string): Promise<StoredImage | null> {
    if (!realtimeDb) {
      throw new Error("Realtime Database is not initialized.");
    }
    try {
      const snapshot = await get(child(ref(realtimeDb), `images/${userId}/profile-pictures/${imageId}`));
      if (snapshot.exists()) {
        return snapshot.val() as StoredImage;
      }
      return null;
    } catch (error) {
      console.error("Error getting image from Realtime Database:", error);
      return null;
    }
  }
}
