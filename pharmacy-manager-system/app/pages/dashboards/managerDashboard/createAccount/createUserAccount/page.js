"use client";

import Link from "next/link";
import { useState,useEffect } from "react";
import { useRouter } from "next/navigation";
import StaffAccountForm from "../../../../components/StaffAccountForm"
export default function CreateAccount() {
  return (
    <>
    <StaffAccountForm/>
    </>
  );
}
