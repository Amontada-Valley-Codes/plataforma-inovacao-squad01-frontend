import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
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

  const handleAddTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui seria onde salvaria o desafio
    console.log('Desafio criado:', { ...formData, tags });
    
    // Simular sucesso e voltar ao dashboard
    onNavigate('dashboard');
  };

  const suggestedTags = ['IA', 'Sustentabilidade', 'FinTech', 'HealthTech', 'EdTech', 'IoT', 'Blockchain', 'Automação'];

  return (
    <div className="min-h-screen bg-background h-screen w-full bg-[url('/ninnafundo.jpg')] bg-cover bg-center">
      {/* Header */}
      <div className="bg-card bg-[#011677] text-white">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4 ">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate('dashboard')}
              className='hover:bg-[#001a90] cursor-pointer '
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao Dashboard
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              <h1>Novo Desafio de Inovação</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6 text-center">
            <h2 className='text-3xl mb-2.5 font-bold'>Cadastrar Desafio</h2>
            <p className="text-gray-700">
              Crie um novo desafio para capturar ideias inovadoras e conectar com startups
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <Card className='shadow-lg shadow-gray-200/80 rounded-2xl bg-white/90 backdrop-blur-sm'>
              <CardHeader>
                <CardTitle>Informações Básicas :</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome do Desafio *</Label>
                  <Input
                    id="name"
                    placeholder="Ex: Automação de Processos Financeiros"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className='focus:border-[#011778] focus:ring focus:ring-[#011778]/70 rounded-lg'
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Data de Início *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left hover:bg-gray-200 cursor-pointer"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4 " />
                          {formData.startDate ? (
                            format(formData.startDate, "dd/MM/yyyy", { locale: pt })
                          ) : (
                            <span>Selecionar data</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-white">
                        <Calendar
                          mode="single"
                          selected={formData.startDate}
                          onSelect={(date) => setFormData({ ...formData, startDate: date })}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label>Data de Fim *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left hover:bg-gray-200 cursor-pointer"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.endDate ? (
                            format(formData.endDate, "dd/MM/yyyy", { locale: pt })
                          ) : (
                            <span>Selecionar data</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-white">
                        <Calendar
                          mode="single"
                          selected={formData.endDate}
                          onSelect={(date) => setFormData({ ...formData, endDate: date })}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="area">Área Principal</Label>
                  <Input
                    id="area"
                    placeholder="Ex: FinTech, HealthTech, Sustentabilidade..."
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    className='focus:border-[#011778] focus:ring focus:ring-[#011778]/70 rounded-lg'
                  />
                </div>

                <div className="space-y-2">
                  <Label>Tags/Temas Relacionados</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Digite uma tag e pressione Enter"
                      className='focus:border-[#011778] focus:ring focus:ring-[#011778]/70 rounded-lg'
                      value={currentTag}
                      onChange={(e) => setCurrentTag(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                    />
                    <Button type="button" variant="outline" onClick={handleAddTag} className='hover:bg-gray-300 cursor-pointer'>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Sugestões de tags:</p>
                    <div className="flex flex-wrap gap-2">
                      {suggestedTags.map((tag) => (
                        <Button
                          key={tag}
                          type="button"
                          variant="outline"
                          size="sm"
                          className='hover:bg-gray-300 cursor-pointer'
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
              </CardContent>
            </Card>

            <Card className='shadow-lg shadow-gray-200/80 rounded-2xl bg-white/90 backdrop-blur-sm'>
              <CardHeader>
                <CardTitle>Descrição do Problema</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição Completa *</Label>
                  <Textarea
                    id="description"
                    placeholder="Descreva o contexto, o problema específico, os objetivos esperados e quais tipos de soluções você está procurando..."
                    className="min-h-32 focus:border-[#011778] focus:ring focus:ring-[#011778]/70 rounded-lg"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            <Card className='shadow-lg shadow-gray-200/80 rounded-2xl bg-white/90 backdrop-blur-sm'>
              <CardHeader>
                <CardTitle>Configurações de Publicação</CardTitle>
                <CardDescription>
                  Defina quem pode ver e participar deste desafio
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Label>Tipo de Desafio</Label>
                  <RadioGroup
                    value={formData.type}
                    onValueChange={(value: 'interno' | 'publico') => 
                      setFormData({ ...formData, type: value })
                    }
                  >
                    <div className="flex items-center space-x-2 p-4 border border-border rounded-lg hover:bg-gray-200 cursor-pointer">
                      <RadioGroupItem value="interno" id="interno" />
                      <div className="space-y-1 flex-1">
                        <Label htmlFor="interno">
                          🔒 Restrito (Inovação Interna)
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Apenas colaboradores da sua empresa podem ver e participar deste desafio
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 p-4 border border-border rounded-lg cursor-pointer hover:bg-gray-200">
                      <RadioGroupItem value="publico" id="publico" />
                      <div className="space-y-1 flex-1">
                        <Label htmlFor="publico">
                          🌍 Público (Externo)
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Startups e parceiros externos podem ver e se candidatar para este desafio
                        </p>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4 justify-end">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => onNavigate('dashboard')}
                className='cursor-pointer hover:bg-[#160430] hover:text-white'
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                className="bg-gradient-to-r from-[#011677] to-[#160430] hover:opacity-90 text-white shadow-md rounded-lg px-6 py-2 cursor-pointer"
              >
                <Save className="w-4 h-4 mr-2" />
                Criar Desafio
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}