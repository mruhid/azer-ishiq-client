"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface UserInformationContextType {
  isOpen: boolean;
  toggleSidebar: () => void;
  setId: (id: number) => void;
  UserId: number | null;
}

const UserInformationContext = createContext<
  UserInformationContextType | undefined
>(undefined);

interface UserInformationProviderProps {
  children: ReactNode;
}

export default function UserInformationProvider({
  children,
}: UserInformationProviderProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [UserId, setUserId] = useState<number | null>(null);

  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };
  const setId = (id: number) => {
    setUserId(id);
  };

  return (
    <UserInformationContext.Provider
      value={{ isOpen, setId, UserId, toggleSidebar }}
    >
      {children}
    </UserInformationContext.Provider>
  );
}

export function useUserInformation() {
  const context = useContext(UserInformationContext);
  if (!context) {
    throw new Error(
      "useUserInformation must be used within a UserInformationProvider",
    );
  }
  return context;
}
