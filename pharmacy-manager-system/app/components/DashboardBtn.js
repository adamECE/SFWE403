'use client'
import { useRouter } from 'next/navigation'


export default function DashboardBtn({name, dst}) {
    const router = useRouter()

    const handleBtnClick = (e) => {
        e.preventDefault();
        router.push(dst); 
    }

    return (
        <button onClick={handleBtnClick}
            style={{
                margin:'10px',
                padding:'2px',
                color:'black',
                border:'solid 2px black',
                width: '90%',
                height:'100px',
                fontSize:'60px'
            }}>
            {name}
        </button>
    )
  }
  