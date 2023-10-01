

import { createContext, useState, useEffect, } from 'react';
import { setCookie,destroyCookie } from 'nookies'
import { useRouter } from "next/navigation";

export const AuthContext = createContext("")

export function AuthProvider({ children }) {

    const router = useRouter();
    const [user, setUser] = useState(null)
    const isAuthenticated=!!user

    async function signOut() {
        setUser(null)
        destroyCookie(null, 'pharmacyauth.token')
        router.push('/');
    }
 async function signIn({ email, password }) {
   try {
      // Make a POST request to your login endpoint
      const response = await fetch('http://127.0.0.1:3030/pharmacy-0x2/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({email,password }),
      });

      if (response.ok) {
        
          const data = await response.json();
            setUser({
        email: data.email,
        isACCountActive: data.isACCountActive,
        role: data.role,
      });

        setCookie(undefined, 'pharmacyauth.token', data.token, {
            maxAge: 60 * 60 * 1, // 1 hour
            
        })
          localStorage.setItem('token', data.token);
          localStorage.setItem('email', data.email);
          localStorage.setItem('role', data.role)
          localStorage.setItem('isACCountActive', data.isACCountActive);
        
        router.push("/pages/");
    
      } else {
      
        const errorText = await response.text();
       console.log(JSON.parse(errorText).error);
        
      }
    } catch (error) {
      console.error('Login error:', error);
    }
console.log(user)
  }
    
    return (
    <AuthContext.Provider value={{ user, isAuthenticated, signIn,signOut }}>
      {children}
    </AuthContext.Provider>
  )
}