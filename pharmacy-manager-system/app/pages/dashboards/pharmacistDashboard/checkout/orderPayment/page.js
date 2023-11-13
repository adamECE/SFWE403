'use client';

import Link from 'next/link';
import {useState, useEffect} from 'react';
import {useRouter} from 'next/navigation';
import OrderPayment from '../../../../components/orderPayment';
export default function payOrder() {
  return (
    <>
      <OrderPayment />
    </>
  );
}
