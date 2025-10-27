// /plat_inovacao/src/components/ChallengeDetails.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Textarea } from "./ui/textarea";
import {
  ArrowLeft,
  Calendar,
  Target,
  Users,
  Building2,
  Heart,
  MessageCircle,
  Send,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Paperclip,
  ThumbsUp,
  Check,
} from "lucide-react";
import { User, Challenge, Startup, Idea } from "../app/context/UserContext";
import { useRouter } from "next/navigation";
import api from "../lib/api";

// Tipos de dados específicos para esta página
interface Comment {
  id: string;
  author: { name: string; avatar?: string };
  text: string;
  createdAt: string;
}

type ConnectionStatus =
  | "nenhum"
  | "INTERESSE"
  | "CONVIDADA"
  | "POC"
  | "REJEITADA";

interface RecommendedStartup extends Startup {
  matchScore: number;
  connectionStatus: ConnectionStatus;
  lastInteraction?: string;
}

interface ChallengeDetailsProps {
  user: User;
  challenge: Challenge;
  onNavigate: (page: "dashboard" | "startup-database") => void;
}

export function ChallengeDetails({
  user,
  challenge,
  onNavigate,
}: ChallengeDetailsProps) {
  const [theme, setTheme] = useState<string>(
    typeof window !== "undefined"
      ? sessionStorage.getItem("theme") || "light"
      : "light"
  );
  const router = useRouter();

  const [submissions, setSubmissions] = useState<Idea[]>([]);
  const [recommendedStartups, setRecommendedStartups] = useState<
    RecommendedStartup[]
  >([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  // 💡 NOVA FUNÇÃO PARA BUSCAR DADOS
  const fetchRelatedData = async () => {
    if (!challenge.id || !user.companyId) return;

    try {
      const [ideasRes, startupsRes, commentsRes, connectionsRes] =
        await Promise.all([
          api.get("/idea"),
          api.get("/startups"),
          api.get(`/comments/${challenge.id}/CHALLENGE`),
          api.get("/connections"), // Busca todas as conexões da empresa
        ]);

      const challengeIdeas = ideasRes.data.filter(
        (idea: any) => idea.challengeId === challenge.id
      );
      setSubmissions(challengeIdeas);

      const challengeConnections = connectionsRes.data.filter(
        (conn: any) => conn.challengeId === challenge.id
      );

      const recommendations = startupsRes.data
        .slice(0, 3)
        .map((startup: Startup, index: number) => {
          const existingConnection = challengeConnections.find(
            (conn: any) => conn.startupId === startup.id
          );

          return {
            ...startup,
            matchScore: 95 - index * 5,
            connectionStatus: existingConnection
              ? existingConnection.status
              : "nenhum",
          };
        });
      setRecommendedStartups(recommendations);

      const formattedComments = commentsRes.data.map((comment: any) => ({
        id: comment.id,
        author: { name: comment.author.name || "Usuário" },
        text: comment.text,
        createdAt: new Date(comment.createdAt).toLocaleDateString("pt-BR"),
      }));
      setComments(formattedComments);
    } catch (error) {
      console.error("Falha ao buscar dados relacionados ao desafio:", error);
    }
  };

  useEffect(() => {
    fetchRelatedData();
  }, [challenge.id, user.companyId]);

  const handlePostComment = async () => {
    if (!newComment.trim()) return;
    setIsSubmittingComment(true);

    try {
      const response = await api.post("/comments", {
        text: newComment,
        commentableType: "CHALLENGE",
        commentableId: challenge.id,
      });

      const newCommentFromServer = response.data;

      const postedComment: Comment = {
        id: newCommentFromServer.id,
        author: { name: user.name, avatar: user.image_url },
        text: newCommentFromServer.text,
        createdAt: new Date(newCommentFromServer.createdAt).toLocaleDateString(
          "pt-BR"
        ),
      };

      setComments((prevComments) => [postedComment, ...prevComments]);
      setNewComment("");
    } catch (error) {
      console.error("Falha ao publicar comentário:", error);
      alert("Não foi possível publicar o seu comentário. Tente novamente.");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleConnect = async (startupId: string) => {
    if (!user.companyId) return;

    try {
      await api.post("/connections", {
        companyID: user.companyId,
        startupID: startupId,
        challengeID: challenge.id,
        status: "INTERESSE",
        history: [],
      });

      setRecommendedStartups((prev) =>
        prev.map((startup) =>
          startup.id === startupId
            ? { ...startup, connectionStatus: "INTERESSE" }
            : startup
        )
      );
    } catch (error) {
      console.error("Falha ao criar conexão:", error);
      alert("Não foi possível registrar o interesse.");
    }
  };

  // Funções auxiliares (progress, etc.)
  const calculateProgress = () => {
    const startDate = new Date(challenge.startDate);
    const endDate = new Date(challenge.endDate);
    const now = new Date();
    const total = endDate.getTime() - startDate.getTime();
    const elapsed = now.getTime() - startDate.getTime();
    return Math.min(100, Math.max(0, (elapsed / total) * 100));
  };

  const getStatusColor = (status: ConnectionStatus) => {
    const colors: { [key in ConnectionStatus]: string } = {
      nenhum: "bg-gray-100 text-gray-800",
      INTERESSE: "bg-blue-100 text-blue-800",
      CONVIDADA: "bg-yellow-100 text-yellow-800",
      POC: "bg-green-100 text-green-800",
      REJEITADA: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };
  const getStatusLabel = (status: ConnectionStatus) => {
    const labels: { [key in ConnectionStatus]: string } = {
      nenhum: "Não Contatada",
      INTERESSE: "Interesse Registrado",
      CONVIDADA: "Convidada para POC",
      POC: "POC em Andamento",
      REJEITADA: "Rejeitada",
    };
    return labels[status] || status;
  };
  const getStatusIcon = (status: ConnectionStatus) => {
    switch (status) {
      case "INTERESSE":
        return <Heart className="w-4 h-4" />;
      case "CONVIDADA":
        return <Send className="w-4 h-4" />;
      case "POC":
        return <CheckCircle className="w-4 h-4" />;
      case "REJEITADA":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div
      className={`min-h-screen ${
        theme === "dark" ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      {/* Header - Mantido */}
      <div
        className={` ${
          theme === "dark"
            ? "bg-gray-800 text-white"
            : " text-white border-b border-gray-200 bg-[#011677]"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center gap-4">
            <Button
              className={`hovers-exit-dash ${
                theme === "dark" ? "hover:bg-gray-600" : ""
              }`}
              variant="ghost"
              size="sm"
              onClick={() => onNavigate("dashboard")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao Dashboardd
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              <h1 className="font-semibold">Detalhes do Desafio</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Principal - Ajustado para usar Container e padding padronizado */}
      <div className="container mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Challenge Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card
            className={`bg-white ${
              theme === "dark" ? "bg-gray-800 text-white" : ""
            }`}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <CardTitle className="text-xl">{challenge.name}</CardTitle>
                  <div className="flex flex-wrap items-center gap-2">
                    {" "}
                    {/* flex-wrap para mobile */}
                    <Badge variant="outline">{challenge.area}</Badge>
                    <Badge
                      variant={
                        challenge.type === "PUBLICO" ? "default" : "secondary"
                      }
                    >
                      {challenge.type === "PUBLICO" ? "Público" : "Interno"}
                    </Badge>
                    <Badge variant="outline">{challenge.company}</Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold">Descrição do Problema</h3>
                <p
                  className={` mt-2 ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {challenge.description}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div
                    className={`flex items-center gap-2 text-sm ${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    <Calendar className="w-4 h-4" />
                    Data de Início:{" "}
                    {new Date(challenge.startDate).toLocaleDateString("pt-BR")}
                  </div>
                  <div
                    className={`flex items-center gap-2 text-sm ${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    <Calendar className="w-4 h-4" />
                    Data de Fim:{" "}
                    {new Date(challenge.endDate).toLocaleDateString("pt-BR")}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Progresso do Desafio
                  </Label>
                  <Progress value={calculateProgress()} className="w-full" />
                  <p className="text-xs text-gray-500">
                    {Math.round(calculateProgress())}% concluído
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className={`bg-white ${
              theme === "dark" ? "bg-gray-800 text-white" : ""
            }`}
          >
            <CardHeader>
              <CardTitle>Métricas do Desafio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div
                    className={`text-2xl font-bold ${
                      theme === "dark" ? "text-gray-400" : "text-gray-800"
                    }`}
                  >
                    {submissions.length}
                  </div>
                  <p
                    className={`text-sm ${
                      theme === "dark" ? "text-gray-200" : "text-gray-500"
                    }`}
                  >
                    Ideias Submetidas
                  </p>
                </div>
                <div className="text-center">
                  <div
                    className={`text-2xl font-bold ${
                      theme === "dark" ? "text-gray-400" : "text-green-600"
                    }`}
                  >
                    4
                  </div>
                  <p
                    className={`text-sm ${
                      theme === "dark" ? "text-gray-200" : "text-gray-500"
                    }`}
                  >
                    Startups Interessadas
                  </p>
                </div>
                <div className="text-center">
                  <div
                    className={`text-2xl font-bold ${
                      theme === "dark" ? "text-gray-400" : "text-blue-600"
                    }`}
                  >
                    2
                  </div>
                  <p
                    className={`text-sm ${
                      theme === "dark" ? "text-gray-200" : "text-gray-500"
                    }`}
                  >
                    POCs Iniciadas
                  </p>
                </div>
                <div className="text-center">
                  <div
                    className={`text-2xl font-bold ${
                      theme === "dark" ? "text-gray-400" : "text-yellow-600"
                    }`}
                  >
                    87%
                  </div>
                  <p
                    className={`text-sm ${
                      theme === "dark" ? "text-gray-200" : "text-gray-500"
                    }`}
                  >
                    Score Médio
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Actions */}
        <div className="space-y-6">
          <Card
            className={`bg-white ${
              theme === "dark" ? "bg-gray-800 text-white" : ""
            }`}
          >
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">              
              <Button
                variant="outline"
                className={`w-full justify-start cursor-pointer  ${
                  theme === "dark"
                    ? "text-gray-200 hover:bg-gray-500"
                    : "text-gray-800 hover:bg-gray-100"
                }`}
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Relatório Detalhado
              </Button>
              <Button
                variant="outline"
                className={`w-full justify-start cursor-pointer  ${
                  theme === "dark"
                    ? "text-gray-200 hover:bg-gray-500"
                    : "text-gray-800 hover:bg-gray-100"
                }`}
                onClick={() => onNavigate("startup-database")}
              >
                <Building2 className="w-4 h-4 mr-2" />
                Buscar Mais Startups
              </Button>
              <Button
                className={`w-full justify-start bg-[#011677] text-white hover:bg-[#0121af] cursor-pointer ${
                  theme === "dark" ? "bg-gray-600 hover:bg-gray-700 " : ""
                }`}
                onClick={() => router.push(`/funnel/${challenge.id}`)}
              >
                <Target className="w-4 h-4 mr-2" />
                Aceder ao Funil de Ideias
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* SEÇÃO DAS TABS (ABAS) - CORREÇÃO DE RESPONSIVIDADE APLICADA AQUI */}
      <div className="container pb-7 mx-auto px-4 sm:px-6 mt-8">
        <Tabs defaultValue="submissions">
          {/* TabsList com overflow-x-auto e classes de padding responsivas */}
          <TabsList
            className={`w-full overflow-x-auto overflow-y-hidden justify-start border-b ${
              theme === "dark"
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <TabsTrigger
              className={`py-3 px-3 sm:py-4 cursor-pointer sm:px-6 text-sm font-medium whitespace-nowrap ${
                theme === "dark"
                  ? "text-gray-200 hover:bg-gray-700"
                  : "text-gray-800 hover:bg-gray-100"
              }`}
              value="submissions"
            >
              Submissões ({submissions.length})
            </TabsTrigger>
            <TabsTrigger
              className={`py-3 px-3 sm:py-4 cursor-pointer  sm:px-6 text-sm font-medium whitespace-nowrap ${
                theme === "dark"
                  ? "text-gray-200 hover:bg-gray-700"
                  : "text-gray-800 hover:bg-gray-100"
              }`}
              value="startups"
            >
              Startups Recomendadas ({recommendedStartups.length})
            </TabsTrigger>
            <TabsTrigger
              className={`py-3 px-3 sm:py-4 cursor-pointer  sm:px-6 text-sm font-medium whitespace-nowrap ${
                theme === "dark"
                  ? "text-gray-200 hover:bg-gray-700"
                  : "text-gray-800 hover:bg-gray-100"
              }`}
              value="discussion"
            >
              {challenge.type === "PUBLICO" ? "Discussão" : "Discussão Interna"}
              ({comments.length})
            </TabsTrigger>
          </TabsList>

          {/* Conteúdo da Tab de Startups - Ajuste de responsividade interna */}
          <TabsContent value="startups">
            <Card
              className={`bg-white mt-4 ${
                theme === "dark" ? "bg-gray-800 text-white" : ""
              }`}
            >
              <CardHeader>
                <CardTitle>Recomendações Automáticas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recommendedStartups.map((startup) => (
                  <div
                    key={startup.id}
                    className={`rounded-lg p-4 ${
                      theme === "dark"
                        ? "bg-gray-700"
                        : "border border-gray-200"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
                      <div className="space-y-2 mb-2 sm:mb-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-medium">{startup.name}</h4>
                          <Badge variant="outline">{startup.segment}</Badge>
                          <Badge className="bg-green-100 text-green-800">
                            {startup.matchScore}% Match
                          </Badge>
                        </div>
                        <p
                          className={`text-sm ${
                            theme === "dark" ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          {startup.description}
                        </p>
                        <div
                          className={`flex flex-wrap gap-x-4 text-xs ${
                            theme === "dark" ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          <span>Estágio: {startup.stage}</span>
                          <span>Tecnologia: {startup.technology}</span>
                        </div>
                      </div>
                      <div className="text-left sm:text-right mt-2 sm:mt-0">
                        <div className="text-2xl font-bold text-green-600">
                          {startup.matchScore}%
                        </div>
                        <p className="text-xs text-gray-500">Compatibilidade</p>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-2 mb-3 sm:mb-0">
                        <Badge
                          className={getStatusColor(startup.connectionStatus)}
                        >
                          {getStatusIcon(startup.connectionStatus)}
                          <span className="ml-1">
                            {getStatusLabel(startup.connectionStatus)}
                          </span>
                        </Badge>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push(`/startup/${startup.id}`)}
                        >
                          <Building2 className="w-4 h-4 mr-2" />
                          Ver Perfil
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleConnect(startup.id)}
                          disabled={startup.connectionStatus !== "nenhum"}
                        >
                          {startup.connectionStatus === "nenhum" ? (
                            <>
                              <Heart className="w-4 h-4 mr-2" />
                              Conectar
                            </>
                          ) : (
                            <>
                              <Check className="w-4 h-4 mr-2 text-green-600" />
                              Conectado
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab de Submissões de Ideias */}
          <TabsContent value="submissions">
            <Card
              className={`bg-white mt-4 ${
                theme === "dark" ? "bg-gray-800 text-white" : ""
              }`}
            >
              <CardHeader>
                <CardTitle>Ideias Submetidas</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {submissions.map((idea) => (
                  <Card
                    key={idea.id}
                    className={`flex flex-col ${
                      theme === "dark" ? "bg-gray-700 text-white" : ""
                    }`}
                  >
                    <CardHeader>
                      <CardTitle className="text-base">{idea.title}</CardTitle>
                      <CardDescription>por {idea.authorId}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 flex items-end justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <ThumbsUp className="w-4 h-4" /> {idea.votes || 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="w-4 h-4" />{" "}
                          {idea.comments || 0}
                        </span>
                      </div>
                      <Badge
                        className={` ${
                          theme === "dark"
                            ? "bg-gray-600 text-gray-200"
                            : "bg-gray-100 text-gray-800"
                        }`}
                        variant="outline"
                      >
                        {idea.stage}
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab de Discussão */}
          <TabsContent value="discussion">
            <Card
              className={`bg-white mt-4 ${
                theme === "dark" ? "bg-gray-800 text-white" : ""
              }`}
            >
              <CardHeader>
                <CardTitle>
                  {challenge.type === "PUBLICO"
                    ? "Discussão"
                    : "Discussão Interna"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start gap-4">
                  <Avatar className={theme === "dark" ? "bg-gray-700" : ""}>
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="w-full space-y-2">
                    <Textarea
                      className="focus:border-[#001f61] focus:ring focus:ring-[#001f61]/30 transition-colors"
                      placeholder="Adicione um comentário..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                    />
                    <div className="flex justify-between items-center">
                      <Button
                        className={`hover:bg-gray-300 cursor-pointer ${
                          theme === "dark" ? "hover:bg-gray-600" : ""
                        }`}
                        onClick={handlePostComment}
                        size="sm"
                        disabled={isSubmittingComment}
                      >
                        {isSubmittingComment ? (
                          "A publicar..."
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2 " />
                            Publicar
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
                <Separator />
                <div className="space-y-6">
                  {comments.map((comment) => (
                    <div key={comment.id} className="flex items-start gap-4">
                      <Avatar>
                        <AvatarFallback>
                          {comment.author.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">
                          {comment.author.name}
                        </p>
                        <p
                          className={`text-sm ${
                            theme === "dark" ? "text-gray-200" : "text-gray-500"
                          }`}
                        >
                          {comment.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
