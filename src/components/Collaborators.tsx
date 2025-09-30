"use client";

import React, { useState, useEffect } from "react";
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
  DialogClose,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { User, UserRole } from "../app/context/UserContext";
import { Sidebar } from "./SideBar";
import { api } from "../service/Api";
import { DialogFooter } from "./ui/dialog";

interface CollaboratorsProps {
  user: User;
}

const mockCompanies = [
  { id: "comp-01", name: "TechCorp Brasil" },
  { id: "comp-02", name: "InnovateCorp" },
];

export function Collaborators({ user }: CollaboratorsProps) {
  const [collaborators, setCollaborators] = useState<User[]>([]);
  const [companies, setCompanies] = useState<{ id: string; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Estados para o formulário de novo colaborador
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('COMUM');
  const [selectedCompanyId, setSelectedCompanyId] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);


  const fetchCollaborators = async () => {
    try {
      const response = await api.get('/users');
      // Se for admin, mostra todos. Se for gestor, mostra apenas da sua empresa.
      const filteredCollaborators = user.role === 'ADMIN' 
        ? response.data 
        : response.data.filter((collab: User) => collab.companyId === user.companyId);
      setCollaborators(filteredCollaborators);
    } catch (error) {
      console.error("Erro ao buscar colaboradores:", error);
    }
  };
  
  const fetchCompanies = async () => {
    if (user.role === 'ADMIN') {
      try {
        // Num projeto real, buscaríamos as empresas da API: const response = await api.get('/companies');
        setCompanies(mockCompanies); // Usando mock por enquanto
      } catch (error) {
        console.error("Erro ao buscar empresas:", error);
      }
    }
  };

  useEffect(() => {
    setIsLoading(true);
    Promise.all([fetchCollaborators(), fetchCompanies()]).finally(() => setIsLoading(false));
  }, [user]);

  const handleAddCollaborator = async (e: React.FormEvent) => {
    e.preventDefault();
    const companyId = user.role === 'ADMIN' ? selectedCompanyId : user.companyId;

    if (!newName || !newEmail || !companyId) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }

    try {
      await api.post('/users', {
        name: newName,
        email: newEmail,
        password: 'password123', // Senha padrão para o convite
        role: newRole.toUpperCase(), // Garante que o enum seja enviado em maiúsculas
        companyId: companyId,
      });
      
      // Limpa o formulário, fecha o modal e atualiza a lista
      setNewName('');
      setNewEmail('');
      setNewRole('COMUM');
      setIsDialogOpen(false);
      fetchCollaborators(); // Busca a lista atualizada

    } catch (error) {
      console.error("Erro ao adicionar colaborador:", error);
      alert('Não foi possível adicionar o colaborador.');
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar user={user} />
      <div className="flex-1">
        <div className="bg-[#011677] border-b border-gray-200 sticky top-0 z-10">
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

        <div className="container mx-auto px-6 py-8">
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl text-gray-900">
                  Lista de Colaboradores
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Gerencie os acessos e permissões da sua equipa na plataforma.
                </CardDescription>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="cursor-pointer bg-[#011677] text-white hover:bg-[#0121af] transition-colors duration-200">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Adicionar Colaborador
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-white p-6 rounded-lg shadow-lg">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-center text-[#001f61]">
                      Adicionar Novo Colaborador
                    </DialogTitle>
                     <DialogDescription className="text-gray-600 text-center mt-2">
                        Você está a adicionar um novo utilizador. Selecione a empresa e o nível de acesso.
                      </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAddCollaborator}>
                    <div className="space-y-4 py-4">
                      {user.role === "ADMIN" && (
                        <div className="space-y-2">
                          <Label htmlFor="company" className="text-gray-700">Empresa</Label>
                          <Select onValueChange={setSelectedCompanyId} value={selectedCompanyId}>
                            <SelectTrigger className="focus:ring-[#001f61]/30">
                              <SelectValue placeholder="Selecione a empresa" />
                            </SelectTrigger>
                            <SelectContent>
                              {companies.map((company) => (
                                <SelectItem key={company.id} value={company.id}>
                                  {company.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-gray-700">Nome Completo</Label>
                        <Input
                          id="name"
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                          placeholder="Nome do colaborador"
                          className="focus:border-[#001f61] focus:ring focus:ring-[#001f61]/30 transition-colors"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-gray-700">E-mail</Label>
                        <Input
                          id="email"
                          type="email"
                          value={newEmail}
                          onChange={(e) => setNewEmail(e.target.value)}
                          placeholder="email@empresa.com"
                          className="focus:border-[#001f61] focus:ring focus:ring-[#001f61]/30 transition-colors"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="role" className="text-gray-700">Nível de Acesso</Label>
                        <Select onValueChange={(value) => setNewRole(value as UserRole)} value={newRole}>
                          <SelectTrigger className="focus:ring-[#001f61]/30">
                            <SelectValue placeholder="Selecione um nível" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="comum">Usuário Comum</SelectItem>
                            <SelectItem value="avaliador">Avaliador</SelectItem>
                            <SelectItem value="gestor">Gestor de Inovação</SelectItem>
                             {user.role === 'ADMIN' && <SelectItem value="ADMIN">Admin</SelectItem>}
                          </SelectContent>
                        </Select>
                      </div>
                       <DialogFooter>
                          <DialogClose asChild>
                            <Button type="button" variant="ghost">Cancelar</Button>
                          </DialogClose>
                           <Button
                            type="submit"
                            className="w-full bg-[#001f61] hover:bg-[#002a7a] transition-colors text-white"
                          >
                            Enviar Convite
                          </Button>
                       </DialogFooter>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-gray-600">Colaborador</TableHead>
                    <TableHead className="text-gray-600">Nível de Acesso</TableHead>
                    <TableHead className="text-right text-gray-600">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {collaborators.map((collab) => (
                    <TableRow key={collab.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>{collab.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-gray-800">{collab.name}</p>
                            <p className="text-sm text-gray-500">{collab.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Select
                          defaultValue={collab.role.toLowerCase()}
                          disabled={user.id === collab.id || (user.role !== "GESTOR" && user.role !== "ADMIN")}
                        >
                          <SelectTrigger className="w-48 border-gray-400">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-white border-gray-200 shadow">
                            <SelectItem value="comum">Usuário Comum</SelectItem>
                            <SelectItem value="avaliador">Avaliador</SelectItem>
                            <SelectItem value="gestor">Gestor de Inovação</SelectItem>
                             {user.role === 'ADMIN' && <SelectItem value="admin">Admin</SelectItem>}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={user.id === collab.id}
                          className="text-white bg-red-600 cursor-pointer hover:bg-red-700"
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