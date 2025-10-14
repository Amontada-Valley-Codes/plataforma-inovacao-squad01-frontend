// /plat_inovacao/src/components/Dashboard.tsx

"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
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
} from "recharts";
import {
  Lightbulb,
  Rocket,
  Users,
  Clock,
  Plus,
  LogOut,
  Target,
  User as UserIcon,
} from "lucide-react";
import { User, Challenge, Startup } from "../app/context/UserContext";
import { Sidebar } from "./SideBar";
import { useRouter } from "next/navigation";
import Image from "next/image";
import api from "../lib/api"; // 1. Importar o Axios
import Loading from "../app/loading"; // 2. Importar o Loading

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

// Interface para os dados agregados do dashboard
interface DashboardData {
  ideasCount: number;
  connectionsCount: number;
  pocsCount: number;
  avgTime: number;
  funnelData: { stage: string; count: number; color: string }[];
  kpiData: { name: string; ideas: number }[];
  pieData: { name: string; value: number; color: string }[];
  recentChallenges: Challenge[];
  startupsCount: number;
  startups: Startup[];
}


export function Dashboard({ user, onLogout }: DashboardProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const [theme, setTheme] = useState<string>(typeof window !== 'undefined' ? (sessionStorage.getItem('theme') || 'light') : 'light');
    const router = useRouter();

    // 3. Estados para os dados do dashboard e loading
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Mapeamento dos nomes das etapas do backend para o frontend
    const stageLabels: { [key: string]: string } = {
        GERACAO: "Geração/Captura",
        PRE_TRIAGEM: "Pré-Triagem",
        IDEACAO: "Ideação",
        TRIAGEM_DETALHADA: "Triagem Detalhada",
        EXPERIMENTACAO: "Experimentação (POC)",
    };

    const funnelColors = {
        "Geração/Captura": "#3B82F6",
        "Pré-Triagem": "#8B5CF6",
        "Ideação": "#06B6D4",
        "Triagem Detalhada": "#10B981",
        "Experimentação (POC)": "#F59E0B",
    };


    // 4. useEffect para buscar todos os dados em paralelo
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                // Executa todas as chamadas de API em paralelo
                const [
                    ideasRes,
                    connectionsRes,
                    pocsRes,
                    challengesRes,
                    startupsRes
                ] = await Promise.all([
                    api.get('/idea/company/' + user.companyId), // Pegar todas as ideias
                    api.get('/connections'),
                    api.get('/poc'),
                    api.get(`/challenges/findByCompany/${user.companyId}`), // Pegar os 5 mais recentes
                    api.get('/startups')
                ]);

                // --- Processamento dos dados ---

                // KPIs
                const ideasCount = ideasRes.data.length;
                const connectionsCount = connectionsRes.data.length;
                const pocsCount = pocsRes.data.length;
				const startupsCount = startupsRes.data.length;

				console.log('Challenges:', challengesRes.data);

                // Gráfico de Funil
                const funnelCounts = ideasRes.data.reduce((acc: any, idea: any) => {
                    const stageName = stageLabels[idea.stage] || 'Outro';
                    acc[stageName] = (acc[stageName] || 0) + 1;
                    return acc;
                }, {});

                const funnelData = Object.entries(funnelCounts).map(([stage, count]) => ({
                    stage,
                    count: count as number,
                    color: funnelColors[stage as keyof typeof funnelColors] || '#ccc'
                }));

                // Gráfico de Distribuição (Pie Chart)
                 const segmentCounts = startupsRes.data.reduce((acc: any, startup: any) => {
                    acc[startup.segment] = (acc[startup.segment] || 0) + 1;
                    return acc;
                }, {});

                const pieData = Object.entries(segmentCounts).map(([name, value], index) => ({
                    name,
                    value: value as number,
                    color: ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'][index % 4]
                }));

                // Atualizar o estado do dashboard com os dados processados
                setDashboardData({
                    ideasCount,
                    connectionsCount,
                    pocsCount,
                    avgTime: 18, // Manter mockado por enquanto
                    funnelData,
                    recentChallenges: challengesRes.data, // A API paginada retorna em `data.data`
                    pieData,
					startupsCount,
					startups: startupsRes.data,
                    kpiData: [ // Manter mockado ou processar `createdAt` das ideias
                        { name: "Jan", ideas: 10 }, { name: "Fev", ideas: 20 },
                        { name: "Mar", ideas: 15 }, { name: "Abr", ideas: 25 },
                        { name: "Mai", ideas: ideasCount },
                    ]
                });
				// console.log('challengesRes.data.data', challengesRes.data.data);

            } catch (error) {
                console.error("Falha ao carregar dados do dashboard:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);


    // Funções de clique e tema (continuam as mesmas)
    const handleChallengeClick = (challenge: Challenge) => {
        sessionStorage.setItem("selectedChallenge", JSON.stringify(challenge));
        router.push(`/funnel/${challenge.id}`);
    };
    const handleThemeChange = (newTheme: string) => {
        sessionStorage.setItem('theme', newTheme);
        setTheme(newTheme);
    };

    // 5. Renderizar o estado de loading
    if (isLoading || !dashboardData) {
        return <Loading />;
    }


    return (
        <div className={`flex h-screen bg-background text-white ${theme === 'dark' ? 'bg-gray-900 text-white' : ''}`}>
            <Sidebar theme={theme} user={user} />

            <div className={`flex-1 overflow-y-auto bg-gray-50 text-gray-900 ${theme === 'dark' ? 'bg-gray-900 text-white' : ''}`}>
                <div className="p-6 md:p-8 space-y-8">
                    {/* Header do Dashboard (código continua o mesmo) */}
                    <div className="flex items-center justify-between">
									<div className="flex flex-col">
									<h1 className={`font-extrabold text-3xl text-[#011677] mb-1 ${theme === 'dark' ? 'text-white' : ''}`}>
										Dashboard
									</h1>
									<p className={`text-gray-500 text-base ${theme === 'dark' ? 'text-gray-200' : ''}`}>
										Visão geral dos indicadores e atividades de <span className="uppercase">{user.company}</span>
									</p>
									</div>
					
									<div className="fixed right-20 z-50">
										<button
											className={`w-14 cursor-pointer h-10 flex items-center justify-center rounded-full bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors shadow-md mr-4 ${theme === 'dark' ? 'bg-gray-700 text-white hover:bg-gray-600' : ''}`}
											onClick={() => handleThemeChange(theme === 'light' ? 'dark' : 'light')}
											aria-label="Mudar tema"
										>
											{/* Ícone de troca de tema (sol/lua) */}
											{theme === 'light' ? (
												<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
													<circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2" fill="currentColor" />
													<path stroke="currentColor" strokeWidth="2" d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
												</svg>
											) : (
												<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
													<path stroke="currentColor" strokeWidth="2" d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" fill="currentColor" />
												</svg>
											)}
										</button>
									</div>
					
									{/* INÍCIO DO BLOCO DE PERFIL CUSTOMIZADO */}
									<div className="relative" ref={menuRef}>
									{/* Círculo de Imagem/Inicial (Botão) */}
									<div
										className="w-10 h-10 bg-[#011677] rounded-full flex items-center justify-center cursor-pointer shadow-md hover:ring-2 ring-offset-2 ring-[#011677] transition-all"
										onClick={() => setIsMenuOpen(!isMenuOpen)}
									>
										{/* Opcional: Adicionar Icone para melhor visibilidade em caso de imagem */}
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
					
									{/* Pop-up de Ações (Menu) - Estilo Card/Dropdown Profissional */}
									{isMenuOpen && (
										<Card className={`absolute right-0 mt-3 w-72 rounded-xl border border-gray-200 shadow-2xl z-20 bg-white p-0 overflow-hidden ${theme === 'dark' ? 'bg-gray-900' : ''}`}>
										{/* Informações do Usuário no Header do Card */}
										<div className="bg-[#011677]/95 p-4 text-center border-b border-gray-100">
											<p className="text-base font-semibold text-white">
											{user.name}
											</p>
											<p className="text-sm text-gray-200 truncate">
											{user.email}
											</p>
										</div>
					
										{/* Conteúdo (Ações) */}
										<CardContent className={`p-2 space-y-1 ${theme === 'dark' ? 'bg-gray-900' : ''}`}>
											{/* Item Ver Perfil */}
											<div
												className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
													theme === 'dark'
														? 'text-gray-200 hover:bg-gray-800'
														: 'text-gray-700 hover:bg-gray-100'
												}`}
												onClick={() => {
													router.push("/profile");
													setIsMenuOpen(false);
												}}
											>
												<UserIcon className={`mr-3 h-4 w-4 ${theme === 'dark' ? 'text-gray-200' : 'text-[#011677]'}`} />
												<span className="text-sm font-medium">Ver Perfil</span>
											</div>
					
											<hr className={`my-1 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-100'}`} />
					
											{/* Item Sair */}
											<div
												className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
													theme === 'dark'
														? 'text-red-400 hover:bg-gray-800'
														: 'text-red-600 hover:bg-red-50'
												}`}
												onClick={onLogout}
											>
												<LogOut className={`mr-3 h-4 w-4 ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`} />
												<span className="text-sm font-semibold">
													Sair da Plataforma
												</span>
											</div>
										</CardContent>
										</Card>
									)}
									</div>
									{/* FIM DO BLOCO DE PERFIL */}
								</div>

                    {/* KPI Cards (Agora usam dados do estado `dashboardData`) */}
                    {user.role === "GESTOR" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <Card className={`shadow-lg hover:shadow-xl transition-shadow duration-300 ${theme === 'dark' ? 'bg-gray-800 text-white' : ''}`}>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className={`text-sm font-medium text-gray-500 ${theme === 'dark' ? 'text-gray-200' : ''}`}>Ideias Submetidas</CardTitle>
                                    <Lightbulb className={`h-4 w-4 text-[#011677] ${theme === 'dark' ? 'text-gray-200' : ''}`} />
                                </CardHeader>
                                <CardContent>
									
                                    <div className={`text-3xl font-bold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>{dashboardData.ideasCount}</div>
                                </CardContent>
                            </Card>
                            
							{/* Card: Startups Conectadas */}
											<Card className={`shadow-lg hover:shadow-xl transition-shadow duration-300 ${theme === 'dark' ? 'bg-gray-800 text-white' : ''}`}>
												<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
												<CardTitle className={`text-sm font-medium text-gray-500 ${theme === 'dark' ? 'text-gray-200' : ''}`}>
													Startups Conectadas
												</CardTitle>
												<Users className="h-4 w-4 text-[#06B6D4]" />
												</CardHeader>
												<CardContent>

												
												<div className={`text-3xl font-bold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>{dashboardData.startupsCount}</div>
												<p className="text-xs text-green-600 mt-1">
													+8% em relação ao mês anterior
												</p>
												</CardContent>
											</Card>
							
											{/* Card: POCs Realizadas */}
											<Card className={`shadow-lg hover:shadow-xl transition-shadow duration-300 ${theme === 'dark' ? 'bg-gray-800 text-white' : ''}`}>
												<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
												<CardTitle className={`text-sm font-medium text-gray-500 ${theme === 'dark' ? 'text-gray-200' : ''}`}>
													POCs Realizadas
												</CardTitle>
												<Rocket className="h-4 w-4 text-[#F59E0B]" />
												</CardHeader>
												<CardContent>
												<div className={`text-3xl font-bold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>{dashboardData.pocsCount}</div>
												<p className="text-xs text-green-600 mt-1">
													+25% em relação ao mês anterior
												</p>
												</CardContent>
											</Card>
							
											{/* Card: Tempo Médio por Etapa */}
											<Card className={`shadow-lg hover:shadow-xl transition-shadow duration-300 ${theme === 'dark' ? 'bg-gray-800 text-white' : ''}`}>
												<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
												<CardTitle className={`text-sm font-medium text-gray-500 ${theme === 'dark' ? 'text-gray-200' : ''}`}>
													Tempo Médio por Etapa
												</CardTitle>
												<Clock className="h-4 w-4 text-red-500" />
												</CardHeader>
												<CardContent>
												<div className={`text-3xl font-bold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
													{dashboardData.avgTime} dias
												</div>
												<p className="text-xs text-red-600 mt-1">
													-15% em relação ao mês anterior
												</p>
												</CardContent>
											</Card>
                        </div>
                    )}

                    {/* Funil de Inovação (Agora usa dados do estado) */}
                    {(user.role === "AVALIADOR" || user.role === "GESTOR") && (
                        <Card className={`lg:col-span-2 shadow-lg ${theme === 'dark' ? 'bg-gray-800 text-white' : ''}`}>
                            <CardHeader>
                                <CardTitle className="text-xl font-bold">Funil de Inovação</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-2">
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                                    {dashboardData.funnelData.map((stage) => (
                                        <div key={stage.stage} className="text-center">
                                            <div
                                                className="h-20 rounded-xl mb-2 flex flex-col items-center justify-center text-white font-bold text-2xl"
                                                style={{ backgroundColor: stage.color }}
                                            >
                                                {stage.count}
                                            </div>
                                            <h4 className="text-sm font-semibold">{stage.stage}</h4>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Gráficos (Agora usam dados do estado) */}
                     {(user.role === "AVALIADOR" || user.role === "GESTOR") && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card className={`shadow-lg ${theme === 'dark' ? 'bg-gray-800 text-white' : ''}`}>
                              <CardHeader>
                                <CardTitle className="text-xl font-bold">Tendência de Ideias</CardTitle>
                              </CardHeader>
                              <CardContent>
                                  <ResponsiveContainer width="100%" height={300}>
                                      <LineChart data={dashboardData.kpiData}>
                                          <XAxis dataKey="name" />
                                          <YAxis />
                                          <Tooltip />
                                          <Line type="monotone" dataKey="ideas" stroke="#011677" />
                                      </LineChart>
                                  </ResponsiveContainer>
                              </CardContent>
                            </Card>
                            <Card className={`shadow-lg ${theme === 'dark' ? 'bg-gray-800 text-white' : ''}`}>
                                <CardHeader>
                                    <CardTitle className="text-xl font-bold">Distribuição por Segmento</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie data={dashboardData.pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                                                {dashboardData.pieData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* Desafios Ativos (Agora usa dados do estado) */}
                    <Card className={`shadow-lg ${theme === 'dark' ? 'bg-gray-800 text-white' : ''}`}>
                        <CardHeader className="flex md:flex-row flex-col md:items-center justify-between pb-4">
										<div>
											<CardTitle className="text-xl font-bold">
											Desafios Ativos
											</CardTitle>
											<CardDescription>
											Desafios em andamento na plataforma que você pode atuar.
											</CardDescription>
										</div>
										<Button
											className={`bg-[#011677] cursor-pointer text-white hover:bg-[#020ebd] mt-4 md:mt-0 font-semibold transition-colorsv ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : ''}`}
											onClick={() => router.push("/challenges/new")}
										>
											<Plus className="w-4 h-4 mr-2" />
											Criar Novo Desafio
										</Button>
										</CardHeader>
						
                        <CardContent>
										<div className="space-y-4">
											{dashboardData.recentChallenges.length === 0 && (
												<p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
													Nenhum desafio recente encontrado.
												</p>
											)}
											{dashboardData.recentChallenges.map((challenge) => (
											<div
												key={challenge.id}
												className={`flex md:items-center md:flex-row flex-col justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-100 cursor-pointer transition-colors ${theme === 'dark' ? 'border-gray-700 hover:bg-gray-600' : ''}`}
											>
												<div className="space-y-1">
												<h4 className={`font-semibold text-lg ${theme === 'dark' ? 'text-gray-200' : 'text-[#011677]'}`}>
													{challenge.name}
												</h4>
												<div className="flex items-center gap-3 flex-wrap">
													{/* Badge da Área */}
													<Badge
													variant="outline"
													className="border-[#011677] text-[#011677] bg-blue-50/50 hover:bg-blue-100 transition-colors"
													>
													{challenge.area}
													</Badge>
						
													{/* Badge do Tipo */}
													<Badge
													className={
														challenge.type === "publico"
														? "bg-green-500 text-white hover:bg-green-600"
														: "bg-yellow-500 text-white hover:bg-yellow-600"
													}
													>
													{challenge.type === "publico" ? "Público" : "Interno"}
													</Badge>
						
													{/* Período */}
													<span className="text-sm text-gray-500 flex items-center gap-1">
													<Clock className="w-4 h-4" />
													{new Date(challenge.startDate).toLocaleDateString(
														"pt-BR"
													)}
													-
													{new Date(challenge.endDate).toLocaleDateString(
														"pt-BR"
													)}
													</span>
												</div>
												</div>
						
												<div className="flex flex-col md:flex-row md:space-x-3 space-y-2 md:space-y-0 mt-4 md:mt-0">
												<Button
													className="bg-gray-200 text-gray-700 h-9 hover:bg-gray-300 transition-colors font-medium cursor-pointer"
													size="sm"
													onClick={(e) => {
													e.stopPropagation(); // Evita que o clique se propague para o div pai
													sessionStorage.setItem(
														"selectedChallenge",
														JSON.stringify(challenge)
													);
													router.push(`/challenges/${challenge.id}`);
													}}
												>
													<Lightbulb className="w-4 h-4 mr-2" />
													Ver Detalhes
												</Button>
						
												{/* Botão Funil de Ideias (Mais proeminente) */}
												<Button
													className="bg-[#011677] text-white hover:bg-[#020ebd] h-9 font-medium transition-colors cursor-pointer"
													onClick={(e) => {
													e.stopPropagation(); // Evita que o clique se propague para o div pai
													handleChallengeClick(challenge);
													}}
												>
													<Target className="w-4 h-4 mr-2" />
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
    );
}