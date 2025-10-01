'use client';

import React, { useState, useEffect } from 'react';
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
    ArrowLeft, Calendar, Target, Users, Building2, Heart, MessageCircle, Send,
    Clock, CheckCircle, AlertCircle, Star, TrendingUp, Paperclip, Lightbulb, ThumbsUp
} from 'lucide-react';
import { User, Challenge, Startup } from '../app/context/UserContext';
import { useRouter } from 'next/navigation';
import { api } from '../service/Api';
import { Sidebar } from './SideBar';

interface ChallengeDetailsProps {
    user: User;
    challenge: Challenge;
}

// Interfaces para os dados que virão da API
interface IdeaSubmission {
    id: string;
    title: string;
    description: string;
    author: string;
    votes: number;
    comments: any[];
    stage: string;
}

interface Connection {
    id: string;
    status: 'NENHUM' | 'INTERESSE' | 'CONVIDADA' | 'POC' | 'REJEITADA';
    startup: Startup & { matchScore?: number };
}

const mockComments = [
	{ id: 'c1', author: { name: 'Ana Silva', avatar: 'https://i.pravatar.cc/40?u=ana' }, text: 'Achei a FinanceAI muito promissora.', timestamp: '2 dias atrás' },
	{ id: 'c2', author: { name: 'Carlos Santos', avatar: 'https://i.pravatar.cc/40?u=carlos' }, text: 'Concordo com a Ana. A SmartAudit também parece interessante.', timestamp: '1 dia atrás' },
];

export function ChallengeDetails({ user, challenge }: ChallengeDetailsProps) {
    const [newComment, setNewComment] = useState('');
    const router = useRouter();

    // Estados para guardar os dados da API
    const [submissions, setSubmissions] = useState<IdeaSubmission[]>([]);
    const [connections, setConnections] = useState<Connection[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!challenge.id) return;
            setIsLoading(true);
            try {
                // Buscar ideias e conexões em paralelo
                const [ideasRes, connectionsRes] = await Promise.all([
                    api.get(`/ideas/challenge/${challenge.id}`),
                    api.get(`/connections/challenge/${challenge.id}`)
                ]);
                setSubmissions(ideasRes.data);
                setConnections(connectionsRes.data);
            } catch (error) {
                console.error("Erro ao buscar detalhes do desafio:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [challenge.id]);


    const handlePostComment = () => { /* ... Lógica para postar comentário ... */ };
    
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
        <div className="min-h-screen bg-gray-50 flex">
            <Sidebar user={user} />
            <div className="flex-1 flex flex-col">
                <div className="bg-[#011677] text-white border-b border-gray-200">
                    <div className="container mx-auto px-6 py-4">
                        <div className="flex items-center gap-2">
                            <Target className="w-5 h-5" />
                            <h1 className="font-semibold">Detalhes do Desafio</h1>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-6 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Coluna da Esquerda - Detalhes do Desafio */}
                        <div className="lg:col-span-2 space-y-6">
                            <Card className="bg-white">
                                <CardHeader>
                                    <CardTitle className="text-xl">{challenge.name}</CardTitle>
                                    <div className="flex items-center gap-2 pt-1">
                                        <Badge variant="outline">{challenge.area}</Badge>
                                        <Badge variant={challenge.type === 'PUBLICO' ? 'default' : 'secondary'}>
                                            {challenge.type === 'PUBLICO' ? 'Público' : 'Interno'}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div>
                                        <h3 className="font-semibold">Descrição do Problema</h3>
                                        <p className="text-gray-600 mt-2">{challenge.description}</p>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2 text-sm text-gray-600">
                                            <div className="flex items-center gap-2"><Calendar className="w-4 h-4" /> Início: {new Date(challenge.startDate).toLocaleDateString('pt-BR')}</div>
                                            <div className="flex items-center gap-2"><Calendar className="w-4 h-4" /> Fim: {new Date(challenge.endDate).toLocaleDateString('pt-BR')}</div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-sm font-medium">Progresso</Label>
                                            <Progress value={calculateProgress()} />
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

                        {/* Coluna da Direita - Ações Rápidas */}
                        <div className="space-y-6">
                            <Card className="bg-white">
                                <CardHeader><CardTitle>Ações Rápidas</CardTitle></CardHeader>
                                <CardContent className="space-y-3">
                                    <Button className="w-full justify-start bg-[#011677] text-white hover:bg-[#0121af]" onClick={() => router.push(`/funnel/${challenge.id}`)}>
                                        <Target className="w-4 h-4 mr-2" />
                                        Aceder ao Funil de Ideias
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start cursor-pointer hover:bg-gray-100">
									<TrendingUp className="w-4 h-4 mr-2" />
									Relatório Detalhado
									</Button>
									<Button
										variant="outline"
										className="w-full justify-start cursor-pointer hover:bg-gray-100"
										onClick={() => router.push('/startups')}
									>
										<Building2 className="w-4 h-4 mr-2" />
										Buscar Mais Startups
									</Button>
									
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Abas */}
                    <div className="mt-8">
                        <Tabs defaultValue="submissions">
                            <TabsList className="mb-4">
                                <TabsTrigger value="submissions"><Lightbulb className="w-4 h-4 mr-2" />Submissões ({submissions.length})</TabsTrigger>
                                <TabsTrigger value="startups"><Star className="w-4 h-4 mr-2" />Startups Recomendadas ({connections.length})</TabsTrigger>
                                <TabsTrigger value="discussion"><MessageCircle className="w-4 h-4 mr-2" />Discussão</TabsTrigger>
                            </TabsList>

                            <TabsContent value="submissions">
                                <Card className="bg-white">
                                    <CardHeader><CardTitle>Ideias Submetidas</CardTitle></CardHeader>
                                    <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {isLoading ? <p>A carregar ideias...</p> : submissions.map((idea) => (
                                            <Card key={idea.id} className="flex flex-col">
                                                <CardHeader><CardTitle className="text-base">{idea.title}</CardTitle><CardDescription>por {idea.author}</CardDescription></CardHeader>
                                                <CardContent className="flex-1 flex items-end justify-between text-sm text-gray-500">
                                                    <div className="flex items-center gap-4">
                                                        <span className="flex items-center gap-1"><ThumbsUp className="w-4 h-4" /> {idea.votes}</span>
                                                        {/* <span className="flex items-center gap-1"><MessageCircle className="w-4 h-4" /> {idea.comments.length}</span> */}
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
                                    <CardHeader><CardTitle>Startups em Radar</CardTitle></CardHeader>
                                    <CardContent className="space-y-4">
                                        {isLoading ? <p>A carregar startups...</p> : connections.map((conn) => (
                                            <div key={conn.id} className="border border-gray-200 rounded-lg p-4">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <h4 className="font-medium">{conn.startup.name}</h4>
                                                        <p className="text-sm text-gray-600">{conn.startup.problem}</p>
                                                    </div>
                                                    <Badge className={getStatusColor(conn.status)}>{getStatusLabel(conn.status)}</Badge>
                                                </div>
                                            </div>
                                        ))}
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
										<Avatar><AvatarFallback>{user.email.charAt(0)}</AvatarFallback></Avatar>
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
        </div>
    );
}