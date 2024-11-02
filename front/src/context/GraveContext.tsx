// src/context/GraveContext.tsx
import React, { createContext, useContext, ReactNode } from 'react';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db, auth } from "../components/Firebase"; // Firebase設定ファイルのインポート
import { useAuthState } from 'react-firebase-hooks/auth';

type GraveData = {
  id: string;
  imageUrl: string;
  animeInfo: string;
  animeId: string;
  characterName: string;
  characterId: string;
  visitors: number;
  isPublic: boolean;
  userId: string;
};

interface GraveContextType {
  addGrave: (data: Omit<GraveData, 'userId'>) => Promise<void>;
  getGraves: () => Promise<GraveData[]>;
}

const GraveContext = createContext<GraveContextType | undefined>(undefined);

export const GraveProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user] = useAuthState(auth);

  const addGrave = async (data: Omit<GraveData, 'userId'>) => {
    if (!user) return;

    const graveData: GraveData = {
      ...data,
      userId: user.uid,
    };

    const userGravesRef = collection(db, 'users', user.uid, 'graves');
    await addDoc(userGravesRef, graveData);
  };

  const getGraves = async () => {
    if (!user) return [];

    const userGravesRef = collection(db, 'users', user.uid, 'graves');
    const graveDocs = await getDocs(userGravesRef);

    return graveDocs.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        imageUrl: data.imageUrl as string,
        animeInfo: data.animeInfo as string,
        animeId: data.animeId as string,
        characterName: data.characterName as string,
        characterId: data.characterId as string,
        visitors: data.visitors as number,
        isPublic: data.isPublic as boolean,
        userId: data.userId as string,
      } as GraveData;
    });
  };

  return (
    <GraveContext.Provider value={{ addGrave, getGraves }}>
      {children}
    </GraveContext.Provider>
  );
};

export const useGrave = (): GraveContextType => {
  const context = useContext(GraveContext);
  if (!context) {
    throw new Error('useGrave must be used within a GraveProvider');
  }
  return context;
};
