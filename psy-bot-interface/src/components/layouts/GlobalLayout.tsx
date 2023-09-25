import { ReactNode } from 'react';

interface GlobalLayoutProps {
    children: ReactNode;
}

const GlobalRootLayout = ({ children }: GlobalLayoutProps) => {
  return (
    <div>
      <p>asdaskhdj</p>
      {children}
    </div>
  );
}

export default GlobalRootLayout;