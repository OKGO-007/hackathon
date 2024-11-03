import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { collection, addDoc, getDocs, QuerySnapshot, DocumentData, doc } from 'firebase/firestore';
import { db, auth } from "../components/Firebase"; // Firebase設定ファイルのインポート
import { useAuthState } from 'react-firebase-hooks/auth';

// GraveDataの型定義
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
  timestamp: number;
  message: string;
};

// GraveContextの型定義
interface GraveContextType {
  addGrave: (data: Omit<GraveData, 'userId'>) => Promise<void>;
  graves: GraveData[]; // お墓データの配列
  allPublicGraves: GraveData[]; // 公開されているお墓データの配列
  setAllPublicGraves: React.Dispatch<React.SetStateAction<GraveData[]>>; // setAllPublicGraves関数
}

// GraveContextの作成
const GraveContext = createContext<GraveContextType | undefined>(undefined);

// GraveProviderコンポーネントの定義
export const GraveProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user] = useAuthState(auth);
  const [allPublicGraves, setAllPublicGraves] = useState<GraveData[]>([]); // お墓データを管理するステート
  const [graves, setGraves] = useState<GraveData[]>([]); // お墓データを管理するステート
  
  // getDocsを使ってドキュメントを取得
  const fetchGraves = async () => {
    if (!user) {
      console.error("User is not logged in.");
      return; // ユーザーが存在しない場合は何もせず終了
    }

    const Ref = doc(db, 'graves', user.uid); // gravesコレクション内のユーザーIDのドキュメント
    const userGravesRef = collection(Ref, 'grave'); // ユーザーのUIDが存在する場合にコレクションのパスを修正
  
    try {
      const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(userGravesRef); // Promiseを待機
      const updatedData: GraveData[] = []; // GraveData[]型を指定
      querySnapshot.forEach((doc) => {
        const dataG: GraveData = { id: doc.id, ...doc.data() } as GraveData;
        updatedData.push(dataG);
      });
      setGraves(updatedData);
    } catch (error) {
      console.error("Error fetching graves:", error);
    }
  };

  const fetchAllGraves = async () => {
    const userGravesRef = collection(db, 'all_graves'); // ユーザーのUIDが存在する場合にコレクションのパスを修正
  
    try {
      const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(userGravesRef); // Promiseを待機
      const Alldata: GraveData[] = []; // GraveData[]型を指定
      querySnapshot.forEach((doc) => {
        const a: GraveData = { id: doc.id, ...doc.data() } as GraveData;
        Alldata.push(a);
      });
      setAllPublicGraves(Alldata);
    } catch (error) {
      console.error("Error fetching graves:", error);
    }
  };

  // Gravesのデータをリアルタイムで取得
  useEffect(() => {
    if (user) {
      fetchGraves(); // ユーザーが存在する場合に呼び出す
    }
    fetchAllGraves();
  }, [user, graves]); // userが変更されたときに実行

  const addGrave = async (data: Omit<GraveData, 'userId'>) => {
    if (!user) return;

    const graveData: GraveData = {
      ...data,
      userId: user.uid,
    };

    const userGravesRef = collection(db, 'users', user.uid, 'graves'); // コレクションのパスを修正
    await addDoc(userGravesRef, graveData);
  };

  return (
    <GraveContext.Provider value={{ addGrave, graves, allPublicGraves, setAllPublicGraves }}>
      {children}
    </GraveContext.Provider>
  );
};

// useGraveフックの定義
export const useGrave = (): GraveContextType => {
  const context = useContext(GraveContext);
  if (!context) {
    throw new Error('useGrave must be used within a GraveProvider');
  }
  return context;
};
