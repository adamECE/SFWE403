'use client';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {useState, useEffect} from 'react';

export default function LandingPage() {
  const router = useRouter();

  const [dashboardLink, setDashboardLink] = useState('');

  //const { user } = useContext(AuthContext)
  const [user, setUser] = useState(null);
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
    switch (localStorage.getItem('role')) {
      case 'pharmacy manager':
        setDashboardLink('./pages/dashboards/managerDashboard/');
        break;
      case 'pharmacist':
        setDashboardLink('./pages/dashboards/pharmacistDashboard/');
        break;
      case 'pharmacy technician':
        setDashboardLink('./pages/dashboards/staffDashboard/');
        break;
      case 'cashier':
        setDashboardLink('./pages/dashboards/staffDashboard/');
        break;

      default:
        setDashboardLink('#');
        break;
    }
  }, []);

  // }

  return (
    <div>
      <div style={blockStyle}>
        <Link className="user-button" href={dashboardLink}>
          My Dashboard{' '}
        </Link>{' '}
        <Link className="user-button" href="./pages/settings">
          My Account Settings{' '}
        </Link>{' '}
        <Link className="user-button" href="./pages/pharmacy">
          Pharmacy Info{' '}
        </Link>{' '}
      </div>{' '}
    </div>
  );
}
