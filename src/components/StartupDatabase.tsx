'use client'

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { 
  ArrowLeft, 
  Search, 
  Building2, 
  Users, 
  Eye,
  MapPin,
  Calendar,
  Award
} from 'lucide-react';
import { User, Startup } from '../app/context/UserContext';
import { Sidebar } from './SideBar';
import { api } from '../service/Api'; // Importamos a nossa instância do Axios

interface StartupDatabaseProps {
  user: User;
  onNavigate: (page: 'dashboard') => void;
}

// A interface precisa de corresponder aos dados da API (alguns campos são opcionais)
interface StartupFromAPI extends Startup {
    location?: string;
    foundedYear?: number;
    employees?: string;
    funding?: string;
    founders?: string;
}

export function StartupDatabase({ user, onNavigate }: StartupDatabaseProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    segment: '',
    stage: '',
    technology: '',
    location: ''
  });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Estados para os dados e carregamento
  const [startups, setStartups] = useState<StartupFromAPI[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // useEffect para buscar os dados da API
  useEffect(() => {
    const fetchStartups = async () => {
      setIsLoading(true);
      try {
        const response = await api.get('/startups');
        setStartups(response.data);
      } catch (error) {
        console.error("Erro ao buscar startups:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStartups();
  }, []);

  // A lógica de filtragem agora opera sobre o estado 'startups'
  const filteredStartups = startups.filter(startup => {
    const matchesSearch = searchQuery === '' || 
      startup.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      startup.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      startup.problem.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSegment = filters.segment === '' || startup.segment === filters.segment;
    const matchesStage = filters.stage === '' || startup.stage === filters.stage;
    const matchesTechnology = filters.technology === '' || 
      startup.technology.toLowerCase().includes(filters.technology.toLowerCase());

    return matchesSearch && matchesSegment && matchesStage && matchesTechnology;
  });

  const getStageLabel = (stage: string) => {
    const labels: { [key: string]: string } = {
      IDEACAO: 'Ideação', OPERACAO: 'Operação', 
      TRACAO: 'Tração', ESCALA: 'Escala'
    };
    return labels[stage] || stage;
  };

  const getStageColor = (stage: string) => {
    const colors: { [key: string]: string } = {
      IDEACAO: 'bg-blue-100 text-blue-800', OPERACAO: 'bg-yellow-100 text-yellow-800',
      TRACAO: 'bg-green-100 text-green-800', ESCALA: 'bg-purple-100 text-purple-800'
    };
    return colors[stage] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar user={user} />
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                <h1 className="text-lg font-semibold">Base de Startups</h1>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  Grade
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  Lista
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-6 py-8 flex-1">
          {/* Search and Filters */}
          <div className="mb-8">
             <Card className="bg-white">
                <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Search className="w-5 h-5" />
                    Busca e Filtros
                </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                {/* Search Bar */}
                <div className="space-y-2">
                  <Label htmlFor="search">Buscar Startups</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="search"
                      placeholder="Nome, problema que resolve, tecnologia..."
                      className="pl-10 focus:border-[#001f61] focus:ring focus:ring-[#001f61]/30 transition-colors"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label>Segmento</Label>
                    <Select
                      value={filters.segment}
                      onValueChange={(value: string) =>
                        setFilters({
                          ...filters,
                          segment: value === "all" ? "" : value,
                        })
                      }
                    >
                      <SelectTrigger className="focus:ring-[#001f61]/30">
                        <SelectValue placeholder="Todos os segmentos" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos os segmentos</SelectItem>
                        <SelectItem value="FinTech">FinTech</SelectItem>
                        <SelectItem value="HealthTech">HealthTech</SelectItem>
                        <SelectItem value="EdTech">EdTech</SelectItem>
                        <SelectItem value="GreenTech">GreenTech</SelectItem>
                        <SelectItem value="Industry 4.0">
                          Industry 4.0
                        </SelectItem>
                        <SelectItem value="CyberSecurity">
                          CyberSecurity
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Estágio de Maturidade</Label>
                    <Select
                      value={filters.stage}
                      onValueChange={(value: string) =>
                        setFilters({
                          ...filters,
                          stage: value === "all" ? "" : value,
                        })
                      }
                    >
                      <SelectTrigger className="focus:ring-[#001f61]/30">
                        <SelectValue placeholder="Todos os estágios" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos os estágios</SelectItem>
                        <SelectItem value="ideacao">Ideação</SelectItem>
                        <SelectItem value="operacao">Operação</SelectItem>
                        <SelectItem value="tracao">Tração</SelectItem>
                        <SelectItem value="escala">Escala</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Tecnologia</Label>
                    <Input
                      placeholder="Ex: IA, Blockchain..."
                      value={filters.technology}
                      onChange={(e) =>
                        setFilters({ ...filters, technology: e.target.value })
                      }
                      className="focus:border-[#001f61] focus:ring focus:ring-[#001f61]/30 transition-colors"
                    />
                  </div>
                </div>

                {/* Clear filters */}
                <div className="flex justify-between items-center pt-2">
                  <p className="text-sm text-gray-500">
                    {filteredStartups.length} startups encontradas
                  </p>
                  <Button
                    variant="link"
                    size="sm"
                    className="text-[#001f61] hover:underline"
                    onClick={() => {
                      setSearchQuery("");
                      setFilters({
                        segment: "",
                        stage: "",
                        technology: "",
                        location: "",
                      });
                    }}
                  >
                    Limpar Filtros
                  </Button>
                </div>
              </div>
                </CardContent>
            </Card>
          </div>

          {/* Startups Grid/List */}
          {isLoading ? (
            <div className="text-center py-12">Carregando startups...</div>
          ) : (
            <div className={viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
              : 'space-y-4'
            }>
              {filteredStartups.map((startup) => (
                <Card key={startup.id} className="hover:shadow-lg transition-shadow cursor-pointer bg-white">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <CardTitle className="flex items-center gap-2 text-gray-800">
                          <Building2 className="w-5 h-5 text-blue-600" />
                          {startup.name}
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{startup.segment}</Badge>
                          <Badge className={getStageColor(startup.stage)}>
                            {getStageLabel(startup.stage)}
                          </Badge>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-1">Problema que Resolve</h4>
                      <p className="text-sm text-gray-600">{startup.problem}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm">{startup.description}</p>
                    </div>

                    <div className="space-y-2 text-sm">
                        {startup.location && <div className="flex items-center gap-2 text-gray-500"><MapPin className="w-4 h-4" />{startup.location}</div>}
                        {startup.founders && <div className="flex items-center gap-2 text-gray-500"><Users className="w-4 h-4" />{startup.founders}</div>}
                    </div>

                    <div>
                      <Label className="text-xs text-gray-500">TECNOLOGIAS</Label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {startup.technology.split(', ').map((tech, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Button className="w-full mt-4">
                      Ver Detalhes
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!isLoading && filteredStartups.length === 0 && (
            <div className="text-center py-12">
              <Building2 className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">Nenhuma startup encontrada</h3>
              <p className="text-gray-500">
                Tente ajustar seus filtros ou adicione novas startups à base de dados.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}