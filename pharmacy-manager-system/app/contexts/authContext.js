

import { createContext, useState, useEffect, } from 'react';
import { setCookie,destroyCookie } from 'nookies'
import { useRouter } from "next/navigation";

export const AuthContext = createContext("")

export function AuthProvider({ children }) {

    const router = useRouter();
    const [user, setUser] = useState(null)
    let isAuthenticated

    async function signOut() {
        setUser(null)
      destroyCookie(null, 'pharmacyauth.token')
       isAuthenticated=false
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
       isAuthenticated=data.isACCountActive

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
  }


async function sendResetEmail({ email}) {
   try {
      // Make a POST request to the login endpoint
      const response = await fetch('http://127.0.0.1:3030/pharmacy-0x2/api/pw-reset-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({email}),
      });
     if (response.ok) {
      
        const responseText = await response.text();
        return( JSON.parse(responseText). message) 
      } else {
        const errorText = await response.text();
        return(JSON.parse(errorText).error);  
      }
    } catch (error) {
      console.error('Login error:', error);
    }

  }


async function activateAccount({ currentPassword,newPassword,confirmPassword}) {
   try {
          const token = localStorage.getItem('token');
      const response = await fetch('http://127.0.0.1:3030/pharmacy-0x2/api/account-activation', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
           'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({currentPassword,newPassword,confirmPassword}),
      });

     if (response.ok) {
         localStorage.setItem('isACCountActive', true);
       isAuthenticated=true
        const responseText = await response.text();
        return( JSON.parse(responseText). message)
      } else {
        const errorText = await response.text();
        return(JSON.parse(errorText).error);  
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  }
  
   
  
  async function resetPassword({newPassword,confirmPassword,token}) {
   try {
         
      const response = await fetch('http://127.0.0.1:3030/pharmacy-0x2/api/reset-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',   
        },
        body: JSON.stringify({token,newPassword,confirmPassword}),
      });

     if (response.ok) {
        
        const responseText = await response.text();
        return( JSON.parse(responseText). message)
      } else {
        const errorText = await response.text();
        return(JSON.parse(errorText).error);  
      }
    } catch (error) {
      console.error('Login error:', error);
    }}

    
    return (
    <AuthContext.Provider value={{ user, isAuthenticated, signIn,signOut,sendResetEmail,activateAccount,resetPassword }}>
      {children}
    </AuthContext.Provider>
  )
}