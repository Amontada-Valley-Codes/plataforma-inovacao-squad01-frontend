'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { UserPlus, Users } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { User, UserRole } from '../app/context/UserContext'
import { Sidebar } from './SideBar'
import { useRouter } from 'next/navigation'

interface CollaboratorsProps {
	user: User
}

const mockCollaborators: User[] = [
	{ id: '1', name: 'Ana Silva', email: 'ana.silva@techcorp.com', role: 'gestor', company: 'TechCorp Brasil' },
	{ id: '2', name: 'Carlos Santos', email: 'carlos.santos@techcorp.com', role: 'avaliador', company: 'TechCorp Brasil' },
	{ id: '3', name: 'Maria Costa', email: 'maria.costa@techcorp.com', role: 'comum', company: 'TechCorp Brasil' },
	{ id: '4', name: 'João Pereira', email: 'joao.pereira@techcorp.com', role: 'comum', company: 'TechCorp Brasil' },
]

const mockCompanies = [
	{ id: 'comp-01', name: 'TechCorp Brasil' },
	{ id: 'comp-02', name: 'InnovateCorp' },
];

export function Collaborators({ user }: CollaboratorsProps) {
	const router = useRouter()

	const getRoleLabel = (role: UserRole) => {
		const labels = {
			comum: 'Usuário Comum',
			avaliador: 'Avaliador',
			gestor: 'Gestor de Inovação',
		}
		return labels[role] || role
	}

	return (
		<div className="min-h-screen bg-gray-50 flex">
			{/* Sidebar fixa */}
			<Sidebar user={user} />

			{/* Conteúdo principal */}
			<div className="flex-1">
				{/* Header */}
				<div className="bg-white border-b border-gray-200 sticky top-0 z-10">
					<div className="container mx-auto px-6 py-4">
						<div className="flex items-center gap-4">
							<div className="flex items-center gap-2">
								<Users className="w-5 h-5 text-gray-700" />
								<h1 className="text-lg font-semibold text-gray-800">
									Gestão de Colaboradores
								</h1>
							</div>
						</div>
					</div>
				</div>

				{/* Content */}
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
							<Dialog>
								<DialogTrigger asChild>
									<Button className='cursor-pointer bg-[#011677] text-white hover:bg-[#160430]'>
										<UserPlus className="w-4 h-4 mr-2" />
										Adicionar Colaborador
									</Button>
								</DialogTrigger>
								<DialogContent className="bg-white">
									<DialogHeader>
										<DialogTitle>Adicionar Novo Colaborador</DialogTitle>
										{user.role === 'admin' && (
											<DialogDescription>
												Você está a adicionar um novo utilizador. Selecione a empresa e o nível de acesso.
											</DialogDescription>
										)}
									</DialogHeader>
									<div className="space-y-4 py-4">
										{/* CAMPO DE EMPRESA SÓ PARA O ADMIN */}
										{user.role === 'admin' && (
											<div className="space-y-2">
												<Label htmlFor="company">Empresa</Label>
												<Select>
													<SelectTrigger>
														<SelectValue placeholder="Selecione a empresa" />
													</SelectTrigger>
													<SelectContent>
														{mockCompanies.map(company => (
															<SelectItem key={company.id} value={company.id}>{company.name}</SelectItem>
														))}
													</SelectContent>
												</Select>
											</div>
										)}
										<div className="space-y-2">
											<Label htmlFor="name">Nome Completo</Label>
											<Input id="name" placeholder="Nome do colaborador" />
										</div>
										<div className="space-y-2">
											<Label htmlFor="email">E-mail</Label>
											<Input id="email" type="email" placeholder="email@empresa.com" />
										</div>
										<div className="space-y-2">
											<Label htmlFor="role">Nível de Acesso</Label>
											<Select>
												<SelectTrigger>
													<SelectValue placeholder="Selecione um nível" />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="comum">Usuário Comum</SelectItem>
													<SelectItem value="avaliador">Avaliador</SelectItem>
													<SelectItem value="gestor">Gestor de Inovação</SelectItem>
												</SelectContent>
											</Select>
										</div>
										<Button type="submit" className="w-full">
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
										<TableHead className="text-gray-600">Nível de Acesso</TableHead>
										<TableHead className="text-right text-gray-600">Ações</TableHead>
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
													defaultValue={collab.role}
													disabled={user.id === collab.id || user.role !== 'gestor'}
												>
													<SelectTrigger className="w-48 border-gray-400">
														<SelectValue />
													</SelectTrigger>
													<SelectContent className='bg-white border-gray-200 shadow'>
														<SelectItem className='hover:bg-gray-200' value="comum">Usuário Comum</SelectItem>
														<SelectItem className='hover:bg-gray-200' value="avaliador">Avaliador</SelectItem>
														<SelectItem className='hover:bg-gray-200' value="gestor">Gestor de Inovação</SelectItem>
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
	)
}
