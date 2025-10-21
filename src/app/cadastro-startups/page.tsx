"use client"
import { useState } from 'react';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Textarea } from '../../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import api from '../../lib/api';
import Link from 'next/link';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Label } from '../../components/ui/label';

export default function CadastroStartups() {
    const [formData, setFormData] = useState({
        // Dados da Startup
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
        // Dados do Usuário Administrador
        nameUser: '',
        emailUser: '',
        passwordUser: '',
    });
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSelectChange = (value: string) => {
        setFormData(prev => ({ ...prev, stage: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess(false);
        try {
            const response = await api.post('/startups', formData);
            console.log('Startup e usuário cadastrados:', response.data);
            setSuccess(true);
            // Opcional: resetar o formulário ou redirecionar após um tempo
        } catch (error: any) {
            console.error('Erro ao cadastrar startup:', error);
            setError(error.response?.data?.message || 'Ocorreu um erro desconhecido.');
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
                <Card className="w-full max-w-md text-center">
                    <CardHeader>
                        <CardTitle className="text-2xl text-green-600">Cadastro Realizado com Sucesso!</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>Sua startup e seu usuário foram criados. Agora você pode acessar a plataforma.</p>
                        <Button asChild className="mt-4">
                            <Link href="/login">Ir para o Login</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <Card className="w-full max-w-4xl">
                <CardHeader>
                    <CardTitle className="text-center text-3xl font-bold text-[#011677]">Cadastro de Startup</CardTitle>
                    <CardDescription className="text-center text-lg">
                        Preencha os dados da sua startup e do usuário administrador.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Seção Dados da Startup */}
                        <div>
                            <h3 className="text-xl font-semibold mb-4 border-b pb-2 text-[#011677]">Informações da Startup</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <Label htmlFor="name">Nome da Startup</Label>
                                    <Input id="name" value={formData.name} onChange={handleChange} required />
                                </div>
                                <div>
                                    <Label htmlFor="cnpj">CNPJ</Label>
                                    <Input id="cnpj" value={formData.cnpj} onChange={handleChange} required />
                                </div>
                                <div>
                                    <Label htmlFor="segment">Segmento de Atuação</Label>
                                    <Input id="segment" value={formData.segment} onChange={handleChange} required placeholder="Ex: FinTech, HealthTech, AgroTech"/>
                                </div>
                                <div>
                                    <Label htmlFor="technology">Tecnologia Principal</Label>
                                    <Input id="technology" value={formData.technology} onChange={handleChange} required placeholder="Ex: Inteligência Artificial, Blockchain"/>
                                </div>
                                 <div>
                                    <Label htmlFor="stage">Estágio Atual</Label>
                                     <Select onValueChange={handleSelectChange} defaultValue={formData.stage}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="IDEACAO">Ideação</SelectItem>
                                            <SelectItem value="OPERACAO">Operação</SelectItem>
                                            <SelectItem value="TRACAO">Tração</SelectItem>
                                            <SelectItem value="ESCALA">Escala</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label htmlFor="location">Localização (Cidade, Estado)</Label>
                                    <Input id="location" value={formData.location} onChange={handleChange} required />
                                </div>
                                <div>
                                    <Label htmlFor="founders">Fundadores</Label>
                                    <Input id="founders" value={formData.founders} onChange={handleChange} required />
                                </div>
                                <div>
                                    <Label htmlFor="links">Website ou LinkedIn</Label>
                                    <Input id="links" value={formData.links} onChange={handleChange} required />
                                </div>
                                <div className='md:col-span-2'>
                                    <Label htmlFor="problem">Qual problema sua startup resolve?</Label>
                                    <Textarea id="problem" value={formData.problem} onChange={handleChange} required />
                                </div>
                                <div className='md:col-span-2'>
                                    <Label htmlFor="pitch">Pitch (resumo da solução)</Label>
                                    <Textarea id="pitch" value={formData.pitch} onChange={handleChange} required />
                                </div>
                            </div>
                        </div>

                        {/* Seção Dados do Usuário */}
                        <div>
                            <h3 className="text-xl font-semibold mb-4 border-b pb-2 text-[#011677]">Dados do Administrador</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <Label htmlFor="nameUser">Seu Nome Completo</Label>
                                    <Input id="nameUser" value={formData.nameUser} onChange={handleChange} required />
                                </div>
                                <div>
                                    <Label htmlFor="emailUser">Seu E-mail de Acesso</Label>
                                    <Input id="emailUser" type="email" value={formData.emailUser} onChange={handleChange} required />
                                </div>
                                <div className='md:col-span-2'>
                                    <Label htmlFor="passwordUser">Sua Senha</Label>
                                    <Input id="passwordUser" type="password" value={formData.passwordUser} onChange={handleChange} required minLength={6}/>
                                    <p className="text-xs text-gray-500 mt-1">A senha deve ter no mínimo 6 caracteres.</p>
                                </div>
                            </div>
                        </div>
                        
                        {error && <p className="text-sm text-red-500 text-center bg-red-100 p-2 rounded-md">{error}</p>}

                        <div className="flex justify-between items-center pt-4">
                             <Link href="/login" className="text-sm text-blue-600 hover:underline">
                                Já tem uma conta? Faça login
                            </Link>
                            <Button type="submit" className="bg-[#011677] hover:bg-[#011677]/90">
                                Finalizar Cadastro
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}