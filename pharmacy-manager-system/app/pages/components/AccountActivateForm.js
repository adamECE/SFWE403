"use client";
import Link from "next/link";
import { useRouter} from "next/navigation";
import { useState,useEffect,useContext} from 'react';
import { AuthContext } from "../../contexts/authContext";

export default function AccountActivateForm() {
  const router = useRouter();
  const { activateAccount } = useContext(AuthContext);
  const blockStyle = {
    margin: "10 auto",
    border: "0 ",
    padding: "20px",
    width: "80%",
    justifyContent: "space-between",
    alignItems: "center",
    position: "absolute",
    display: "flex",
    flexDirection: "column",
    left: "10%",
  };

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
      const { currentPassword, newPassword, confirmPassword } = formData;
  
    try {
        const response = await activateAccount({ currentPassword, newPassword, confirmPassword });
        alert(response)
        router.refresh()
    } catch (error) {
      console.error('Error:', error) }
  };  
  return (
    <div>
      <div style={blockStyle}>
        
        <Link
          className="user-button" href="#"> Activate Your Account </Link>{" "}
            <form onSubmit={handleSubmit} className="max-w-[400px] w-full mx-auto bg-transparent p-4 rounded border border-sky-400">
            <label className="block text-white text-sm font-bold mb-2">
                Current Password
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                id="currentPassword"
                name="currentPassword"
                type="password"
                      placeholder="Current Password"
                      value={formData.currentPassword}
                       onChange={handleChange}
                  />
            <label className="block text-white text-sm font-bold mb-2">
                New Password
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                id="newPassword"
                name="newPassword"
                type="password"
                      placeholder="New Password"
                      value={formData.newPassword}
                       onChange={handleChange}
                  />
                  
                 <label className="block text-white text-sm font-bold mb-2">
                Confirm New Password
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                      placeholder="Confirm New Password"
                      value={formData.confirmPassword}
                       onChange={handleChange}
                  />  
                   <button
            className="bg-blue-500 hover:bg-blue-700 rounded w-full my-2 py-2 text-white appearance-none focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Submit
          </button>
        </form>{" "}      


      </div>{" "}
    </div>
  );
}
