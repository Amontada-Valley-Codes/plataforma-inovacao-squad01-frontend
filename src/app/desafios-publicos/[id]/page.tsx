// /copia_frotend/src/app/desafios-publicos/[id]/page.tsx

"use client"; // 💡 1. Transforme a página num Componente de Cliente

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import api from '../../../lib/api'; // 💡 2. Importe a sua instância do axios
import Loading from '../../loading'; // 💡 Importe o seu componente de loading
import { useParams } from 'next/navigation';
// Defina os tipos de dados que esperamos da API
interface Challenge {
  id: string;
  name: string;
  description: string;
  company: { name: string };
  area: string;
  images: string[];
}

type DetalhesPageProps = {
  params: {
    id: string;
  };
};

export default function PaginaDetalhesDesafio(){
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  // 💡 3. Crie estados para gerir o desafio, o carregamento e os erros
  const [desafio, setDesafio] = useState<Challenge | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getImageForArea = (area: string): string => {
  const areaNormalizada = area.toLowerCase();
  if (areaNormalizada.includes('ambiente') || areaNormalizada.includes('sustentabilidade')) {
    return '/img/SUSTENTAVEL.jpg'; // Imagem de energia sustentável
  }
  if (areaNormalizada.includes('automação')) {
    return '/img/OPERACIONAL.jpg'; // Imagem de indústria 4.0
  }
  if (areaNormalizada.includes('finanças')) {
    return '/img/FINANCEIRO.jpg'; // Imagem de finanças
  }
  if (areaNormalizada.includes('educação')) {
    return '/img/EDUCACIONAL.jpg'; // Imagem de educação
  }
  if (areaNormalizada.includes('tecnologia')) {
    return '/img/TECNOLOGIA.jpg'; // Imagem de tecnologia
  }
  if (areaNormalizada.includes('saúde')) {
    return '/img/SAUDE.jpg'; // Imagem de saúde
  }
  if (areaNormalizada.includes('Cultural')) {
    return '/img/CULTURAL.jpg'; // Imagem de saúde
  }
  if (areaNormalizada.includes('social')) {
    return '/img/SOCIAL.jpg'; // Imagem de saúde
  }
  if (areaNormalizada.includes('logística')) {
    return '/img/LOGISTICA.jpg'; // Imagem de logística
  }
  if (areaNormalizada.includes('comercial')) {
    return '/img/COMERCIAL.jpg'; // Imagem de comercial
  }
  // Imagem padrão para outras áreas ou se não houver correspondência
  return '/img/desafio4.jpg';
};

  // 💡 4. Use useEffect para buscar os dados quando o componente for montado
  useEffect(() => {
    if (!id) return;

    const fetchAndFindChallenge = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Usa o endpoint PÚBLICO para buscar a lista de todos os desafios
        const response = await api.get<Challenge[]>('/challenges/findByPublic');
        const allPublicChallenges = response.data;
        
        // Filtra a lista no frontend para encontrar o desafio com o ID correspondente
        const foundChallenge = allPublicChallenges.find(d => d.id === id);

        if (foundChallenge) {
          setDesafio(foundChallenge);
        } else {
          setError("Desafio não encontrado!");
        }

      } catch (err) {
        console.error("Falha ao buscar desafios públicos:", err);
        setError("Não foi possível carregar os dados do desafio.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndFindChallenge();
  }, [id]); // O efeito é executado sempre que o ID da página mudar

  // Estado de carregamento
  if (isLoading) {
    return <Loading />;
  }

  // Estado de erro ou se o desafio não for encontrado
  if (error || !desafio) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold">{error || "Desafio não encontrado!"}</h1>
        <Link href="/" className="mt-4 text-blue-600 hover:underline">
          Voltar para a página inicial
        </Link>
      </div>
    );
  }

  // Se o desafio for encontrado, exibe os detalhes
  return (
    <div className="bg-gray-50 min-h-screen">
      <main className="max-w-4xl mx-auto py-8 px-4">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="relative w-full h-64 md:h-80">
            <Image
              src={getImageForArea(desafio.area)}
              alt={desafio.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{desafio.name}</h1>
                <p className="text-lg text-gray-600 mt-1">Oferecido por: {desafio.company.name}</p>
              </div>
              <span className="bg-blue-100 text-[#011677] text-sm font-semibold px-3 py-1 rounded-full">
                {desafio.area}
              </span>
            </div>
            
            <hr className="my-6" />

            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Sobre o Desafio</h2>
              <p className="text-gray-700 leading-relaxed">
                {desafio.description}
              </p>
            </div>

            <div className="mt-8 text-center">
              <Link
                href="/cadastro-startups"
                className="bg-[#011677] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#001a90] transition">
                Participar do Desafio
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}