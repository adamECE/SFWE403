import { createContext, useState, useEffect, } from 'react';
import { setCookie, destroyCookie } from 'nookies'
import { useRouter } from "next/navigation";
import Swal from 'sweetalert2'
export const AuthContext = createContext("")

export function AuthProvider({ children }) {

    const router = useRouter();
    const [user, setUser] = useState(null)
    const [isAuthenticated, setIsAuthenticated]= useState(false)

    async function signOut() {
       destroyCookie({}, 'pharmacyauth.token')
        try {
          
            // Make a POST request to your login endpoint
            const response = await fetch('http://127.0.0.1:3030/pharmacy-0x2/api/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',    
                },
                body: JSON.stringify({ email:localStorage.getItem('email')}),          
            });

            if (response.ok) {   
                localStorage.removeItem('token');
                localStorage.removeItem('email');
                localStorage.removeItem('role')
                //localStorage.removeItem('isACCountActive');
                router.refresh();

            }
        } catch (error) {
            console.error('Logout error:', error);
        }
    }
    async function signIn({ email, password }) {
        try {
            // Make a POST request to your login endpoint
         
            const response = await fetch('http://127.0.0.1:3030/pharmacy-0x2/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {

                const data = await response.json();
                setUser({
                    email: data.email,
                    isACCountActive: data.isACCountActive,
                    role: data.role,
                });

                return data;


            } else {

                const errorText = await response.text();
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: JSON.parse(errorText).error,

                })
                //alert(JSON.parse(errorText).error);
                return false;
            }
        } catch (error) {
            console.error('Login error:', error);
        }
    }


    async function sendResetEmail({ email }) {
        try {
            // Make a POST request to the login endpoint
            const response = await fetch('http://127.0.0.1:3030/pharmacy-0x2/api/pw-reset-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });
            if (response.ok) {

                const responseText = await response.text();
                return (JSON.parse(responseText).message)
            } else {
                const errorText = await response.text();
                return (JSON.parse(errorText).error);
            }
        } catch (error) {
            console.error('Login error:', error);
        }

    }

    async function sendTwoFactorEmail({ email }) {
        try {
            // Make a POST request to the login endpoint
            const response = await fetch('http://127.0.0.1:3030/pharmacy-0x2/api/two-factor', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });
            if (response.ok) {

                const responseText = await response.text();
             
                return (JSON.parse(responseText).code)
            } else {
                const errorText = await response.text();
                return (JSON.parse(errorText).error);
            }
        } catch (error) {
            console.error('Login error:', error);
        }

    }


    async function checkTwoFactorCode({ data,code }) {
         try {
        //     // Make a POST request to the login endpoint
            const response = await fetch('http://127.0.0.1:3030/pharmacy-0x2/api/verify-two-factor', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email:data.email,code }),
            });
            if (response.ok) {

                const responseText = await response.text();
                setCookie(undefined, 'pharmacyauth.token', data.token, {
                    maxAge: 60 * 60 * 16, // 16 hours

                })
                localStorage.setItem('token', data.token);
                localStorage.setItem('email', data.email);
                localStorage.setItem('role', data.role)
                localStorage.setItem('isACCountActive', data.isACCountActive);

     router.push("/pages/");
   
               return (1)
            } else {
                const errorText = await response.text();
                 Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: JSON.parse(errorText).error,

                })
                
            }
        } catch (error) {
            console.error('Login error:', error);
        }

    }

    async function activateAccount({ currentPassword, newPassword, confirmPassword }) {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://127.0.0.1:3030/pharmacy-0x2/api/account-activation', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
            });

            if (response.ok) {
                localStorage.setItem('isACCountActive', true);
                setIsAuthenticated(true)
                const responseText = await response.text();
                return (JSON.parse(responseText).message)
            } else {
                const errorText = await response.text();
                return (JSON.parse(errorText).error);
            }
        } catch (error) {
            console.error('Login error:', error);
        }
    }



    async function resetPassword({ newPassword, confirmPassword, token }) {
        try {

            const response = await fetch('http://127.0.0.1:3030/pharmacy-0x2/api/reset-password', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token, newPassword, confirmPassword }),
            });

            if (response.ok) {

                const responseText = await response.text();
                return (JSON.parse(responseText).message)
            } else {
                const errorText = await response.text();
                return (JSON.parse(errorText).error);
            }
        } catch (error) {
            console.error('Login error:', error);
        }
    }




    return ( < AuthContext.Provider value = {

            { user, isAuthenticated,checkTwoFactorCode, signIn, signOut, sendResetEmail, sendTwoFactorEmail, activateAccount, resetPassword } } > { children } </AuthContext.Provider>)
    }