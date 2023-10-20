'use client';

import {useEffect} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';

export default function Settings() {
  const router = useRouter();
  const blockStyle = {
    marign: '10 auto',

    padding: '20px',
    border: '0 ',
    width: '80%',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    left: '10%',
  };
  useEffect(() => {
    //add check for login!
  });
  return (
    <div>
      <div style={blockStyle}>
        <Link className="user-button" href="./settings/patients">
          Patients{' '}
        </Link>{' '}
      </div>{' '}
    </div>
  );
}
