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
      <div className="bg-[#001f61] text-white shadow-lg">
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
              <Target className="w-5 h-5 text-black" />
              <h1 className="text-xl font-semibold">Novo Desafio de Inovação</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8 text-center">
            <h2 className='text-4xl mb-2 font-extrabold text-[#001f61]'>Cadastrar Desafio</h2>
            <p className="text-gray-600 font-medium">
              Crie um novo desafio para capturar ideias inovadoras e conectar com startups.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <Card className='shadow-xl shadow-gray-200/80 rounded-2xl bg-white/90 backdrop-blur-sm border-2 border-gray-100'>
              <CardHeader>
                <CardTitle className="text-[#001f61]">Informações Básicas:</CardTitle>
                <CardDescription className="text-gray-500">
                  Detalhes essenciais sobre o seu desafio.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome do Desafio <span className="text-black">*</span></Label>
                  <Input
                    id="name"
                    placeholder="Ex: Automação de Processos Financeiros"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className='focus:border-[#001f61] focus:ring focus:ring-[#001f61]/30 rounded-lg transition-colors'
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Data de Início <span className="text-black">*</span></Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal border-gray-300 hover:border-[#001f61] transition-colors cursor-pointer"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4 text-black" />
                          {formData.startDate ? (
                            format(formData.startDate, "dd/MM/yyyy", { locale: pt })
                          ) : (
                            <span className="text-muted-foreground">Selecionar data</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-white shadow-lg rounded-lg">
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
                    <Label>Data de Fim <span className="text-black">*</span></Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal border-gray-300 hover:border-[#001f61] transition-colors cursor-pointer"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4 text-black" />
                          {formData.endDate ? (
                            format(formData.endDate, "dd/MM/yyyy", { locale: pt })
                          ) : (
                            <span className="text-muted-foreground">Selecionar data</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-white shadow-lg rounded-lg">
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
                  <Label htmlFor="area">Área Principal</Label>
                  <Input
                    id="area"
                    placeholder="Ex: FinTech, HealthTech, Sustentabilidade..."
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    className='focus:border-[#001f61] focus:ring focus:ring-[#001f61]/30 rounded-lg transition-colors'
                  />
                </div>

                <div className="space-y-2">
                  <Label>Tags/Temas Relacionados</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Digite uma tag e pressione Enter"
                      className='focus:border-[#001f61] focus:ring focus:ring-[#001f61]/30 rounded-lg transition-colors'
                      value={currentTag}
                      onChange={(e) => setCurrentTag(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                    />
                    <Button type="button" onClick={handleAddTag} className='bg-black text-white hover:bg-blue-900 transition-colors cursor-pointer'>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {tags.map((tag) => (
                        <Badge key={tag} className="bg-[#001f61] text-white hover:bg-[#002a7a] transition-colors flex items-center gap-1">
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="ml-1 opacity-70 hover:opacity-100"
                          >
                            <X className="w-3 h-3 text-black" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  <div className="mt-4">
                    <p className="text-sm text-gray-500">Sugestões de tags:</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {suggestedTags.map((tag) => (
                        <Button
                          key={tag}
                          type="button"
                          variant="outline"
                          size="sm"
                          className='border-black text-black hover:bg-[#eaf4d5] transition-colors'
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

            <Card className='shadow-xl shadow-gray-200/80 rounded-2xl bg-white/90 backdrop-blur-sm border-2 border-gray-100'>
              <CardHeader>
                <CardTitle className="text-[#001f61]">Descrição do Problema</CardTitle>
                <CardDescription className="text-gray-500">
                  Explique em detalhes o contexto e os objetivos do desafio.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição Completa <span className="text-black">*</span></Label>
                  <Textarea
                    id="description"
                    placeholder="Descreva o contexto, o problema específico, os objetivos esperados e quais tipos de soluções você está procurando..."
                    className="min-h-[120px] focus:border-[#001f61] focus:ring focus:ring-[#001f61]/30 rounded-lg transition-colors"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            <Card className='shadow-xl shadow-gray-200/80 rounded-2xl bg-white/90 backdrop-blur-sm border-2 border-gray-100'>
              <CardHeader>
                <CardTitle className="text-[#001f61]">Configurações de Publicação</CardTitle>
                <CardDescription className="text-gray-500">
                  Defina quem pode ver e participar deste desafio.
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
                    <div className="flex items-center space-x-2 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                      <RadioGroupItem value="interno" id="interno" className="text-[#001f61] border-gray-300" />
                      <div className="space-y-1 flex-1">
                        <Label htmlFor="interno" className="font-medium text-[#001f61]">
                          🔒 Restrito (Inovação Interna)
                        </Label>
                        <p className="text-sm text-gray-500">
                          Apenas colaboradores da sua empresa podem ver e participar deste desafio.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                      <RadioGroupItem value="publico" id="publico" className="text-[#001f61] border-gray-300" />
                      <div className="space-y-1 flex-1">
                        <Label htmlFor="publico" className="font-medium text-[#001f61]">
                          🌍 Público (Externo)
                        </Label>
                        <p className="text-sm text-gray-500">
                          Startups e parceiros externos podem ver e se candidatar para este desafio.
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
                className='border-[#001f61] text-[#001f61] hover:bg-[#b9bbbe] transition-colors'
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