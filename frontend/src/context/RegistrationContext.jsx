import { createContext, useState } from 'react';

const RegistrationContext = createContext();

export const RegistrationProvider = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <RegistrationContext.Provider value={{ isModalOpen, setIsModalOpen }}>
      {children}
    </RegistrationContext.Provider>
  );
};

export default RegistrationContext;
