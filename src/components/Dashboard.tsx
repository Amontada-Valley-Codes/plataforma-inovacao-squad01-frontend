import Image from "next/image";
import React, { useState } from "react";
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
  BarChart,
  Bar,
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
  TrendingUp,
  Clock,
  Plus,
  LogOut,
  Menu,
  Target,
  Database,
  FileText,
} from "lucide-react";
import { User, Challenge } from "../app/context/UserContext";

interface DashboardProps {
  user: User;
  onNavigate: (
    page: "challenge-form" | "startup-database" | "challenge-details",
    challenge?: Challenge
  ) => void;
  onLogout: () => void;
}

export function Dashboard({ user, onNavigate, onLogout }: DashboardProps) {
  const [selectedCompany, setSelectedCompany] = useState(user.company);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  console.log("User role in Dashboard:", user.role);

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
    { name: "Abr", ideias: 88, startups: 31, pocs: 12, tempo: 20 },
    { name: "Mai", ideias: 104, startups: 28, pocs: 15, tempo: 18 },
  ];

  const pieData = [
    { name: "FinTech", value: 35, color: "#3B82F6" },
    { name: "HealthTech", value: 25, color: "#10B981" },
    { name: "EdTech", value: 20, color: "#F59E0B" },
    { name: "Outros", value: 20, color: "#8B5CF6" },
  ];

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
  ];

  return (
    <div className="flex h-screen bg-background bg-[#011677] text-white">
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-16"
        } transition-all duration-300 bg-card shadow-md flex flex-col justify-between`}
      >
        {/* Topo da sidebar */}
        <div className="p-4 w-full flex flex-col">
          <div className="flex items-center gap-2 mb-8 w-full">
            <div className="w-8 h-8 bg-[#160430] rounded-lg flex items-center justify-center">
              <Image
                alt="logo"
                src="/img/Ninna_logo.png"
                width={60}
                height={60}
              />
            </div>
            {sidebarOpen && (
              <span className="font-semibold">InnovatePlatform</span>
            )}
          </div>

          {/* Menu */}
          <nav className="space-y-2 w-full">
            <Button
              variant="secondary"
              className="w-full justify-start cursor-pointer hover:bg-[#160430]"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              {sidebarOpen && "Dashboard"}
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start cursor-pointer hover:bg-[#160430]"
            >
              <Target className="w-4 h-4 mr-2" />
              {sidebarOpen && "Funil de Inovação"}
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start cursor-pointer hover:bg-[#160430]"
              onClick={() => onNavigate("challenge-form")}
            >
              <Plus className="w-4 h-4 mr-2 " />
              {sidebarOpen && "Desafios"}
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start cursor-pointer hover:bg-[#160430]"
              onClick={() => onNavigate("startup-database")}
            >
              <Database className="w-4 h-4 mr-2" />
              {sidebarOpen && "Base de Startups"}
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start cursor-pointer hover:bg-[#160430]"
            >
              <FileText className="w-4 h-4 mr-2" />
              {sidebarOpen && "Relatórios"}
            </Button>

            {user.role === 'gestor' && (
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => onNavigate('collaborators' as any)}
              >
                <Users className="w-4 h-4 mr-2" />
                {sidebarOpen && 'Colaboradores'}
              </Button>
            )}
          </nav>
        </div>

        {/* Rodapé com botão toggle */}
        <div className="p-4 flex items-center justify-center w-full">
          <Button
            variant="ghost"
            size="lg"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex items-center justify-center gap-2 w-full cursor-pointer hover:bg-[#001a90]"
          >
            {sidebarOpen && <span>Recolher</span>}
            <Menu className="w-5 h-5 mt-1" />
          </Button>
        </div>
      </div>
      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-white text-black">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="font-bold text-2xl">Dashboard de Inovação</h1>
                <p className="text-gray-500">
                  Visão geral dos indicadores e atividades
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-lg">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-xs text-primary-foreground">
                    {user.name[0]}
                  </span>
                </div>
                <div className="text-sm">
                  <p className="font-medium">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.role}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="lg"
                onClick={onLogout}
                className="cursor-pointer bg-gray-100 hover:bg-gray-300 "
              >
                <LogOut className="w-7 h-7 mr-1" />
                Sair
              </Button>
            </div>
          </div>

          {/* KPI Cards */}
          {user.role === "gestor" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <Card>
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

              <Card>
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

              <Card>
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

              <Card>
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

          {user.role === "avaliador" || user.role === "gestor" ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Funil de Inovação */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Funil de Inovação</CardTitle>
                  <CardDescription>
                    Distribuição de projetos por etapa do processo de inovação
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {funnelData.map((stage, index) => (
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

          {user.role === "avaliador" || user.role === "gestor" ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Gráfico de Tendências */}
              <Card>
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
                        stroke="#3B82F6"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Distribuição por Segmento */}
              <Card>
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
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Desafios Ativos</CardTitle>
                <CardDescription>
                  Desafios em andamento na plataforma
                </CardDescription>
              </div>
              <Button
                className="bg-[#160430] cursor-pointer text-white"
                onClick={() => onNavigate("challenge-form")}
              >
                <Plus className="w-4 h-4 mr-2" />
                Novo Desafio
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 ">
                {recentChallenges.map((challenge) => (
                  <div
                    key={challenge.id}
                    className="flex items-center justify-between p-4 shadow-lg rounded-lg hover:bg-gray-200 cursor-pointer"
                    onClick={() => onNavigate("challenge-details", challenge)}
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
                    <Button className='bg-blue-500 text-white' size="sm">
                      Ver Detalhes
                    </Button>
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
