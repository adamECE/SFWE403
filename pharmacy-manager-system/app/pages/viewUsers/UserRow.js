import React from "react";

export default function UserRow({
  popupWindow,
  setPopupWindow,
  setPopupWindowContent,
  name,
  _id,
  lastName,
  firstName,
  email,
  phoneNumber,
  role,
  dateOfBirth,
  addressStreet,
  addressCity,
  addressState,
  addressZipcode,
  lastLogin,
  isLocked
}) {
  const handleRowOnClick = (e) => {
    e.preventDefault();

    setPopupWindow(true);

    setPopupWindowContent({
      name: name,
      _id: _id,
      firstName: firstName,
      lastName: lastName,
      email: email,
      phoneNumber: phoneNumber,
      role: role,
      dateOfBirth: dateOfBirth,
      addressStreet: addressStreet,
      addressCity: addressCity,
      addressState: addressState,
      addressZipcode: addressZipcode,
      lastLogin: lastLogin,
      isLocked: isLocked
    });
  };

  return (
    <tr
      className={
        popupWindow
          ? "border-b dark:border-neutral-500 trBg"
          : "border-b dark:border-neutral-500 trBg hover:scale-105"
      }
      onClick={handleRowOnClick}
    >
      <td className="whitespace-nowrap px-6 py-4">  {firstName}  </td>
      <td className="whitespace-nowrap px-6 py-4"> {lastName} </td>
      <td className="whitespace-nowrap px-6 py-4"> {email} </td>
      <td className="whitespace-nowrap px-6 py-4"> {phoneNumber} </td>
      <td className="whitespace-nowrap px-6 py-4"> {role} </td>
      
      
        
      
    </tr>
  );
}