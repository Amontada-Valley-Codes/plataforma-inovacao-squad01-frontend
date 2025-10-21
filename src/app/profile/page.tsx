"use client";
import { useState, useRef, useEffect } from "react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { User, Phone, Briefcase, ArrowLeft, Camera, Loader2 } from "lucide-react";
import { Separator } from "../../components/ui/separator";
import { useUser, type User as UserType } from "../context/UserContext";
import { useRouter } from "next/navigation";
import api from "../../lib/api"; // Importando nossa instância do axios

export default function ProfilePage() {
    const { user: userFromContext, setUser } = useUser();
    const router = useRouter();

    const [theme] = useState<string>(
        typeof window !== "undefined"
            ? sessionStorage.getItem("theme") || "light"
            : "light"
    );

    // Remove o usuário mock e usa o do contexto diretamente
    const user: UserType = userFromContext!;

    // Adiciona mais campos ao estado, se necessário (ex: department, matricula não existem no seu DTO do backend)
    const [profile, setProfile] = useState({
        name: user?.name ?? "",
        email: user?.email ?? "",
        phone: (user as any).phone ?? "",
        avatar: user?.image_url ?? "",
    });

    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState("");
    const [error, setError] = useState("");
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    // Se não houver usuário, redireciona ou mostra loading
    useEffect(() => {
        if (!userFromContext) {
            router.push('/login');
        }
    }, [userFromContext, router]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    // Função de submit atualizada para chamar a API
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setSaveMessage("");
        setError("");

        try {
            // A rota no backend é PATCH /user/:id
            const response = await api.patch(`/user/${user.id}`, {
                name: profile.name,
                email: profile.email,
                phone: profile.phone
            });
            
            // Atualiza o contexto do usuário e o localStorage com os novos dados
            setUser(response.data);

            setSaveMessage("Perfil atualizado com sucesso!");
        } catch (err: any) {
            setError(err.response?.data?.message || "Ocorreu um erro ao atualizar o perfil.");
        } finally {
            setIsSaving(false);
        }
    };

    // Função de avatar atualizada para chamar a API
    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const formData = new FormData();
            formData.append('file', file);

            try {
                // A rota no backend é POST /auth/upload
                const response = await api.post('/auth/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                // Atualiza o estado local e o contexto do usuário
                setProfile({ ...profile, avatar: response.data.image_url });
                setUser(response.data);
                setSaveMessage("Avatar atualizado com sucesso!");

            } catch (err: any) {
                setError(err.response?.data?.message || "Ocorreu um erro ao enviar a imagem.");
            }
        }
    };
    
    // Se o usuário ainda não carregou, pode mostrar um loading
    if (!user) {
        return <div>Carregando...</div>;
    }


    const inputFocusClass =
        "focus:border-[#001f61] focus:ring focus:ring-[#001f61]/30 transition-colors";
    const inputThemeClass =
        theme === "dark"
            ? "bg-gray-700 border-gray-600 placeholder:text-gray-400 text-white"
            : "bg-white border-gray-300 placeholder:text-gray-700 text-gray-900";
    const buttonMainClass =
        "bg-[#001f61] hover:bg-[#002a7a] text-white transition-colors duration-200 cursor-pointer";

    return (
        <div className={`flex flex-col min-h-screen ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50"}`}>
            {/* Navbar */}
            <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-[#011677]'} sticky top-0 z-10 shadow-md`}>
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" className={`text-white ${theme === 'dark' ? 'hover:bg-gray-600' : ''} hovers-exit-dash transition-colors duration-200`} onClick={() => router.push("/dashboard")}>
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Voltar ao Dashboard
                        </Button>
                        <Separator orientation="vertical" className="h-6 bg-white/30" />
                        <div className="flex items-center gap-2 text-white">
                            <User className="w-5 h-5" />
                            <h1 className="text-lg font-semibold">Perfil</h1>
                        </div>
                    </div>
                </div>
            </div>

            {/* Conteúdo principal */}
            <main className="flex-1 p-8 flex justify-center items-start">
                <div className="flex flex-col md:flex-row gap-8 w-full max-w-6xl">
                    {/* Card da esquerda */}
                    <Card className={`p-6 flex flex-col shadow-md hover:shadow-xl transition-all duration-300 rounded-2xl flex-1 border ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
                        <div className="flex flex-col items-center mb-6">
                            <div className="relative">
                                <img
                                    src={profile.avatar || "https://cdn-icons-png.flaticon.com/512/9131/9131529.png"}
                                    alt="Foto de perfil"
                                    className="w-32 h-32 rounded-full object-cover border-4 border-[#001f61]"
                                />
                                <button onClick={() => fileInputRef.current?.click()} className="absolute bottom-1 right-1 bg-[#001f61] p-2 rounded-full hover:bg-[#002a7a] transition">
                                    <Camera size={16} className="text-white" />
                                </button>
                                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleAvatarChange} className="hidden" />
                            </div>
                            <h2 className={`text-2xl font-semibold mt-4 ${theme === "dark" ? "text-gray-50" : "text-gray-900"}`}>{profile.name}</h2>
                            <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>{profile.email}</p>
                        </div>

                        <div className={`space-y-4 divide-y ${theme === "dark" ? "divide-gray-700" : "divide-gray-200"}`}>
                            <div className={`flex items-center gap-2 pt-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                                <User size={18} className={`${theme === "dark" ? "text-gray-400" : "text-gray-500"}`} /> Cargo:{" "}
                                <span className={`font-medium ${theme === "dark" ? "text-gray-50" : "text-gray-900"}`}>{user.role}</span>
                            </div>
                            <div className={`flex items-center gap-2 pt-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                                <Phone size={18} className={`${theme === "dark" ? "text-gray-400" : "text-gray-500"}`} /> Telefone:{" "}
                                <span className={`font-medium ${theme === "dark" ? "text-gray-50" : "text-gray-900"}`}>{profile.phone || 'Não informado'}</span>
                            </div>
                        </div>
                    </Card>

                    {/* Card da direita */}
                    <Card className={`p-6 shadow-md hover:shadow-xl transition-all duration-300 rounded-2xl flex-1 border ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
                        <h3 className={`text-xl font-semibold mb-2 ${theme === "dark" ? "text-gray-50" : "text-gray-900"}`}>Informações</h3>
                        <p className={`${theme === "dark" ? "text-gray-400" : "text-gray-500"} mb-6`}>Edite suas informações abaixo:</p>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <Input className={`rounded-lg ${inputFocusClass} ${inputThemeClass}`} name="name" value={profile.name} onChange={handleChange} placeholder="Nome" />
                            <Input className={`rounded-lg ${inputFocusClass} ${inputThemeClass}`} name="email" value={profile.email} onChange={handleChange} placeholder="Email" />
                            <Input className={`rounded-lg ${inputFocusClass} ${inputThemeClass}`} name="phone" value={profile.phone} onChange={handleChange} placeholder="Telefone" />

                            <Button type="submit" disabled={isSaving} className={`w-full mt-2 rounded-lg font-medium ${buttonMainClass}`}>
                                {isSaving ? <Loader2 className="animate-spin" /> : "Atualizar"}
                            </Button>

                            {saveMessage && <p className="text-center text-green-500 text-sm mt-2 animate-fade-in">{saveMessage}</p>}
                            {error && <p className="text-center text-red-500 text-sm mt-2 animate-fade-in">{error}</p>}
                        </form>
                    </Card>
                </div>
            </main>
        </div>
    );
}