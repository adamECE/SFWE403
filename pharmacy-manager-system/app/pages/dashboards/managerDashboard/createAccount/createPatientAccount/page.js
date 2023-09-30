"use client";

import Link from "next/link";
import { useState,useEffect } from "react";
import { useRouter } from "next/navigation";
import PatientAccountForm from "../../../../components/PatientAccountForm"
export default function CreateAccount() {
  

  return (
    <>
    <PatientAccountForm/>
    </>
  );
}
