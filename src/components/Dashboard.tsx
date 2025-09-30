'use client'

import React, { useState, useRef, useEffect } from "react"
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
  User as UserIcon,
} from "lucide-react"
import { User, Challenge } from "../app/context/UserContext" 
import { Sidebar } from "./SideBar"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { api } from "../service/Api" // Corrigindo o caminho da importação

interface DashboardProps {
  user: User
  onLogout: () => void
}

interface KPI {
  ideasCount: number;
  connectionsCount: number;
  pocsCount: number;
}

// Dados mock para os gráficos, pois a lógica de agregação no back-end é mais complexa
const funnelData = [
  { stage: "Geração/Captura", count: 45, color: "#3B82F6" },
  { stage: "Pré-Triagem", count: 28, color: "#8B5CF6" },
  { stage: "Ideação", count: 18, color: "#06B6D4" },
  { stage: "Triagem Detalhada", count: 12, color: "#10B981" },
  { stage: "Experimentação (POC)", count: 7, color: "#F59E0B" },
];
const kpiData = [
  { name: "Jan", ideias: 65, startups: 12, pocs: 3, tempo: 28 },
  { name: "Fev", ideias: 78, startups: 18, pocs: 5, tempo: 25 },
  { name: "Mar", ideias: 92, startups: 25, pocs: 8, tempo: 22 },
];
const pieData = [
  { name: "FinTech", value: 35, color: "#3B82F6" },
  { name: "HealthTech", value: 25, color: "#10B981" },
  { name: "EdTech", value: 20, color: "#F59E0B" },
  { name: "Outros", value: 20, color: "#8B5CF6" },
];


export function Dashboard({ user, onLogout }: DashboardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter()

  const [kpis, setKpis] = useState<KPI>({ ideasCount: 0, connectionsCount: 0, pocsCount: 0 });
  const [recentChallenges, setRecentChallenges] = useState<Challenge[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Lógica para buscar dados da API
  useEffect(() => {
    const fetchData = async () => {
      // No seu UserContext, a companyId está em 'user.company'. Ajustei para corresponder.
      if (!user?.companyId) return;
      
      setIsLoading(true);
      try {
        const [challengesRes, ideasRes, connectionsRes] = await Promise.all([
          api.get('/challenges'),
          api.get('/ideas'),
          api.get('/connections'),
        ]);

        const companyChallenges = challengesRes.data.filter((c: any) => c.companyId === user.companyId);
        const companyIdeas = ideasRes.data.filter((i: any) => i.companyId === user.companyId);
        const companyConnections = connectionsRes.data.filter((c: any) => c.companyId === user.companyId);

        setKpis({
          ideasCount: companyIdeas.length,
          connectionsCount: companyConnections.length,
          pocsCount: companyConnections.filter((c: any) => c.status === 'POC').length,
        });

        setRecentChallenges(companyChallenges.slice(0, 3)); // Mostra os 3 mais recentes

      } catch (error) {
        console.error("Erro ao buscar dados para o dashboard:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // Função para fechar o menu ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuRef]);

  return (
    <div className="flex h-screen bg-[#011677] text-white">
      <Sidebar user={user} />

      <div className="flex-1 overflow-auto bg-[#f9fafb] text-black">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="font-bold text-2xl">Dashboard</h1>
              <p className="text-gray-500">
                Visão geral dos indicadores e atividades
              </p>
            </div>
            
            <div className="relative" ref={menuRef}>
                <div 
                    className="w-10 h-10 bg-[#011677] rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:ring-2 ring-offset-2 ring-[#011677] transition-all"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
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
                            {user.email.charAt(0).toUpperCase()}
                        </span>
                    )}
                </div>

                {isMenuOpen && (
                    <Card className="absolute gap-1 right-0 mt-3 w-64 shadow-2xl z-20">
                        <CardHeader className="p-3 border-b text-center">
                            <p className="text-sm font-medium leading-none">{user.name}</p>
                            <p className="text-xs leading-none text-gray-500">{user.email}</p>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div
                                className="flex items-center p-2 cursor-pointer hover:bg-gray-100 transition"
                                onClick={() => { router.push("/profile"); setIsMenuOpen(false); }}
                            >
                                <UserIcon className="mr-2 h-4 w-4 text-[#011677]" />
                                <span className="text-sm">Ver Perfil</span>
                            </div>
                            <div
                                className="flex items-center p-2 pb-1 cursor-pointer hover:bg-red-50 transition border-t"
                                onClick={onLogout}
                            >
                                <LogOut className="mr-2 h-4 w-4 text-red-600" />
                                <span className="text-sm text-red-600 font-medium">Sair</span>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
          </div>

          {/* KPI Cards - Apenas para GESTOR e ADMIN */}
          {(user.role === "GESTOR" || user.role === "ADMIN") && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Ideias Submetidas</CardTitle>
                  <Lightbulb className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{isLoading ? '...' : kpis.ideasCount}</div>
                  <p className="text-xs text-muted-foreground">Total de ideias na empresa</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Startups Conectadas</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{isLoading ? '...' : kpis.connectionsCount}</div>
                  <p className="text-xs text-muted-foreground">Matches e interesses</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">POCs Realizadas</CardTitle>
                  <Rocket className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{isLoading ? '...' : kpis.pocsCount}</div>
                  <p className="text-xs text-muted-foreground">Provas de conceito em andamento</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Tempo Médio por Etapa</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">18 dias</div>
                  <p className="text-xs text-muted-foreground">(Cálculo pendente)</p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Gráficos e Funil - Para GESTOR, AVALIADOR e ADMIN */}
          {(user.role === "GESTOR" || user.role === "AVALIADOR" || user.role === "ADMIN") && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Funil de Inovação</CardTitle>
                    <CardDescription>Distribuição de projetos por etapa do processo</CardDescription>
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
                          <h4 className="text-sm font-medium mb-1">{stage.stage}</h4>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Tendência de Ideias</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart data={kpiData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Line type="monotone" dataKey="ideias" stroke="#011677" strokeWidth={2} /></LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Distribuição por Segmento</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart><Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name} ${value}%`}>{pieData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}</Pie><Tooltip /></PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </>
          )}

          {/* Desafios Recentes - Visível para todos */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Desafios Ativos</CardTitle>
                <CardDescription>Desafios em andamento na plataforma</CardDescription>
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
              <div className="space-y-4 ">
                 {isLoading ? (
                  <p>A carregar desafios...</p>
                ) : recentChallenges.length > 0 ? (
                  recentChallenges.map((challenge) => (
                    <div
                      key={challenge.id}
                      className="flex items-center justify-between p-4 shadow-lg rounded-lg hover:bg-gray-200 cursor-pointer"
                      onClick={() => {
                        sessionStorage.setItem('selectedChallenge', JSON.stringify(challenge));
                        router.push(`/challenges/${challenge.id}`);
                      }}
                    >
                      <div className="space-y-1">
                        <h4 className="font-medium">{challenge.name}</h4>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{challenge.area}</Badge>
                          <Badge variant={challenge.type === "PUBLICO" ? "default" : "secondary"}>
                            {challenge.type === "PUBLICO" ? "Público" : "Interno"}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            Encerra em: {new Date(challenge.endDate).toLocaleDateString("pt-BR")}
                          </span>
                        </div>
                      </div>
                      <Button className="bg-[#011677] hover:bg-[#0121af] text-white cursor-pointer" size="sm">
                        Ver Detalhes
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-4">Nenhum desafio ativo encontrado para a sua empresa.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}