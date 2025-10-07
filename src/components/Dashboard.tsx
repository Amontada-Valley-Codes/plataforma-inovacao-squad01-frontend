'use client'

import React, { useState, useRef, useEffect } from "react" // Importe useRef e useEffect
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import {
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	PieChart,
	Pie,
	Cell,
	LineChart,
	Line,
} from "recharts"
import {
	Lightbulb,
	Rocket,
	Users,
	Clock,
	Plus,
	LogOut,
	Target,
	User as UserIcon, // Renomeado para evitar conflito com a interface User
} from "lucide-react"
// Certifique-se de que User e Challenge são importados corretamente do seu UserContext
import { User, Challenge } from "../app/context/UserContext"
import { Sidebar } from "./SideBar"
import { useRouter } from "next/navigation"
import Image from "next/image"

interface DashboardProps {
	user: User
	onLogout: () => void
}

export function Dashboard({ user, onLogout }: DashboardProps) {
	const [selectedCompany] = useState(user.company)
	const [isMenuOpen, setIsMenuOpen] = useState(false); // NOVO ESTADO para controlar o pop-up
	const menuRef = useRef<HTMLDivElement>(null); // Referência para detectar cliques fora
	const [theme, setTheme] = useState<string>(typeof window !== 'undefined' ? (sessionStorage.getItem('theme') || 'light') : 'light');

	const router = useRouter()

	// Função para fechar o menu ao clicar fora
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
				setIsMenuOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [menuRef]);

	// ... (dados do gráfico mantidos)
	const funnelData = [
		{ stage: "Geração/Captura", count: 45, color: "#3B82F6" },
		{ stage: "Pré-Triagem", count: 28, color: "#8B5CF6" },
		{ stage: "Ideação", count: 18, color: "#06B6D4" },
		{ stage: "Triagem Detalhada", count: 12, color: "#10B981" },
		{ stage: "Experimentação (POC)", count: 7, color: "#F59E0B" },
	]

	const kpiData = [
		{ name: "Jan", ideias: 65, startups: 12, pocs: 3, tempo: 28 },
		{ name: "Fev", ideias: 78, startups: 18, pocs: 5, tempo: 25 },
		{ name: "Mar", ideias: 92, startups: 25, pocs: 8, tempo: 22 },
		{ name: "Abr", ideias: 88, startups: 31, pocs: 12, tempo: 20 },
		{ name: "Mai", ideias: 104, startups: 28, pocs: 15, tempo: 18 },
	]

	const pieData = [
		{ name: "FinTech", value: 35, color: "#3B82F6" },
		{ name: "HealthTech", value: 25, color: "#10B981" },
		{ name: "EdTech", value: 20, color: "#F59E0B" },
		{ name: "Outros", value: 20, color: "#8B5CF6" },
	]

	const recentChallenges: Challenge[] = [
		{
			id: "1",
			name: "Automação de Processos Financeiros",
			startDate: "2024-01-15",
			endDate: "2024-03-15",
			area: "FinTech",
			description:
				"Buscar soluções inovadoras para automatizar processos financeiros internos",
			type: "interno",
			company: selectedCompany,
			status: "ativo",
		},
		{
			id: "2",
			name: "Sustentabilidade na Cadeia de Suprimentos",
			startDate: "2024-02-01",
			endDate: "2024-04-01",
			area: "GreenTech",
			description:
				"Desenvolver soluções sustentáveis para otimizar nossa cadeia de suprimentos",
			type: "publico",
			company: selectedCompany,
			status: "ativo",
		},
	]

	const handleChallengeClick = (challenge: Challenge) => {
		sessionStorage.setItem("selectedChallenge", JSON.stringify(challenge));
		router.push(`/funnel/${challenge.id}`); // Navega para a página do funil com o ID do desafio
	}

	const handleThemeChange = (newTheme: string) => {
		sessionStorage.setItem('theme', newTheme);
		setTheme(newTheme);
		
	}


	return (
		<div className="flex h-screen bg-background bg-[#011677] text-white">
			{/* Sidebar */}
			<Sidebar theme={theme} user={user} />

			{/* Main Content */}
			<div className={`flex-1 overflow-auto bg-gray-900 text-black ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
				<div className="p-6">
					{/* Header */}
					<div className="flex items-center justify-between mb-6">
						<div className="flex items-center gap-4">
							<div>
								<h1 className="font-bold md:text-2xl text-[20px]">Dashboard</h1>
								<p className="text-gray-500 md:text-[17px] text-[13px]">
									Visão geral dos indicadores e atividades
								</p>
							</div>
						</div>

						{/* botao para Mudar tema */}

						<button
							className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors"
							onClick={() => handleThemeChange(theme === 'light' ? 'dark' : 'light')}
						>
							Mudar Tema
						</button>

						<div className="relative" ref={menuRef}>
							{/* O círculo de imagem de perfil (Botão que abre o menu) */}
							<div
								className="w-10 h-10 bg-[#011677] rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:ring-2 ring-offset-2 ring-[#011677] transition-all"
								onClick={() => setIsMenuOpen(!isMenuOpen)} // Alterna o estado do menu
							>
								{/* Renderiza a imagem real ou a inicial */}
								{user.image_url ? (
									<Image
										src={user.image_url}
										alt="Perfil"
										width={40}
										height={40}
										className="rounded-full object-cover"
									/>
								) : (
									<span className="text-lg font-bold text-white">
										{user.name[0].toUpperCase()}
									</span>
								)}
							</div>

							{/* Pop-up de Ações (Menu) */}
							{isMenuOpen && (
								<Card className="absolute right-0 mt-3 w-72 rounded-2xl border border-gray-200 shadow-xl z-20 bg-white p-0 gap-0">
									{/* Header */}
									<CardHeader className="p-4 text-center border-b border-gray-100 !px-4 !pt-4 !gap-0">
										<p className="text-sm font-semibold text-gray-800">{user.name}</p>
										<p className="text-xs text-gray-500 truncate">{user.email}</p>
									</CardHeader>

									{/* Conteúdo */}
									<CardContent className="p-2 !px-2">
										<div
											className="flex items-center p-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
											onClick={() => {
												router.push("/profile");
												setIsMenuOpen(false);
											}}
										>
											<UserIcon className="mr-2 h-4 w-4 text-[#011677]" />
											<span className="text-sm text-gray-700">Ver Perfil</span>
										</div>

										<hr className="my-2 border-gray-200" />

										<div
											className="flex items-center p-2 rounded-lg cursor-pointer hover:bg-red-50 transition-colors"
											onClick={onLogout}
										>
											<LogOut className="mr-2 h-4 w-4 text-red-600" />
											<span className="text-sm text-red-600 font-semibold">Sair</span>
										</div>
									</CardContent>
								</Card>
							)}
						</div>
						{/* FIM DO NOVO BLOCO */}

					</div>
					{/* KPI Cards */}
					{user.role === "gestor" && (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
							<Card className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="text-sm font-medium">
										Ideias Submetidas
									</CardTitle>
									<Lightbulb className="h-4 w-4 text-muted-foreground" />
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-bold">427</div>
									<p className="text-xs text-muted-foreground">
										+12% em relação ao mês anterior
									</p>
								</CardContent>
							</Card>
							
							<Card className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="text-sm font-medium">
										Startups Conectadas
									</CardTitle>
									<Users className="h-4 w-4 text-muted-foreground" />
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-bold">114</div>
									<p className="text-xs text-muted-foreground">
										+8% em relação ao mês anterior
									</p>
								</CardContent>
							</Card>

							<Card className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="text-sm font-medium">
										POCs Realizadas
									</CardTitle>
									<Rocket className="h-4 w-4 text-muted-foreground" />
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-bold">43</div>
									<p className="text-xs text-muted-foreground">
										+25% em relação ao mês anterior
									</p>
								</CardContent>
							</Card>

							<Card className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="text-sm font-medium">
										Tempo Médio por Etapa
									</CardTitle>
									<Clock className="h-4 w-4 text-muted-foreground" />
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-bold">18 dias</div>
									<p className="text-xs text-muted-foreground">
										-15% em relação ao mês anterior
									</p>
								</CardContent>
							</Card>
						</div>
					)}

					{/* Funil de Inovação */}
					{user.role === "avaliador" || user.role === "gestor" ? (
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
							<Card className={`lg:col-span-2 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
								<CardHeader>
									<CardTitle>Funil de Inovação</CardTitle>
									<CardDescription>
										Distribuição de projetos por etapa do processo de inovação
									</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="grid grid-cols-1 md:grid-cols-5 gap-4">
										{funnelData.map((stage) => (
											<div key={stage.stage} className="text-center">
												<div
													className="h-20 rounded-lg mb-2 flex items-center justify-center text-white font-bold text-lg"
													style={{ backgroundColor: stage.color }}
												>
													{stage.count}
												</div>
												<h4 className="text-sm font-medium mb-1">
													{stage.stage}
												</h4>
												<p className="text-xs text-muted-foreground">
													projetos
												</p>
											</div>
										))}
									</div>
								</CardContent>
							</Card>
						</div>
					) : null}

					{/* Gráficos */}
					{user.role === "avaliador" || user.role === "gestor" ? (
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
							<Card className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
								<CardHeader>
									<CardTitle>Tendência de Ideias</CardTitle>
									<CardDescription>
										Evolução mensal de submissões
									</CardDescription>
								</CardHeader>
								<CardContent>
									<ResponsiveContainer width="100%" height={250}>
										<LineChart data={kpiData}>
											<CartesianGrid strokeDasharray="3 3" />
											<XAxis dataKey="name" />
											<YAxis />
											<Tooltip />
											<Line
												type="monotone"
												dataKey="ideias"
												stroke="#011677"
												strokeWidth={2}
											/>
										</LineChart>
									</ResponsiveContainer>
								</CardContent>
							</Card>

							<Card className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
								<CardHeader>
									<CardTitle>Distribuição por Segmento</CardTitle>
									<CardDescription>
										Startups por área de atuação
									</CardDescription>
								</CardHeader>
								<CardContent>
									<ResponsiveContainer width="100%" height={250}>
										<PieChart>
											<Pie
												data={pieData}
												cx="50%"
												cy="50%"
												outerRadius={80}
												dataKey="value"
												label={({ name, value }) => `${name} ${value}%`}
											>
												{pieData.map((entry, index) => (
													<Cell key={`cell-${index}`} fill={entry.color} />
												))}
											</Pie>
											<Tooltip />
										</PieChart>
									</ResponsiveContainer>
								</CardContent>
							</Card>
						</div>
					) : null}

					{/* Desafios Recentes */}
					<Card className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
						<CardHeader className="flex md:flex-row flex-col md:items-center justify-between">
							<div>
								<CardTitle>Desafios Ativos</CardTitle>
								<CardDescription>
									Desafios em andamento na plataforma
								</CardDescription>
							</div>
							<Button
								className="bg-[#011677] cursor-pointer text-white hover:bg-[#0121af]"
								onClick={() => router.push("/challenges/new")}
							>
								<Plus className="w-4 h-4 mr-2" />
								Novo Desafio
							</Button>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{recentChallenges.map((challenge) => (
									<div
										key={challenge.id}
										className={`flex md:items-center md:flex-row flex-col justify-between p-4 shadow-lg rounded-lg hover:bg-gray-200 cursor-pointer ${theme === 'dark' ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-white text-black'}`}

									>
										<div className="space-y-1">
											<h4 className="font-medium">{challenge.name}</h4>
											<div className="flex items-center gap-2">
												<Badge variant="outline">{challenge.area}</Badge>
												<Badge
													variant={
														challenge.type === "publico"
															? "default"
															: "secondary"
													}
												>
													{challenge.type === "publico" ? "Público" : "Interno"}
												</Badge>
												<span className="text-sm text-muted-foreground">
													{new Date(challenge.startDate).toLocaleDateString(
														"pt-BR"
													)}{" "}
													-
													{new Date(challenge.endDate).toLocaleDateString(
														"pt-BR"
													)}
												</span>
											</div>
										</div>
										<div className="flex md:space-x-2 space-y-2 md:space-y-0 mt-4 md:mt-0">
											<Button className="bg-[#011677] mt-2 md:mt-0 h-9 hover:bg-[#0121af] text-white cursor-pointer" size="sm" onClick={() => {
												sessionStorage.setItem('selectedChallenge', JSON.stringify(challenge));
												router.push(`/challenges/${challenge.id}`);
											}}>
												<Lightbulb className="w-4 h-2 mr-2" />
												Ver Detalhes
											</Button>
											<Button
												className="w-50 justify-start bg-[#011677] text-white hover:bg-[#0121af]"
												onClick={() => handleChallengeClick(challenge)}
											>
												<Target className="w-4 h-2 mr-2" />
												Funil de Ideias
											</Button>
										</div>
										
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	)
}