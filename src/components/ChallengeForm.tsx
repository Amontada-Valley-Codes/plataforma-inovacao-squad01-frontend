'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
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
import { useRouter } from 'next/navigation';
import { api } from '../service/Api';

interface ChallengeFormProps {
  user: User;
  onNavigate: (page: 'dashboard') => void;
}

export function ChallengeForm({ user, onNavigate }: ChallengeFormProps) {
    const [name, setName] = useState('');
    const [startDate, setStartDate] = useState<Date | undefined>();
    const [endDate, setEndDate] = useState<Date | undefined>();
    const [area, setArea] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState<'INTERNO' | 'PUBLICO'>('INTERNO');
    const [tags, setTags] = useState<string[]>([]);
    const [currentTag, setCurrentTag] = useState('');

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
        if (!name || !startDate || !endDate || !area || !description) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        try {
            await api.post('/challenges', {
                name,
                startDate,
                endDate,
                area,
                description,
                type,
                companyId: user.companyId,
            });

            alert('Desafio criado com sucesso!');
            onNavigate('dashboard');

        } catch (error) {
            console.error('Erro ao criar desafio:', error);
            alert('Não foi possível criar o desafio. Tente novamente.');
        }
    };
    
    const suggestedTags = ['IA', 'Sustentabilidade', 'FinTech', 'HealthTech', 'EdTech', 'IoT', 'Blockchain', 'Automação'];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <div className="bg-[#011677] text-white shadow-lg">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onNavigate('dashboard')}
                            className='hovers-exit-dash'
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
            <div className="container mx-auto px-6 py-8 flex-1">
                <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
                    <div className="text-center">
                        <h2 className='text-3xl font-bold text-[#001f61]'>Cadastrar Desafio</h2>
                        <p className="text-gray-600 mt-1">
                            Crie um novo desafio para capturar ideias e conectar com startups.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Coluna da Esquerda */}
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-[#001f61]">Informações Básicas</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Nome do Desafio <span className="text-red-500">*</span></Label>
                                        <Input id="name" placeholder="Ex: Automação de Processos Financeiros" value={name} onChange={(e) => setName(e.target.value)} required />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Data de Início <span className="text-red-500">*</span></Label>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button variant="outline" className="w-full justify-start text-left font-normal"><CalendarIcon className="mr-2 h-4 w-4" />{startDate ? format(startDate, "dd/MM/yyyy") : <span>Selecionar data</span>}</Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={startDate} onSelect={setStartDate} /></PopoverContent>
                                            </Popover>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Data de Fim <span className="text-red-500">*</span></Label>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button variant="outline" className="w-full justify-start text-left font-normal"><CalendarIcon className="mr-2 h-4 w-4" />{endDate ? format(endDate, "dd/MM/yyyy") : <span>Selecionar data</span>}</Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={endDate} onSelect={setEndDate} /></PopoverContent>
                                            </Popover>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="area">Área Principal <span className="text-red-500">*</span></Label>
                                        <Input id="area" placeholder="Ex: FinTech, HealthTech..." value={area} onChange={(e) => setArea(e.target.value)} required />
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-[#001f61]">Descrição do Problema</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        <Label htmlFor="description">Descrição Completa <span className="text-red-500">*</span></Label>
                                        <Textarea id="description" placeholder="Descreva o contexto, o problema, os objetivos..." className="min-h-32" value={description} onChange={(e) => setDescription(e.target.value)} required />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Coluna da Direita */}
                        <div className="space-y-6">
                             <Card>
                                <CardHeader><CardTitle className="text-[#001f61]">Tags e Temas</CardTitle></CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Adicionar Tags</Label>
                                        <div className="flex gap-2">
                                            <Input placeholder="Digite uma tag e pressione Enter" value={currentTag} onChange={(e) => setCurrentTag(e.target.value)} onKeyPress={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(); } }} />
                                            <Button type="button" onClick={handleAddTag}><Plus className="w-4 h-4" /></Button>
                                        </div>
                                        {tags.length > 0 && (
                                            <div className="flex flex-wrap gap-2 pt-2">
                                                {tags.map((tag) => (
                                                    <Badge key={tag} className="bg-[#001f61] text-white">
                                                        {tag}
                                                        <button type="button" onClick={() => handleRemoveTag(tag)} className="ml-2 opacity-70 hover:opacity-100"><X className="w-3 h-3" /></button>
                                                    </Badge>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <div className="space-y-2 pt-2">
                                        <p className="text-sm text-gray-500">Sugestões:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {suggestedTags.map((tag) => (
                                                <Button key={tag} type="button" variant="outline" size="sm" onClick={() => { if (!tags.includes(tag)) setTags([...tags, tag]); }} disabled={tags.includes(tag)}>{tag}</Button>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader><CardTitle className="text-[#001f61]">Publicação</CardTitle></CardHeader>
                                <CardContent>
                                    <RadioGroup value={type} onValueChange={(value: 'INTERNO' | 'PUBLICO') => setType(value)} className="space-y-2">
                                        <Label htmlFor="interno" className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-100"><RadioGroupItem value="INTERNO" id="interno" /><span>🔒 Interno</span></Label>
                                        <Label htmlFor="publico" className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-100"><RadioGroupItem value="PUBLICO" id="publico" /><span>🌍 Público</span></Label>
                                    </RadioGroup>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                    
                    <div className="flex gap-4 justify-end pt-4">
                        <Button type="button" variant="ghost" onClick={() => onNavigate('dashboard')}>Cancelar</Button>
                        <Button type="submit" className="bg-[#011677] text-white hover:bg-[#0121af]">
                            <Save className="w-4 h-4 mr-2" />
                            Criar Desafio
                        </Button>
                    </div>
                </form>
            </div>
        </div>
  );
}