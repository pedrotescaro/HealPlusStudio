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
 *
 * @template T Optional type for document data. Defaults to any.
 * @param {Query | string | null | undefined} queryOrPath - A Firestore Query object or a path string.
 * @param {UseCollectionOptions} options - Options for the query, such as constraints.
 * @returns {UseCollectionResult<T>} Object with data, isLoading, error.
 */
export function useCollection<T = any>(
  queryOrPath: Query | string | null | undefined,
  options: UseCollectionOptions = {}
): UseCollectionResult<T> {
  const { firestore } = useFirebase();
  const { constraints = [] } = options;
  type StateDataType = WithId<T>[] | null;

  const [data, setData] = useState<StateDataType>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<FirestoreError | Error | null>(null);

  useEffect(() => {
    if (!firestore || !queryOrPath) {
      setData(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    // Determine if the input is a Query object or a path string
    const finalQuery = typeof queryOrPath === 'string'
      ? query(collection(firestore, queryOrPath), ...constraints)
      : queryOrPath;

    const unsubscribe = onSnapshot(
      finalQuery,
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
        
        // This is a simplified path for the error message.
        // A more robust solution might try to reconstruct the full path.
        let path: string = 'unknown path';
        if (typeof queryOrPath === 'string') {
          path = queryOrPath;
        } else if ((queryOrPath as any)._query) {
           path = (queryOrPath as any)._query.path?.canonicalString() || `collectionGroup: ${(queryOrPath as any)._query.collectionGroup}`;
        }
        
        const contextualError = new FirestorePermissionError({
          operation: 'list', // This operation name might be misleading but is kept for consistency.
          path: path,
        });

        setError(contextualError);
        setData(null);
        setIsLoading(false);

        // trigger global error propagation
        errorEmitter.emit('permission-error', contextualError);
      }
    );

    return () => unsubscribe();
  }, [firestore, queryOrPath, JSON.stringify(constraints)]); // Use stringified constraints for dependency array

  return { data, isLoading, error };
}
