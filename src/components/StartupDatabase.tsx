// /plat_inovacao/src/components/StartupDatabase.tsx

import React, { useState, useEffect } from "react";
import api from "../lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
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
  Eye,
  MapPin,
  Calendar,
  Award,
  LayoutGrid, // Ícone para Grid
  List, // Ícone para Lista
} from "lucide-react";
import { User, Startup } from "../app/context/UserContext";
import Loading from "../app/loading"; // Assumindo que Loading existe

interface StartupDatabaseProps {
  user: User;
  onNavigate: (page: "dashboard") => void;
}

// Adaptação para Frontend (mantida)
type StartupFrontend = Startup & {
  location: string;
  foundedYear: number;
  employees: string;
  funding: string;
};

export function StartupDatabase({ user, onNavigate }: StartupDatabaseProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    segment: "",
    stage: "",
    technology: "",
    location: "", // Mantido, embora não usado no filtro atual
  });
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [theme, setTheme] = useState<string>(
    typeof window !== "undefined"
      ? sessionStorage.getItem("theme") || "light"
      : "light"
  );
  const [startups, setStartups] = useState<StartupFrontend[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStartups = async () => {
      setIsLoading(true);
      try {
        const response = await api.get("/startups");
        // Adaptação dos dados (com mocks e fallbacks)
        const adaptedData = response.data.map((startup: any) => ({
          ...startup,
          foundedYear: startup.createdAt
            ? new Date(startup.createdAt).getFullYear()
            : "N/A", // Fallback para ano
          employees: startup.employees || "1-10", // Usar dado real ou fallback
          funding: startup.funding || "Não informado", // Usar dado real ou fallback
          location: startup.location || "Não informada", // Usar dado real ou fallback
        }));
        setStartups(adaptedData);
      } catch (error) {
        console.error("Falha ao buscar startups:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStartups();
  }, []);

  // Lógica de filtro (insensível a maiúsculas/minúsculas)
  const filteredStartups = startups.filter((startup) => {
    const searchTerm = searchQuery.toLowerCase();
    const techFilter = filters.technology.toLowerCase();

    const matchesSearch =
      !searchQuery ||
      startup.name.toLowerCase().includes(searchTerm) ||
      (startup.description &&
        startup.description.toLowerCase().includes(searchTerm)) || // Verifica se existe
      (startup.problem && startup.problem.toLowerCase().includes(searchTerm)); // Verifica se existe

    const matchesSegment =
      !filters.segment ||
      (startup.segment &&
        startup.segment.toLowerCase() === filters.segment.toLowerCase());
    const matchesStage =
      !filters.stage ||
      (startup.stage &&
        startup.stage.toUpperCase() === filters.stage.toUpperCase());
    const matchesTechnology =
      !filters.technology ||
      (startup.technology &&
        startup.technology.toLowerCase().includes(techFilter));

    return matchesSearch && matchesSegment && matchesStage && matchesTechnology;
  });

  // Funções auxiliares de estilo (mantidas)
  const getStageLabel = (stage: string) =>
    ({
      IDEACAO: "Ideação",
      OPERACAO: "Operação",
      TRACAO: "Tração",
      ESCALA: "Escala",
    }[stage] || stage);
  const getStageColor = (stage: string) =>
    ({
      IDEACAO: "bg-blue-100 text-blue-800",
      OPERACAO: "bg-green-100 text-green-800",
      TRACAO: "bg-yellow-100 text-yellow-800",
      ESCALA: "bg-purple-100 text-purple-800",
    }[stage] || "bg-gray-100 text-gray-800"); // Cores diferentes

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div
      className={`min-h-screen ${
        theme === "dark"
          ? "bg-gray-900 text-gray-200"
          : "bg-gray-50 text-gray-900"
      }`}
    >
      {" "}
      {/* Fundo ajustado */}
      {/* Header com ajustes responsivos */}
      <div
        className={`z-20 shadow-md ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-[#011677] text-white'}`}>
        {/* ✅ AQUI: Padding ajustado (px-4 para mobile, sm:px-6 para telas maiores) */}
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          {/* ✅ AQUI: flex-col sm:flex-row para empilhar em mobile se necessário, justify-between mantido */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            {/* Grupo Esquerdo: Voltar e Título */}
            <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate("dashboard")}
                className={`hovers-exit-dash px-2 sm:px-3 ${
                  theme === "dark" ? "hover:bg-gray-700" : ""
                }`} // Padding ajustado
              >
                <ArrowLeft className="w-4 h-4 sm:mr-2" />{" "}
                {/* Margem apenas em telas maiores */}
                <span className="hidden sm:inline">Voltar ao dashboard</span>{" "}
                {/* Esconde "Voltar" em telas extra pequenas */}
              </Button>
              <Separator
                orientation="vertical"
                className="h-6 bg-white/30 hidden sm:block"
              />{" "}
              {/* Esconde separador no mobile */}
              <div className="flex items-center gap-2 flex-grow justify-center sm:justify-start">
                {" "}
                {/* Título centralizado no mobile */}
                <Building2 className="w-5 h-5" />
                <h1 className="text-lg sm:text-xl font-semibold whitespace-nowrap">
                  Base de Startups
                </h1>{" "}
                {/* Evita quebra de linha */}
              </div>
            </div>

            {/* Grupo Direito: Botões Grid/Lista */}
            {/* ✅ AQUI: Botões usam ícones em telas pequenas */}
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"} // Estilo ajustado
                size="icon" // Tamanho ícone padrão
                onClick={() => setViewMode("grid")}
                className={`rounded-md ${
                  viewMode === "grid"
                    ? theme === "dark"
                      ? "bg-gray-600"
                      : "bg-white text-[#011677]"
                    : theme === "dark"
                    ? "hover:bg-gray-700"
                    : "hover:bg-white/10"
                }`}
                aria-label="Visualizar em Grade"
              >
                <LayoutGrid className="w-5 h-5" />
              </Button>
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"} // Estilo ajustado
                size="icon" // Tamanho ícone padrão
                onClick={() => setViewMode("list")}
                className={`rounded-md ${
                  viewMode === "list"
                    ? theme === "dark"
                      ? "bg-gray-600"
                      : "bg-white text-[#011677]"
                    : theme === "dark"
                    ? "hover:bg-gray-700"
                    : "hover:bg-white/10"
                }`}
                aria-label="Visualizar em Lista"
              >
                <List className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* Content */}
      {/* ✅ AQUI: Padding ajustado */}
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Secção Título e Descrição da Página */}
        <div className="mb-6 sm:mb-8 text-center sm:text-left">
          {/* ✅ AQUI: Tamanho da fonte ajustado */}
          <h2
            className={`text-2xl sm:text-3xl font-bold ${
              theme === "dark" ? "text-gray-200" : "text-[#001f61]"
            }`}
          >
            Explore Startups Inovadoras
          </h2>
          <p
            className={`mt-1 text-sm sm:text-base ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Encontre as startups perfeitas para seus desafios.
          </p>
        </div>

        {/* Card de Filtros */}
        <Card
          className={`shadow-md rounded-lg mb-6 sm:mb-8 ${
            theme === "dark" ? "bg-gray-800 border border-gray-700" : "bg-white"
          }`}
        >
          <CardHeader className="border-b pb-4 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-100'}">
            <CardTitle
              className={`flex items-center gap-2 text-base sm:text-lg font-semibold ${
                theme === "dark" ? "text-gray-200" : "text-[#001f61]"
              }`}
            >
              <Filter className="w-4 h-4 sm:w-5 sm:h-5" />
              Busca e Filtros
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 sm:pt-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label
                  className={`text-sm ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                  htmlFor="search"
                >
                  Buscar
                </Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Nome, problema, tecnologia..."
                    className={`pl-10 rounded-md ${
                      theme === "dark"
                        ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500/60"
                        : "bg-white input-gbl"
                    }`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              {/* ✅ AQUI: Grid de filtros ajustado para sm:grid-cols-2 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label
                    className={`text-sm ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Segmento
                  </Label>
                  <Select
                    value={filters.segment}
                    onValueChange={(value) =>
                      setFilters({
                        ...filters,
                        segment: value === "all" ? "" : value,
                      })
                    }
                  >
                    <SelectTrigger
                      className={`rounded-md cursor-pointer ${
                        theme === "dark"
                          ? "bg-gray-700 border-gray-600 text-gray-200"
                          : "bg-white border-gray-300"
                      }`}
                    >
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent
                      className={`${
                        theme === "dark"
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-white"
                      }`}
                    >
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="FinTech">FinTech</SelectItem>
                      <SelectItem value="HealthTech">HealthTech</SelectItem>
                      <SelectItem value="EdTech">EdTech</SelectItem>
                      <SelectItem value="AgroTech">AgroTech</SelectItem>
                    </SelectContent>{" "}
                    {/* Mais opções */}
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label
                    className={`text-sm ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Estágio
                  </Label>
                  <Select
                    value={filters.stage}
                    onValueChange={(value) =>
                      setFilters({
                        ...filters,
                        stage: value === "all" ? "" : value,
                      })
                    }
                  >
                    <SelectTrigger
                      className={`rounded-md cursor-pointer ${
                        theme === "dark"
                          ? "bg-gray-700 border-gray-600 text-gray-200"
                          : "bg-white border-gray-300"
                      }`}
                    >
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent
                      className={`${
                        theme === "dark"
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-white"
                      }`}
                    >
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="IDEACAO">Ideação</SelectItem>
                      <SelectItem value="OPERACAO">Operação</SelectItem>
                      <SelectItem value="TRACAO">Tração</SelectItem>
                      <SelectItem value="ESCALA">Escala</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label
                    className={`text-sm ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Tecnologia
                  </Label>
                  <Input
                    placeholder="Ex: IA, Blockchain..."
                    value={filters.technology}
                    onChange={(e) =>
                      setFilters({ ...filters, technology: e.target.value })
                    }
                    className={`rounded-md ${
                      theme === "dark"
                        ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500/60"
                        : "bg-white input-gbl"
                    }`}
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row justify-between items-center pt-2 sm:pt-4 gap-2">
                {" "}
                {/* Layout ajustado para mobile */}
                <p
                  className={`text-xs sm:text-sm ${
                    theme === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {filteredStartups.length} startups encontradas
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`text-xs cursor-pointer sm:text-sm ${
                    theme === "dark"
                      ? "text-blue-400 hover:bg-gray-700"
                      : "text-[#001f61] hover:bg-blue-50"
                  }`} // Cor ajustada
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

        {/* Startups Grid/List */}
        {/* ✅ AQUI: Grid com gap ajustado */}
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
              : "space-y-4"
          }
        >
          {filteredStartups.map((startup) => (
            <Card
              key={startup.id}
              className={`hover:shadow-lg transition-shadow duration-200 rounded-lg overflow-hidden ${
                theme === "dark"
                  ? "bg-gray-800 border border-gray-700"
                  : "bg-white border border-gray-200"
              }`}
            >
              <CardHeader className="pb-3 sm:pb-4">
                {" "}
                {/* Padding ajustado */}
                <div className="flex justify-between items-start gap-3">
                  <div className="space-y-1 sm:space-y-2">
                    {/* ✅ AQUI: Tamanho da fonte ajustado */}
                    <CardTitle
                      className={`flex items-center gap-2 text-base sm:text-lg font-semibold ${
                        theme === "dark" ? "text-gray-100" : "text-[#001f61]"
                      }`}
                    >
                      <Building2 className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />{" "}
                      {/* Ícone não encolhe */}
                      {startup.name}
                    </CardTitle>
                    <div className="flex flex-wrap items-center gap-2">
                      {" "}
                      {/* Wrap badges */}
                      <Badge
                        variant="outline"
                        className={`text-xs px-2 py-0.5 rounded ${
                          theme === "dark"
                            ? "border-gray-600 text-gray-300"
                            : "border-gray-300 text-gray-600"
                        }`}
                      >
                        {startup.segment}
                      </Badge>
                      <Badge
                        className={`text-xs px-2 py-0.5 rounded ${getStageColor(
                          startup.stage
                        )}`}
                      >
                        {getStageLabel(startup.stage)}
                      </Badge>
                    </div>
                  </div>
                  {/* Botão Ver Detalhes (Opcional aqui ou abaixo) */}
                  {/* <Button variant="ghost" size="icon" className={`w-8 h-8 ${theme === 'dark' ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100'}`}><Eye className="w-4 h-4" /></Button> */}
                </div>
              </CardHeader>
              {/* ✅ AQUI: Padding ajustado */}
              <CardContent className="space-y-3 sm:space-y-4 pt-0 pb-4 sm:pb-5 px-4 sm:px-5">
                {" "}
                {/* Padding ajustado */}
                {startup.problem && (
                  <div>
                    <h4
                      className={`text-xs sm:text-sm font-medium mb-1 ${
                        theme === "dark" ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Problema
                    </h4>
                    <p
                      className={`text-xs sm:text-sm line-clamp-2 ${
                        theme === "dark" ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {startup.problem}
                    </p>{" "}
                    {/* Limita linhas */}
                  </div>
                )}
                {startup.description && (
                  <div>
                    <h4
                      className={`text-xs sm:text-sm font-medium mb-1 ${
                        theme === "dark" ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Descrição
                    </h4>
                    <p
                      className={`text-xs sm:text-sm line-clamp-3 ${
                        theme === "dark" ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {startup.description}
                    </p>{" "}
                    {/* Limita linhas */}
                  </div>
                )}
                <Separator
                  className={theme === "dark" ? "bg-gray-700" : "bg-gray-100"}
                />{" "}
                {/* Separador mais sutil */}
                <div
                  className={`space-y-1.5 text-xs sm:text-sm ${
                    theme === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <MapPin
                      className={`w-3.5 h-3.5 ${
                        theme === "dark" ? "text-gray-500" : "text-gray-400"
                      }`}
                    />
                    {startup.location}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar
                      className={`w-3.5 h-3.5 ${
                        theme === "dark" ? "text-gray-500" : "text-gray-400"
                      }`}
                    />
                    Fundada em {startup.foundedYear}
                  </div>
                  <div className="flex items-center gap-2">
                    <Users
                      className={`w-3.5 h-3.5 ${
                        theme === "dark" ? "text-gray-500" : "text-gray-400"
                      }`}
                    />
                    {startup.employees} funcionários
                  </div>
                  {/* <div className="flex items-center gap-2"><Award className="w-3.5 h-3.5 text-gray-400" />{startup.funding}</div> */}{" "}
                  {/* Funding talvez menos importante */}
                </div>
                {startup.technology && (
                  <div>
                    <Label
                      className={`text-xs font-semibold uppercase tracking-wider ${
                        theme === "dark" ? "text-gray-500" : "text-gray-400"
                      }`}
                    >
                      Tecnologias
                    </Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {startup.technology.split(/, ?/).map(
                        (
                          tech,
                          index // Split mais robusto
                        ) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className={`text-xs px-1.5 py-0.5 rounded ${
                              theme === "dark"
                                ? "bg-gray-700 text-gray-300"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {tech}
                          </Badge>
                        )
                      )}
                    </div>
                  </div>
                )}
                <Button
                  className={`w-full cursor-pointer mt-3 sm:mt-4 text-sm ${
                    theme === "dark"
                      ? "bg-blue-600 hover:bg-blue-500"
                      : "bg-[#001f61] hover:bg-[#002a7a]"
                  } transition-colors text-white`}
                >
                  Ver Detalhes
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mensagem de "Nenhuma startup encontrada" */}
        {!isLoading && filteredStartups.length === 0 && (
          <div className="text-center py-12 sm:py-16">
            <Building2
              className={`w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 ${
                theme === "dark" ? "text-gray-600" : "text-gray-300"
              }`}
            />
            <h3
              className={`text-base sm:text-lg font-medium mb-2 ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Nenhuma startup encontrada
            </h3>
            <p
              className={`text-sm ${
                theme === "dark" ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Tente ajustar seus filtros ou termo de busca.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
