"use client";
import { useRouter } from "next/navigation";

export default function DashboardBtn({ name, dst }) {
  const router = useRouter();

  const handleBtnClick = (e) => {
    e.preventDefault();
    router.push(dst);
  };

  return (
    <button onClick={handleBtnClick} className="user-button">
      {name}{" "}
    </button>
  );
}
