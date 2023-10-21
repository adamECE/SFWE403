"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import React from "react";
import UserRow from "./UserRow";
import PopupUsers from "./PopupUsers";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [popupWindow, setPopupWindow] = useState(false);
  const [popupWindowContent, setPopupWindowContent] = useState({});
  const [usersUpdated, setUsersUpdated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setUsersUpdated(!usersUpdated);
  },[]);
  // This useEffect will run whenever usersUpdated changes
  useEffect(() => {
    const token = localStorage.getItem("token"); // get auth token from localStorage

    fetch("http://127.0.0.1:3030/pharmacy-0x2/api/staff-list/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // include bearer token in the Authorization header
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response error");
        }
        return res.json();
      })
      .then((data) => {
        setUsers(data);
        console.log(data);
      })
      .catch((error) => {
        console.error("Fetch error:", error);
      });
  }, [usersUpdated]); // This useEffect depends on the usersUpdated state
    
  const thStyle = " px-6 py-4";
  const blockStyle = "m-5 p-5 flex flex-col justify-center items-center ";
  return (
    <div className={blockStyle}>
      <h3>Users</h3>

      {/* Only show modal if an item is clicked */}
      {popupWindow && (
        <PopupUsers
          popupWindowContent={popupWindowContent}
          setPopupWindow={setPopupWindow}
          usersUpdated={usersUpdated}
          setUsersUpdated={setUsersUpdated}
        />
      )}

      <table className="border-collapse border border-sky-700 md:table-fixed font-light mx-4 my-4">
        <thead className="border-b bg-neutral-50 font-medium dark:border-neutral-500 dark:text-neutral-800">
          <tr>
          <th scope="col" className={thStyle}>
              First Name
            </th>
            <th scope="col" className={thStyle}>
              Last Name
            </th>
            <th scope="col" className={thStyle}>
              Email
            </th>
            <th scope="col" className={thStyle}>
              Phone Number
            </th>
            <th scope="col" className={thStyle}>
              Role
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((item) => (
            <UserRow
              key={item._id}
              _id={item._id}
              popupWindow={popupWindow}
              setPopupWindow={setPopupWindow}
              setPopupWindowContent={setPopupWindowContent}
              firstName = {item.firstName}
              lastName = {item.lastName}
              email = {item.email}
              phoneNumber = {item.phoneNumber}
              role = {item.role}
              dateOfBirth = {item.dateOfBirth}
              addressStreet = {item.address.streetName}
              addressCity = {item.address.city}
              addressState = {item.address.state}
              addressZipcode = {item.address.zipCode}
              lastLogin = {item.lastLogin}
              isLocked = {item.isLocked}
            />
          ))}
        </tbody>
      </table>
    </div>
  );

}