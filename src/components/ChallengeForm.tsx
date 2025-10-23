import React, { useState } from 'react';
import { Card, CardContent, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { ArrowLeft, Calendar as CalendarIcon, Plus, X, Save, Target } from 'lucide-react';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { User } from '../app/context/UserContext';
import api from '../lib/api';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "./ui/select";


interface ChallengeFormProps {
	user: User;
	onNavigate: (page: 'dashboard') => void;
}

export function ChallengeForm({ user, onNavigate }: ChallengeFormProps) {
	const [formData, setFormData] = useState({
		name: '',
		startDate: undefined as Date | undefined,
		endDate: undefined as Date | undefined,
		area: '',
		description: '',
		type: 'interno' as 'interno' | 'publico'
	});

	const [tags, setTags] = useState<string[]>([]);
	const [currentTag, setCurrentTag] = useState('');
	const [theme, setTheme] = useState<string>(typeof window !== 'undefined' ? (sessionStorage.getItem('theme') || 'light') : 'light');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState('');

	const handleAddTag = () => {
		if (currentTag.trim() && !tags.includes(currentTag.trim())) {
			setTags([...tags, currentTag.trim()]);
			setCurrentTag('');
		}
	};

	const handleRemoveTag = (tagToRemove: string) => {
		setTags(tags.filter(tag => tag !== tagToRemove));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');
		setIsSubmitting(true);

		// 1. Validar dados (exemplo simples)
		if (!formData.name || !formData.startDate || !formData.endDate || !formData.description) {
			setError('Por favor, preencha todos os campos obrigatórios.');
			setIsSubmitting(false);
			return;
		}

		// 2. Mapear dados do frontend para o formato do DTO do backend
		const challengeData = {
			name: formData.name,
			startDate: formData.startDate,
			endDate: formData.endDate,
			area: formData.area,
			description: formData.description,
			// Converte 'interno' -> 'RESTRITO', 'publico' -> 'PUBLICO'
			typePublication: formData.type === 'interno' ? 'RESTRITO' : 'PUBLICO',
			// Valores padrão para campos que não existem no formulário
			status: 'ATIVO',
			images: ['https://via.placeholder.com/150'], // URL de imagem provisória
			// O backend espera um Enum, vamos enviar a primeira tag como exemplo
			// Idealmente, o backend deveria aceitar um array ou o frontend deveria ter um seletor para o Enum
			tags: tags.length > 0 ? tags[0].toUpperCase().replace(/ /g, '_') : 'IA',
			categoria: 'TECNOLOGIA', // Valor padrão
			companyId: user.companyId // Assumindo que o `user` do context tem o companyId
		};

		// Validação para o enum `Tags` (simplificada)
		const validTags = ['IA', 'SUSTENTABILIDADE', 'FINTECH', 'HEALTHTECH', 'EDTECH', 'IOT', 'BLOCKCHAIN', 'AUTOMACAO'];
		if (!validTags.includes(challengeData.tags)) {
			challengeData.tags = 'IA'; // Define um padrão se a tag não for válida
		}


		try {
			// 3. Enviar os dados para o backend
			await api.post('/challenges', challengeData);

			// 4. Sucesso: notificar o usuário (opcional) e navegar
			alert('Desafio criado com sucesso!'); // Você pode substituir por um componente de notificação (Toaster)
			onNavigate('dashboard');

		} catch (err: any) {
			console.error('Falha ao criar desafio:', err);
			setError(err.response?.data?.message || 'Ocorreu um erro ao enviar o formulário.');
		} finally {
			setIsSubmitting(false);
		}
	};

	const suggestedTags = ['IA', 'Sustentabilidade', 'FinTech', 'HealthTech', 'EdTech', 'IoT', 'BLOCKHAIN', 'Automação'];

	return (
		<div className={`min-h-screen bg-background h-screen w-full bg-[url('/ninnafundo.jpg')] bg-cover bg-center" ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
			{/* Header */}
			<div className={`bg-[#011677] text-white shadow-lg ${theme === 'dark' ? 'bg-gray-800 text-white' : ' text-black border-b border-gray-200'}`}>
				<div className="container mx-auto px-6 py-4">
					<div className="flex items-center gap-4">
						<Button
							variant="ghost"
							size="sm"
							onClick={() => onNavigate('dashboard')}
							className={`hovers-exit-dash ${theme === 'dark' ? 'hover:bg-gray-600' : ''}`}
						>
							<ArrowLeft className="w-4 h-4 mr-2" />
							Voltar ao Dashboard
						</Button>
						<Separator orientation="vertical" className="h-6 bg-white/30" />
						<div className="flex items-center gap-2">
							<Target className="w-5 h-5 text-white" />
							<h1 className="text-xl font-semibold">Novo Desafio de Inovação</h1>
						</div>
					</div>
				</div>
			</div>

			{/* Content */}
			<div className="container mx-auto px-6 flex justify-center items-center">
				<div className="mx-auto">
					<div className="mb-2 text-center">
						<h2 className={`text-4xl font-extrabold mt-3 text-[#001f61] ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Cadastrar Desafio</h2>
						<p className={` font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
							Crie um novo desafio para capturar ideias inovadoras e conectar com startups.
						</p>
					</div>

					<form onSubmit={handleSubmit} className="space-y-6 w-300"> {/* Reduzi o espaço aqui de space-y-8 para space-y-6 */}
						<Card className={` rounded-2xl  ${theme === 'dark' ? 'bg-gray-800' : 'bg-white/90 backdrop-blur-sm border-2 border-gray-100 shadow-xl shadow-gray-200/80'}`}>
							<CardContent className="p-6">
								{/* Container principal do Grid */}
								<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

									{/* COLUNA ESQUERDA: Informações Básicas */}
									<div className="space-y-6">
										<div>
											<CardTitle className={`text-[#001f61] mb-4 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Informações Básicas:</CardTitle>
											<div className="space-y-2">
												<Label htmlFor="name" className={` ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Nome do Desafio <span className={` ${theme === 'dark' ? 'text-white' : 'text-black'}`}>*</span></Label>
												<Input
													id="name"
													placeholder="Ex: Automação de Processos Financeiros"
													value={formData.name}
													onChange={(e) => setFormData({ ...formData, name: e.target.value })}
													required
													className={` rounded-lg transition-colors ${theme === 'dark' ? 'bg-gray-800 text-white focus:border-white/10 focus:ring-white/60' : 'bg-white text-black focus:border-[#001f61] focus:ring focus:ring-[#001f61]/30'}`}
												/>
											</div>
										</div>

										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											<div className="space-y-2">
												<Label className={` ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Data de Início <span className={` ${theme === 'dark' ? 'text-white' : 'text-black'}`}>*</span></Label>
												<Popover>
													<PopoverTrigger asChild>
														<Button
															variant="outline"
															className={`w-full justify-start text-left font-normal border-gray-300  transition-colors cursor-pointer ${theme === 'dark' ? 'text-white' : 'text-black hover:border-[#001f61]'}`}
														>
															<CalendarIcon className={`mr-2 h-4 w-4 text-black ${theme === 'dark' ? 'text-white' : ''}`} />
															{formData.startDate ? (
																format(formData.startDate, "dd/MM/yyyy", { locale: pt })
															) : (
																<span className={` ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Selecionar data</span>
															)}
														</Button>
													</PopoverTrigger>
													<PopoverContent className={`w-auto p-0 bg-white shadow-lg rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'}`}>
														<Calendar
															mode="single"
															selected={formData.startDate}
															onSelect={(date) => setFormData({ ...formData, startDate: date })}
															locale={pt}
															className="rounded-md border"
															classNames={{
																day_selected: "bg-[#001f61] text-white hover:bg-[#001f61] hover:text-white focus:bg-[#001f61] focus:text-white",
																day_today: "text-black font-bold",
																day_outside: "text-gray-400",
															}}
														/>
													</PopoverContent>
												</Popover>
											</div>

											<div className="space-y-2">
												<Label className={` ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Data de Fim <span className={` ${theme === 'dark' ? 'text-white' : 'text-black'}`}>*</span></Label>
												<Popover>
													<PopoverTrigger asChild>
														<Button
															variant="outline"
															className={`w-full justify-start text-left font-normal border-gray-300  transition-colors cursor-pointer ${theme === 'dark' ? 'text-white' : 'text-black hover:border-[#001f61]'}`}
														>
															<CalendarIcon className={`mr-2 h-4 w-4 text-black ${theme === 'dark' ? 'text-white' : ''}`} />
															{formData.endDate ? (
																format(formData.endDate, "dd/MM/yyyy", { locale: pt })
															) : (
																<span className="text-muted-foreground">Selecionar data</span>
															)}
														</Button>
													</PopoverTrigger>
													<PopoverContent className={`w-auto p-0 bg-white shadow-lg rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'}`}>
														<Calendar
															mode="single"
															selected={formData.endDate}
															onSelect={(date) => setFormData({ ...formData, endDate: date })}
															locale={pt}
															className="rounded-md border"
															classNames={{
																day_selected: "bg-[#001f61] text-white hover:bg-[#001f61] hover:text-white focus:bg-[#001f61] focus:text-white",
																day_today: "text-black font-bold",
																day_outside: "text-gray-400",
															}}
														/>
													</PopoverContent>
												</Popover>
											</div>
										</div>

										<div className="space-y-2">
											<Label className={` ${theme === 'dark' ? 'text-white' : 'text-black'}`} htmlFor="area">Área Principal</Label>
											<Select onValueChange={(value) => setFormData({ ...formData, area: value })}>
                                                <SelectTrigger className={`w-full justify-between border-gray-300 transition-colors cursor-pointer ${theme === 'dark' ? 'text-white' : 'text-black hover:border-[#001f61]'}`}>
                                                    <SelectValue placeholder="Selecione a área principal" className={` ${theme === 'dark' ? 'text-white' : 'text-black'}`} />
                                                </SelectTrigger>
                                                <SelectContent className={`bg-white shadow-lg rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'}`}>
                                                    {['Meio Ambiente', 'Automação', 'Sustentabilidade', 'Finanças', 'Educação'].map((areaValue) => (
                                                        <SelectItem
                                                            key={areaValue}
                                                            value={areaValue}
                                                            className={`cursor-pointer select-none relative py-2 pl-10 pr-4 hover:bg-[#001f61] hover:text-white ${theme === 'dark' ? 'text-white' : 'text-black'}`}
                                                        >
                                                            <span>{areaValue}</span>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
											
										</div>

										<div className="space-y-2">
											<Label className={` ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Tags/Temas Relacionados</Label>
											<div className="flex gap-2">
												<Input
													placeholder="Digite uma tag e pressione Enter"
													className={`focus:border-[#001f61] focus:ring focus:ring-[#001f61]/30 rounded-lg transition-colors ${theme === 'dark' ? 'bg-gray-800 text-white focus:border-white/10 focus:ring-white/60' : 'bg-white text-black'}`}
													value={currentTag}
													onChange={(e) => setCurrentTag(e.target.value)}
													onKeyPress={(e) => {
														if (e.key === 'Enter') {
															e.preventDefault();
															handleAddTag();
														}
													}}
												/>
												<Button type="button" onClick={handleAddTag} className={`bg-black text-white hover:bg-blue-900 transition-colors cursor-pointer ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-500' : ''}`}>
													<Plus className="w-4 h-4" />
												</Button>
											</div>

											{tags.length > 0 && (
												<div className="flex flex-wrap gap-2 mt-3">
													{tags.map((tag) => (
														<Badge key={tag} className={`bg-[#001f61] text-white hover:bg-[#002a7a] transition-colors flex items-center gap-1 ${theme === 'dark' ? 'bg-gray-700 text-white hover:bg-gray-500' : ''}`}>
															{tag}
															<button
																type="button"
																onClick={() => handleRemoveTag(tag)}
																className="ml-1 opacity-70 hover:opacity-100"
															>
																<X className="w-3 h-3 text-black cursor-pointer" />
															</button>
														</Badge>
													))}
												</div>
											)}

											<div className="mt-4">
												<p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Sugestões de tags:</p>
												<div className="flex flex-wrap gap-2 mt-1">
													{suggestedTags.map((tag) => (
														<Button
															key={tag}
															type="button"
															variant="outline"
															size="sm"
															className={`border-black cursor-pointer text-black hover:bg-blue-100 transition-colors ${theme === 'dark' ? 'border-gray-700 text-gray-300 hover:bg-gray-700' : ''}`}
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
									<div className="space-y-8">
										{/* Seção de Descrição */}
										<div className="space-y-2">
											<CardTitle className={`text-[#001f61] mb-4 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Descrição do Problema:</CardTitle>
											<Label className={` ${theme === 'dark' ? 'text-white' : 'text-black'}`} htmlFor="description">Descrição Completa <span className={` ${theme === 'dark' ? 'text-white' : 'text-black'}`}>*</span></Label>
											<Textarea
												id="description"
												placeholder="Descreva o contexto, o problema específico..."
												className={`min-h-[120px] focus:border-[#001f61] focus:ring focus:ring-[#001f61]/30 rounded-lg transition-colors ${theme === 'dark' ? 'bg-gray-800 text-white focus:border-white/10 focus:ring-white/60' : 'bg-white text-black'}`}
												value={formData.description}
												onChange={(e) => setFormData({ ...formData, description: e.target.value })}
												required
											/>
										</div>

										{/* Seção de Configurações */}
										<div className="space-y-4">
											<CardTitle className={`text-[#001f61] mb-4 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Configurações de Publicação:</CardTitle>
											<Label className={` ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Tipo de Desafio</Label>
											<RadioGroup
												value={formData.type}
												onValueChange={(value: 'interno' | 'publico') =>
													setFormData({ ...formData, type: value })
												}
												>
												{/* INTERNO */}
												<Label
													htmlFor="interno"
													className={`flex items-center space-x-2 p-4 rounded-lg cursor-pointer transition-all border 
													${formData.type === 'interno'
														? 'border-[#001f61] bg-[#001f61]/10 ring-2 ring-[#001f61]/40'
														: 'border-gray-200 hover:bg-gray-100'
													} 
													${theme === 'dark'
														? formData.type === 'interno'
														? 'bg-[#001f61]/20 border-[#001f61]'
														: 'border-gray-700 hover:bg-gray-700'
														: ''
													}`}
												>
													<RadioGroupItem
													value="interno"
													id="interno"
													className={`text-[#001f61] border-gray-300 ${
														theme === 'dark' ? 'text-white' : 'text-black'
													}`}
													/>
													<div className="space-y-1 flex-1">
													<div
														className={`font-medium ${
														theme === 'dark' ? 'text-white' : 'text-[#001f61]'
														}`}
													>
														🔒 Restrito (Inovação Interna)
													</div>
													<p
														className={`text-sm ${
														theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
														}`}
													>
														Apenas colaboradores da sua empresa podem ver e participar deste
														desafio.
													</p>
													</div>
												</Label>

												{/* PUBLICO */}
												<Label
													htmlFor="publico"
													className={`flex items-center space-x-2 p-4 rounded-lg cursor-pointer transition-all border 
													${formData.type === 'publico'
														? 'border-[#001f61] bg-[#001f61]/10 ring-2 ring-[#001f61]/40'
														: 'border-gray-200 hover:bg-gray-100'
													} 
													${theme === 'dark'
														? formData.type === 'publico'
														? 'bg-[#001f61]/20 border-[#001f61]'
														: 'border-gray-700 hover:bg-gray-700'
														: ''
													}`}
												>
													<RadioGroupItem
													value="publico"
													id="publico"
													className={`text-[#001f61] border-gray-300 ${
														theme === 'dark' ? 'text-white' : 'text-black'
													}`}
													/>
													<div className="space-y-1 flex-1">
													<div
														className={`font-medium ${
														theme === 'dark' ? 'text-white' : 'text-[#001f61]'
														}`}
													>
														🌍 Público (Externo)
													</div>
													<p
														className={`text-sm ${
														theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
														}`}
													>
														Startups e parceiros externos podem ver e se candidatar para este
														desafio.
													</p>
													</div>
												</Label>
											</RadioGroup>
										</div>
									</div>
								</div>
							</CardContent>

							{/* BOTÕES DE AÇÃO */}
							<div className="flex gap-6 justify-center mb-4">
								<Button
									type="button"
									variant="outline"
									onClick={() => onNavigate('dashboard')}
									className={`border-[#001f61] text-[#001f61] hover:bg-[#b9bbbe] transition-colors cursor-pointer ${theme === 'dark' ? 'text-white border-gray-700 hover:bg-gray-700' : ''}`}
								>

									Cancelar
								</Button>
								<Button
									type="submit"
									className="bg-gradient-to-r from-[#011677] to-[#160430] hover:opacity-90 text-white shadow-md rounded-lg px-6 py-2 cursor-pointer"
									disabled={isSubmitting} // <-- Desativa o botão durante o envio
								>
									{isSubmitting ? 'A criar...' : ( // <-- Muda o texto durante o envio
										<>
											<Save className="w-4 h-4 mr-2" />
											Criar Desafio
										</>
									)}
								</Button>
							</div>
							{error && <p className="text-red-500 text-sm mt-2">{error}</p>}
						</Card>
					</form>
				</div>
			</div>
		</div>
	);
}