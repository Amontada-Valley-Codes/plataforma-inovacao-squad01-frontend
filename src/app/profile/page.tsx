"use client";
import { useState } from "react";
// Importações de componentes da sua UI
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
// Importações dos ícones
import { User, Mail, Phone, Briefcase, Hash, ArrowLeft, GraduationCap, Building2 } from "lucide-react";
import { useRouter } from 'next/navigation';
// Importação do hook e tipo de usuário
import { useUser, type User as UserType } from "../context/UserContext";

export default function ProfilePage() {
  const router = useRouter();
  const { user: userFromContext } = useUser();

  const user: UserType = userFromContext ?? {
    id: "1",
    company: "Ninna Hub",
    name: "teste",
    email: "teste@teste.com",
    role: "admin" as UserType["role"],
  };

  const [profile, setProfile] = useState({
    name: user.name ?? "",
    email: user.email ?? "",
    department: (user as any).department ?? "Tecnologia da Informação (TI)",
    matricula: (user as any).matricula ?? "1235",
    phone: (user as any).phone ?? "(11) 9554-4321",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Perfil atualizado:", profile);
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="relative flex min-h-screen bg-gray-50">
      <Button
        onClick={handleGoBack}
        variant="ghost"
        className="absolute top-4 left-4 flex items-center gap-2 text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft size={20} />
        Voltar
      </Button>
      <main className="flex-1 p-8 flex justify-center items-center">
        <div className="flex flex-col md:flex-row gap-8 w-full max-w-6xl">
          {/* Card da esquerda - Informações do Perfil */}
            <Card className="p-6 flex flex-col shadow-lg rounded-2xl flex-1">
            <h2 className="text-2xl font-semibold mb-2 text-left">{profile.name}</h2>

            {/* Exibe a ROLE do usuário */}

            <div className="space-y-2 text-gray-600">
            <p className="text-gray-600 text-left mb-5">{profile.email}</p>
                <p className="flex items-center gap-2 text-gray-600 mb-4">
                    <User size={18} /> Cargo: {user.role}
                </p>
                <p className="flex items-center gap-2 mb-4">
                <Briefcase size={18} /> {profile.department}
                </p>
                <p className="flex items-center gap-2 mb-4">
                <Hash size={18} /> Matrícula: {profile.matricula}
                </p>
                <p className="flex items-center gap-2 mb-4">
                <Phone size={18} /> Telefone: {profile.phone}
                </p>
            </div>
            <Button className="mt-14 w-full bg-[#001f61] hover:bg-[#002a7a] text-white transition-colors duration-200">
                Upload de imagem
            </Button>
            </Card>

          {/* Card da direita - Formulário de Edição */}
          <Card className="p-6 shadow-lg rounded-2xl flex-1">
            <h3 className="text-xl font-semibold mb-4">Informações</h3>
            <p className="text-gray-500 mb-6">
              As informações podem ser editadas
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
              className="focus:border-[#001f61] focus:ring focus:ring-[#001f61]/30 transition-colors"
                name="name"
                value={profile.name}
                onChange={handleChange}
                placeholder="Nome"
              />
              <Input
              className="focus:border-[#001f61] focus:ring focus:ring-[#001f61]/30 transition-colors"
                name="email"
                value={profile.email}
                onChange={handleChange}
                placeholder="Email"
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                className="focus:border-[#001f61] focus:ring focus:ring-[#001f61]/30 transition-colors"
                  name="matricula"
                  value={profile.matricula}
                  onChange={handleChange}
                  placeholder="Matrícula"
                />
                <Input
                className="focus:border-[#001f61] focus:ring focus:ring-[#001f61]/30 transition-colors"
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                  placeholder="Telefone"
                />
              </div>
              <Input
                className="focus:border-[#001f61] focus:ring focus:ring-[#001f61]/30 transition-colors"
                name="department"
                value={profile.department}
                onChange={handleChange}
                placeholder="Departamento"
              />
              <Button
                type="submit"
                className="w-full bg-[#001f61] hover:bg-[#002a7a] text-white transition-colors duration-200"
              >
                Atualizar
              </Button>
            </form>
          </Card>
        </div>
      </main>
    </div>
  );
}