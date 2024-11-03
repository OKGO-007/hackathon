import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
  } from 'react';
  import { getAuth, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
  
  // User型を定義
  interface User {
    uid: string;
    email: string | null;
  }
  
  // AuthContextの型定義
  interface AuthContextType {
    user: User | null;
  }
  
  // 初期状態
  const initialState: AuthContextType = {
    user: null,
  };
  
  // AuthContextの作成
  const AuthContext = createContext<AuthContextType>(initialState);
  
  // AuthProviderコンポーネント
  export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<AuthContextType>(initialState);
  
    useEffect(() => {
      const auth = getAuth();
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
        if (firebaseUser) {
          // ユーザーが存在する場合、ユーザー情報を取得
          setUser({
            user: {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
            },
          });
        } else {
          // ユーザーが存在しない場合はnullに設定
          setUser(initialState);
        }
      });
      
  
      // クリーンアップ関数を返す
      return () => unsubscribe();
    }, []);
  
    return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
  };
  
  // useAuthContextフック
  export const useAuthContext = () => useContext(AuthContext);
  