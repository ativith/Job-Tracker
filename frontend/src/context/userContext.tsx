import { createContext, useState, ReactNode, useEffect } from "react";

// 1. กำหนด type ของ user
// ถ้า user มี structure เช่น id, name, email ก็ระบุให้ชัดเจน
type User = {
  id: number;
  username: string;
  email: string;
} | null;

// 2. กำหนด type ของ context
type UserContextType = {
  user: User;
  updateUser: (userData: User) => void;
  clearUser: () => void;
};

// 3. สร้าง context พร้อม default value
export const UserContext = createContext<UserContextType>({
  user: null,
  updateUser: () => {},
  clearUser: () => {},
});

// 4. สร้าง Provider component
type UserProviderProps = {
  children: ReactNode;
};

const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<User>(null);
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const updateUser = (userData: User) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const clearUser = () => {
    setUser(null);
  };

  const value: UserContextType = {
    user,
    updateUser,
    clearUser,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserProvider;
