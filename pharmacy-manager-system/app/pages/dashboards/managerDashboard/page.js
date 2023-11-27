'use client';
import {useEffect} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';

export default function ManagerDashboard() {
  const router = useRouter();

  const blockStyle = {
    margin: '10 auto',
    border: '0 ',
    padding: '20px',
    width: '80%',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    left: '10%',
  };
  useEffect(() => {
    if (
      localStorage.getItem('role') != 'pharmacy manager' &&
      localStorage.getItem('isACCountActive') == 'true'
    ) {
      router.push('/pages/');
    } else if (localStorage.getItem('isACCountActive') == null) {
      router.push('/');
    }
  });
  return (
    <div>
      <div style={blockStyle}>
        <Link className="user-button" href="./managerDashboard/createAccount">
          Create User Accounts{' '}
        </Link>{' '}
        <Link className="user-button" href="../inventory">
          Inventory{' '}
        </Link>{' '}
        <Link
          className="user-button"
          href="./managerDashboard/inputPrescriptionInfo"
        >
          Input Prescription Info{' '}
        </Link>{' '}
        <Link className="user-button" href="./managerDashboard/notifications">
          Notifications{' '}
        </Link>{' '}
        <Link className="user-button" href="./managerDashboard/logs">
          Transactions Logs
        </Link>
        <Link className="user-button" href="./managerDashboard/checkout">
          Checkout{' '}
        </Link>{' '}
        <Link className="user-button" href="./managerDashboard/reports">
          Reports{' '}
        </Link>{' '}
        {''}
      </div>{' '}
    </div>
  );
}
