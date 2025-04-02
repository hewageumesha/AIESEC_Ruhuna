import React, { ReactNode } from 'react';

interface LayoutProps {
    children: ReactNode;
}

const Layout: React.FC <LayoutProps>= ({ children }) => {
  return (
    <div>
      <div className="flex justify-center">
        {children}
      </div>
      
    </div>
  );
};

export default Layout;
