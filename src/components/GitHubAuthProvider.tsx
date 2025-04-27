
import React, { createContext, useContext, ReactNode } from 'react';
import { useGitHubAuth } from '@/hooks/useGitHubAuth';

type GitHubContextType = ReturnType<typeof useGitHubAuth>;

const GitHubAuthContext = createContext<GitHubContextType | undefined>(undefined);

export function GitHubAuthProvider({ children }: { children: ReactNode }) {
  const auth = useGitHubAuth();
  
  return (
    <GitHubAuthContext.Provider value={auth}>
      {children}
    </GitHubAuthContext.Provider>
  );
}

export const useGitHubAuthContext = () => {
  const context = useContext(GitHubAuthContext);
  if (context === undefined) {
    throw new Error('useGitHubAuthContext must be used within a GitHubAuthProvider');
  }
  return context;
};
