'use client';

import React, { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    empresa: '',
    phone: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage('');
    setErrorMessage('');

    const { name, email, empresa, phone, message } = formData;
    const emailTarget = 'josenilsonsousa366@gmail.com';

    const body = `
Olá, meu nome é ${name}.

${message}

----------------------------------------
📩 Email: ${email}
🏢 Empresa: ${empresa}
📞 Telefone: ${phone}
----------------------------------------

Atenciosamente,  
${name}
`;

    const mailtoLink = `mailto:${emailTarget}?subject=${encodeURIComponent(
      `Contato de ${name} - ${empresa}`
    )}&body=${encodeURIComponent(body)}`;

    try {
      window.location.href = mailtoLink;
      setSuccessMessage('Mensagem enviada com sucesso!');
      setFormData({ name: '', email: '', empresa: '', phone: '', message: '' });
    } catch (error) {
      setErrorMessage(
        'Ocorreu um erro ao tentar enviar a mensagem.' + error
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="min-h-screen bg-[#f9fafb] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-10 bg-white shadow-xl rounded-2xl overflow-hidden">
        {/*
          Verifique se o caminho da imagem está correto.
          A imagem deve estar na pasta "public/img/" do seu projeto.
        */}
        <div className="flex flex-col justify-center relative px-8 py-12 bg-[url('/img/fundo-contato.jpg')] bg-cover bg-center text-white">
        <div className='bg-[#011677]/60 absolute top-0 right-0 bottom-0 left-0'></div>
        <div className='z-10'>
          <h1 className="text-4xl font-extrabold mb-4 text-center pb-10">Conecte sua Empresa à Inovação</h1>
          <p className="text-lg mb-6 leading-relaxed">
            Sua empresa enfrenta desafios complexos? Traga-os para a nossa comunidade de startups! Juntos, podemos encontrar soluções inovadoras e acelerar o crescimento do seu negócio.
          </p>
          <ul className="space-y-2 text-blue-100 text-center">
            <li>Resolva desafios reais com o apoio de startups promissoras.</li>
            <li>Construa parcerias estratégicas para o futuro do seu setor.</li>
            <li>Encontre a tecnologia e o talento certos para impulsionar a sua empresa.</li>
          </ul>
        </div>
            
        </div>

        {/* Coluna da Direita (Formulário) */}
        <div className="px-8 py-12">
          <div className="text-center mb-6">
            <h2 className="mt-3 text-[#011677] text-2xl font-medium">
              Formulário de Contato
            </h2>
          </div>

          {successMessage && (
            <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-md text-center font-semibold">
              {successMessage}
            </div>
          )}

          {errorMessage && (
            <div className="mb-4 p-4 bg-red-100 text-red-800 rounded-md text-center font-semibold">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {Object.keys(formData).map((field) => (
              <div key={field}>
                <label
                  htmlFor={field}
                  className="block text-sm font-semibold text-[#011677] mb-1"
                >
                  {field === 'empresa'
                    ? 'Empresa *'
                    : field === 'phone'
                    ? 'Telefone *'
                    : field === 'message'
                    ? 'Mensagem *'
                    : `${field.charAt(0).toUpperCase() + field.slice(1)} *`}
                </label>

                {field !== 'message' ? (
                  <input
                    type={field === 'email' ? 'email' : 'text'}
                    id={field}
                    name={field}
                    placeholder={
                      field === 'name'
                        ? 'Digite seu nome completo'
                        : field === 'email'
                        ? 'Digite seu email'
                        : field === 'empresa'
                        ? 'Nome da sua empresa'
                        : field === 'phone'
                        ? 'Telefone para contato'
                        : ''
                    }
                    value={(formData as any)[field]}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-gray-100 text-[#011677] placeholder-[#011677] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#011677]"
                  />
                ) : (
                  <textarea
                    id={field}
                    name={field}
                    rows={3}
                    placeholder="Como podemos ajudar?"
                    value={(formData as any)[field]}
                    onChange={handleChange}
                    required
                    className="w-full resize-none px-4 py-2 bg-gray-100 text-[#011677] placeholder-[#011677] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#011677]"
                  ></textarea>
                )}
              </div>
            ))}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#011677] cursor-pointer text-white font-bold py-3 rounded-lg shadow-lg hover:opacity-90 transition disabled:opacity-50"
            >
              {isSubmitting ? 'Enviando...' : 'Enviar'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
