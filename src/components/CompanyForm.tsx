// /plat_inovacao/src/components/CompanyForm.tsx

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { ArrowLeft, Building2, Save } from 'lucide-react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { User } from '../app/context/UserContext';
import api from '../lib/api';

interface CompanyFormProps {
    user: User;
    onNavigate: (page: 'dashboard') => void;
}

export function CompanyForm({ user, onNavigate }: CompanyFormProps) {
    // Mantendo toda a sua lógica de estado da branch HEAD
    const [name, setName] = useState('');
    const [cnpj, setCnpj] = useState('');
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [theme, setTheme] = useState<string>(typeof window !== 'undefined' ? (sessionStorage.getItem('theme') || 'light') : 'light');

    // Mantendo sua função de submissão da branch HEAD
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        if (!name || !cnpj) {
            setError('Nome da empresa e CNPJ são obrigatórios.');
            setIsSubmitting(false);
            return;
        }

        try {
            await api.post('/companies', {
                name,
                cnpj,
            });

            alert('Empresa criada com sucesso!');
            onNavigate('dashboard');

        } catch (err: any) {
            console.error('Falha ao criar empresa:', err);
            setError(err.response?.data?.message || 'Ocorreu um erro ao criar a empresa.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-black'}`}>
            {/* Header com o estilo combinado */}
            <div className={`bg-[#011677] text-white shadow-lg ${theme === 'dark' ? 'bg-gray-800' : ''}`}>
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center gap-4">
                        <Button className={`hovers-exit-dash ${theme === 'dark' ? 'hover:bg-gray-600' : ''}`} variant="ghost" size="sm" onClick={() => onNavigate('dashboard')}>
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Voltar ao Dashboard
                        </Button>
                        <Separator orientation="vertical" className="h-6" />
                        <div className="flex items-center gap-2">
                            <Building2 className="w-5 h-5" />
                            <h1>Cadastrar Nova Empresa</h1>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content com o formulário funcional da sua branch HEAD */}
            <div className={`container mx-auto px-6 py-8 max-w-2xl`}>
                <form onSubmit={handleSubmit}>
                    <Card className={theme === 'dark' ? 'bg-gray-800 text-white' : ''}>
                        <CardHeader>
                            <CardTitle>Dados da Empresa</CardTitle>
                            <CardDescription>Insira as informações da nova empresa que usará a plataforma.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="company-name">Nome da Empresa</Label>
                                <Input
                                    id="company-name"
                                    placeholder="Ex: Inova Corp"
                                    className={`focus:border-[#001f61] focus:ring focus:ring-[#001f61]/30 transition-colors ${theme === 'dark' ? 'bg-gray-800 text-white' : ''}`}
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="company-cnpj">CNPJ</Label>
                                <Input
                                    id="company-cnpj"
                                    placeholder="00.000.000/0001-00"
                                    className={`focus:border-[#001f61] focus:ring focus:ring-[#001f61]/30 transition-colors ${theme === 'dark' ? 'bg-gray-800 text-white' : ''}`}
                                    value={cnpj}
                                    onChange={(e) => setCnpj(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="company-description">Descrição Breve (não implementado no backend)</Label>
                                <Textarea
                                    id="company-description"
                                    placeholder="Uma breve descrição sobre a empresa..."
                                    className={`focus:border-[#001f61] focus:ring focus:ring-[#001f61]/30 transition-colors ${theme === 'dark' ? 'bg-gray-800 text-white' : ''}`}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>

                            {error && <p className="text-sm text-red-500">{error}</p>}

                            <Button
                                type="submit"
                                className="w-full bg-[#001f61] hover:bg-[#002a7a] transition-colors text-white"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'A salvar...' : (
                                    <>
                                        <Save className="w-4 h-4 mr-2" />
                                        Salvar Empresa
                                    </>
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                </form>
            </div>
        </div>
    );
}