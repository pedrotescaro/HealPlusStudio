'use client';
    
import { useState, useEffect, useMemo } from 'react';
import {
  Query,
  onSnapshot,
  collection,
  collectionGroup,
  query,
  where,
  QueryConstraint,
  DocumentData,
  FirestoreError,
} from 'firebase/firestore';
import { useFirebase } from '@/firebase/provider';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

/** Utility type to add an 'id' field to a given type T. */
type WithId<T> = T & { id: string };

/**
 * Interface for the return value of the useCollection hook.
 * @template T Type of the document data.
 */
export interface UseCollectionResult<T> {
  data: WithId<T>[] | null; // Array of document data with IDs, or null.
  isLoading: boolean;       // True if loading.
  error: FirestoreError | Error | null; // Error object, or null.
}

interface UseCollectionOptions {
  constraints?: QueryConstraint[];
  isGroup?: boolean;
}

/**
 * React hook to subscribe to a Firestore collection or collection group in real-time.
 * It memoizes the query internally.
 *
 * @template T Optional type for document data. Defaults to any.
 * @param {string | null | undefined} path - The path to the collection or the ID for a collection group.
 * @param {UseCollectionOptions} options - Options for the query, such as constraints and whether it's a group query.
 * @returns {UseCollectionResult<T>} Object with data, isLoading, error.
 */
export function useCollection<T = any>(
  path: string | null | undefined,
  options: UseCollectionOptions = {}
): UseCollectionResult<T> {
  const { firestore, user } = useFirebase();
  const { constraints = [], isGroup = false } = options;
  type StateDataType = WithId<T>[] | null;

  const [data, setData] = useState<StateDataType>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<FirestoreError | Error | null>(null);

  // Memoize the query object.
  // The query is re-created only if firestore, path, or constraints change.
  const memoizedQuery = useMemo(() => {
    if (!firestore || !path || !user) return null;

    let q: Query;
    if (isGroup) {
      // For collection group queries, filter by professionalId to ensure security rules pass.
      const groupConstraints = [...constraints, where('professionalId', '==', user.uid)];
      q = query(collectionGroup(firestore, path), ...groupConstraints);
    } else {
      q = query(collection(firestore, path), ...constraints);
    }
    return q;
  }, [firestore, path, user, JSON.stringify(constraints), isGroup]); // stringify constraints for deep comparison


  useEffect(() => {
    if (!memoizedQuery) {
      setData(null);
      // Set loading to false only if we are not expecting a query to run
      if (!path || !firestore) {
        setIsLoading(false);
      }
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    const unsubscribe = onSnapshot(
      memoizedQuery,
      (querySnapshot) => {
        const result: WithId<T>[] = [];
        querySnapshot.forEach((doc) => {
          result.push({ ...(doc.data() as T), id: doc.id });
        });
        setData(result);
        setError(null);
        setIsLoading(false);
      },
      (error: FirestoreError) => {
        console.error("Firestore onSnapshot error in useCollection:", error.code, error.message);
        
        let path: string = 'unknown';
        try {
            // Attempt to get path from our memoized query
            // This is an internal property and might break, so wrap in try-catch
            path = (memoizedQuery as any)._query.path.canonicalString();
        } catch {}

        const contextualError = new FirestorePermissionError({
          operation: 'list',
          path,
        });

        setError(contextualError);
        setData(null);
        setIsLoading(false);

        // trigger global error propagation
        errorEmitter.emit('permission-error', contextualError);
      }
    );

    return () => unsubscribe();
  }, [memoizedQuery, path, firestore]);

  return { data, isLoading, error };
}
