"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
// NOVIDADE: Importando ícones para carregamento e sucesso
import { UserPlus, Users, Loader2, CheckCircle } from "lucide-react"; 
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose // NOVIDADE: Para fechar o Dialog programaticamente, se necessário.
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { User, UserRole } from "../app/context/UserContext";
import { Sidebar } from "./SideBar";
import { useRouter } from "next/navigation";

interface CollaboratorsProps {
  user: User;
}

// ... (mockCollaborators e mockCompanies permanecem os mesmos) ...

const mockCollaborators: User[] = [
  {
    id: "1",
    name: "Ana Silva",
    email: "ana.silva@techcorp.com",
    role: "gestor",
    company: "TechCorp Brasil",
  },
  {
    id: "2",
    name: "Carlos Santos",
    email: "carlos.santos@techcorp.com",
    role: "avaliador",
    company: "TechCorp Brasil",
  },
  {
    id: "3",
    name: "Maria Costa",
    email: "maria.costa@techcorp.com",
    role: "comum",
    company: "TechCorp Brasil",
  },
  {
    id: "4",
    name: "João Pereira",
    email: "joao.pereira@techcorp.com",
    role: "comum",
    company: "TechCorp Brasil",
  },
];

const mockCompanies = [
  { id: "comp-01", name: "TechCorp Brasil" },
  { id: "comp-02", name: "InnovateCorp" },
];

// NOVIDADE: Tipos para o estado do convite
type InviteStatus = 'idle' | 'loading' | 'success';

export function Collaborators({ user }: CollaboratorsProps) {
  const router = useRouter();
  const [theme, setTheme] = useState<string>(typeof window !== 'undefined' ? (sessionStorage.getItem('theme') || 'light') : 'light');

  // NOVIDADE: Estados para o formulário de convite
  const [inviteStatus, setInviteStatus] = useState<InviteStatus>('idle');
  const [isDialogOpen, setIsDialogOpen] = useState(false); // NOVIDADE: Estado para controlar a abertura/fecho do modal

  // Função para simular o envio do convite
  const handleSendInvite = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setInviteStatus('loading'); // 1. Muda para 'carregando'
    
    // Simula uma chamada API com delay de 2 segundos
    await new Promise(resolve => setTimeout(resolve, 2000)); 

    setInviteStatus('success'); // 2. Muda para 'sucesso'
    
    // Opcional: Fechar o modal após um pequeno tempo após o sucesso
    setTimeout(() => {
        setInviteStatus('idle'); // 3. Reinicia o estado para 'idle'
        setIsDialogOpen(false); // 4. Fecha o modal
    }, 2500); 
  };
  
  // Função para resetar o estado quando o modal é fechado (pelo 'X' ou clique fora)
  const handleDialogClose = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      setInviteStatus('idle'); // Garante que o estado seja resetado
    }
  };

  const getRoleLabel = (role: UserRole) => {
    const labels = {
      comum: "Usuário Comum",
      avaliador: "Avaliador",
      gestor: "Gestor de Inovação",
    };
    return labels[role] || role;
  };

  return (
    <div className={`min-h-screen bg-gray-50 flex ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Sidebar fixa */}
      <Sidebar theme={theme} user={user} />

      {/* Conteúdo principal */}
      <div className="flex-1">
        {/* Header - Cor mais profissional e alinhada ao branding */}
        <div className={`bg-[#001f61] sticky top-0 z-10 shadow-md ${theme === 'dark' ? 'bg-gray-800' : ''}`}>
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-white" />
                <h1 className="text-lg font-bold text-white tracking-wide"> {/* Font Bold e Espaçamento maior */}
                  Gestão de Colaboradores
                </h1>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-6 py-8">
          <Card className={`bg-white border-0 rounded-xl shadow-lg ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}`}> {/* Borda zero e sombra mais suave */}
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className={`text-2xl font-extrabold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}> {/* Título maior e mais impactante */}
                  Equipa e Acessos
                </CardTitle>
                <CardDescription className={`text-md text-gray-500 mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Gerencie os acessos e permissões da sua equipa na plataforma.
                </CardDescription>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}> {/* NOVIDADE: Usando o estado para controlar a abertura */}
                <DialogTrigger asChild>
                  <Button 
                    className={`cursor-pointer bg-[#001f61] text-white hover:bg-[#002a7a] transition-all duration-300 transform hover:scale-[1.02] font-semibold ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : ''}`}
                    onClick={() => setIsDialogOpen(true)}
                  > {/* Corrigindo a cor de fundo para o novo padrão, hover mais suave */}
                    <UserPlus className="w-4 h-4 mr-2" />
                    Convidar Colaborador
                  </Button>
                </DialogTrigger>
                
                <DialogContent className={`bg-white p-6 rounded-xl shadow-2xl max-w-lg ${theme === 'dark' ? 'bg-gray-800' : ''}`}> {/* Modal maior, bordas mais arredondadas e sombra mais forte */}
                  <DialogHeader>
                    <DialogTitle className={`text-2xl font-extrabold text-center text-[#001f61] ${theme === 'dark' ? 'text-gray-200' : ''}`}>
                      Adicionar Novo Colaborador
                    </DialogTitle>
                    {user.role === "admin" && (
                      <DialogDescription className={`text-gray-500 text-center mt-2 ${theme === 'dark' ? 'text-gray-400' : ''}`}>
                        Preencha os dados e envie o convite com o nível de acesso apropriado.
                      </DialogDescription>
                    )}
                  </DialogHeader>
                  
                  {/* NOVIDADE: Adicionando o formulário para o 'handleSendInvite' */}
                  <form onSubmit={handleSendInvite} className="space-y-6 py-4"> 
                    {/* CAMPO DE EMPRESA SÓ PARA O ADMIN */}
                    {user.role === "admin" && (
                      <div className="space-y-2">
                        <Label htmlFor="company" className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                          Empresa
                        </Label>
                        <Select>
                          <SelectTrigger className={`focus:ring-[#001f61]/30 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-200' : 'border-gray-300'}`}>
                            <SelectValue placeholder="Selecione a empresa" />
                          </SelectTrigger>
                          <SelectContent className={`${theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}`}>
                            {mockCompanies.map((company) => (
                              <SelectItem 
                                key={company.id} 
                                value={company.id}
                                className={`cursor-pointer ${theme === 'dark' ? 'text-gray-200 hover:bg-gray-600' : 'hover:bg-gray-100'}`}
                              >
                                {company.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="name" className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        Nome Completo
                      </Label>
                      <Input
                        id="name"
                        placeholder="Nome do colaborador"
                        required // NOVIDADE: Adicionando required para validação básica
                        className={`focus:ring-2 focus:ring-[#001f61]/30 focus:border-[#001f61] transition-colors ${theme === 'dark' ? 'bg-gray-700 text-gray-200 border-gray-600' : 'border-gray-300'}`}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        E-mail
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="email@empresa.com"
                        required // NOVIDADE: Adicionando required
                        className={`focus:ring-2 focus:ring-[#001f61]/30 focus:border-[#001f61] transition-colors ${theme === 'dark' ? 'bg-gray-700 text-gray-200 border-gray-600' : 'border-gray-300'}`}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role" className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        Nível de Acesso
                      </Label>
                      <Select required> {/* NOVIDADE: Adicionando required */}
                        <SelectTrigger className={`focus:ring-[#001f61]/30 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-200' : 'border-gray-300'}`}>
                          <SelectValue placeholder="Selecione um nível" />
                        </SelectTrigger>
                        <SelectContent className={`${theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}`}>
                          <SelectItem value="comum" className={`cursor-pointer ${theme === 'dark' ? 'text-gray-200 hover:bg-gray-600' : 'hover:bg-gray-100'}`}>Usuário Comum</SelectItem>
                          <SelectItem value="avaliador" className={`cursor-pointer ${theme === 'dark' ? 'text-gray-200 hover:bg-gray-600' : 'hover:bg-gray-100'}`}>Avaliador</SelectItem>
                          <SelectItem value="gestor" className={`cursor-pointer ${theme === 'dark' ? 'text-gray-200 hover:bg-gray-600' : 'hover:bg-gray-100'}`}>Gestor de Inovação</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {/* NOVIDADE: Lógica e Estilo do Botão */}
                    <Button
                      type="submit"
                      disabled={inviteStatus !== 'idle'} // Desabilita se estiver carregando ou em sucesso
                      className={`w-full font-bold h-10 transition-all duration-300 ${
                        inviteStatus === 'idle' 
                          ? 'bg-[#001f61] hover:bg-[#002a7a] text-white' 
                          : inviteStatus === 'loading' 
                            ? 'bg-blue-500 cursor-not-allowed text-white' 
                            : 'bg-green-600 hover:bg-green-700 text-white'
                      }`}
                    >
                      {inviteStatus === 'loading' && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> // Ícone de carregamento
                      )}
                      {inviteStatus === 'success' && (
                        <CheckCircle className="mr-2 h-4 w-4" /> // Ícone de sucesso
                      )}
                      {inviteStatus === 'idle' && 'Enviar Convite'}
                      {inviteStatus === 'loading' && 'A Enviar...'}
                      {inviteStatus === 'success' && 'Convidado com Sucesso!'}
                    </Button>

                  </form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            
            <CardContent className="pt-6"> {/* Espaçamento interno da CardContent */}
              <div className="overflow-x-auto"> {/* Garante que a tabela seja responsiva em telas pequenas */}
                <Table>
                  <TableHeader>
                    <TableRow className={`${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                      <TableHead className={`text-sm font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Colaborador</TableHead>
                      <TableHead className={`text-sm font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        Nível de Acesso
                      </TableHead>
                      <TableHead className={`text-right text-sm font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        Ações
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockCollaborators.map((collab) => (
                      <TableRow key={collab.id} className={`${theme === 'dark' ? 'border-gray-700 hover:bg-gray-700/50' : 'border-gray-100 hover:bg-gray-50'}`}> {/* Estilo de hover na linha */}
                        <TableCell className="py-4"> {/* Aumentando o padding da célula */}
                          <div className="flex items-center gap-4"> {/* Aumentando o gap */}
                            <Avatar className="h-10 w-10"> {/* Avatar um pouco maior */}
                              <AvatarImage
                                src={`https://i.pravatar.cc/40?u=${collab.email}`}
                                alt={collab.name}
                              />
                              <AvatarFallback className="bg-[#001f61] text-white font-semibold">
                                {collab.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className={`font-semibold text-base ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}> {/* Texto mais claro no Dark Mode */}
                                {collab.name}
                              </p>
                              <p className={`text-sm text-gray-500 ${theme === 'dark' ? 'text-gray-400' : ''}`}>
                                {collab.email}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Select
                            defaultValue={collab.role}
                            disabled={
                              user.id === collab.id || user.role !== "gestor"
                            }
                          >
                            <SelectTrigger className={`w-48 hover:bg-gray-800 cursor-pointer border-gray-300 focus:ring-[#001f61]/30 ${theme === 'dark' ? 'bg-gray-700 text-gray-200 border-gray-600' : ''}`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className={`shadow-lg ${theme === 'dark' ? 'bg-gray-800 border-gray-600' : ''}`}>
                              <SelectItem className={`cursor-pointer ${theme === 'dark' ? 'text-gray-200 hover:bg-gray-700' : 'hover:bg-gray-100'}`} value="comum">Usuário Comum</SelectItem>
                              <SelectItem className={`cursor-pointer ${theme === 'dark' ? 'text-gray-200 hover:bg-gray-700' : 'hover:bg-gray-100'}`} value="avaliador">Avaliador</SelectItem>
                              <SelectItem className={`cursor-pointer ${theme === 'dark' ? 'text-gray-200 hover:bg-gray-700' : 'hover:bg-gray-100'}`} value="gestor">Gestor de Inovação</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="default" // Usando default para um botão sólido
                            size="sm"
                            disabled={user.id === collab.id}
                            className={`text-white bg-red-600 cursor-pointer hover:bg-red-700 transition-colors font-semibold ${user.id === collab.id ? 'opacity-50 cursor-not-allowed' : ''} ${theme === 'dark' ? 'bg-red-700 hover:bg-red-600' : ''}`}
                          >
                            Remover
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}