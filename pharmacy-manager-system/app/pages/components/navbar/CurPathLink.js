"use client"
import Link from "next/link";
import { useState } from 'react';

export default function CurPathLink({
    name,
    pathname 
  }) {

    const [dashboardLink, setDashboardLink] = useState('');
    const displayName = name==="pages" ? '\\ Home \\ ' : name.charAt(0).toUpperCase() + name.replace(/([A-Z])/g, ' $1').slice(1)  + " \\";

    const linkStyles =
    "font-semibold p-1 text-sky-700 text-xl tracking-tight rounded "+
    "hover:text-blue-700 ";

    return (
        <Link className={linkStyles} href={pathname.slice(0, pathname.indexOf(name) + name.length)}>
            {displayName}
        </Link>
    );
  }