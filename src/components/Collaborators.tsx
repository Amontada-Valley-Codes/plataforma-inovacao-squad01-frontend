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
import { UserPlus, Users } from "lucide-react";
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
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { User, UserRole } from "../app/context/UserContext";
import { Sidebar } from "./SideBar";
import { useRouter } from "next/navigation";

interface CollaboratorsProps {
  user: User;
}

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

export function Collaborators({ user }: CollaboratorsProps) {
  const router = useRouter();
  const [theme, setTheme] = useState<string>(typeof window !== 'undefined' ? (sessionStorage.getItem('theme') || 'light') : 'light');

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
        {/* Header */}
        <div className={`bg-[#011677] sticky top-0 z-10 ${theme === 'dark' ? 'bg-gray-800' : ''}`}>
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-white" />
                <h1 className="text-lg font-semibold text-white">
                  Gestão de Colaboradores
                </h1>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-6 py-8">
          <Card className={`bg-white border border-gray-200 shadow-sm ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}`}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className={`text-xl ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                  Lista de Colaboradores
                </CardTitle>
                <CardDescription className={`text-gray-600 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Gerencie os acessos e permissões da sua equipa na plataforma.
                </CardDescription>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className={`cursor-pointer bg-[#011677] text-white hover:bg-[#0121af] transition-colors duration-200 ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : ''}`}>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Adicionar Colaborador
                  </Button>
                </DialogTrigger>
                <DialogContent className={`bg-white p-6 rounded-lg shadow-lg ${theme === 'dark' ? 'bg-gray-800' : ''}`}>
                  <DialogHeader>
                    <DialogTitle className={`text-2xl font-bold text-center text-[#001f61] ${theme === 'dark' ? 'text-gray-200' : ''}`}>
                      Adicionar Novo Colaborador
                    </DialogTitle>
                    {user.role === "admin" && (
                      <DialogDescription className={`text-gray-600 text-center mt-2 ${theme === 'dark' ? 'text-gray-400' : ''}`}>
                        Você está a adicionar um novo utilizador. Selecione a
                        empresa e o nível de acesso.
                      </DialogDescription>
                    )}
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    {/* CAMPO DE EMPRESA SÓ PARA O ADMIN */}
                    {user.role === "admin" && (
                      <div className="space-y-2">
                        <Label htmlFor="company" className="text-gray-700">
                          Empresa
                        </Label>
                        <Select>
                          <SelectTrigger className="focus:ring-[#001f61]/30">
                            <SelectValue placeholder="Selecione a empresa" />
                          </SelectTrigger>
                          <SelectContent>
                            {mockCompanies.map((company) => (
                              <SelectItem key={company.id} value={company.id}>
                                {company.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="name" className={`text-gray-700 ${theme === 'dark' ? 'text-gray-400' : ''}`}>
                        Nome Completo
                      </Label>
                      <Input
                        id="name"
                        placeholder="Nome do colaborador"
                        className={`focus:border-[#001f61]/30 focus:ring focus:ring-[#001f61]/30 transition-colors ${theme === 'dark' ? 'bg-gray-800 text-gray-200' : ''}`}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className={`text-gray-700 ${theme === 'dark' ? 'text-gray-400' : ''}`}>
                        E-mail
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="email@empresa.com"
                        className={`focus:border-[#001f61]/30 focus:ring focus:ring-[#001f61]/30 transition-colors ${theme === 'dark' ? 'bg-gray-800 text-gray-200' : ''}`}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role" className={`text-gray-700 ${theme === 'dark' ? 'text-gray-400' : ''}`}>
                        Nível de Acesso
                      </Label>
                      <Select>
                        <SelectTrigger className="focus:ring-[#001f61]/30">
                          <SelectValue placeholder="Selecione um nível" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="comum">Usuário Comum</SelectItem>
                          <SelectItem value="avaliador">Avaliador</SelectItem>
                          <SelectItem value="gestor">
                            Gestor de Inovação
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      type="submit"
                      className={`w-full bg-[#001f61] hover:bg-[#002a7a] transition-colors text-white ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : ''}`}
                    >
                      Enviar Convite
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-gray-600">Colaborador</TableHead>
                    <TableHead className="text-gray-400">
                      Nível de Acesso
                    </TableHead>
                    <TableHead className="text-right text-gray-600">
                      Ações
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockCollaborators.map((collab) => (
                    <TableRow key={collab.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage
                              src={`https://i.pravatar.cc/40?u=${collab.email}`}
                              alt={collab.name}
                            />
                            <AvatarFallback>
                              {collab.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className={`font-semibold  ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
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
                          <SelectTrigger className={`w-48 border-gray-400 cursor-pointer ${theme === 'dark' ? 'bg-gray-800 text-gray-200' : ''}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className={`bg-white border-gray-200 shadow ${theme === 'dark' ? 'bg-gray-900 border-gray-700' : ''}`}>
                            <SelectItem
                              className={`hover:bg-gray-200 cursor-pointer ${theme === 'dark' ? 'hover:bg-gray-700 text-gray-300' : ''}`}
                              value="comum"
                            >
                              Usuário Comum
                            </SelectItem>
                            <SelectItem
                              className={`hover:bg-gray-200 cursor-pointer ${theme === 'dark' ? 'hover:bg-gray-700 text-gray-300' : ''}`}
                              value="avaliador"
                            >
                              Avaliador
                            </SelectItem>
                            <SelectItem
                              className={`hover:bg-gray-200 cursor-pointer ${theme === 'dark' ? 'hover:bg-gray-700 text-gray-300' : ''}`}
                              value="gestor"
                            >
                              Gestor de Inovação
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={user.id === collab.id}
                          className={`text-white bg-red-700 cursor-pointer hover:bg-red-800 transition-colors ${theme === 'dark' ? 'bg-red-800 hover:bg-red-700' : ''}`}
                        >
                          Remover
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
