// /plat_inovacao/src/components/StartupForm.tsx

'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { ArrowLeft, Building2, Save } from 'lucide-react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { User } from '../app/context/UserContext';
import api from '../lib/api';

interface StartupFormProps {
  user: User;
  onNavigate: (page: 'dashboard') => void;
}

export function StartupForm({ user, onNavigate }: StartupFormProps) {
    const [formData, setFormData] = useState({
        name: '',
        cnpj: '',
        segment: '',
        problem: '',
        technology: '',
        stage: 'IDEACAO',
        location: '',
        founders: '',
        pitch: '',
        links: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [theme, setTheme] = useState<string>(typeof window !== 'undefined' ? (sessionStorage.getItem('theme') || 'light') : 'light');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (value: string) => {
        setFormData(prev => ({ ...prev, stage: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        try {
            await api.post('/startups', formData);
            alert('Startup criada com sucesso!');
            onNavigate('dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Ocorreu um erro ao registar a startup.');
            console.error('Falha ao criar startup:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

  return (
    <div className={`min-h-screen bg-gray-50 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className={`bg-[#011677] text-white shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-[#011677]'} sticky top-0 z-10`}>
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button className='hovers-exit-dash' variant="ghost" size="sm" onClick={() => onNavigate('dashboard')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao Dashboard
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              <h1>Registrar Nova Startup</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 max-w-4xl">
        <form onSubmit={handleSubmit}>
          <Card className={theme === 'dark' ? 'bg-gray-800 text-white' : ''}>
            <CardHeader>
              <CardTitle>Dados da Startup</CardTitle>
              <CardDescription>Insira as informações da nova startup a ser adicionada à base.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2"><Label htmlFor="name">Nome da Startup</Label><Input id="name" name="name" value={formData.name} onChange={handleChange} required /></div>
                <div className="space-y-2"><Label htmlFor="cnpj">CNPJ</Label><Input id="cnpj" name="cnpj" value={formData.cnpj} onChange={handleChange} required /></div>
                <div className="space-y-2"><Label htmlFor="segment">Segmento</Label><Input id="segment" name="segment" value={formData.segment} onChange={handleChange} required /></div>
                <div className="space-y-2"><Label htmlFor="technology">Tecnologia Principal</Label><Input id="technology" name="technology" value={formData.technology} onChange={handleChange} required /></div>
              </div>
              <div className="space-y-2"><Label htmlFor="problem">Problema que Resolve</Label><Textarea id="problem" name="problem" value={formData.problem} onChange={handleChange} required /></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="stage">Estágio</Label>
                    <Select name="stage" onValueChange={handleSelectChange} defaultValue={formData.stage}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="IDEACAO">Ideação</SelectItem>
                            <SelectItem value="OPERACAO">Operação</SelectItem>
                            <SelectItem value="TRACAO">Tração</SelectItem>
                            <SelectItem value="ESCALA">Escala</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2"><Label htmlFor="location">Localização</Label><Input id="location" name="location" value={formData.location} onChange={handleChange} required /></div>
              </div>
              <div className="space-y-2"><Label htmlFor="founders">Fundadores</Label><Input id="founders" name="founders" value={formData.founders} onChange={handleChange} required /></div>
              <div className="space-y-2"><Label htmlFor="pitch">Pitch (URL do vídeo)</Label><Input id="pitch" name="pitch" value={formData.pitch} onChange={handleChange} required /></div>
              <div className="space-y-2"><Label htmlFor="links">Links (Site, LinkedIn, etc.)</Label><Input id="links" name="links" value={formData.links} onChange={handleChange} required /></div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <Button type="submit" className="w-full bg-[#001f61] hover:bg-[#002a7a] transition-colors text-white" disabled={isSubmitting}>
                {isSubmitting ? 'A guardar...' : <><Save className="w-4 h-4 mr-2" />Salvar Startup</>}
              </Button>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}