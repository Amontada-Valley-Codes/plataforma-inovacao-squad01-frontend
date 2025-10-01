import { desafios } from '../../data/desafios'; // Importe os mesmos dados
import Image from 'next/image';
import Link from 'next/link';

// Esta é uma boa prática para definir os tipos das props
type DetalhesPageProps = {
  params: {
    id: string;
  };
};

// Next.js passa os 'params' da URL para a sua página
export default function PaginaDetalhesDesafio({ params }: DetalhesPageProps) {
  const { id } = params;
  const desafio = desafios.find((d) => d.id === id);

  // Caso alguém acesse uma URL com um ID que não existe (ex: /desafios-publicos/99)
  if (!desafio) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold">Desafio não encontrado!</h1>
        <Link href="/" className="mt-4 text-blue-600 hover:underline">
          Voltar para a página inicial
        </Link>
      </div>
    );
  }

  // Se o desafio for encontrado, exibe os detalhes
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Você pode adicionar um header/navbar similar ao da página inicial aqui */}
      
      <main className="max-w-4xl mx-auto py-8 px-4">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="relative w-full h-64 md:h-80">
            <Image
              src={desafio.img}
              alt={desafio.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{desafio.title}</h1>
                <p className="text-lg text-gray-600 mt-1">Oferecido por: {desafio.empresa}</p>
              </div>
              <span className="bg-blue-100 text-[#011677] text-sm font-semibold px-3 py-1 rounded-full">
                {desafio.area}
              </span>
            </div>
            
            <hr className="my-6" />

            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Sobre o Desafio</h2>
              <p className="text-gray-700 leading-relaxed">
                {desafio.descricaoCompleta}
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