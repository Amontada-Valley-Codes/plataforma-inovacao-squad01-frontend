"use client"
import { useState } from 'react';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Textarea } from '../../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import api from '../../lib/api';
import Link from 'next/link';

export default function CadastroStartups() {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        website: '',
        cnpj: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        country: '',
        logo: '',
        linkedin: '',
        facebook: '',
        instagram: '',
        twitter: '',
        mvp: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await api.post('/startup', formData);
            console.log('Startup cadastrada:', response.data);
            // Reset form or redirect
        } catch (error) {
            console.error('Erro ao cadastrar startup:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <Card className="w-full max-w-4xl">
                <CardHeader>
                    <CardTitle className="text-center text-2xl">Cadastro de Startup</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome da Startup</label>
                                <Input id="name" value={formData.name} onChange={handleChange} />
                            </div>
                            <div>
                                <label htmlFor="website" className="block text-sm font-medium text-gray-700">Website</label>
                                <Input id="website" value={formData.website} onChange={handleChange} />
                            </div>
                            <div>
                                <label htmlFor="cnpj" className="block text-sm font-medium text-gray-700">CNPJ</label>
                                <Input id="cnpj" value={formData.cnpj} onChange={handleChange} />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">E-mail de Contato</label>
                                <Input id="email" type="email" value={formData.email} onChange={handleChange} />
                            </div>
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Telefone</label>
                                <Input id="phone" value={formData.phone} onChange={handleChange} />
                            </div>
                            <div>
                                <label htmlFor="address" className="block text-sm font-medium text-gray-700">Endereço</label>
                                <Input id="address" value={formData.address} onChange={handleChange} />
                            </div>
                            <div>
                                <label htmlFor="city" className="block text-sm font-medium text-gray-700">Cidade</label>
                                <Input id="city" value={formData.city} onChange={handleChange} />
                            </div>
                            <div>
                                <label htmlFor="state" className="block text-sm font-medium text-gray-700">Estado</label>
                                <Input id="state" value={formData.state} onChange={handleChange} />
                            </div>
                            <div>
                                <label htmlFor="country" className="block text-sm font-medium text-gray-700">País</label>
                                <Input id="country" value={formData.country} onChange={handleChange} />
                            </div>
                            <div>
                                <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700">LinkedIn</label>
                                <Input id="linkedin" value={formData.linkedin} onChange={handleChange} />
                            </div>
                            <div>
                                <label htmlFor="facebook" className="block text-sm font-medium text-gray-700">Facebook</label>
                                <Input id="facebook" value={formData.facebook} onChange={handleChange} />
                            </div>
                            <div>
                                <label htmlFor="instagram" className="block text-sm font-medium text-gray-700">Instagram</label>
                                <Input id="instagram" value={formData.instagram} onChange={handleChange} />
                            </div>
                            <div>
                                <label htmlFor="twitter" className="block text-sm font-medium text-gray-700">Twitter</label>
                                <Input id="twitter" value={formData.twitter} onChange={handleChange} />
                            </div>
                            <div>
                                <label htmlFor="mvp" className="block text-sm font-medium text-gray-700">Link para o MVP</label>
                                <Input id="mvp" value={formData.mvp} onChange={handleChange} />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descrição</label>
                            <Textarea id="description" value={formData.description} onChange={handleChange} />
                        </div>
                        <Button type="submit" className="w-full">Cadastrar</Button>
                    </form>
                    <div className="mt-4 text-center">
                        <Link href="/login" className="text-sm text-blue-600 hover:underline">
                            Já tem uma conta? Faça login
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}