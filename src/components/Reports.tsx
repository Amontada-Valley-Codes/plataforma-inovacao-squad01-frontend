import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { ArrowLeft, FileText, Download, Filter } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { User } from '../app/context/UserContext';
import { Badge } from './ui/badge';

interface ReportsProps {
  user: User;
  onNavigate: (page: 'dashboard') => void;
}

const ideasData = [
    { id: 'idea-1', title: 'App de Recomendações com IA', stage: 'Ideação', area: 'FinTech', author: 'Ana Silva', submissions: 12, status: 'Ativo' },
    { id: 'idea-2', title: 'Otimização de Rotas', stage: 'Captura', area: 'Logística', author: 'Carlos Santos', submissions: 5, status: 'Ativo' },
    { id: 'idea-3', title: 'Plataforma Gamificada', stage: 'Pré-Triagem', area: 'EdTech', author: 'Maria Costa', submissions: 25, status: 'Ativo' },
    { id: 'idea-7', title: 'Pagamentos com Reconhecimento Facial', stage: 'POC', area: 'FinTech', author: 'Ana Silva', submissions: 89, status: 'Em POC' },
    { id: 'idea-6', title: 'Análise Preditiva de Churn', stage: 'Triagem Detalhada', area: 'Analytics', author: 'Carlos Santos', submissions: 55, status: 'Em Análise' },
];

const funnelChartData = [
    { name: 'Captura', ideas: 45 },
    { name: 'Pré-Triagem', ideas: 28 },
    { name: 'Ideação', ideas: 18 },
    { name: 'Triagem', ideas: 12 },
    { name: 'POC', ideas: 7 },
];

const evolutionChartData = [
    { month: 'Jan', ideas: 65, pocs: 3 },
    { month: 'Fev', ideas: 78, pocs: 5 },
    { month: 'Mar', ideas: 92, pocs: 8 },
    { month: 'Abr', ideas: 88, pocs: 12 },
    { month: 'Mai', ideas: 104, pocs: 15 },
];

const pieChartData = [
    { name: 'FinTech', value: 35, color: '#3B82F6' },
    { name: 'HealthTech', value: 25, color: '#10B981' },
    { name: 'EdTech', value: 20, color: '#F59E0B' },
    { name: 'Logística', value: 20, color: '#8B5CF6' }
];

export function Reports({ user, onNavigate }: ReportsProps) {
  const [theme, setTheme] = useState<string>(typeof window !== 'undefined' ? (sessionStorage.getItem('theme') || 'light') : 'light');
  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`bg-[#011677] text-white  sticky top-0 z-10 ${theme === 'dark' ? 'bg-gray-800 text-white' : ' text-black border-b border-gray-200'}`}>
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button className={`hovers-exit-dash ${theme === 'dark' ? 'hover:bg-gray-600' : ''}`} variant="ghost" size="sm" onClick={() => onNavigate('dashboard')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar ao Dashboard
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                <h1 className="text-lg font-semibold">Relatórios de Inovação</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
                <Button variant="outline">
                    <Filter className="w-4 h-4 mr-2" />
                    Filtrar por Período
                </Button>
                <Button>
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
              <CardDescription>Novas ideias e POCs iniciadas por mês.</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={evolutionChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="ideas" stroke="#011677" name="Novas Ideias" />
                    <Line type="monotone" dataKey="pocs" stroke="#5ff604" name="POCs Iniciadas" />
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
            <div className="overflow-x-auto"> {/* Garante que a tabela é responsiva */}
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
                  {ideasData.map((idea) => (
                    <TableRow key={idea.id} className={`hover:bg-blue-50/20 transition-colors duration-200 ${theme === 'dark' ? 'bg-gray-800 text-white' : ''}`}>
                      <TableCell className={`font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>{idea.title}</TableCell>
                      <TableCell className={`text-gray-600 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{idea.author}</TableCell>
                      <TableCell className={`text-gray-600 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{idea.area}</TableCell>
                      <TableCell>
                        {/* Estilização da Badge baseada no padrão de cores azul/índigo */}
                        <Badge
                          className={`bg-indigo-100 text-indigo-800 hover:bg-indigo-600 text-xs font-medium px-2 py-0.5 ${theme === 'dark' ? 'bg-indigo-900 text-indigo-300' : ''}`}
                        >
                          {idea.stage}
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