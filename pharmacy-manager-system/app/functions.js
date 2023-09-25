'use client'
import '@/app/globals.css'
import { useRouter } from 'next/navigation'

export default function CreateAccButton({name, dst}){
    const router = useRouter()

    const handleBtnClick = (e) => {       
        window.alert("Account Successfully Created: Temporary Password: ");
        e.preventDefault();
        router.push(dst); 
    }

    return (
        <button onClick={handleBtnClick} className='user-button'>
            {name}
        </button>
    )
  }