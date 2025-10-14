"use client";

import React, { useState } from "react";
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
import { User as UserType, Challenge } from "../app/context/UserContext"; // Importe Challenge
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

interface InnovationFunnelProps {
  user: UserType;
  challenge: Challenge; // Agora recebe o desafio inteiro
}

// ... (mocks e funções auxiliares como antes)
const funnelStages = [
  { id: "capture", title: "Geração/Captura" },
  { id: "pre-screening", title: "Pré-Triagem" },
  { id: "ideation", title: "Ideação" },
  { id: "detailed-screening", title: "Triagem Detalhada" },
  { id: "poc", title: "Experimentação (POC)" },
];

// Adicionado o campo "votes" aos dados
const initialIdeas = [
  {
    id: "idea-1",
    stage: "capture",
    title: "App de Recomendações com IA",
    priority: "Alta",
    author: "Ana Silva",
    comments: 3,
    days: 1,
    votes: 12,
  },
  {
    id: "idea-2",
    stage: "capture",
    title: "Otimização de Rotas de Entrega",
    priority: "Média",
    author: "Carlos Santos",
    comments: 1,
    days: 2,
    votes: 5,
  },
  {
    id: "idea-3",
    stage: "pre-screening",
    title: "Plataforma de Treinamento Gamificada",
    priority: "Alta",
    author: "Maria Costa",
    comments: 8,
    days: 5,
    votes: 25,
  },
  {
    id: "idea-4",
    stage: "ideation",
    title: "Uso de Blockchain para Rastreabilidade",
    priority: "Alta",
    author: "Ana Silva",
    comments: 15,
    days: 12,
    votes: 42,
  },
  {
    id: "idea-5",
    stage: "ideation",
    title: "Assistente Virtual para Clientes",
    priority: "Baixa",
    author: "João Pereira",
    comments: 5,
    days: 18,
    votes: 18,
  },
  {
    id: "idea-6",
    stage: "detailed-screening",
    title: "Análise Preditiva de Churn",
    priority: "Crítica",
    author: "Carlos Santos",
    comments: 22,
    days: 25,
    votes: 55,
  },
  {
    id: "idea-7",
    stage: "poc",
    title: "POC - Pagamentos com Reconhecimento Facial",
    priority: "Crítica",
    author: "Ana Silva",
    comments: 31,
    days: 40,
    votes: 89,
  },
];

export function InnovationFunnel({ user, challenge }: InnovationFunnelProps) {
  const router = useRouter();
  const [ideas, setIdeas] = useState(initialIdeas);
  const [isIdeaFormOpen, setIsIdeaFormOpen] = useState(false);
  const [votedIdeas, setVotedIdeas] = useState<string[]>([]);
  const [isEvaluationFormOpen, setIsEvaluationFormOpen] = useState(false);
  const [theme, setTheme] = useState<string>(
    typeof window !== "undefined"
      ? sessionStorage.getItem("theme") || "light"
      : "light"
  );

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "Alta":
        return <Badge className="bg-orange-500 text-white">Alta</Badge>;
      case "Média":
        return <Badge className="bg-[#001f61] text-white">Média</Badge>;
      case "Baixa":
        return <Badge className="bg-[#7eb526] text-white">Baixa</Badge>;
      case "Crítica":
        return <Badge className="bg-red-600 text-white">Crítica</Badge>;
      default:
        return <Badge>{priority}</Badge>;
    }
  };

  const handleOnDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;

    if (source.droppableId !== destination.droppableId) {
      const draggedIdea = ideas.find((idea) => idea.id === result.draggableId);
      if (draggedIdea) {
        const updatedIdeas = ideas.map((idea) =>
          idea.id === draggedIdea.id
            ? { ...idea, stage: destination.droppableId }
            : idea
        );
        setIdeas(updatedIdeas);
      }
    }
  };

  const handleVote = (ideaId: string) => {
    setIdeas(
      ideas.map((idea) =>
        idea.id === ideaId ? { ...idea, votes: idea.votes + 1 } : idea
      )
    );
    setVotedIdeas([...votedIdeas, ideaId]);
  };

  const isEvaluationStage = (stageId: string) => {
    return stageId === "pre-screening" || stageId === "detailed-screening";
  };

  return (
    <div
      className={`min-h-screen ${
        theme === "dark" ? "bg-gray-900" : "bg-gray-50"
      } flex flex-col`}
    >
      <div
        className={`bg-[#011677]  sticky top-0 z-10 text-white ${
          theme === "dark"
            ? "bg-gray-800 text-white"
            : " text-black border-b border-gray-200"
        }`}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className={`hovers-exit-dash ${theme === 'dark' ? 'hover:bg-gray-600' : ''}`}
              onClick={() => router.push(`/challenges/${challenge.id}`)}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar aos Detalhes do Desafio
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
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`w-80 rounded-lg flex flex-col shadow-md border border-gray-200 ${
                      theme === "dark" ? "bg-gray-900" : "bg-white"
                    }`}
                  >
                    {/* Coluna Header */}
                    <div
                      className={`p-4 bg-[#011677] rounded-t-lg ${
                        theme === "dark"
                          ? "bg-gray-800 text-white"
                          : "text-white"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-white">
                          <span className="w-3 h-3 rounded-full bg-[#7eb526]"></span>
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

                    {/* Cards */}
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
                              <Dialog>
                                <DialogTrigger asChild>
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className={`shadow-md ${
                                      snapshot.isDragging
                                        ? "opacity-80 shadow-lg"
                                        : ""
                                    }`}
                                  >
                                    <Card
                                      className={`cursor-pointer active:cursor-grabbing bg-white hover:bg-gray-50 border-l-4 border-[#011677] hover:border-[#7eb526] transition-all ${
                                        theme === "dark"
                                          ? "bg-gray-800 text-white hover:bg-gray-700"
                                          : ""
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
                                              ? "text-gray-400"
                                              : "text-gray-900"
                                          }`}
                                        >
                                          {idea.title}
                                        </CardTitle>
                                      </CardHeader>
                                      <CardContent className="p-4 pt-0 flex-1 flex flex-col justify-end">
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
                                            <span>{idea.author}</span>
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
                                            className="bg-[#7eb526] text-white hover:bg-[#6aa21e]"
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
                                  </div>
                                </DialogTrigger>
                                {isEvaluationStage(idea.stage) && (
                                  <DialogContent className="bg-white">
                                    <EvaluationForm idea={idea} />
                                  </DialogContent>
                                )}
                              </Dialog>
                            )}
                          </Draggable>
                        ))}
                      {provided.placeholder}
                    </div>

                    {/* Adicionar ideia */}
                    {/* Adicionar ideia */}
                    <div
                      // Fundo da div externa (roda pé da coluna)
                      className={`p-4 mt-auto ${
                        theme === "dark" ? "bg-gray-800" : "bg-white"
                      }`}
                    >
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            className={`
          w-full cursor-pointer 
          ${
            theme === "dark"
              ? "text-white hover:bg-gray-700" // Tema Escuro
              : "text-[#001f61] hover:bg-gray-200" // Tema Claro
          }
        `}
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Adicionar Ideia
                          </Button>
                        </DialogTrigger>
                        <DialogContent
                          // Fundo do Modal
                          className={
                            'bg-white'
                          }
                        >
                          <IdeaForm stageTitle={stage.title} />
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
