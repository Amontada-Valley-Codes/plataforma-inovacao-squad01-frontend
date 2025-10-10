"use client";
import { useState } from "react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { User, Phone, Briefcase, ArrowLeft } from "lucide-react";
import { Separator } from "../../components/ui/separator";
import { useUser, type User as UserType } from "../context/UserContext";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { user: userFromContext } = useUser();
  const router = useRouter();

  const [theme] = useState<string>(
    typeof window !== 'undefined' ? (sessionStorage.getItem('theme') || 'light') : 'light'
  );

  const user: UserType = userFromContext ?? {
    id: "1",
    company: "Ninna Hub",
    name: "Teste Usuário",
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

  // Classes de Input/Textarea mais limpas para o foco
  const inputFocusClass = 'focus:border-[#001f61] focus:ring focus:ring-[#001f61]/30 transition-colors';
  // Cor dos Inputs (ajustada para dark)
  const inputThemeClass = theme === 'dark' 
    ? 'bg-gray-700 border-gray-600 placeholder:text-gray-400 text-white'
    : 'bg-white border-gray-300 placeholder:text-gray-400 text-gray-900';
  
  // Classe principal do botão (não muda com o tema)
  const buttonMainClass = 'bg-[#001f61] hover:bg-[#002a7a] text-white transition-colors duration-200 cursor-pointer';


  return (
    // Div Principal - Aplica o fundo e a cor de texto padrão
    <div className={`flex flex-col min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50'}`}>
      
      {/* Navbar azul - Não muda com o tema */}
      <div className="bg-[#011677] sticky top-0 z-10 shadow-md">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hovers-exit-dash transition-colors duration-200"
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
          
          {/* Card da esquerda - Informações do Usuário */}
          <Card 
            // Cor do Card e borda
            className={`p-6 flex flex-col shadow-md hover:shadow-xl transition-all duration-300 rounded-2xl flex-1 border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
          >
            <div className="mb-6">
              {/* Título Principal */}
              <h2 className={`text-2xl font-semibold ${theme === 'dark' ? 'text-gray-50' : 'text-gray-900'}`}>{profile.name}</h2>
              {/* Descrição/Email */}
              <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{profile.email}</p>
            </div>

            {/* Lista de informações */}
            <div className={`space-y-4 divide-y ${theme === 'dark' ? 'divide-gray-700' : 'divide-gray-200'}`}>
              
              {/* Cargo */}
              <div className={`flex items-center gap-2 pt-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                <User size={18} className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} /> Cargo:{" "}
                <span className={`font-medium ${theme === 'dark' ? 'text-gray-50' : 'text-gray-900'}`}>{user.role}</span>
              </div>
              
              {/* Departamento */}
              <div className={`flex items-center gap-2 pt-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                <Briefcase size={18} className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />{" "}
                <span className={`font-medium ${theme === 'dark' ? 'text-gray-50' : 'text-gray-900'}`}>{profile.department}</span>
              </div>
              
              {/* Telefone */}
              <div className={`flex items-center gap-2 pt-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                <Phone size={18} className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />{" "}
                <span className={`font-medium ${theme === 'dark' ? 'text-gray-50' : 'text-gray-900'}`}>{profile.phone}</span>
              </div>
            </div>

            <Button className={`mt-12 w-full rounded-lg ${buttonMainClass}`}>
              Upload de imagem
            </Button>
          </Card>

          {/* Card da direita - Formulário de Edição */}
          <Card 
            // Cor do Card e borda
            className={`p-6 shadow-md hover:shadow-xl transition-all duration-300 rounded-2xl flex-1 border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
          >
            {/* Título */}
            <h3 className={`text-xl font-semibold mb-2 ${theme === 'dark' ? 'text-gray-50' : 'text-gray-900'}`}>Informações</h3>
            {/* Descrição */}
            <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mb-6`}>Edite suas informações abaixo:</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Input Nome */}
              <Input
                className={`rounded-lg ${inputFocusClass} ${inputThemeClass}`}
                name="name"
                value={profile.name}
                onChange={handleChange}
                placeholder="Nome"
              />
              
              {/* Input Email */}
              <Input
                className={`rounded-lg ${inputFocusClass} ${inputThemeClass}`}
                name="email"
                value={profile.email}
                onChange={handleChange}
                placeholder="Email"
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Input Departamento */}
                <Input
                  className={`rounded-lg ${inputFocusClass} ${inputThemeClass}`}
                  name="department"
                  value={profile.department}
                  onChange={handleChange}
                  placeholder="Departamento"
                />
                
                {/* Input Telefone */}
                <Input
                  className={`rounded-lg ${inputFocusClass} ${inputThemeClass}`}
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                  placeholder="Telefone"
                />
              </div>

              <Button
                type="submit"
                className={`w-full mt-2 rounded-lg font-medium ${buttonMainClass}`}
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