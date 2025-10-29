// /plat_inovacao/src/components/InnovationFunnel.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import {
  ArrowLeft,
  GripVertical,
  Plus,
  User,
  Clock,
  MessageSquare,
  Target,
  ThumbsUp,
} from "lucide-react";
import { Badge } from "./ui/badge";
import {
  User as UserType,
  Challenge,
  Idea as BaseIdea,
} from "../app/context/UserContext";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { IdeaForm } from "./IdeaForm";
import { EvaluationForm } from "./EvaluationForm";
import { useRouter } from "next/navigation";
import api from "../lib/api";
import Loading from "../app/loading";
import { motion } from "framer-motion";

// Tipo Idea estendido da sua branch, para incluir campos de UI
type Idea = BaseIdea & {
  days: number;
  author: { name: string };
  comments: number;
};

interface InnovationFunnelProps {
  user: UserType;
  challenge: Challenge;
}

// Mapeamentos para o backend da sua branch HEAD
const stageMap: { [key: string]: BaseIdea["stage"] } = {
  capture: "GERACAO",
  "pre-screening": "PRE_TRIAGEM",
  ideation: "IDEACAO",
  "detailed-screening": "TRIAGEM_DETALHADA",
  poc: "EXPERIMENTACAO",
};
const reverseStageMap: { [key: string]: string } = Object.fromEntries(
  Object.entries(stageMap).map(([key, value]) => [value, key])
);

// Etapas do funil (da branch 'main', mas essencial para ambos)
const funnelStages = [
  { id: "capture", title: "Geração/Captura" },
  { id: "pre-screening", title: "Pré-Triagem" },
  { id: "ideation", title: "Ideação" },
  { id: "detailed-screening", title: "Triagem Detalhada" },
  { id: "poc", title: "Experimentação (POC)" },
];

export function InnovationFunnel({ user, challenge }: InnovationFunnelProps) {
  const router = useRouter();
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isIdeaFormOpen, setIsIdeaFormOpen] = useState(false);
  const [votedIdeas, setVotedIdeas] = useState<string[]>([]);
  const [theme, setTheme] = useState<string>(
    typeof window !== "undefined"
      ? sessionStorage.getItem("theme") || "light"
      : "light"
  );
  const [isEvaluationModalOpen, setIsEvaluationModalOpen] = useState(false);
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);

  // Sua função de busca de dados, agora reutilizável
  const fetchIdeas = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/idea");
      const challengeIdeas = response.data
        .filter((idea: any) => idea.challengeId === challenge.id)
        .map((idea: any) => ({
          ...idea,
          stage: reverseStageMap[idea.stage] || "capture",
          author: "Autor Desconhecido", // Mock, idealmente viria da API
          comments: 0, // Mock
          votes: idea.votes || 0,
          days: Math.floor(
            (new Date().getTime() - new Date(idea.createdAt).getTime()) /
              (1000 * 3600 * 24)
          ),
        }));
      setIdeas(challengeIdeas);
    } catch (error) {
      console.error("Falha ao buscar ideias:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (challenge.id) {
      fetchIdeas();
    }
  }, [challenge.id]);

  // Sua função de Drag-and-Drop com chamada à API
  const handleOnDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;
    if (!destination || source.droppableId === destination.droppableId) return;

    const originalIdeas = ideas;
    const updatedIdeas = ideas.map((idea) =>
      idea.id === draggableId
        ? { ...idea, stage: destination.droppableId }
        : idea
    );
    setIdeas(updatedIdeas);

    const newStageBackend = stageMap[destination.droppableId];
    try {
      await api.put(`/idea/${draggableId}`, { stage: newStageBackend });
    } catch (error) {
      console.error("Falha ao atualizar a etapa da ideia:", error);
      setIdeas(originalIdeas); // Reverte em caso de erro
      alert("Não foi possível mover a ideia. Tente novamente.");
    }
  };

  // Sua função de submissão de nova ideia
  const handleIdeaSubmit = async (formData: {
    title: string;
    description: string;
  }) => {
    try {
      const newIdeaData = {
        title: formData.title,
        description: formData.description,
        challengeId: challenge.id,
        authorId: user.id,
        companyId: user.companyId,
        stage: "GERACAO",
        priority: "BAIXA",
      };
      const response = await api.post("/idea", newIdeaData);
      const newIdeaForState = {
        ...response.data,
        stage: reverseStageMap[response.data.stage],
        author: user.name,
        comments: 0,
        days: 0,
        votes: 0,
      };
      setIdeas((prevIdeas) => [...prevIdeas, newIdeaForState]);
      setIsIdeaFormOpen(false);
    } catch (error) {
      console.error("Falha ao criar ideia:", error);
      alert("Não foi possível criar a ideia. Tente novamente.");
    }
  };

  // Função de voto (lógica de ambas as branches)
  const handleVote = (ideaId: string) => {
    setIdeas(
      ideas.map((idea) =>
        idea.id === ideaId ? { ...idea, votes: (idea.votes || 0) + 1 } : idea
      )
    );
    setVotedIdeas([...votedIdeas, ideaId]);
  };

  // Funções auxiliares combinadas
  const getPriorityBadge = (priority: string) => {
    const prio = priority?.toUpperCase();
    switch (prio) {
      case "ALTA":
        return <Badge className="bg-orange-500 text-white">Alta</Badge>;
      case "MÉDIA":
        return <Badge className="bg-[#001f61] text-white">Média</Badge>;
      case "BAIXA":
        return <Badge className="bg-[#7eb526] text-white">Baixa</Badge>;
      case "CRÍTICA":
        return <Badge className="bg-red-600 text-white">Crítica</Badge>;
      default:
        return <Badge>{priority}</Badge>;
    }
  };
  const isEvaluationStage = (stageId: string) =>
    stageId === "pre-screening" || stageId === "detailed-screening";

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div
      className={`min-h-screen ${
        theme === "dark" ? "bg-gray-900" : "bg-gray-50"
      } flex flex-col`}
    >
      <div
        className={`bg-[#011677] sticky top-0 z-10 text-white ${
          theme === "dark"
            ? "bg-gray-800 text-white"
            : "text-white border-b border-gray-200"
        }`}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className={`hovers-exit-dash ${
                theme === "dark" ? "hover:bg-gray-600" : ""
              }`}
              onClick={() => router.push(`/dashboard`)}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao Dashboard
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              <div>
                <h1 className="text-lg font-semibold">Funil de Ideias</h1>
                <p className="text-sm text-gray-300">{challenge.name}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <DragDropContext onDragEnd={handleOnDragEnd}>
        <div className="flex-1 overflow-x-auto p-3">
          <div className="flex gap-6 min-w-max h-full">
            {funnelStages.map((stage) => (
              <Droppable key={stage.id} droppableId={stage.id}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`w-80 rounded-lg flex flex-col shadow-md border ${
                      theme === "dark"
                        ? "bg-gray-900 border-gray-700"
                        : "bg-white border-gray-200"
                    }`}
                  >
                    <div
                      className={`p-4 bg-[#011677] rounded-t-lg ${
                        theme === "dark"
                          ? "bg-gray-800 text-white"
                          : "text-white"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-white">
                          <span className="w-3 h-3 rounded-full bg-[#001f61]"></span>
                          <h3 className="font-semibold">{stage.title}</h3>
                        </div>
                        <Badge className="bg-white text-[#001f61] font-semibold">
                          {
                            ideas.filter((idea) => idea.stage === stage.id)
                              .length
                          }
                        </Badge>
                      </div>
                    </div>
                    <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                      {ideas
                        .filter((idea) => idea.stage === stage.id)
                        .map((idea, index) => (
                          <Draggable
                            key={idea.id}
                            draggableId={idea.id}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <Dialog
                                open={
                                  isEvaluationModalOpen &&
                                  selectedIdea?.id === idea.id
                                }
                                onOpenChange={(isOpen) => {
                                  if (!isOpen) setSelectedIdea(null);
                                  setIsEvaluationModalOpen(isOpen);
                                }}
                              >
                                <DialogTrigger asChild>
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    onClick={() => setSelectedIdea(idea)}
                                  >
                                    <motion.div
                                      layout
                                      transition={{
                                        type: "spring",
                                        stiffness: 350,
                                        damping: 30,
                                      }}
                                      className={`shadow-md rounded-md ${
                                        snapshot.isDragging
                                          ? "z-50 scale-[1.05] shadow-xl"
                                          : "scale-100 shadow-md"
                                      } transition-all duration-200 ease-in-out`}
                                    >
                                      <Card
                                        className={`cursor-pointer active:cursor-grabbing hover:bg-gray-50 border-l-4 border-[#011677] hover:border-white transition-all ${
                                          theme === "dark"
                                            ? "bg-gray-800 text-white hover:bg-gray-700"
                                            : "bg-white"
                                        }`}
                                      >
                                        <CardHeader className="p-4">
                                          <div className="flex justify-between items-start">
                                            {getPriorityBadge(idea.priority)}
                                            <GripVertical
                                              className={`w-4 h-4 ${
                                                theme === "dark"
                                                  ? "text-gray-400"
                                                  : "text-gray-400"
                                              }`}
                                            />
                                          </div>
                                          <CardTitle
                                            className={`text-base mt-2 ${
                                              theme === "dark"
                                                ? "text-gray-200"
                                                : "text-gray-900"
                                            }`}
                                          >
                                            {idea.title}
                                          </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-4 pt-0">
                                          <div
                                            className={`flex items-center justify-between text-xs ${
                                              theme === "dark"
                                                ? "text-gray-400"
                                                : "text-gray-500"
                                            }`}
                                          >
                                            <div className="flex items-center gap-1">
                                              <Clock className="w-3 h-3" />
                                              <span>{idea.days} dias</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                              <MessageSquare className="w-3 h-3" />
                                              <span>{idea.comments}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                              <User className="w-3 h-3" />
                                              <span>{idea.author.name}</span>
                                            </div>
                                          </div>
                                          <Separator className="my-3" />
                                          <div className="flex items-center justify-between">
                                            <div
                                              className={`flex items-center gap-1 text-sm ${
                                                theme === "dark"
                                                  ? "text-gray-400"
                                                  : "text-gray-600"
                                              }`}
                                            >
                                              <ThumbsUp
                                                className={`w-4 h-4 ${
                                                  theme === "dark"
                                                    ? "text-gray-400"
                                                    : "text-[#001f61]"
                                                }`}
                                              />
                                              <span>{idea.votes}</span>
                                            </div>
                                            <Button
                                              size="sm"
                                              className="bg-[#001f61] cursor-pointer text-white hover:bg-blue-900"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                handleVote(idea.id);
                                              }}
                                              disabled={votedIdeas.includes(
                                                idea.id
                                              )}
                                            >
                                              Apoiar
                                            </Button>
                                          </div>
                                        </CardContent>
                                      </Card>
                                    </motion.div>
                                  </div>
                                </DialogTrigger>

                                {isEvaluationStage(idea.stage) && (
                                  <DialogContent className="bg-white">
                                    {selectedIdea && (
                                      <EvaluationForm
                                        idea={selectedIdea}
                                        user={user}
                                        onEvaluationComplete={() => {
                                          setIsEvaluationModalOpen(false);
                                          setSelectedIdea(null);
                                          fetchIdeas();
                                        }}
                                      />
                                    )}
                                  </DialogContent>
                                )}
                              </Dialog>
                            )}
                          </Draggable>
                        ))}

                      {provided.placeholder}
                    </div>
                    <div
                      className={`p-4 mt-auto ${
                        theme === "dark" ? "bg-gray-900" : "bg-white"
                      }`}
                    >
                      <Dialog
                        open={isIdeaFormOpen}
                        onOpenChange={setIsIdeaFormOpen}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            className={`w-full cursor-pointer ${
                              theme === "dark"
                                ? "text-white hover:bg-gray-700"
                                : "text-[#001f61] hover:bg-gray-200"
                            }`}
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Adicionar Ideia
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-white">
                          <IdeaForm
                            stageTitle={stage.title}
                            onSubmit={handleIdeaSubmit}
                          />
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </div>
      </DragDropContext>
    </div>
  );
}
