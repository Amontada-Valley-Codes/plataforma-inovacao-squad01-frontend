'use client';

import { useRouter } from "next/navigation";
import { useUser } from "../context/UserContext";
import { Login } from "../../components/Login";

export default function LoginPage() {
  const { setUser } = useUser();
  const router = useRouter();

  const handleLogin = (userData: any) => {
    setUser(userData);
    router.push("/dashboard");
  };

  return <Login onLogin={handleLogin} />;
}
