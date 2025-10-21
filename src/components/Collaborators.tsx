// /plat_inovacao/src/components/Collaborators.tsx

"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { UserPlus, Users, Loader2, CheckCircle, Trash2 } from "lucide-react"; // Importe o Trash2
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { User, UserRole } from "../app/context/UserContext";
import { Sidebar } from "./SideBar";
import api from "../lib/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"; // Importe os Tabs

interface CollaboratorsProps { user: User; }
type InviteStatus = 'idle' | 'loading' | 'success' | 'error';

// Novo tipo para os convites pendentes
interface PendingInvite {
	id: string;
	email: string;
	role: UserRole;
	createdAt: string;
	companyId: string;
	status: 'PENDENTE' | 'ACCEPTED' | 'REJECTED';
}

export function Collaborators({ user }: CollaboratorsProps) {
	const [theme, setTheme] = useState<string>(typeof window !== 'undefined' ? (sessionStorage.getItem('theme') || 'light') : 'light');
	const [collaborators, setCollaborators] = useState<User[]>([]);
	const [pendingInvites, setPendingInvites] = useState<PendingInvite[]>([]); // Estado para convites
	const [isLoading, setIsLoading] = useState(true);
	const [companies, setCompanies] = useState<{ id: string; name: string }[]>([]);
	const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');
	const [inviteEmail, setInviteEmail] = useState('');
	const [inviteRole, setInviteRole] = useState<UserRole>('COMUM');
	const [formError, setFormError] = useState('');
	const [inviteStatus, setInviteStatus] = useState<InviteStatus>('idle');
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [activeTab, setActiveTab] = useState("collaborators");

	// Função de busca de dados refatorada para filtrar no frontend
	const fetchData = useCallback(async () => {
		setIsLoading(true);

		const companyIdToFilter = user.role === 'ADMIN' ? selectedCompanyId : user.companyId;

		try {
			// Busca todos os colaboradores e todos os convites em paralelo
			const [collaboratorsRes, allInvitesRes] = await Promise.all([
				companyIdToFilter ? api.get(`/user/${companyIdToFilter}`) : Promise.resolve({ data: [] }),
				api.get('/invitations') // Busca TODOS os convites
			]);

			setCollaborators(collaboratorsRes.data);

			// --- FILTRO NO FRONTEND ---
			const filteredInvites = allInvitesRes.data.filter(
				(invite: PendingInvite) => invite.companyId === companyIdToFilter && invite.status === 'PENDENTE'
			);
			setPendingInvites(filteredInvites);

		} catch (error: any) {
			console.error("Falha ao buscar dados:", error);
			setCollaborators([]);
			setPendingInvites([]);
		} finally {
			setIsLoading(false);
		}
	}, [user.companyId, user.role, selectedCompanyId]);

	useEffect(() => {
		fetchData();
		if (user.role === 'ADMIN') {
			api.get('/companies/list').then(res => setCompanies(res.data)).catch(err => console.error("Falha ao buscar empresas", err));
		}
	}, [fetchData, user.role]);

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
			console.log('Payload do convite:', payload);
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

	const handleRemoveInvite = async (inviteId: string) => {
		if (!window.confirm('Tem a certeza que quer remover este convite?')) return;

		try {
			await api.delete(`/invitations/${inviteId}`);
			// Atualiza o estado localmente para feedback instantâneo
			setPendingInvites(prev => prev.filter(invite => invite.id !== inviteId));
			alert('Convite removido com sucesso!');
		} catch (error) {
			console.error('Falha ao remover convite:', error);
			alert('Ocorreu um erro ao remover o convite.');
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
				<div className={`bg-[#001f61] sticky top-0 z-10 shadow-md ${theme === 'dark' ? 'bg-gray-800' : ''}`}> {/* Header */} </div>
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
							{/* Componente de Tabs adicionado */}
							<Tabs value={activeTab} onValueChange={setActiveTab}>
								<TabsList className="grid w-full grid-cols-2">
									<TabsTrigger value="collaborators">Colaboradores ({collaborators.length})</TabsTrigger>
									<TabsTrigger value="pending">Convites Pendentes ({pendingInvites.length})</TabsTrigger>
								</TabsList>

								<TabsContent value="collaborators" className="mt-4">
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
								</TabsContent>

								<TabsContent value="pending" className="mt-4">
									<div className="overflow-x-auto">
										<Table>
											<TableHeader>
												<TableRow>
													<TableHead>Email Convidado</TableHead>
													<TableHead>Nível de Acesso</TableHead>
													<TableHead>Data do Convite</TableHead>
													<TableHead className="text-right">Ações</TableHead>
												</TableRow>
											</TableHeader>
											<TableBody>
												{isLoading && <TableRow><TableCell colSpan={4} className="text-center py-10 text-gray-500">A carregar convites...</TableCell></TableRow>}
												{!isLoading && pendingInvites.length === 0 && <TableRow><TableCell colSpan={4} className="text-center py-10 text-gray-500">Nenhum convite pendente encontrado.</TableCell></TableRow>}
												{pendingInvites.map((invite) => (
													<TableRow key={invite.id}>
														<TableCell className="font-medium">{invite.email}</TableCell>
														<TableCell>{getRoleLabel(invite.role)}</TableCell>
														<TableCell>{new Date(invite.createdAt).toLocaleDateString('pt-BR')}</TableCell>
														<TableCell className="text-right">
															<Button variant="ghost" size="sm" onClick={() => handleRemoveInvite(invite.id)} className="text-red-600 hover:text-red-700 hover:bg-red-100">
																<Trash2 className="w-4 h-4 mr-2" /> Remover
															</Button>
														</TableCell>
													</TableRow>
												))}
											</TableBody>
										</Table>
									</div>
								</TabsContent>
							</Tabs>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}