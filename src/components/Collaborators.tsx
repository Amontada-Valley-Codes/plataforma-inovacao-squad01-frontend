// /plat_inovacao/src/components/Collaborators.tsx

"use client";

import React, { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
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
    DialogClose
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { User, UserRole } from "../app/context/UserContext";
import { Sidebar } from "./SideBar";
import { useRouter } from "next/navigation";
import api from "../lib/api";

interface CollaboratorsProps {
    user: User;
}

// Tipo para o estado do convite, vindo da 'main'
type InviteStatus = 'idle' | 'loading' | 'success' | 'error';

export function Collaborators({ user }: CollaboratorsProps) {
    const router = useRouter();
    const [theme, setTheme] = useState<string>(typeof window !== 'undefined' ? (sessionStorage.getItem('theme') || 'light') : 'light');

    // Estados da sua branch (HEAD)
    const [collaborators, setCollaborators] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true); // Para o carregamento da tabela
    const [companies, setCompanies] = useState<{ id: string; name: string }[]>([]);
    const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');

    // Estados do formulário (mistura de ambos)
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteRole, setInviteRole] = useState<UserRole>('COMUM');
    const [formError, setFormError] = useState('');

    // Novos estados de UI da 'main'
    const [inviteStatus, setInviteStatus] = useState<InviteStatus>('idle');
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Lógica de busca de dados da sua branch (HEAD)
    useEffect(() => {
        const fetchCollaborators = async () => {
            if (!user.companyId) {
                setIsLoading(false);
                return;
            };
            setIsLoading(true);
            try {
                const response = await api.get(`/user/${user.companyId}`);
                setCollaborators(response.data);
            } catch (error: any) {
                if (error.response && error.response.status === 404) {
                    setCollaborators([]);
                } else {
                    console.error("Falha ao buscar colaboradores:", error);
                }
            } finally {
                setIsLoading(false);
            }
        };

        const fetchCompanies = async () => {
            if (user.role === 'ADMIN') {
                try {
                    const response = await api.get('/companies/list');
                    setCompanies(response.data);
                } catch (error) {
                    console.error("Falha ao buscar empresas:", error);
                }
            }
        };
        
        fetchCollaborators();
        fetchCompanies();
    }, [user.companyId, user.role]);

    // Função de submit combinada: Lógica da sua branch com os estados de UI da 'main'
    const handleInviteSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError('');
        setInviteStatus('loading');

        if (!inviteEmail || !inviteRole) {
            setFormError('Por favor, preencha todos os campos.');
            setInviteStatus('error');
            return;
        }

        try {
            const roleForBackend = inviteRole.toUpperCase();
            const payload: { email: string; role: string; companyId?: string } = {
                email: inviteEmail,
                role: roleForBackend,
            };

            if (user.role === 'ADMIN') {
                if (!selectedCompanyId) {
                    setFormError('Admin deve selecionar uma empresa.');
                    setInviteStatus('error');
                    return;
                }
                payload.companyId = selectedCompanyId;
            }

            await api.post('/invitations', payload);
            setInviteStatus('success');

            // Fecha o modal e reseta o estado após o sucesso
            setTimeout(() => {
                setIsDialogOpen(false);
            }, 2000);

        } catch (err: any) {
            console.error('Falha ao enviar convite:', err);
            setFormError(err.response?.data?.message || 'Ocorreu um erro.');
            setInviteStatus('error');
        }
    };

    // Função de controlo do Dialog da 'main'
    const handleDialogChange = (open: boolean) => {
        setIsDialogOpen(open);
        if (!open) {
            // Reseta o formulário ao fechar
            setInviteStatus('idle');
            setFormError('');
            setInviteEmail('');
            setInviteRole('COMUM');
            setSelectedCompanyId('');
        }
    };

    const getRoleLabel = (role: UserRole) => {
        const labels: { [key: string]: string } = {
            COMUM: "Usuário Comum",
            AVALIADOR: "Avaliador",
            GESTOR: "Gestor de Inovação",
        };
        return labels[role] || role;
      };

    return (
        <div className={`min-h-screen bg-gray-50 flex ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <Sidebar theme={theme} user={user} />

            <div className="flex-1">
                {/* Header com o estilo da 'main' */}
                <div className={`bg-[#001f61] sticky top-0 z-10 shadow-md ${theme === 'dark' ? 'bg-gray-800' : ''}`}>
                    <div className="container mx-auto px-6 py-4">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <Users className="w-5 h-5 text-white" />
                                <h1 className="text-lg font-bold text-white tracking-wide">
                                    Gestão de Colaboradores
                                </h1>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content com o estilo da 'main' */}
                <div className="container mx-auto px-6 py-8">
                    <Card className={`bg-white border-0 rounded-xl shadow-lg ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}`}>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className={`text-2xl font-extrabold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                                    Equipa e Acessos
                                </CardTitle>
                                <CardDescription className={`text-md text-gray-500 mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Gerencie os acessos e permissões da sua equipa na plataforma.
                                </CardDescription>
                            </div>
                            <Dialog open={isDialogOpen} onOpenChange={handleDialogChange}>
                                <DialogTrigger asChild>
                                    <Button
                                        className={`cursor-pointer bg-[#001f61] text-white hover:bg-[#002a7a] transition-all duration-300 transform hover:scale-[1.02] font-semibold ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : ''}`}
                                        onClick={() => setIsDialogOpen(true)}
                                    >
                                        <UserPlus className="w-4 h-4 mr-2" />
                                        Convidar Colaborador
                                    </Button>
                                </DialogTrigger>

                                <DialogContent className={`bg-white p-6 rounded-xl shadow-2xl max-w-lg ${theme === 'dark' ? 'bg-gray-800' : ''}`}>
                                    <DialogHeader>
                                        <DialogTitle className={`text-2xl font-extrabold text-center text-[#001f61] ${theme === 'dark' ? 'text-gray-200' : ''}`}>
                                            Adicionar Novo Colaborador
                                        </DialogTitle>
                                        <DialogDescription className={`text-gray-500 text-center mt-2 ${theme === 'dark' ? 'text-gray-400' : ''}`}>
                                            Preencha os dados e envie o convite com o nível de acesso apropriado.
                                        </DialogDescription>
                                    </DialogHeader>

                                    <form onSubmit={handleInviteSubmit} className="space-y-6 py-4">
                                        {user.role === "ADMIN" && (
                                            <div className="space-y-2">
                                                <Label htmlFor="company" className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Empresa</Label>
                                                <Select value={selectedCompanyId} onValueChange={setSelectedCompanyId} required>
                                                    <SelectTrigger className={`focus:ring-[#001f61]/30 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-200' : 'border-gray-300'}`}>
                                                        <SelectValue placeholder="Selecione a empresa" />
                                                    </SelectTrigger>
                                                    <SelectContent className={`${theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}`}>
                                                        {companies.map((company) => (
                                                            <SelectItem key={company.id} value={company.id} className={`cursor-pointer ${theme === 'dark' ? 'text-gray-200 hover:bg-gray-600' : 'hover:bg-gray-100'}`}>{company.name}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        )}
                                        <div className="space-y-2">
                                            <Label htmlFor="email" className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>E-mail</Label>
                                            <Input id="email" type="email" placeholder="email@empresa.com" required value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} className={`focus:ring-2 focus:ring-[#001f61]/30 focus:border-[#001f61] transition-colors ${theme === 'dark' ? 'bg-gray-700 text-gray-200 border-gray-600' : 'border-gray-300'}`} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="role" className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Nível de Acesso</Label>
                                            <Select value={inviteRole} onValueChange={(value: UserRole) => setInviteRole(value)} required>
                                                <SelectTrigger className={`focus:ring-[#001f61]/30 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-200' : 'border-gray-300'}`}>
                                                    <SelectValue placeholder="Selecione um nível" />
                                                </SelectTrigger>
                                                <SelectContent className={`${theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}`}>
                                                    <SelectItem value="COMUM" className={`cursor-pointer ${theme === 'dark' ? 'text-gray-200 hover:bg-gray-600' : 'hover:bg-gray-100'}`}>Usuário Comum</SelectItem>
                                                    <SelectItem value="AVALIADOR" className={`cursor-pointer ${theme === 'dark' ? 'text-gray-200 hover:bg-gray-600' : 'hover:bg-gray-100'}`}>Avaliador</SelectItem>
                                                    {user.role === 'ADMIN' && <SelectItem value="GESTOR" className={`cursor-pointer ${theme === 'dark' ? 'text-gray-200 hover:bg-gray-600' : 'hover:bg-gray-100'}`}>Gestor de Inovação</SelectItem>}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        {formError && <p className="text-sm text-red-500 text-center">{formError}</p>}
                                        <Button type="submit" disabled={inviteStatus === 'loading' || inviteStatus === 'success'} className={`w-full cursor-pointer font-bold h-10 transition-all duration-300 ${inviteStatus === 'idle' || inviteStatus === 'error' ? 'bg-[#001f61] hover:bg-[#002a7a] text-white' : inviteStatus === 'loading' ? 'bg-blue-500 cursor-not-allowed text-white' : 'bg-green-600 hover:bg-green-700 text-white'}`}>
                                            {inviteStatus === 'loading' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                            {inviteStatus === 'success' && <CheckCircle className="mr-2 h-4 w-4" />}
                                            {(inviteStatus === 'idle' || inviteStatus === 'error') && 'Enviar Convite'}
                                            {inviteStatus === 'loading' && 'A Enviar...'}
                                            {inviteStatus === 'success' && 'Convidado com Sucesso!'}
                                        </Button>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className={`${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                                            <TableHead className={`text-sm font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Colaborador</TableHead>
                                            <TableHead className={`text-sm font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Nível de Acesso</TableHead>
                                            <TableHead className={`text-right text-sm font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Ações</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {collaborators.length === 0 ? (
                                            <TableRow><TableCell colSpan={3} className="text-center py-10 text-gray-500">{isLoading ? 'A carregar colaboradores...' : 'Nenhum colaborador encontrado.'}</TableCell></TableRow>
                                        ) : (
                                            collaborators.map((collab) => (
                                                <TableRow key={collab.id} className={`${theme === 'dark' ? 'border-gray-700 hover:bg-gray-700/50' : 'border-gray-100 hover:bg-gray-50'}`}>
                                                    <TableCell className="py-4">
                                                        <div className="flex items-center gap-4">
                                                            <Avatar className="h-10 w-10">
                                                                <AvatarImage src={`https://i.pravatar.cc/40?u=${collab.email}`} alt={collab.name} />
                                                                <AvatarFallback className="bg-[#001f61] text-white font-semibold">{collab.name.charAt(0)}</AvatarFallback>
                                                            </Avatar>
                                                            <div>
                                                                <p className={`font-semibold text-base ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>{collab.name}</p>
                                                                <p className={`text-sm text-gray-500 ${theme === 'dark' ? 'text-gray-400' : ''}`}>{collab.email}</p>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Select defaultValue={collab.role} disabled={user.id === collab.id || user.role !== "GESTOR"}>
                                                            <SelectTrigger className={`w-48 cursor-pointer border-gray-300 focus:ring-[#001f61]/30 ${theme === 'dark' ? 'bg-gray-700 text-gray-200 border-gray-600' : ''}`}>
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent className={`shadow-lg ${theme === 'dark' ? 'bg-gray-800 border-gray-600' : ''}`}>
                                                                <SelectItem className={`cursor-pointer ${theme === 'dark' ? 'text-gray-200 hover:bg-gray-700' : 'hover:bg-gray-100'}`} value="COMUM">Usuário Comum</SelectItem>
                                                                <SelectItem className={`cursor-pointer ${theme === 'dark' ? 'text-gray-200 hover:bg-gray-700' : 'hover:bg-gray-100'}`} value="AVALIADOR">Avaliador</SelectItem>
                                                                <SelectItem className={`cursor-pointer ${theme === 'dark' ? 'text-gray-200 hover:bg-gray-700' : 'hover:bg-gray-100'}`} value="GESTOR">Gestor de Inovação</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <Button variant="default" size="sm" disabled={user.id === collab.id} className={`text-white bg-red-600 cursor-pointer hover:bg-red-700 transition-colors font-semibold ${user.id === collab.id ? 'opacity-50 cursor-not-allowed' : ''} ${theme === 'dark' ? 'bg-red-700 hover:bg-red-600' : ''}`}>Remover</Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
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