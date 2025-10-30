import React, { useState } from "react";
import { Card, CardContent, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import {
  ArrowLeft,
  Calendar as CalendarIcon,
  Plus,
  X,
  Save,
  Target,
} from "lucide-react";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { User } from "../app/context/UserContext";
import api from "../lib/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface ChallengeFormProps {
  user: User;
  onNavigate: (page: "dashboard") => void;
}

export function ChallengeForm({ user, onNavigate }: ChallengeFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
    area: "",
    description: "",
    type: "interno" as "interno" | "publico",
  });

  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState("");
  const [theme, setTheme] = useState<string>(
    typeof window !== "undefined"
      ? sessionStorage.getItem("theme") || "light"
      : "light"
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleAddTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    if (
      !formData.name ||
      !formData.startDate ||
      !formData.endDate ||
      !formData.description
    ) {
      setError("Por favor, preencha todos os campos obrigatórios.");
      setIsSubmitting(false);
      return;
    }

    const challengeData = {
      name: formData.name,
      startDate: formData.startDate,
      endDate: formData.endDate,
      area: formData.area,
      description: formData.description,
      typePublication: formData.type === "interno" ? "RESTRITO" : "PUBLICO",
      status: "ATIVO",
      images: ["https://via.placeholder.com/150"],
      tags: tags.length > 0 ? tags[0].toUpperCase().replace(/ /g, "_") : "IA",
      categoria: "TECNOLOGIA",
      companyId: user.companyId,
    };

    const validTags = [
      "IA",
      "SUSTENTABILIDADE",
      "FINTECH",
      "HEALTHTECH",
      "EDTECH",
      "IOT",
      "BLOCKCHAIN",
      "AUTOMACAO",
    ];
    if (!validTags.includes(challengeData.tags)) {
      challengeData.tags = "IA";
    }

    try {
      await api.post("/challenges", challengeData);
      alert("Desafio criado com sucesso!");
      onNavigate("dashboard");
    } catch (err: any) {
      console.error("Falha ao criar desafio:", err);
      setError(
        err.response?.data?.message || "Ocorreu um erro ao enviar o formulário."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const suggestedTags = [
    "IA",
    "Sustentabilidade",
    "FinTech",
    "HealthTech",
    "EdTech",
    "IoT",
    "BLOCKHAIN",
    "Automação",
  ];

  return (
    // ✅ AQUI: Adicionado overflow-y-auto para permitir scroll se o conteúdo for maior que a tela
    <div
      className={`min-h-screen w-full bg-[url('/ninnafundo.jpg')] bg-cover bg-center overflow-y-auto ${
        theme === "dark" ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      {/* Header */}
      <div
        className={`bg-[#011677] text-white shadow-lg sticky top-0 z-10 ${
          theme === "dark" ? "bg-gray-800" : "bg-[#011677]"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 py-4">
          {" "}
          {/* Ajustado padding horizontal */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate("dashboard")}
              className={`hovers-exit-dash ${
                theme === "dark"
                  ? "hover:bg-gray-600 text-white"
                  : "text-white"
              }`} // Ajuste de cor hover
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {/* ✅ AQUI: Esconde texto em telas muito pequenas */}
              <span className="hidden sm:inline">Voltar ao Dashboard</span>
              <span className="sm:hidden">Voltar ao Dashboard</span>{" "}
              {/* Texto alternativo para mobile */}
            </Button>
            <Separator orientation="vertical" className="h-6 bg-white/30" />
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-white" />
              {/* ✅ AQUI: Ajustado tamanho da fonte em telas menores */}
              <h1 className="text-lg sm:text-xl font-semibold">Novo Desafio</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      {/* ✅ AQUI: Removido flex e items-center do container principal, adicionado padding vertical */}
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {/* ✅ AQUI: Removido mx-auto redundante */}
        <div className="w-full">
          <div className="mb-4 sm:mb-6 text-center">
            {" "}
            {/* Ajustado margin bottom */}
            {/* ✅ AQUI: Ajustado tamanho da fonte em telas menores */}
            <h2
              className={`text-3xl sm:text-4xl font-extrabold mt-3 text-[#001f61] ${
                theme === "dark" ? "text-white" : "text-black"
              }`}
            >
              Cadastrar Desafio
            </h2>
            <p
              className={`mt-1 font-medium text-sm sm:text-base ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {" "}
              {/* Ajustado tamanho da fonte e margin top */}
              Crie um novo desafio para capturar ideias inovadoras e conectar
              com startups.
            </p>
          </div>

          {/* ✅ AQUI: Ajustada a largura máxima responsiva */}
          <form
            onSubmit={handleSubmit}
            className="space-y-6 w-full max-w-4xl mx-auto pb-10"
          >
            <Card
              className={`rounded-xl sm:rounded-2xl ${
                theme === "dark"
                  ? "bg-gray-800"
                  : "bg-white/90 backdrop-blur-sm border border-gray-100 shadow-lg"
              }`}
            >
              {" "}
              {/* Ajustado rounded e shadow/border */}
              {/* ✅ AQUI: Ajustado padding */}
              <CardContent className="p-4 sm:p-6">
                {/* ✅ AQUI: Grid muda para 2 colunas a partir de `md` */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                  {" "}
                  {/* Ajustado gap */}
                  {/* COLUNA ESQUERDA: Informações Básicas */}
                  <div className="space-y-6">
                    <div>
                      {/* ✅ AQUI: Ajustado tamanho da fonte */}
                      <CardTitle
                        className={`text-[#001f61] mb-4 text-lg sm:text-xl ${
                          theme === "dark" ? "text-white" : "text-black"
                        }`}
                      >
                        Informações Básicas:
                      </CardTitle>
                      <div className="space-y-2">
                        <Label
                          htmlFor="name"
                          className={` ${
                            theme === "dark" ? "text-white" : "text-black"
                          }`}
                        >
                          Nome do Desafio{" "}
                          <span className="text-red-500">*</span>
                        </Label>{" "}
                        {/* Cor do asterisco */}
                        <Input
                          id="name"
                          placeholder="Ex: Automação Financeira"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          required
                          className={` rounded-lg transition-colors ${
                            theme === "dark"
                              ? "bg-gray-700 border-gray-600 text-white focus:border-white focus:ring-white"
                              : "bg-white text-black input-gbl"
                          }`} // Ajuste de cores dark/light
                        />
                      </div>
                    </div>

                    {/* ✅ AQUI: Grid interno muda para 2 colunas a partir de `sm` */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label
                          className={` ${
                            theme === "dark" ? "text-white" : "text-black"
                          }`}
                        >
                          Data de Início <span className="text-red-500">*</span>
                        </Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={`w-full justify-start text-left font-normal transition-colors cursor-pointer ${
                                theme === "dark"
                                  ? "bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                                  : "bg-white border-gray-300 text-black hover:border-[#001f61]"
                              }`}
                            >
                              <CalendarIcon
                                className={`mr-2 h-4 w-4 ${
                                  theme === "dark"
                                    ? "text-gray-300"
                                    : "text-gray-500"
                                }`}
                              />
                              {formData.startDate ? (
                                format(formData.startDate, "dd/MM/yyyy", {
                                  locale: pt,
                                })
                              ) : (
                                <span
                                  className={`${
                                    theme === "dark"
                                      ? "text-gray-400"
                                      : "text-gray-500"
                                  }`}
                                >
                                  Selecionar data
                                </span> // Cor placeholder
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            className={`w-auto p-0 shadow-lg rounded-lg ${
                              theme === "dark"
                                ? "bg-gray-700 border-gray-600"
                                : "bg-white border-gray-200"
                            }`}
                          >
                            <Calendar
                              mode="single"
                              selected={formData.startDate}
                              onSelect={(date) =>
                                setFormData({ ...formData, startDate: date })
                              }
                              locale={pt}
                              className={`rounded-md ${
                                theme === "dark"
                                  ? "[&>div]:bg-gray-700 [&>div]:text-white"
                                  : ""
                              }`} // Ajuste tema dark calendar
                              classNames={{
                                day_selected: `!bg-[#001f61] !text-white hover:!bg-[#001f61] focus:!bg-[#001f61] ${
                                  theme === "dark" ? "!text-white" : ""
                                }`,
                                day_today: `!font-bold ${
                                  theme === "dark"
                                    ? "!text-blue-300"
                                    : "!text-[#001f61]"
                                }`,
                                day_outside: `!text-gray-400 ${
                                  theme === "dark" ? "!text-gray-500" : ""
                                }`,
                              }}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div className="space-y-2">
                        <Label
                          className={` ${
                            theme === "dark" ? "text-white" : "text-black"
                          }`}
                        >
                          Data de Fim <span className="text-red-500">*</span>
                        </Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={`w-full justify-start text-left font-normal transition-colors cursor-pointer ${
                                theme === "dark"
                                  ? "bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                                  : "bg-white border-gray-300 text-black hover:border-[#001f61]"
                              }`}
                            >
                              <CalendarIcon
                                className={`mr-2 h-4 w-4 ${
                                  theme === "dark"
                                    ? "text-gray-300"
                                    : "text-gray-500"
                                }`}
                              />
                              {formData.endDate ? (
                                format(formData.endDate, "dd/MM/yyyy", {
                                  locale: pt,
                                })
                              ) : (
                                <span
                                  className={`${
                                    theme === "dark"
                                      ? "text-gray-400"
                                      : "text-gray-500"
                                  }`}
                                >
                                  Selecionar data
                                </span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            className={`w-auto p-0 shadow-lg rounded-lg ${
                              theme === "dark"
                                ? "bg-gray-700 border-gray-600"
                                : "bg-white border-gray-200"
                            }`}
                          >
                            <Calendar
                              mode="single"
                              selected={formData.endDate}
                              onSelect={(date) =>
                                setFormData({ ...formData, endDate: date })
                              }
                              locale={pt}
                              className={`rounded-md ${
                                theme === "dark"
                                  ? "[&>div]:bg-gray-700 [&>div]:text-white"
                                  : ""
                              }`}
                              classNames={{
                                day_selected: `!bg-[#001f61] !text-white hover:!bg-[#001f61] focus:!bg-[#001f61] ${
                                  theme === "dark" ? "!text-white" : ""
                                }`,
                                day_today: `!font-bold ${
                                  theme === "dark"
                                    ? "!text-blue-300"
                                    : "!text-[#001f61]"
                                }`,
                                day_outside: `!text-gray-400 ${
                                  theme === "dark" ? "!text-gray-500" : ""
                                }`,
                              }}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label
                        className={` ${
                          theme === "dark" ? "text-white" : "text-black"
                        }`}
                        htmlFor="area"
                      >
                        Área Principal
                      </Label>
                      <Select
                        onValueChange={(value) =>
                          setFormData({ ...formData, area: value })
                        }
                      >
                        <SelectTrigger
                          className={`w-full justify-between transition-colors cursor-pointer ${
                            theme === "dark"
                              ? "bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                              : "bg-white border-gray-300 text-black hover:border-[#001f61]"
                          }`}
                        >
                          <SelectValue placeholder="Selecione a área principal" />
                        </SelectTrigger>
                        <SelectContent
                          className={`shadow-lg rounded-lg ${
                            theme === "dark"
                              ? "bg-gray-700 border-gray-600 text-white"
                              : "bg-white border-gray-200"
                          }`}
                        >
                          {[
                            "Ambiental ",

                            "Tecnologia ",

                            "Operacional ",

                            "Educacional ",

                            "Financeiro ",

                            "Sustentavel ",

                            "Social ",

                            "Logistico ",

                            "Comercial ",

                            "Saude ",

                            "Cultural "
                          ].map((areaValue) => (
                            <SelectItem
                              key={areaValue}
                              value={areaValue}
                              className={`cursor-pointer select-none relative py-2 pl-8 pr-4 ${
                                theme === "dark"
                                  ? "hover:bg-gray-600"
                                  : "hover:bg-blue-50"
                              }`}
                            >
                              {areaValue}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label
                        className={` ${
                          theme === "dark" ? "text-white" : "text-black"
                        }`}
                      >
                        Tags/Temas Relacionados
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Digite tag e Enter" // Texto placeholder menor
                          className={`rounded-lg transition-colors ${
                            theme === "dark"
                              ? "bg-gray-700 border-gray-600 text-white focus:border-white focus:ring-white"
                              : "bg-white text-black input-gbl"
                          }`}
                          value={currentTag}
                          onChange={(e) => setCurrentTag(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleAddTag();
                            }
                          }}
                        />
                        <Button
                          type="button"
                          onClick={handleAddTag}
                          className={`bg-[#001f61] text-white hover:bg-[#002a7a] transition-colors cursor-pointer px-3 button-style`}
                        >
                          {" "}
                          {/* Padding ajustado */}
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>

                      {tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {tags.map((tag) => (
                            <Badge
                              key={tag}
                              className={`bg-[#e0e7ff] text-[#001f61] hover:bg-[#c7d2fe] transition-colors flex items-center gap-1 font-medium ${
                                theme === "dark"
                                  ? "bg-gray-600 text-gray-100 hover:bg-gray-500"
                                  : ""
                              }`}
                            >
                              {" "}
                              {/* Cores ajustadas */}
                              {tag}
                              <button
                                type="button"
                                onClick={() => handleRemoveTag(tag)}
                                className="ml-1 opacity-70 hover:opacity-100 focus:outline-none"
                                aria-label={`Remover tag ${tag}`}
                              >
                                <X className="w-3 h-3 text-current cursor-pointer" />{" "}
                                {/* Cor do X ajustada */}
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}

                      <div className="mt-4">
                        <p
                          className={`text-xs sm:text-sm ${
                            theme === "dark" ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          Sugestões:
                        </p>{" "}
                        {/* Tamanho fonte ajustado */}
                        <div className="flex flex-wrap gap-2 mt-1">
                          {suggestedTags.map((tag) => (
                            <Button
                              key={tag}
                              type="button"
                              variant="outline"
                              size="sm"
                              className={`cursor-pointer transition-colors text-xs px-2 py-1 ${
                                theme === "dark"
                                  ? "border-gray-600 text-gray-300 hover:bg-gray-700 disabled:opacity-50"
                                  : "border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                              }`} // Estilo ajustado
                              onClick={() => {
                                if (!tags.includes(tag)) {
                                  setTags([...tags, tag]);
                                }
                              }}
                              disabled={tags.includes(tag)}
                            >
                              {tag}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* COLUNA DIREITA: Descrição e Configurações */}
                  <div className="space-y-6 sm:space-y-8">
                    {" "}
                    {/* Ajustado space-y */}
                    {/* Seção de Descrição */}
                    <div className="space-y-2">
                      {/* ✅ AQUI: Ajustado tamanho da fonte */}
                      <CardTitle
                        className={`text-[#001f61] mb-4 text-lg sm:text-xl ${
                          theme === "dark" ? "text-white" : "text-black"
                        }`}
                      >
                        Descrição do Problema:
                      </CardTitle>
                      <Label
                        className={` ${
                          theme === "dark" ? "text-white" : "text-black"
                        }`}
                        htmlFor="description"
                      >
                        Descrição Completa{" "}
                        <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id="description"
                        placeholder="Descreva o contexto, o problema específico, objetivos..."
                        className={`min-h-[150px] sm:min-h-[200px] rounded-lg transition-colors ${
                          theme === "dark"
                            ? "bg-gray-700 border-gray-600 text-white focus:border-white focus:ring-white"
                            : "bg-white text-black input-gbl "
                        }`} // Altura mínima ajustada
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    {/* Seção de Configurações */}
                    <div className="space-y-4">
                      {/* ✅ AQUI: Ajustado tamanho da fonte */}
                      <CardTitle
                        className={`text-[#001f61] mb-4 text-lg sm:text-xl ${
                          theme === "dark" ? "text-white" : "text-black"
                        }`}
                      >
                        Configurações:
                      </CardTitle>
                      <Label
                        className={` ${
                          theme === "dark" ? "text-white" : "text-black"
                        }`}
                      >
                        Tipo de Desafio
                      </Label>
                      <RadioGroup
                        value={formData.type}
                        onValueChange={(value: "interno" | "publico") =>
                          setFormData({ ...formData, type: value })
                        }
                        className="space-y-3" // Espaçamento entre radios
                      >
                        {/* INTERNO */}
                        <Label
                          htmlFor="interno"
                          className={`flex items-center space-x-3 p-4 rounded-lg cursor-pointer transition-all border
                                                    ${
                                                      formData.type ===
                                                      "interno"
                                                        ? "border-[#001f61] bg-[#eef2ff] ring-2 ring-[#a5b4fc]" // Estilo selecionado light
                                                        : "border-gray-200 hover:bg-gray-50" // Estilo não selecionado light
                                                    }
                                                    ${
                                                      theme === "dark"
                                                        ? formData.type ===
                                                          "interno"
                                                          ? "bg-blue-900/30 border-blue-700 ring-2 ring-blue-500/50" // Estilo selecionado dark
                                                          : "border-gray-700 hover:bg-gray-700" // Estilo não selecionado dark
                                                        : ""
                                                    }`}
                        >
                          <RadioGroupItem
                            value="interno"
                            id="interno"
                            className={`border-gray-400 ${
                              formData.type === "interno"
                                ? "text-white"
                                : "text-[#011677]"
                            } ${theme === "dark" ? "border-gray-500" : ""}`} // Estilo do radio
                          />
                          <div className="space-y-1 flex-1">
                            <div
                              className={`font-medium ${
                                theme === "dark"
                                  ? "text-white"
                                  : "text-[#011677]"
                              }`}
                            >
                              🔒 Restrito (Interno)
                            </div>
                            <p
                              className={`text-xs sm:text-sm ${
                                theme === "dark"
                                  ? "text-gray-400"
                                  : "text-gray-500"
                              }`}
                            >
                              {" "}
                              {/* Tamanho fonte ajustado */}
                              Apenas colaboradores podem ver e participar.
                            </p>
                          </div>
                        </Label>

                        {/* PUBLICO */}
                        <Label
                          htmlFor="publico"
                          className={`flex items-center space-x-3 p-4 rounded-lg cursor-pointer transition-all border
                                                    ${
                                                      formData.type ===
                                                      "publico"
                                                        ? "border-[#001f61] bg-[#eef2ff] ring-2 ring-[#a5b4fc]"
                                                        : "border-gray-200 hover:bg-gray-50"
                                                    }
                                                    ${
                                                      theme === "dark"
                                                        ? formData.type ===
                                                          "publico"
                                                          ? "bg-blue-900/30 border-blue-700 ring-2 ring-blue-500/50"
                                                          : "border-gray-700 hover:bg-gray-700"
                                                        : ""
                                                    }`}
                        >
                          <RadioGroupItem
                            value="publico"
                            id="publico"
                            className={`border-gray-400 ${
                              formData.type === "publico"
                                ? "text-white"
                                : "text-[#011677]"
                            } ${theme === "dark" ? "border-gray-500" : ""}`}
                          />
                          <div className="space-y-1 flex-1">
                            <div
                              className={`font-medium ${
                                theme === "dark"
                                  ? "text-white"
                                  : "text-[#011677]"
                              }`}
                            >
                              🌍 Público (Externo)
                            </div>
                            <p
                              className={`text-xs sm:text-sm ${
                                theme === "dark"
                                  ? "text-gray-400"
                                  : "text-gray-500"
                              }`}
                            >
                              Startups e parceiros podem ver e se candidatar.
                            </p>
                          </div>
                        </Label>
                      </RadioGroup>
                    </div>
                  </div>
                </div>
              </CardContent>
              {/* BOTÕES DE AÇÃO */}
              {/* ✅ AQUI: Ajustado padding e gap dos botões */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center p-4 sm:p-6 border-t mt-6 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-100'}">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onNavigate("dashboard")}
                  className={`w-full sm:w-auto transition-colors cursor-pointer px-6 py-2 rounded-lg ${
                    theme === "dark"
                      ? "text-gray-300 border-gray-600 hover:bg-gray-700"
                      : "text-[#001f61] border-[#001f61] hover:bg-gray-100"
                  }`} // Ajuste estilo
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className={`w-full sm:w-auto bg-gradient-to-r from-[#011677] to-[#160430] hover:opacity-90 text-white shadow-md rounded-lg px-6 py-2 cursor-pointer flex items-center justify-center ${
                    isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                  }`} // Adicionado flex e justify-center
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      {/* Opcional: Adicionar um spinner */}
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      A criar...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Criar Desafio
                    </>
                  )}
                </Button>
              </div>
            </Card>

            {error && (
              <p className="text-center text-red-500 mt-4 text-sm">{error}</p> // Tamanho fonte erro
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
