'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Query,
  onSnapshot,
  DocumentData,
  FirestoreError,
  QuerySnapshot,
  collection,
  query,
  where,
  orderBy,
  limit,
  collectionGroup,
  QueryConstraint,
} from 'firebase/firestore';
import { useFirebase } from '@/firebase/provider';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

/** Utility type to add an 'id' field to a given type T. */
export type WithId<T> = T & { id: string };

/**
 * Interface for the return value of the useCollection hook.
 * @template T Type of the document data.
 */
export interface UseCollectionResult<T> {
  data: WithId<T>[] | null; // Document data with ID, or null.
  isLoading: boolean;       // True if loading.
  error: FirestoreError | Error | null; // Error object, or null.
}

/* Internal implementation of Query:
  https://github.com/firebase/firebase-js-sdk/blob/c5f08a9bc5da0d2b0207802c972d53724ccef055/packages/firestore/src/lite-api/reference.ts#L143
*/
export interface InternalQuery extends Query<DocumentData> {
  _query: {
    path: {
      canonicalString(): string;
      toString(): string;
    }
  }
}

/**
 * React hook to subscribe to a Firestore collection or query in real-time.
 * It memoizes the query internally based on the path and query constraints.
 * 
 * @template T Optional type for document data. Defaults to any.
 * @param {string | null | undefined} path - The path to the collection.
 * @param {QueryConstraint[]} queryConstraints - An array of query constraints from Firestore (where, orderBy, limit).
 * @returns {UseCollectionResult<T>} Object with data, isLoading, error.
 */
export function useCollection<T = any>(
    path: string | null | undefined,
    ...queryConstraints: QueryConstraint[]
): UseCollectionResult<T> {
  const { firestore } = useFirebase();
  type ResultItemType = WithId<T>;
  type StateDataType = ResultItemType[] | null;

  const [data, setData] = useState<StateDataType>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<FirestoreError | Error | null>(null);

  // Memoize the query reference itself. The effect will re-run if firestore, path, or the constraints' string representation changes.
  const memoizedQuery = useMemo(() => {
    if (!firestore || !path) return null;
    
    // Naive way to serialize constraints for dependency array. In a real-world scenario, a more robust serialization might be needed.
    const constraintsString = queryConstraints.map(c => c.type + JSON.stringify(c)).join(',');

    try {
        const isCollectionGroup = path.includes('/'); // Simple check, refine if needed.
        const baseQuery = isCollectionGroup ? collectionGroup(firestore, path) : collection(firestore, path);
        return query(baseQuery, ...queryConstraints);
    } catch (e) {
      console.error("Failed to create Firestore query:", e);
      return null;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firestore, path, JSON.stringify(queryConstraints)]);


  useEffect(() => {
    if (!memoizedQuery) {
      setIsLoading(false);
      setData(null);
      return;
    }

    setIsLoading(true);

    const unsubscribe = onSnapshot(
      memoizedQuery,
      (snapshot: QuerySnapshot<DocumentData>) => {
        try {
          const results: ResultItemType[] = snapshot.docs.map(doc => ({
            ...(doc.data() as T),
            id: doc.id,
          }));
          setData(results);
          setError(null);
        } catch (snapshotError) {
          console.error('Error processing snapshot:', snapshotError);
          setError(snapshotError as Error);
          setData(null);
        } finally {
          setIsLoading(false);
        }
      },
      (error: FirestoreError) => {
        const path: string = (memoizedQuery as unknown as InternalQuery)._query.path.canonicalString();

        const contextualError = new FirestorePermissionError({
          operation: 'list',
          path,
        });

        setError(contextualError);
        setData(null);
        setIsLoading(false);
        errorEmitter.emit('permission-error', contextualError);
      }
    );

    return () => unsubscribe();
  }, [memoizedQuery]);

  return { data, isLoading, error };
}
