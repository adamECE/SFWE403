'use client';

import Link from 'next/link';
import {useState, useEffect} from 'react';
import {useRouter} from 'next/navigation';
import Purchase from '../../../components/Purchase';
export default function Checkout() {
  return (
    <>
      <Purchase />
    </>
  );
}
