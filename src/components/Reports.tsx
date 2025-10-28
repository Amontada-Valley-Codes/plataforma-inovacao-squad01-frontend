// /plat_inovacao/src/components/Reports.tsx

import React, { useState, useEffect } from 'react';
import api from '../lib/api'; // 1. Importar o axios
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { ArrowLeft, FileText, Download, Filter } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { User } from '../app/context/UserContext';
import { Badge } from './ui/badge';
import Loading from '../app/loading'; // Importar componente de loading

interface ReportsProps {
    user: User;
    onNavigate: (page: 'dashboard') => void;
}

// Interface para os dados que virão da API de ideias
interface IdeaFromApi {
    id: string;
    title: string;
    stage: 'GERACAO' | 'PRE_TRIAGEM' | 'IDEACAO' | 'TRIAGEM_DETALHADA' | 'EXPERIMENTACAO';
    author: { name: string }; // Supondo que o backend aninhe os dados do autor
    area: string; // Adicionando área para corresponder à tabela
    status: string; // Adicionando status
}

export function Reports({ user, onNavigate }: ReportsProps) {
    const [theme, setTheme] = useState<string>(typeof window !== 'undefined' ? (sessionStorage.getItem('theme') || 'light') : 'light');

    // 2. Estados para os dados e loading
    const [ideasData, setIdeasData] = useState<IdeaFromApi[]>([]);
    const [funnelChartData, setFunnelChartData] = useState<{ name: string; ideas: number }[]>([]);
    const [evolutionChartData, setEvolutionChartData] = useState<{ month: string; ideas: number }[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Mapeamento dos nomes das etapas do backend para o frontend
    const stageLabels: { [key: string]: string } = {
        GERACAO: 'Captura',
        PRE_TRIAGEM: 'Pré-Triagem',
        IDEACAO: 'Ideação',
        TRIAGEM_DETALHADA: 'Triagem',
        EXPERIMENTACAO: 'POC',
    };


    // 3. useEffect para buscar e processar os dados
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get('/idea');
                const ideas: IdeaFromApi[] = response.data;

                // A. Popular a tabela
                // Precisamos adaptar os dados, já que o backend não retorna autor.name, area, e status diretamente
                const adaptedIdeas = ideas.map(idea => ({
                    ...idea,
                    author: { name: 'Usuário' }, // Mock, pois o backend não retorna isso
                    area: 'Tecnologia', // Mock
                    status: 'Ativo' // Mock
                }));
                setIdeasData(adaptedIdeas);

                // B. Processar dados para o gráfico de funil
                const funnelCounts = ideas.reduce((acc, idea) => {
                    const stageName = stageLabels[idea.stage] || 'Outro';
                    acc[stageName] = (acc[stageName] || 0) + 1;
                    return acc;
                }, {} as Record<string, number>);

                const funnelData = Object.keys(stageLabels).map(key => ({
                    name: stageLabels[key],
                    ideas: funnelCounts[stageLabels[key]] || 0
                }));
                setFunnelChartData(funnelData);

                // C. Processar dados para o gráfico de evolução (exemplo simplificado)
                // Num caso real, o campo `createdAt` seria usado aqui
                setEvolutionChartData([
                    { month: 'Jan', ideas: 15 },
                    { month: 'Fev', ideas: 28 },
                    { month: 'Mar', ideas: 12 },
                    { month: 'Abr', ideas: 35 },
                    { month: 'Mai', ideas: ideas.length }, // Total de ideias no mês atual
                ]);


            } catch (error) {
                console.error("Falha ao buscar dados para os relatórios:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    // 4. Renderizar o loading
    if (isLoading) {
        return <Loading />;
    }

    const handleExportCSV = () => {
        if (ideasData.length === 0) {
            alert("Não há dados para exportar.");
            return;
        }

        // 1. Definir os cabeçalhos do CSV
        const headers = ['Título da Ideia', 'Autor', 'Área', 'Etapa Atual', 'Status'];

        // 2. Mapear os dados para o formato de linha do CSV
        const rows = ideasData.map(idea => [
            `"${idea.title.replace(/"/g, '""')}"`, // Trata aspas no título
            `"${idea.author.name}"`,
            `"${idea.area}"`,
            `"${stageLabels[idea.stage] || idea.stage}"`,
            `"${idea.status}"`
        ].join(','));

        // 3. Juntar cabeçalhos e linhas
        const csvContent = [headers.join(','), ...rows].join('\n');

        // 4. Criar um Blob com o conteúdo CSV
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);

        // 5. Criar um link temporário e simular o clique para fazer o download
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "relatorio_de_ideias.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    // 💡 FIM DA NOVA FUNÇÃO


    return (
        <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
            {/* Header - AJUSTADO: Removido 'sticky top-0 z-10' para tirar o efeito fixo */}
            <div className={`bg-[#011677] text-white ${theme === 'dark' ? 'bg-gray-800 text-white' : ' text-black border-b border-gray-200'}`}>
                <div className="container mx-auto px-6 py-4">
                    {/* Alterado para flex-wrap e ajustado o alinhamento no mobile */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"> 
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
                            <Button 
                                className={`hovers-exit-dash ${theme === 'dark' ? 'hover:bg-gray-600' : ''}`} 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => onNavigate('dashboard')}
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Voltar ao Dashboard
                            </Button>
                            {/* Separator oculto no mobile e visível apenas no desktop */}
                            <Separator orientation="vertical" className="h-6 hidden sm:block" /> 
                            <div className="flex items-center gap-2">
                                <FileText className="w-5 h-5" />
                                <h1 className="text-lg font-semibold">Relatórios de Inovação</h1>
                            </div>
                        </div>
                        {/* Div dos botões: usa flex-wrap, e preenche a largura total no mobile */}
                        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto sm:justify-end">
                            <Button 
                                variant="outline" 
                                className={`w-full sm:w-auto ${theme === 'dark' ? 'text-gray-200 bg-gray-700 hover:bg-gray-600' : 'text-gray-800 bg-white hover:bg-gray-100'}`}
                            >
                                <Filter className="w-4 h-4 mr-2" />
                                Filtrar por Período
                            </Button>
                            <Button 
                                onClick={handleExportCSV} 
                                className={`w-full sm:w-auto cursor-pointer ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'hovers-exit-dash'}`}
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Exportar Relatório
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-6 py-8 space-y-8">
                {/* Gráficos */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <Card className={`shadow-lg ${theme === 'dark' ? 'bg-gray-800 text-white' : ''}`}>
                        <CardHeader>
                            <CardTitle>Ideias por Etapa do Funil</CardTitle>
                            <CardDescription>Distribuição atual das ideias no funil de inovação.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                {/* O gráfico de funil agora usa o estado `funnelChartData` */}
                                <BarChart data={funnelChartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="ideas" fill="#011677" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                    <Card className={`shadow-lg ${theme === 'dark' ? 'bg-gray-800 text-white' : ''}`}>
                        <CardHeader>
                            <CardTitle>Evolução Mensal</CardTitle>
                            <CardDescription>Novas ideias submetidas por mês.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                {/* O gráfico de evolução agora usa o estado `evolutionChartData` */}
                                <LineChart data={evolutionChartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="ideas" stroke="#011677" name="Novas Ideias" />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>

                {/* Tabela de Dados */}
                <Card className={`shadow-lg ${theme === 'dark' ? 'bg-gray-800 text-white' : ''}`}>
                    <CardHeader>
                        <CardTitle className={`text-2xl ${theme === 'dark' ? 'text-gray-200' : 'text-[#001f61]'}`}>Relatório Geral de Ideias</CardTitle>
                        <CardDescription>Lista completa de todas as ideias submetidas na sua empresa.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table className="min-w-full divide-y divide-gray-200">
                                <TableHeader className={`bg-gray-50 ${theme === 'dark' ? 'bg-gray-800' : ''}`}>
                                    <TableRow>
                                        <TableHead className={`font-bold ${theme === 'dark' ? 'text-gray-200' : 'text-[#001f61]'}`}>Título da Ideia</TableHead>
                                        <TableHead className={`font-bold ${theme === 'dark' ? 'text-gray-200' : 'text-[#001f61]'}`}>Autor</TableHead>
                                        <TableHead className={`font-bold ${theme === 'dark' ? 'text-gray-200' : 'text-[#001f61]'}`}>Área</TableHead>
                                        <TableHead className={`font-bold ${theme === 'dark' ? 'text-gray-200' : 'text-[#001f61]'}`}>Etapa Atual</TableHead>
                                        <TableHead className={`font-bold ${theme === 'dark' ? 'text-gray-200' : 'text-[#001f61]'}`}>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {/* A tabela agora usa o estado `ideasData` */}
                                    {ideasData.map((idea) => (
                                        <TableRow key={idea.id} className={`hover:bg-blue-50/20 transition-colors duration-200 ${theme === 'dark' ? 'bg-gray-800 text-white' : ''}`}>
                                            <TableCell className={`font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>{idea.title}</TableCell>
                                            <TableCell className={`text-gray-600 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{idea.author.name}</TableCell>
                                            <TableCell className={`text-gray-600 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{idea.area}</TableCell>
                                            <TableCell>
                                                <Badge
                                                    className={`bg-indigo-100 text-indigo-800 hover:bg-indigo-600 text-xs font-medium px-2 py-0.5 ${theme === 'dark' ? 'bg-indigo-900 text-indigo-300' : ''}`}
                                                >
                                                    {stageLabels[idea.stage] || idea.stage}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className={`text-gray-600 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{idea.status}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}