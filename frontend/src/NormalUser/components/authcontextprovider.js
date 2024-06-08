import React, { createContext, useState, useEffect } from 'react';
import { useAuthorization } from "../resusable_function"


const AuthContext = createContext({
  isAuthenticated: false,
  setIsAuthenticated: () => {},
});



const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const handleauth = useAuthorization
  
    useEffect(() => {
        if (handleauth){
            setIsAuthenticated("Authorized")
        }else{
            setIsAuthenticated("authorized")
        }
         
     }, []);
  
    return (
      <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
        {children}
      </AuthContext.Provider>
    );
  };
  
  export default AuthProvider;