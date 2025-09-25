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
  collectionGroup,
  QueryConstraint,
  where,
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
 * @param {string | null | undefined} pathOrCollectionGroupId - The path to the collection or the ID of the collection group.
 * @param {object} options - Configuration for the query.
 * @param {boolean} [options.isGroup=false] - Set to true if querying a collection group.
 * @param {QueryConstraint[]} [options.constraints=[]] - An array of query constraints (where, orderBy, limit).
 * @returns {UseCollectionResult<T>} Object with data, isLoading, error.
 */
export function useCollection<T = any>(
    pathOrCollectionGroupId: string | null | undefined,
    options: { isGroup?: boolean; constraints?: QueryConstraint[] } = {}
): UseCollectionResult<T> {
  const { firestore, user } = useFirebase();
  const { isGroup = false, constraints = [] } = options;
  type ResultItemType = WithId<T>;
  type StateDataType = ResultItemType[] | null;

  const [data, setData] = useState<StateDataType>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<FirestoreError | Error | null>(null);

  // Memoize the query reference itself.
  const memoizedQuery = useMemo(() => {
    if (!firestore || !pathOrCollectionGroupId || !user) return null;

    try {
        let finalConstraints = [...constraints];
        if (isGroup) {
            // For collection group queries, we MUST filter by the current user's ID
            // to comply with security rules.
            if (pathOrCollectionGroupId === 'reports' && user.role === 'patient') {
              finalConstraints.push(where('patientId', '==', user.uid));
            } else {
              finalConstraints.push(where('professionalId', '==', user.uid));
            }
        }
        
        const baseQuery = isGroup
            ? collectionGroup(firestore, pathOrCollectionGroupId)
            : collection(firestore, pathOrCollectionGroupId);
            
        return query(baseQuery, ...finalConstraints);

    } catch (e) {
      console.error("Failed to create Firestore query:", e);
      return null;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firestore, pathOrCollectionGroupId, isGroup, JSON.stringify(constraints), user]);


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
        const path: string = (memoizedQuery as unknown as InternalQuery)._query.path.canonicalString()

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
