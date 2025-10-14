import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import {
  ArrowLeft,
  Search,
  Filter,
  Building2,
  Users,
  TrendingUp,
  Eye,
  MapPin,
  Calendar,
  Award,
} from "lucide-react";
import { User, Startup } from "../app/context/UserContext";

interface StartupDatabaseProps {
  user: User;
  onNavigate: (page: "dashboard") => void;
}

export function StartupDatabase({ user, onNavigate }: StartupDatabaseProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    segment: "",
    stage: "",
    technology: "",
    location: "",
  });
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [theme, setTheme] = useState<string>(typeof window !== 'undefined' ? (sessionStorage.getItem('theme') || 'light') : 'light');

  // Mock data de startups
  const mockStartups: (Startup & {
    location: string;
    foundedYear: number;
    employees: string;
    funding: string;
  })[] = [
    {
      id: "1",
      name: "FinanceAI",
      segment: "FinTech",
      stage: "tracao",
      technology: "IA, Machine Learning",
      problem: "Automação de processos financeiros",
      description:
        "Plataforma de IA para automação inteligente de processos financeiros corporativos, reduzindo custos operacionais em até 60%.",
      location: "São Paulo, SP",
      foundedYear: 2021,
      employees: "11-50",
      funding: "Series A - R$ 15M",
    },
    {
      id: "2",
      name: "GreenChain",
      segment: "GreenTech",
      stage: "operacao",
      technology: "Blockchain, IoT",
      problem: "Rastreabilidade na cadeia de suprimentos",
      description:
        "Solução blockchain para rastreabilidade completa e sustentável da cadeia de suprimentos, garantindo transparência e redução de impacto ambiental.",
      location: "Rio de Janeiro, RJ",
      foundedYear: 2020,
      employees: "51-100",
      funding: "Seed - R$ 5M",
    },
    {
      id: "3",
      name: "HealthBot",
      segment: "HealthTech",
      stage: "escala",
      technology: "IA, Telemedicina",
      problem: "Diagnóstico médico assistido",
      description:
        "Assistente virtual baseado em IA para apoio ao diagnóstico médico, já utilizado por mais de 500 clínicas no Brasil.",
      location: "Belo Horizonte, MG",
      foundedYear: 2019,
      employees: "101-500",
      funding: "Series B - R$ 45M",
    },
    {
      id: "4",
      name: "EduVR",
      segment: "EdTech",
      stage: "ideacao",
      technology: "VR/AR, Gamificação",
      problem: "Educação imersiva",
      description:
        "Plataforma de educação em realidade virtual para treinamentos corporativos e educação técnica.",
      location: "Florianópolis, SC",
      foundedYear: 2023,
      employees: "1-10",
      funding: "Pre-Seed - R$ 800K",
    },
    {
      id: "5",
      name: "SmartFactory",
      segment: "Industry 4.0",
      stage: "tracao",
      technology: "IoT, Analytics",
      problem: "Otimização industrial",
      description:
        "Sistema IoT para monitoramento e otimização de processos industriais, aumentando eficiência em 35%.",
      location: "Porto Alegre, RS",
      foundedYear: 2022,
      employees: "21-50",
      funding: "Series A - R$ 12M",
    },
    {
      id: "6",
      name: "CyberShield",
      segment: "CyberSecurity",
      stage: "operacao",
      technology: "AI, Cybersecurity",
      problem: "Segurança cibernética",
      description:
        "Plataforma de segurança cibernética com detecção de ameaças por IA em tempo real.",
      location: "São Paulo, SP",
      foundedYear: 2021,
      employees: "31-100",
      funding: "Seed - R$ 8M",
    },
  ];

  const filteredStartups = mockStartups.filter((startup) => {
    const matchesSearch =
      searchQuery === "" ||
      startup.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      startup.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      startup.problem.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSegment =
      filters.segment === "" || startup.segment === filters.segment;
    const matchesStage =
      filters.stage === "" || startup.stage === filters.stage;
    const matchesTechnology =
      filters.technology === "" ||
      startup.technology
        .toLowerCase()
        .includes(filters.technology.toLowerCase());

    return matchesSearch && matchesSegment && matchesStage && matchesTechnology;
  });

  const getStageLabel = (stage: string) => {
    const labels = {
      ideacao: "Ideação",
      operacao: "Operação",
      tracao: "Tração",
      escala: "Escala",
    };
    return labels[stage as keyof typeof labels] || stage;
  };

  // Cores de badge unificadas para o azul principal
  const getStageColor = (stage: string) => {
    const colors = {
      ideacao: "bg-blue-50 text-blue-800",
      operacao: "bg-blue-100 text-blue-800",
      tracao: "bg-blue-200 text-blue-800",
      escala: "bg-blue-300 text-blue-800",
    };
    return colors[stage as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
      {/* Header */}
      <div className={`bg-[#011677] text-white shadow-lg ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-[#011677] text-white'}`}>
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate("dashboard")}
                className="hovers-exit-dash"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar ao Dashboard
              </Button>
              <Separator orientation="vertical" className="h-6 bg-white/30" />
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                <h1 className="text-xl font-semibold">Base de Startups</h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className={
                  viewMode === "grid"
                    ? "bg-[#001f61] text-white hover:bg-[#002a7a] border-white"
                    : "border-white text-white hover:bg-white hover:text-[#001f61] cursor-pointer"
                }
              >
                Grade
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
                className={
                  viewMode === "list"
                    ? "bg-[#001f61] text-white hover:bg-[#002a7a] border-white"
                    : "border-white text-white hover:bg-white hover:text-[#001f61] cursor-pointer"
                }
              >
                Lista
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* --- */}
      {/* Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="mb-6">
            <h2 className={`text-3xl font-bold text-[#001f61] ${theme === 'dark' ? 'text-gray-200' : ''}`}>
              Explore Startups Inovadoras
            </h2>
            <p className={` ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Encontre as startups perfeitas para seus desafios de inovação.
            </p>
          </div>

          <Card className={`shadow-lg rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <CardHeader>
              <CardTitle className={`flex items-center gap-2 text-[#001f61] ${theme === 'dark' ? 'text-gray-200' : ''}`}>
                <Filter className="w-5 h-5" />
                Busca e Filtros
              </CardTitle>
            </CardHeader>
            <CardContent className={``}>
              <div className="space-y-4">
                {/* Search Bar */}
                <div className="space-y-2">
                  <Label className={` ${theme === 'dark' ? 'text-gray-200' : ''}`} htmlFor="search">Buscar Startups</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="search"
                      placeholder="Nome, problema que resolve, tecnologia..."
                      className={`pl-10 focus:border-[#001f61] focus:ring focus:ring-[#001f61]/30 transition-colors border-gray-500 ${theme === 'dark' ? 'bg-gray-800 text-gray-200' : 'bg-white text-black'}`}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label className={` ${theme === 'dark' ? 'text-gray-200' : ''}`}>Segmento</Label>
                    <Select
                      value={filters.segment}
                      onValueChange={(value: string) =>
                        setFilters({
                          ...filters,
                          segment: value === "all" ? "" : value,
                        })
                      }
                    >
                      <SelectTrigger className="focus:ring-[#001f61]/30 cursor-pointer">
                        <SelectValue placeholder="Todos os segmentos" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos os segmentos</SelectItem>
                        <SelectItem value="FinTech">FinTech</SelectItem>
                        <SelectItem value="HealthTech">HealthTech</SelectItem>
                        <SelectItem value="EdTech">EdTech</SelectItem>
                        <SelectItem value="GreenTech">GreenTech</SelectItem>
                        <SelectItem value="Industry 4.0">
                          Industry 4.0
                        </SelectItem>
                        <SelectItem value="CyberSecurity">
                          CyberSecurity
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className={` ${theme === 'dark' ? 'text-gray-200' : ''}`}>Estágio de Maturidade</Label>
                    <Select
                      value={filters.stage}
                      onValueChange={(value: string) =>
                        setFilters({
                          ...filters,
                          stage: value === "all" ? "" : value,
                        })
                      }
                    >
                      <SelectTrigger className="focus:ring-[#001f61]/30 cursor-pointer">
                        <SelectValue placeholder="Todos os estágios" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos os estágios</SelectItem>
                        <SelectItem value="ideacao">Ideação</SelectItem>
                        <SelectItem value="operacao">Operação</SelectItem>
                        <SelectItem value="tracao">Tração</SelectItem>
                        <SelectItem value="escala">Escala</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className={` ${theme === 'dark' ? 'text-gray-200' : ''}`}>Tecnologia</Label>
                    <Input
                      placeholder="Ex: IA, Blockchain..."
                      value={filters.technology}
                      onChange={(e) =>
                        setFilters({ ...filters, technology: e.target.value })
                      }
                      className={`focus:border-[#001f61] focus:ring focus:ring-[#001f61]/30 transition-colors border-gray-500 ${theme === 'dark' ? 'bg-gray-800 text-gray-200' : 'bg-white text-black'}`}
                    />
                  </div>
                </div>

                {/* Clear filters */}
                <div className="flex justify-between items-center pt-2">
                  <p className="text-sm text-gray-500">
                    {filteredStartups.length} startups encontradas
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`text-[#001f61] hovers-exit-dash ${theme === 'dark' ? 'bg-gray-800 text-gray-200' : 'bg-white text-black'}`}
                    onClick={() => {
                      setSearchQuery("");
                      setFilters({
                        segment: "",
                        stage: "",
                        technology: "",
                        location: "",
                      });
                    }}
                  >
                    Limpar Filtros
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        {/* --- */}
        {/* Startups Grid/List */}
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
          }
        >
          {filteredStartups.map((startup) => (
            <Card
              key={startup.id}
              className={`hover:shadow-xl transition-shadow cursor-pointer rounded-xl ${theme === 'dark' ? 'bg-gray-800 text-gray-200' : 'bg-white text-black'}`}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <CardTitle className={`flex items-center gap-2 text-[#001f61] ${theme === 'dark' ? 'text-gray-200' : ''}`}>
                      <Building2 className="w-5 h-5 text-[#001f61]" />
                      {startup.name}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={`border-[#001f61] text-[#001f61] ${theme === 'dark' ? 'border-gray-200 text-gray-200' : ''}`}
                      >
                        {startup.segment}
                      </Badge>
                      <Badge className={getStageColor(startup.stage)}>
                        {getStageLabel(startup.stage)}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`text-[#001f61] hover:bg-gray-100 ${theme === 'dark' ? 'bg-gray-800 text-gray-200' : 'bg-white text-black'}`}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className={`font-medium mb-1 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                    Problema que Resolve
                  </h4>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{startup.problem}</p>
                </div>

                <div>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{startup.description}</p>
                </div>

                <div className="space-y-2 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#001f61]" />
                    {startup.location}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#001f61]" />
                    Fundada em {startup.foundedYear}
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#001f61]" />
                    {startup.employees} funcionários
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-[#001f61]" />
                    {startup.funding}
                  </div>
                </div>

                <div>
                  <Label className={`text-xs text-gray-500 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>TECNOLOGIAS</Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {startup.technology.split(", ").map((tech, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className={`text-xs bg-gray-100 text-gray-700 ${theme === 'dark' ? 'bg-gray-800 text-gray-200' : ''}`}
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button className="w-full mt-4 bg-[#001f61] hover:bg-[#002a7a] transition-colors text-white">
                  Ver Detalhes
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredStartups.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              Nenhuma startup encontrada
            </h3>
            <p className="text-gray-500">
              Tente ajustar seus filtros ou termo de busca.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
