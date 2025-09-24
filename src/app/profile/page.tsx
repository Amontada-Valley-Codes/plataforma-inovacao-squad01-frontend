"use client";
import { useState } from "react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { User, Phone, Briefcase, Hash, ArrowLeft } from "lucide-react";
import { Separator } from "../../components/ui/separator";
import { useUser, type User as UserType } from "../context/UserContext";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { user: userFromContext } = useUser();
  const router = useRouter();

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

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Navbar azul com botão de voltar */}
      <div className="bg-[#011677] border-b border-gray-200 sticky top-0 z-10 shadow-md">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hovers-exit-dash"
              onClick={() => router.push("/dashboard")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao Dashboard
            </Button>
            <Separator orientation="vertical" className="h-6 bg-white/30" />
            <div className="flex items-center gap-2 text-white">
              <User className="w-5 h-5" />
              <h1 className="text-lg font-semibold">Perfil</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo principal */}
      <main className="flex-1 p-8 flex justify-center items-start">
        <div className="flex flex-col md:flex-row gap-8 w-full max-w-6xl">
          {/* Card da esquerda */}
          <Card className="p-6 flex flex-col shadow-md hover:shadow-xl transition-all duration-300 rounded-2xl flex-1 bg-white">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">{profile.name}</h2>
              <p className="text-gray-500">{profile.email}</p>
            </div>

            <div className="space-y-4 divide-y divide-gray-200">
              <div className="flex items-center gap-2 pt-2 text-gray-700">
                <User size={18} className="text-gray-500" /> Cargo:{" "}
                <span className="font-medium">{user.role}</span>
              </div>
              <div className="flex items-center gap-2 pt-2 text-gray-700">
                <Briefcase size={18} className="text-gray-500" />{" "}
                <span className="font-medium">{profile.department}</span>
              </div>
              <div className="flex items-center gap-2 pt-2 text-gray-700">
                <Hash size={18} className="text-gray-500" /> Matrícula:{" "}
                <span className="font-medium">{profile.matricula}</span>
              </div>
              <div className="flex items-center gap-2 pt-2 text-gray-700">
                <Phone size={18} className="text-gray-500" />{" "}
                <span className="font-medium">{profile.phone}</span>
              </div>
            </div>

            <Button className="mt-12 w-full rounded-lg bg-[#001f61] hover:bg-[#002a7a] text-white transition-colors duration-200">
              Upload de imagem
            </Button>
          </Card>

          {/* Card da direita */}
          <Card className="p-6 shadow-md hover:shadow-xl transition-all duration-300 rounded-2xl flex-1 bg-white">
            <h3 className="text-xl font-semibold mb-2 text-gray-900">Informações</h3>
            <p className="text-gray-500 mb-6">Edite suas informações abaixo:</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                className="focus:border-[#001f61] focus:ring focus:ring-[#001f61]/30 transition-colors rounded-lg"
                name="name"
                value={profile.name}
                onChange={handleChange}
                placeholder="Nome"
              />
              <Input
                className="focus:border-[#001f61] focus:ring focus:ring-[#001f61]/30 transition-colors rounded-lg"
                name="email"
                value={profile.email}
                onChange={handleChange}
                placeholder="Email"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  className="focus:border-[#001f61] focus:ring focus:ring-[#001f61]/30 transition-colors rounded-lg"
                  name="matricula"
                  value={profile.matricula}
                  onChange={handleChange}
                  placeholder="Matrícula"
                />
                <Input
                  className="focus:border-[#001f61] focus:ring focus:ring-[#001f61]/30 transition-colors rounded-lg"
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                  placeholder="Telefone"
                />
              </div>
              <Input
                className="focus:border-[#001f61] focus:ring focus:ring-[#001f61]/30 transition-colors rounded-lg"
                name="department"
                value={profile.department}
                onChange={handleChange}
                placeholder="Departamento"
              />

              <Button
                type="submit"
                className="w-full bg-[#001f61] hover:bg-[#002a7a] text-white transition-colors duration-200 rounded-lg font-medium"
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
