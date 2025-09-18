import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { ArrowRight, Briefcase, Calendar } from 'lucide-react';
import { Badge } from './ui/badge';
import Image from 'next/image';
import Link from 'next/link';
import { Separator } from './ui/separator';

// Mock de dados para os desafios públicos
const mockPublicChallenges = [
  {
    id: "challenge-02",
    companyName: "TechCorp Brasil",
    companyLogo: "/img/Ninna_com_fundo.png", // Usando um logo genérico como exemplo
    name: "Sustentabilidade na Cadeia de Suprimentos",
    endDate: "2025-12-01",
    area: "GreenTech",
    description: "Desenvolver soluções sustentáveis para otimizar nossa cadeia de suprimentos, visando a redução do impacto ambiental e a melhoria da rastreabilidade dos produtos.",
  },
  {
    id: "challenge-03",
    companyName: "InnovateCorp",
    companyLogo: "/img/Ninna_com_fundo.png",
    name: "Digitalização da Experiência do Paciente",
    endDate: "2025-11-20",
    area: "HealthTech",
    description: "Buscamos startups com soluções para modernizar a jornada do paciente em nossas clínicas, desde o agendamento até o pós-consulta.",
  },
];

export function PublicChallenges() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Público */}
      <header className="bg-white shadow-sm sticky top-0 z-20">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Image src="/img/Ninna_logo.png" alt="Ninna Hub Logo" width={120} height={40} />
          <Button asChild>
            <Link href="/">Acessar Plataforma</Link>
          </Button>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800">Desafios em Aberto</h1>
          <p className="text-lg text-gray-600 mt-2">
            Conecte sua startup a grandes empresas e ajude a resolver problemas reais.
          </p>
        </div>

        {/* Grelha de Desafios */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockPublicChallenges.map((challenge) => (
            <Card key={challenge.id} className="flex flex-col hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <Image src={challenge.companyLogo} alt={challenge.companyName} width={40} height={40} className="rounded-full" />
                  <div>
                    <CardTitle className="text-lg">{challenge.name}</CardTitle>
                    <p className="text-sm text-gray-500">{challenge.companyName}</p>
                  </div>
                </div>
                <Badge variant="secondary">{challenge.area}</Badge>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-gray-600 text-sm line-clamp-3">{challenge.description}</p>
              </CardContent>
              <div className="p-6 pt-0 mt-auto">
                 <Separator className="my-4" />
                 <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                    <span className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Encerra em: {new Date(challenge.endDate).toLocaleDateString('pt-BR')}
                    </span>
                 </div>
                <Button asChild className="w-full">
                  <Link href={`/desafios/${challenge.id}`}>
                    Ver Detalhes
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}