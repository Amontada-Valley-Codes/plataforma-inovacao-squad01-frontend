import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Textarea } from './ui/textarea';
import {
	ArrowLeft,
	Calendar,
	Target,
	Users,
	Building2,
	Heart,
	MessageCircle,
	Send,
	Clock,
	CheckCircle,
	AlertCircle,
	Star,
	TrendingUp,
	Paperclip,
	Lightbulb,
	ThumbsUp
} from 'lucide-react';
import { User, Challenge, Startup } from '../app/context/UserContext';

interface ChallengeDetailsProps {
	user: User;
	challenge: Challenge;
	onNavigate: (page: 'dashboard' | 'startup-database') => void;
}

// Mock de dados para os comentários
const mockComments = [
	{ id: 'c1', author: { name: 'Ana Silva', avatar: 'https://i.pravatar.cc/40?u=ana' }, text: 'Achei a FinanceAI muito promissora.', timestamp: '2 dias atrás' },
	{ id: 'c2', author: { name: 'Carlos Santos', avatar: 'https://i.pravatar.cc/40?u=carlos' }, text: 'Concordo com a Ana. A SmartAudit também parece interessante.', timestamp: '1 dia atrás' },
];

// Mock de dados para as ideias submetidas a este desafio
const mockSubmissions = [
	{ id: 'idea-1', title: 'App de Recomendações com IA', author: 'Maria Costa', votes: 42, comments: 15, stage: 'ideation' },
	{ id: 'idea-2', title: 'Pagamentos com Reconhecimento Facial', author: 'Carlos Santos', votes: 89, comments: 31, stage: 'poc' },
	{ id: 'idea-3', title: 'Plataforma de Treinamento Gamificada', author: 'João Pereira', votes: 25, comments: 8, stage: 'pre-screening' },
];


export function ChallengeDetails({ user, challenge, onNavigate }: ChallengeDetailsProps) {
	const [newComment, setNewComment] = useState('');

	const handlePostComment = () => {
		if (newComment.trim()) {
			console.log('Novo comentário:', newComment);
			setNewComment('');
		}
	};

	// ... (funções getStatusColor, getStatusLabel, getStatusIcon, handleConnectionAction, calculateProgress continuam aqui)
	const recommendedStartups: (Startup & {
		matchScore: number;
		connectionStatus: 'nenhum' | 'interesse' | 'convidada' | 'poc' | 'rejeitada';
		lastInteraction?: string;
	})[] = [
			{
				id: '1', name: 'FinanceAI', segment: 'FinTech', stage: 'tracao', technology: 'IA, Machine Learning',
				problem: 'Automação de processos financeiros', description: 'Plataforma de IA para automação inteligente de processos financeiros corporativos, reduzindo custos operacionais em até 60%.',
				matchScore: 95, connectionStatus: 'interesse', lastInteraction: '2024-01-10'
			},
			{
				id: '2', name: 'ProcessBot', segment: 'FinTech', stage: 'operacao', technology: 'RPA, IA',
				problem: 'Automação robótica de processos', description: 'Solução de RPA especializada em processos financeiros com inteligência artificial integrada.',
				matchScore: 88, connectionStatus: 'nenhum'
			},
		];

	const getStatusColor = (status: string) => {
		const colors: { [key: string]: string } = {
			nenhum: 'bg-gray-100 text-gray-800', interesse: 'bg-blue-100 text-blue-800',
			convidada: 'bg-yellow-100 text-yellow-800', poc: 'bg-green-100 text-green-800',
			rejeitada: 'bg-red-100 text-red-800'
		};
		return colors[status] || 'bg-gray-100 text-gray-800';
	};
	const getStatusLabel = (status: string) => {
		const labels: { [key: string]: string } = {
			nenhum: 'Não Contatada', interesse: 'Interesse Registrado', convidada: 'Convidada para POC',
			poc: 'POC em Andamento', rejeitada: 'Rejeitada'
		};
		return labels[status] || status;
	};
	const getStatusIcon = (status: string) => {
		switch (status) {
			case 'interesse': return <Heart className="w-4 h-4" />;
			case 'convidada': return <Send className="w-4 h-4" />;
			case 'poc': return <CheckCircle className="w-4 h-4" />;
			case 'rejeitada': return <AlertCircle className="w-4 h-4" />;
			default: return null;
		}
	};
	const handleConnectionAction = (startupId: string, action: 'interesse' | 'convidar' | 'rejeitar') => {
		console.log(`Ação ${action} para startup ${startupId}`);
	};
	const calculateProgress = () => {
		const startDate = new Date(challenge.startDate);
		const endDate = new Date(challenge.endDate);
		const now = new Date();
		const total = endDate.getTime() - startDate.getTime();
		const elapsed = now.getTime() - startDate.getTime();
		return Math.min(100, Math.max(0, (elapsed / total) * 100));
	};


	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header */}
			<div className="bg-[#001f61] text-white border-b border-gray-200">
				<div className="container mx-auto px-6 py-4">
					<div className="flex items-center gap-4">
						<Button variant="ghost" size="sm" onClick={() => onNavigate('dashboard')}>
							<ArrowLeft className="w-4 h-4 mr-2" />
							Voltar ao Dashboard
						</Button>
						<Separator orientation="vertical" className="h-6" />
						<div className="flex items-center gap-2">
							<Target className="w-5 h-5" />
							<h1 className="font-semibold">Detalhes do Desafio</h1>
						</div>
					</div>
				</div>
			</div>

			{/* Content */}
			<div className="container mx-auto px-6 py-8">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Left Column - Challenge Details */}
					<div className="lg:col-span-2 space-y-6">
						<Card className="bg-white">
							<CardHeader>
								<div className="flex items-start justify-between">
									<div className="space-y-2">
										<CardTitle className="text-xl">{challenge.name}</CardTitle>
										<div className="flex items-center gap-2">
											<Badge variant="outline">{challenge.area}</Badge>
											<Badge variant={challenge.type === 'publico' ? 'default' : 'secondary'}>
												{challenge.type === 'publico' ? 'Público' : 'Interno'}
											</Badge>
											<Badge variant="outline">{challenge.company}</Badge>
										</div>
									</div>
								</div>
							</CardHeader>
							<CardContent className="space-y-6">
								<div>
									<h3 className="font-semibold">Descrição do Problema</h3>
									<p className="text-gray-600 mt-2">{challenge.description}</p>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div className="space-y-2">
										<div className="flex items-center gap-2 text-sm text-gray-600">
											<Calendar className="w-4 h-4" />
											Data de Início: {new Date(challenge.startDate).toLocaleDateString('pt-BR')}
										</div>
										<div className="flex items-center gap-2 text-sm text-gray-600">
											<Calendar className="w-4 h-4" />
											Data de Fim: {new Date(challenge.endDate).toLocaleDateString('pt-BR')}
										</div>
									</div>

									<div className="space-y-2">
										<Label className="text-sm font-medium">Progresso do Desafio</Label>
										<Progress value={calculateProgress()} className="w-full" />
										<p className="text-xs text-gray-500">
											{Math.round(calculateProgress())}% concluído
										</p>
									</div>
								</div>
							</CardContent>
						</Card>

						<Card className="bg-white">
							<CardHeader>
								<CardTitle>Métricas do Desafio</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
									<div className="text-center">
										<div className="text-2xl font-bold text-gray-800">23</div>
										<p className="text-sm text-gray-500">Ideias Submetidas</p>
									</div>
									<div className="text-center">
										<div className="text-2xl font-bold text-green-600">4</div>
										<p className="text-sm text-gray-500">Startups Interessadas</p>
									</div>
									<div className="text-center">
										<div className="text-2xl font-bold text-blue-600">2</div>
										<p className="text-sm text-gray-500">POCs Iniciadas</p>
									</div>
									<div className="text-center">
										<div className="text-2xl font-bold text-yellow-600">87%</div>
										<p className="text-sm text-gray-500">Score Médio</p>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Right Column - Actions */}
					<div className="space-y-6">
						<Card className="bg-white">
							<CardHeader>
								<CardTitle>Ações Rápidas</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3">
								<Button className="w-full justify-start cursor-pointer hover:bg-gray-100" variant='outline'>
									<Users className="w-4 h-4 mr-2" />
									Gerenciar Participantes
								</Button>
								
								<Button variant="outline" className="w-full justify-start cursor-pointer hover:bg-gray-100">
									<TrendingUp className="w-4 h-4 mr-2" />
									Relatório Detalhado
								</Button>
								<Button
									variant="outline"
									className="w-full justify-start cursor-pointer hover:bg-gray-100"
									onClick={() => onNavigate('startup-database')}
								>
									<Building2 className="w-4 h-4 mr-2" />
									Buscar Mais Startups
								</Button>
							</CardContent>
						</Card>
					</div>
				</div>

				{/* Tabs for Startups, Discussion, and Submissions */}
				<div className="mt-8">
					<Tabs defaultValue="submissions">
						<TabsList className="mb-4 ">
							<TabsTrigger value="submissions" className='border-r-gray-400 border-b-gray-400 '>
								<Lightbulb className="w-4 h-4 mr-2" />
								Submissões de Ideias ({mockSubmissions.length})
							</TabsTrigger>
							<TabsTrigger value="startups" className='border-r-gray-400 border-b-gray-400 '>
								<Star className="w-4 h-4 mr-2" />
								Startups Recomendadas
							</TabsTrigger>
							<TabsTrigger value="discussion" className='border-r-gray-400 border-b-gray-400'>
								<MessageCircle className="w-4 h-4 mr-2" />
								Discussão Interna
							</TabsTrigger>
						</TabsList>

						{/* NOVA ABA DE SUBMISSÕES */}
						<TabsContent value="submissions">
							<Card className="bg-white">
								<CardHeader>
									<CardTitle>Ideias Submetidas</CardTitle>
									<CardDescription>
										Veja e avalie as ideias propostas pela equipa para este desafio.
									</CardDescription>
								</CardHeader>
								<CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
									{mockSubmissions.map((idea) => (
										<Card key={idea.id} className="flex flex-col">
											<CardHeader>
												<CardTitle className="text-base">{idea.title}</CardTitle>
												<CardDescription>por {idea.author}</CardDescription>
											</CardHeader>
											<CardContent className="flex-1 flex items-end justify-between text-sm text-gray-500">
												<div className="flex items-center gap-4">
													<span className="flex items-center gap-1"><ThumbsUp className="w-4 h-4" /> {idea.votes}</span>
													<span className="flex items-center gap-1"><MessageCircle className="w-4 h-4" /> {idea.comments}</span>
												</div>
												<Badge variant="outline">{idea.stage}</Badge>
											</CardContent>
										</Card>
									))}
								</CardContent>
							</Card>
						</TabsContent>

						<TabsContent value="startups">
							<Card className="bg-white">
								<CardHeader>
									<CardTitle>Recomendações Automáticas</CardTitle>
									<CardDescription>
										Startups compatíveis com este desafio baseadas em IA e histórico de matches.
									</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="space-y-4">
										{recommendedStartups.map((startup) => (
											<div key={startup.id} className="border border-gray-200 rounded-lg p-4">
												<div className="flex items-start justify-between mb-4">
													<div className="space-y-2">
														<div className="flex items-center gap-2">
															<h4 className="font-medium">{startup.name}</h4>
															<Badge variant="outline">{startup.segment}</Badge>
															<Badge className="bg-green-100 text-green-800">{startup.matchScore}% Match</Badge>
														</div>
														<p className="text-sm text-gray-600">{startup.description}</p>
														<div className="flex items-center gap-4 text-xs text-gray-500">
															<span>Estágio: {startup.stage}</span>
															<span>Tecnologia: {startup.technology}</span>
														</div>
													</div>
													<div className="text-right">
														<div className="text-2xl font-bold text-green-600">{startup.matchScore}%</div>
														<p className="text-xs text-gray-500">Compatibilidade</p>
													</div>
												</div>
												<div className="flex items-center justify-between pt-4 border-t border-gray-200">
													<div className="flex items-center gap-2">
														<Badge className={getStatusColor(startup.connectionStatus)}>
															{getStatusIcon(startup.connectionStatus)}
															<span className="ml-1">{getStatusLabel(startup.connectionStatus)}</span>
														</Badge>
													</div>
													<div className="flex gap-2">
														{/* Botões de Ação */}
													</div>
												</div>
											</div>
										))}
									</div>
								</CardContent>
							</Card>
						</TabsContent>

						<TabsContent value="discussion">
							<Card className="bg-white">
								<CardHeader>
									<CardTitle>Discussão Interna</CardTitle>
									<CardDescription>
										Espaço para colaboradores discutirem o desafio, submissões e startups.
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-6">
									<div className="flex items-start gap-4">
										<Avatar><AvatarFallback>{user.name.charAt(0)}</AvatarFallback></Avatar>
										<div className="w-full space-y-2">
											<Textarea placeholder="Adicione um comentário..." value={newComment} onChange={(e) => setNewComment(e.target.value)} />
											<div className="flex justify-between items-center">
												<Button variant="outline" size="sm"><Paperclip className="w-4 h-4 mr-2" />Anexar</Button>
												<Button onClick={handlePostComment} size="sm"><Send className="w-4 h-4 mr-2" />Publicar</Button>
											</div>
										</div>
									</div>
									<Separator />
									<div className="space-y-6">
										{mockComments.map((comment) => (
											<div key={comment.id} className="flex items-start gap-4">
												<Avatar><AvatarImage src={comment.author.avatar} /><AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback></Avatar>
												<div className="w-full">
													<div className="flex items-center gap-2 mb-1">
														<p className="font-medium text-sm">{comment.author.name}</p>
														<p className="text-xs text-gray-500">{comment.timestamp}</p>
													</div>
													<p className="text-sm text-gray-600">{comment.text}</p>
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
		</div>
	);
}