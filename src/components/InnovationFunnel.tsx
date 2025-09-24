import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { ArrowLeft, GripVertical, Plus, User, Clock, MessageSquare, Target, ThumbsUp } from 'lucide-react';
import { Badge } from './ui/badge';
import { User as UserType } from '../app/context/UserContext';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import { IdeaForm } from './IdeaForm';
import { EvaluationForm } from './EvaluationForm';

interface InnovationFunnelProps {
	user: UserType;
	onNavigate: (page: 'dashboard') => void;
}

const funnelStages = [
	{ id: 'capture', title: 'Geração/Captura' },
	{ id: 'pre-screening', title: 'Pré-Triagem' },
	{ id: 'ideation', title: 'Ideação' },
	{ id: 'detailed-screening', title: 'Triagem Detalhada' },
	{ id: 'poc', title: 'Experimentação (POC)' },
];

// Adicionado o campo "votes" aos dados
const initialIdeas = [
	{ id: 'idea-1', stage: 'capture', title: 'App de Recomendações com IA', priority: 'Alta', author: 'Ana Silva', comments: 3, days: 1, votes: 12 },
	{ id: 'idea-2', stage: 'capture', title: 'Otimização de Rotas de Entrega', priority: 'Média', author: 'Carlos Santos', comments: 1, days: 2, votes: 5 },
	{ id: 'idea-3', stage: 'pre-screening', title: 'Plataforma de Treinamento Gamificada', priority: 'Alta', author: 'Maria Costa', comments: 8, days: 5, votes: 25 },
	{ id: 'idea-4', stage: 'ideation', title: 'Uso de Blockchain para Rastreabilidade', priority: 'Alta', author: 'Ana Silva', comments: 15, days: 12, votes: 42 },
	{ id: 'idea-5', stage: 'ideation', title: 'Assistente Virtual para Clientes', priority: 'Baixa', author: 'João Pereira', comments: 5, days: 18, votes: 18 },
	{ id: 'idea-6', stage: 'detailed-screening', title: 'Análise Preditiva de Churn', priority: 'Crítica', author: 'Carlos Santos', comments: 22, days: 25, votes: 55 },
	{ id: 'idea-7', stage: 'poc', title: 'POC - Pagamentos com Reconhecimento Facial', priority: 'Crítica', author: 'Ana Silva', comments: 31, days: 40, votes: 89 },
];

export function InnovationFunnel({ user, onNavigate }: InnovationFunnelProps) {
	const [ideas, setIdeas] = useState(initialIdeas);
	const [votedIdeas, setVotedIdeas] = useState<string[]>([]); // Estado para controlar votos

	const getPriorityBadge = (priority: string) => {
		switch (priority) {
			case 'Alta': return <Badge className="bg-orange-500 text-white">Alta</Badge>;
			case 'Média': return <Badge className="bg-[#001f61] text-white">Média</Badge>;
			case 'Baixa': return <Badge className="bg-[#7eb526] text-white">Baixa</Badge>;
			case 'Crítica': return <Badge className="bg-red-600 text-white">Crítica</Badge>;
			default: return <Badge>{priority}</Badge>;
		}
	};

	const handleOnDragEnd = (result: DropResult) => {
		const { source, destination } = result;
		if (!destination) return;

		if (source.droppableId !== destination.droppableId) {
			const draggedIdea = ideas.find(idea => idea.id === result.draggableId);
			if (draggedIdea) {
				const updatedIdeas = ideas.map(idea =>
					idea.id === draggedIdea.id ? { ...idea, stage: destination.droppableId } : idea
				);
				setIdeas(updatedIdeas);
			}
		}
	};

	const handleVote = (ideaId: string) => {
		setIdeas(ideas.map(idea =>
			idea.id === ideaId ? { ...idea, votes: idea.votes + 1 } : idea
		));
		setVotedIdeas([...votedIdeas, ideaId]);
	};

	const isEvaluationStage = (stageId: string) => {
		return stageId === 'pre-screening' || stageId === 'detailed-screening';
	};

	return (
		<div className="min-h-screen bg-[#f8f9fa] flex flex-col">
			{/* Topbar */}
			<div className="bg-[#011677] border-b border-gray-200 sticky top-0 z-10">
				<div className="container mx-auto px-6 py-4">
					<div className="flex items-center gap-4">
						<Button
							variant="ghost"
							size="sm"
							className="hovers-exit-dash text-white"
							onClick={() => onNavigate('dashboard')}
						>
							<ArrowLeft className="w-4 h-4 mr-2" />
							Voltar ao Dashboard
						</Button>
						<Separator orientation="vertical" className="h-6" />
						<div className="flex items-center gap-2 text-white">
							<Target className="w-5 h-5" />
							<h1 className="text-lg font-semibold">Funil de Inovação</h1>
						</div>
					</div>
				</div>
			</div>

			{/* Board */}
			<DragDropContext onDragEnd={handleOnDragEnd}>
				<div className="flex-1 overflow-x-auto p-6">
					<div className="flex gap-6 min-w-max h-full">
						{funnelStages.map(stage => (
							<Droppable key={stage.id} droppableId={stage.id}>
								{(provided, snapshot) => (
									<div
										ref={provided.innerRef}
										{...provided.droppableProps}
										className="w-80 bg-white rounded-lg flex flex-col shadow-md border border-gray-200"
									>
										{/* Coluna Header */}
										<div className="p-4 bg-[#011677] rounded-t-lg">
											<div className="flex items-center justify-between">
												<div className="flex items-center gap-2 text-white">
													<span className="w-3 h-3 rounded-full bg-[#7eb526]"></span>
													<h3 className="font-semibold">{stage.title}</h3>
												</div>
												<Badge className="bg-white text-[#001f61] font-semibold">
													{ideas.filter(idea => idea.stage === stage.id).length}
												</Badge>
											</div>
										</div>

										{/* Cards */}
										<div className="flex-1 p-4 space-y-4 overflow-y-auto">
											{ideas.filter(idea => idea.stage === stage.id).map((idea, index) => (
												<Draggable key={idea.id} draggableId={idea.id} index={index}>
													{(provided, snapshot) => (
														<Dialog>
															<DialogTrigger asChild>
																<div
																	ref={provided.innerRef}
																	{...provided.draggableProps}
																	{...provided.dragHandleProps}
																	className={`shadow-md ${snapshot.isDragging ? 'opacity-80 shadow-lg' : ''}`}
																>
																	<Card className="cursor-pointer active:cursor-grabbing bg-white hover:bg-gray-50 border-l-4 border-[#011677] hover:border-[#7eb526] transition-all">
																		<CardHeader className="p-4">
																			<div className="flex justify-between items-start">
																				{getPriorityBadge(idea.priority)}
																				<GripVertical className="w-4 h-4 text-gray-400" />
																			</div>
																			<CardTitle className="text-base mt-2 text-gray-900">{idea.title}</CardTitle>
																		</CardHeader>
																		<CardContent className="p-4 pt-0 flex-1 flex flex-col justify-end">
																			<div className="flex items-center justify-between text-xs text-gray-500">
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
																				<div className="flex items-center gap-1 text-sm text-gray-600">
																					<ThumbsUp className="w-4 h-4 text-[#001f61]" />
																					<span>{idea.votes}</span>
																				</div>
																				<Button
																					size="sm"
																					className="bg-[#7eb526] text-white hover:bg-[#6aa21e]"
																					onClick={(e) => {
																						e.stopPropagation();
																						handleVote(idea.id);
																					}}
																					disabled={votedIdeas.includes(idea.id)}
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
										<div className="p-4 mt-auto">
											<Dialog>
												<DialogTrigger asChild>
													<Button variant="ghost" className="w-full text-[#001f61] cursor-pointer hover:bg-gray-200">
														<Plus className="w-4 h-4 mr-2" />
														Adicionar Ideia
													</Button>
												</DialogTrigger>
												<DialogContent className="bg-white">
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
