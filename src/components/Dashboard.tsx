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
    ChevronRight,
} from "lucide-react";
import { User, Challenge, Startup, Idea } from "../app/context/UserContext";
import { Sidebar } from "./SideBar";
import { useRouter } from "next/navigation";
import Image from "next/image";
import api from "../lib/api";
import Loading from "../app/loading";
// 💡 NOVAS IMPORTAÇÕES PARA O MODAL
import { Dialog, DialogContent } from "./ui/dialog";
import { IdeaForm } from "./IdeaForm";
import { Separator } from "./ui/separator";


interface DashboardProps {
    user: User;
    onLogout: () => void;
}

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
}

// 💡 NOVA INTERFACE PARA IDEIAS DE STARTUP
interface StartupIdea extends Idea {
    challengeName?: string;
}

export function Dashboard({ user, onLogout }: DashboardProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const [theme, setTheme] = useState<string>(typeof window !== 'undefined' ? (sessionStorage.getItem('theme') || 'light') : 'light');
    const router = useRouter();
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    
    // 💡 NOVOS ESTADOS PARA O MODAL E DADOS DA STARTUP
    const [startupIdeas, setStartupIdeas] = useState<StartupIdea[]>([]);
    const [isIdeaModalOpen, setIsIdeaModalOpen] = useState(false);
    const [selectedChallengeForIdea, setSelectedChallengeForIdea] = useState<Challenge | null>(null);


    const stageLabels: { [key: string]: string } = {
        GERACAO: "Geração/Captura", PRE_TRIAGEM: "Pré-Triagem", IDEACAO: "Ideação",
        TRIAGEM_DETALHADA: "Triagem Detalhada", EXPERIMENTACAO: "Experimentação (POC)",
    };
    const funnelColors = {
        "Geração/Captura": "#3B82F6", "Pré-Triagem": "#8B5CF6", "Ideação": "#06B6D4",
        "Triagem Detalhada": "#10B981", "Experimentação (POC)": "#F59E0B",
    };

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const challengesEndpoint = user.role === 'ADMIN' || user.role === 'STARTUP'
                ? '/challenges/findByPublic'
                : `/challenges/findByCompany/${user.companyId}`;

            const ideasEndpoint = user.role === 'STARTUP'
                ? `/idea/`
                : `/idea/company/${user.companyId}`;

           
            const startupsEndpoint = '/startups';
            const connectionsEndpoint = user.role === 'ADMIN' ? '/companies/list' : '/connections';
            const pocsEndpoint = user.role === 'ADMIN' ? null : '/poc';

            const apiCalls = [
                api.get(startupsEndpoint),
                api.get(challengesEndpoint),
                api.get(connectionsEndpoint),
            ];

            // 💡 Adiciona chamadas específicas
            if (pocsEndpoint) apiCalls.push(api.get(pocsEndpoint));
            if (user.role === 'STARTUP') apiCalls.push(api.get(ideasEndpoint));
            else apiCalls.push(api.get(user.role === 'ADMIN' ? '/idea' : `/idea/company/${user.companyId}`));


            const [startupsRes, challengesRes, connectionsRes, pocsResOrIdeasRes, startupIdeasRes] = await Promise.all(apiCalls);
            
            const challenges = challengesRes.data.data || challengesRes.data;
            console.log("Desafios carregados:", challengesRes);
            console.log("Ideias carregadas:", startupIdeasRes);

            const ideasFilter = startupIdeasRes?.data.filter((idea: Idea) => idea.authorId === user.id) || [];
            // 💡 Lógica para carregar as ideias da startup
            if (user.role === 'STARTUP') {
                 const ideasWithChallengeName = ideasFilter.map((idea: Idea) => {
                    const challenge = challenges.find((c: Challenge) => c.id === idea.challengeId);
                    return {
                        ...idea,
                        challengeName: challenge ? challenge.name : 'Desafio não encontrado'
                    };
                });
                setStartupIdeas(ideasWithChallengeName);
            }
            
            // Lógica para os outros roles
            const ideasRes = user.role === 'STARTUP' ? { data: [] } : startupIdeasRes || pocsResOrIdeasRes;
            const pocsRes = user.role === 'STARTUP' ? undefined : pocsResOrIdeasRes;
            
            const ideasCount = ideasRes.data.length;
            const startupsCount = startupsRes.data.length;
            const connectionsCount = connectionsRes.data.length;
            const pocsCount = pocsRes ? pocsRes.data.length : 0;

            const funnelCounts = ideasRes.data.reduce((acc: any, idea: any) => {
                const stageName = stageLabels[idea.stage] || 'Outro';
                acc[stageName] = (acc[stageName] || 0) + 1;
                return acc;
            }, {});
            const funnelData = Object.entries(funnelCounts).map(([stage, count]) => ({
                stage, count: count as number, color: funnelColors[stage as keyof typeof funnelColors] || '#ccc'
            }));

            const segmentCounts = startupsRes.data.reduce((acc: any, startup: any) => {
                acc[startup.segment] = (acc[startup.segment] || 0) + 1;
                return acc;
            }, {});
            const pieData = Object.entries(segmentCounts).map(([name, value], index) => ({
                name, value: value as number, color: ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'][index % 4]
            }));

            setDashboardData({
                ideasCount, startupsCount, connectionsCount, pocsCount,
                recentChallenges: challenges, pieData,
                kpiData: [{ name: "Jan", ideas: 10 }, { name: "Mar", ideas: 15 }, { name: "Mai", ideas: ideasCount }],
                avgTime: 0, funnelData,
            });

        } catch (error) {
            console.error("Falha ao carregar dados do dashboard:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchData();
        } else {
            setIsLoading(false);
        }
    }, [user]);

    // 💡 NOVA FUNÇÃO PARA SUBMETER IDEIA
    const handleIdeaSubmit = async (formData: { title: string, description: string }) => {
        if (!selectedChallengeForIdea) return;
        try {
            const newIdeaData = {
                title: formData.title,
                description: formData.description,
                challengeId: selectedChallengeForIdea.id,
                authorId: user.id,
                companyId: user.companyId || user.startupId, 
                stage: 'GERACAO',
                priority: 'BAIXA',
            };
            console.log("Enviando nova ideia:", newIdeaData);
            await api.post('/idea', newIdeaData);
            setIsIdeaModalOpen(false);
            fetchData(); // Recarrega os dados do dashboard
        } catch (error) {
            console.error('Falha ao criar ideia:', error);
            alert('Não foi possível criar a ideia. Tente novamente.');
        }
    };


    const handleChallengeClick = (challenge: Challenge) => {
        sessionStorage.setItem("selectedChallenge", JSON.stringify(challenge));
        router.push(`/funnel/${challenge.id}`);
    };
    const handleThemeChange = (newTheme: string) => {
        sessionStorage.setItem('theme', newTheme);
        setTheme(newTheme);
    };

    if (isLoading || !dashboardData) {
        return <Loading />;
    }
    
    const ideasByChallenge = startupIdeas.reduce((acc, idea) => {
        const key = idea.challengeName || "Desconhecido";
        if (!acc[key]) acc[key] = [];
        acc[key].push(idea);
        return acc;
    }, {} as Record<string, StartupIdea[]>);

    return (
        <div className={`flex h-screen bg-background text-white ${theme === 'dark' ? 'bg-gray-900 text-white' : ''}`}>
            <Sidebar theme={theme} user={user} />

            <div className={`flex-1 overflow-y-auto bg-gray-50 text-gray-900 ${theme === 'dark' ? 'bg-gray-900 text-white' : ''}`}>
                <div className="p-6 md:p-8 space-y-8">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                            <h1 className={`font-extrabold text-3xl text-[#011677] mb-1 ${theme === 'dark' ? 'text-white' : ''}`}>Dashboard</h1>
                            <p className={`text-gray-500 text-base ${theme === 'dark' ? 'text-gray-200' : ''}`}>
                                {user.role === 'STARTUP' ? `Bem-vindo(a), ${user.name}!` : `Visão geral dos indicadores de ${user.company}`}
                            </p>
                        </div>
                        {/* Menu de Perfil */}
                         <div className="flex items-center gap-4">
                            <button
                                className={`w-14 cursor-pointer h-10 flex items-center justify-center rounded-full bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors shadow-md ${theme === 'dark' ? 'bg-gray-700 text-white hover:bg-gray-600' : ''}`}
                                onClick={() => handleThemeChange(theme === 'light' ? 'dark' : 'light')}
                                aria-label="Mudar tema"
                            >
                                {theme === 'light' ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2" fill="currentColor" /><path stroke="currentColor" strokeWidth="2" d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" /></svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke="currentColor" strokeWidth="2" d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" fill="currentColor" /></svg>
                                )}
                            </button>

                            <div className="relative" ref={menuRef}>
                                <div
                                    className="w-10 h-10 bg-[#011677] rounded-full flex items-center justify-center cursor-pointer shadow-md hover:ring-2 ring-offset-2 ring-[#011677] transition-all"
                                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                                >
                                    {user.image_url ? (
                                        <Image src={user.image_url} alt="Perfil" width={40} height={40} className="rounded-full object-cover" />
                                    ) : (
                                        <span className="text-lg font-bold text-white">{user.name[0].toUpperCase()}</span>
                                    )}
                                </div>
                                {isMenuOpen && (
                                    <Card className={`absolute right-0 mt-3 w-72 rounded-xl shadow-2xl z-20 bg-white p-0 overflow-hidden ${theme === 'dark' ? 'bg-gray-900' : ''}`}>
                                        <div className="bg-[#011677]/95 p-4 text-center "><p className="text-base font-semibold text-white">{user.name}</p><p className="text-sm text-gray-200 truncate">{user.email}</p></div>
                                        <CardContent className={`p-2 space-y-1 ${theme === 'dark' ? 'bg-gray-900' : ''}`}>
                                            <div className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${theme === 'dark' ? 'text-gray-200 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'}`} onClick={() => { router.push("/profile"); setIsMenuOpen(false); }}>
                                                <UserIcon className={`mr-3 h-4 w-4 ${theme === 'dark' ? 'text-gray-200' : 'text-[#011677]'}`} />
                                                <span className="text-sm font-medium">Ver Perfil</span>
                                            </div>
                                            <hr className={`my-1 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-100'}`} />
                                            <div className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${theme === 'dark' ? 'text-red-400 hover:bg-gray-800' : 'text-red-600 hover:bg-red-50'}`} onClick={onLogout}>
                                                <LogOut className={`mr-3 h-4 w-4 ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`} />
                                                <span className="text-sm font-semibold">Sair da Plataforma</span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* 💡 RENDERIZAÇÃO CONDICIONAL DO CONTEÚDO */}
                    {user.role === 'STARTUP' ? (
                        // Card de Minhas Ideias para Startups
                        <Card className={`shadow-lg ${theme === 'dark' ? 'bg-gray-800 text-white' : ''}`}>
                            <CardHeader>
                                <CardTitle className="text-xl font-bold">Minhas Ideias Submetidas</CardTitle>
                                <CardDescription>Acompanhe o status das suas propostas para os desafios.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {Object.keys(ideasByChallenge).length > 0 ? Object.entries(ideasByChallenge).map(([challengeName, ideas]) => (
                                    <div key={challengeName}>
                                        <h3 className="font-semibold text-lg mb-2">{challengeName}</h3>
                                        <div className="space-y-3">
                                            {ideas.map(idea => (
                                                <div key={idea.id} className={`flex items-center justify-between p-3 border rounded-lg ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                                                    <p>{idea.title}</p>
                                                    <Badge variant="outline">{stageLabels[idea.stage as keyof typeof stageLabels] || idea.stage}</Badge>
                                                </div>
                                            ))}
                                        </div>
                                        <Separator className="my-4" />
                                    </div>
                                )) : (
                                    <p className="text-center text-gray-500 py-4">Você ainda não submeteu nenhuma ideia.</p>
                                )}
                            </CardContent>
                        </Card>
                    ) : (
                        // Dashboard padrão para outros roles
                        <>
                           {user.role === "GESTOR" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <Card className={`shadow-lg hover:shadow-xl transition-shadow duration-300 ${theme === 'dark' ? 'bg-gray-800 text-white' : ''}`}>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className={`text-sm font-medium text-gray-500 ${theme === 'dark' ? 'text-gray-200' : ''}`}>Ideias Submetidas</CardTitle><Lightbulb className={`h-4 w-4 text-[#011677] ${theme === 'dark' ? 'text-gray-200' : ''}`} /></CardHeader>
                                <CardContent><div className={`text-3xl font-bold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>{dashboardData.ideasCount}</div><p className="text-xs text-green-600 mt-1">+12% em relação ao mês anterior</p></CardContent>
                            </Card>
                            <Card className={`shadow-lg hover:shadow-xl transition-shadow duration-300 ${theme === 'dark' ? 'bg-gray-800 text-white' : ''}`}>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className={`text-sm font-medium text-gray-500 ${theme === 'dark' ? 'text-gray-200' : ''}`}>Startups Conectadas</CardTitle><Users className="h-4 w-4 text-[#06B6D4]" /></CardHeader>
                                <CardContent><div className={`text-3xl font-bold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>{dashboardData.startupsCount}</div><p className="text-xs text-green-600 mt-1">+8% em relação ao mês anterior</p></CardContent>
                            </Card>
                            <Card className={`shadow-lg hover:shadow-xl transition-shadow duration-300 ${theme === 'dark' ? 'bg-gray-800 text-white' : ''}`}>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className={`text-sm font-medium text-gray-500 ${theme === 'dark' ? 'text-gray-200' : ''}`}>POCs Realizadas</CardTitle><Rocket className="h-4 w-4 text-[#F59E0B]" /></CardHeader>
                                <CardContent><div className={`text-3xl font-bold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>{dashboardData.pocsCount}</div><p className="text-xs text-green-600 mt-1">+25% em relação ao mês anterior</p></CardContent>
                            </Card>
                            <Card className={`shadow-lg hover:shadow-xl transition-shadow duration-300 ${theme === 'dark' ? 'bg-gray-800 text-white' : ''}`}>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className={`text-sm font-medium text-gray-500 ${theme === 'dark' ? 'text-gray-200' : ''}`}>Tempo Médio por Etapa</CardTitle><Clock className="h-4 w-4 text-red-500" /></CardHeader>
                                <CardContent><div className={`text-3xl font-bold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>{dashboardData.avgTime} dias</div><p className="text-xs text-red-600 mt-1">-15% em relação ao mês anterior</p></CardContent>
                            </Card>
                        </div>
                    )}
                    
                            {(user.role === "AVALIADOR" || user.role === "GESTOR") && (
                        <Card className={`lg:col-span-2 shadow-lg ${theme === 'dark' ? 'bg-gray-800 text-white' : ''}`}>
                            <CardHeader><CardTitle className="text-xl font-bold">Funil de Inovação</CardTitle><CardDescription>Distribuição de projetos por etapa do processo de inovação.</CardDescription></CardHeader>
                            <CardContent className="pt-2">
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                                    {dashboardData.funnelData.map((stage) => (
                                        <div key={stage.stage} className="text-center">
                                            <div className="h-20 rounded-xl mb-2 flex flex-col items-center justify-center text-white font-bold text-2xl transition-all duration-300 hover:scale-[1.03]" style={{ backgroundColor: stage.color }}>{stage.count}</div>
                                            <h4 className={`text-sm font-semibold mb-1 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>{stage.stage}</h4>
                                            <p className={`text-xs text-gray-500 ${theme === 'dark' ? 'text-gray-400' : ''}`}>projetos</p>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                    
                            {(user.role === "AVALIADOR" || user.role === "GESTOR") && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card className={`shadow-lg ${theme === 'dark' ? 'bg-gray-800 text-white' : ''}`}>
                                <CardHeader><CardTitle className="text-xl font-bold">Tendência de Ideias</CardTitle><CardDescription>Evolução mensal de submissões.</CardDescription></CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <LineChart data={dashboardData.kpiData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}><CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" /><XAxis dataKey="name" stroke="#6b7280" /><YAxis stroke="#6b7280" /><Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #e0e0e0" }} /><Line type="monotone" dataKey="ideas" stroke="#011677" strokeWidth={3} activeDot={{ r: 8 }} /></LineChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                            <Card className={`shadow-lg ${theme === 'dark' ? 'bg-gray-800 text-white' : ''}`}>
                                <CardHeader><CardTitle className="text-xl font-bold">Distribuição por Segmento</CardTitle><CardDescription>Startups por área de atuação.</CardDescription></CardHeader>
                                <CardContent className="pt-0">
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart><Pie data={dashboardData.pieData} cx="50%" cy="50%" outerRadius={100} dataKey="value" labelLine={false} label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}>{dashboardData.pieData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} stroke="#fff" strokeWidth={2} />))}</Pie><Tooltip /></PieChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                        </>
                    )}

                    {/* Lista de Desafios Ativos (com botões condicionais) */}
                    <Card className={`shadow-lg ${theme === 'dark' ? 'bg-gray-800 text-white' : ''}`}>
                        <CardHeader className="flex md:flex-row flex-col md:items-center justify-between pb-4">
                            <div>
                                <CardTitle className="text-xl font-bold">Desafios Ativos</CardTitle>
                                <CardDescription>
                                    {user.role === 'STARTUP' ? 'Oportunidades para você aplicar sua solução.' : 'Desafios em andamento na plataforma.'}
                                </CardDescription>
                            </div>
                            {user.role !== 'STARTUP' && (
                                <Button className={`bg-[#011677] cursor-pointer text-white hover:bg-[#020ebd] mt-4 md:mt-0 font-semibold transition-colorsv ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : ''}`} onClick={() => router.push("/challenges/new")}>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Criar Novo Desafio
                                </Button>
                            )}
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {dashboardData.recentChallenges.map((challenge) => (
                                    <div key={challenge.id} className={`flex md:items-center md:flex-row flex-col justify-between p-4 border rounded-xl hover:bg-gray-100/50 cursor-pointer transition-colors ${theme === 'dark' ? 'border-gray-700 hover:bg-gray-800/50' : 'border-gray-200'}`}>
                                        <div className="space-y-1" onClick={() => router.push(`/challenges/${challenge.id}`)}>
                                            <h4 className={`font-semibold text-lg ${theme === 'dark' ? 'text-gray-200' : 'text-[#011677]'}`}>{challenge.name}</h4>
                                            <div className="flex items-center gap-3 flex-wrap">
                                                <Badge variant="outline" className="border-[#011677] text-[#011677] bg-blue-50/50">{challenge.area}</Badge>
                                                <Badge className={challenge.type === "PUBLICO" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                                                    {challenge.type === "PUBLICO" ? "Público" : "Interno"}
                                                </Badge>
                                                <span className="text-sm text-gray-500 flex items-center gap-1">
                                                    <Clock className="w-4 h-4" />
                                                    {new Date(challenge.startDate).toLocaleDateString("pt-BR")} - {new Date(challenge.endDate).toLocaleDateString("pt-BR")}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col md:flex-row md:space-x-3 space-y-2 md:space-y-0 mt-4 md:mt-0">
                                            <Button className="bg-gray-200 cursor-pointer text-gray-700 h-9 hover:bg-gray-300 font-medium" size="sm" onClick={(e) => { e.stopPropagation(); router.push(`/challenges/${challenge.id}`); }}>
                                                <ChevronRight className="w-4 h-4 mr-2 " />Ver Detalhes
                                            </Button>
                                            
                                            {/* 💡 LÓGICA DE BOTÕES CONDICIONAL */}
                                            {user.role === 'STARTUP' ? (
                                                <Button
                                                    className="bg-green-600 text-white hover:bg-green-700 h-9 font-medium"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedChallengeForIdea(challenge);
                                                        setIsIdeaModalOpen(true);
                                                    }}
                                                >
                                                    <Plus className="w-4 h-4 mr-2" />
                                                    Adicionar Ideia
                                                </Button>
                                            ) : (
                                                <Button className="cursor-pointer bg-[#011677] text-white hover:bg-[#020ebd] h-9 font-medium" onClick={(e) => { e.stopPropagation(); handleChallengeClick(challenge); }}>
                                                    <Target className="w-4 h-4 mr-2" />
                                                    Funil de Ideias
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
            {/* 💡 RENDERIZAÇÃO DO MODAL */}
            <Dialog open={isIdeaModalOpen} onOpenChange={setIsIdeaModalOpen}>
                <DialogContent className={`bg-white ${theme === 'dark' ? 'bg-gray-800' : ''}`}>
                    {selectedChallengeForIdea && (
                        <IdeaForm
                            stageTitle={`para "${selectedChallengeForIdea.name}"`}
                            onSubmit={handleIdeaSubmit}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}