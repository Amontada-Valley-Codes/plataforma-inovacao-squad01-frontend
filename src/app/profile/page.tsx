"use client";
import { useState, useRef, useEffect } from "react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { User, Phone, Briefcase, ArrowLeft, Camera } from "lucide-react";
import { Separator } from "../../components/ui/separator";
import { useUser, type User as UserType } from "../context/UserContext";
import { useRouter } from "next/navigation";
import Loading from "../loading";
import api from "../../lib/api"; // 💡 Importe o 'api'

export default function ProfilePage() {
	// 💡 Obtenha o 'setUser' para atualizar o contexto após o sucesso
	const { user: userFromContext, setUser, isAuthenticated } = useUser();
	const router = useRouter();

	const [theme, setTheme] = useState<string>("light");

	useEffect(() => {
		const storedTheme = sessionStorage.getItem("theme") || "light";
		setTheme(storedTheme);
	}, []);

	if (!isAuthenticated || !userFromContext) {
		return <Loading />;
	}

	const user: UserType = userFromContext;

	// Simplifique o estado para corresponder aos dados reais do usuário
	const [profile, setProfile] = useState({
		name: user.name ?? "",
		email: user.email ?? "",
		avatar: user.image_url ?? "",
	});

	const [isSaving, setIsSaving] = useState(false);
	const [saveMessage, setSaveMessage] = useState("");
	const [error, setError] = useState("");
	const fileInputRef = useRef<HTMLInputElement | null>(null);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setProfile({ ...profile, [e.target.name]: e.target.value });
	};

	// 💡 Lógica de Submissão Integrada com o Backend
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSaving(true);
		setSaveMessage("");
		setError("");

		try {
			const payload = {
				name: profile.name,
				email: profile.email,
			};

			const response = await api.put(`/user/${user.id}`, payload);

			// Atualiza o contexto do usuário com os novos dados
			setUser({ ...user, ...response.data });

			setSaveMessage("Perfil atualizado com sucesso!");
		} catch (err: any) {
			console.error("Falha ao atualizar perfil:", err);
			setError(err.response?.data?.message || "Ocorreu um erro ao salvar.");
		} finally {
			setIsSaving(false);
		}
	};

	const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		// Cria um FormData para enviar o ficheiro
		const formData = new FormData();
		formData.append('file', file);

		setIsSaving(true); // Reutiliza o estado de 'saving'
		setError('');

		try {
			const response = await api.post(`/user/${user.id}/avatar`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			});

			// Atualiza o estado do perfil e o contexto do usuário com a nova imagem
			const newAvatarUrl = response.data.avatar;
			setProfile(prev => ({ ...prev, avatar: newAvatarUrl }));
			setUser({ ...user, image_url: newAvatarUrl }); // Assumindo que o campo no contexto é image_url

			setSaveMessage("Avatar atualizado com sucesso!");

		} catch (err: any) {
			console.error("Falha no upload do avatar:", err);
			setError(err.response?.data?.message || "Ocorreu um erro no upload.");
		} finally {
			setIsSaving(false);
		}
	};

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
			<div className={`${theme === "dark" ? "bg-gray-800" : "bg-[#011677]"} sticky top-0 z-10 shadow-md`}>
				<div className="container mx-auto px-6 py-4">
					<div className="flex items-center gap-4">
						<Button
							variant="ghost"
							size="sm"
							className={`text-white ${theme === "dark" ? "hover:bg-gray-700" : ""} hovers-exit-dash transition-colors duration-200`}
							onClick={() => router.push("/dashboard")}
						>
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

			<main className="flex-1 p-8 flex justify-center items-start">
				<div className="flex flex-col md:flex-row gap-8 w-full max-w-6xl">
					{/* Card da Esquerda (Exibição) */}
					<Card className={`p-6 flex flex-col shadow-md hover:shadow-xl transition-all duration-300 rounded-2xl flex-1 border ${theme === "dark"
						? "bg-gray-800 border-gray-700"
						: "bg-white border-gray-200"
						}`}>
						<div className="flex flex-col items-center mb-6">
							<div className="relative">
								<img
									src={profile.avatar || "https://cdn-icons-png.flaticon.com/512/9131/9131529.png"}
									alt="Foto de perfil"
									className="w-32 h-32 rounded-full object-cover border-4 border-[#001f61]"
								/>
								<button
									onClick={() => fileInputRef.current?.click()}
									className="absolute bottom-1 right-1 bg-[#001f61] p-2 rounded-full hover:bg-[#002a7a] transition"
								>
									<Camera size={16} className="text-white" />
								</button>
								<input
									type="file"
									accept="image/*"
									ref={fileInputRef}
									onChange={handleAvatarChange}
									className="hidden"
								/>
							</div>
							<h2
								className={`text-2xl font-semibold mt-4 ${theme === "dark" ? "text-gray-50" : "text-gray-900"
									}`}
							>
								{profile.name}
							</h2>
							<p
								className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"
									}`}
							>
								{profile.email}
							</p>
						</div>

						<div className={`space-y-4 divide-y ${theme === "dark" ? "divide-gray-700" : "divide-gray-200"
							}`}>
							<div className={`flex items-center gap-2 pt-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"
								}`}>
								<User
									size={18}
									className={`${theme === "dark" ? "text-gray-400" : "text-gray-500"
										}`}
								/>{" "}
								Cargo:{" "}
								<span
									className={`font-medium ${theme === "dark" ? "text-gray-50" : "text-gray-900"
										}`}
								>
									{user.role}
								</span>
							</div>
							{/* Removemos os campos que não existem no backend */}
						</div>
					</Card>

					{/* Card da Direita (Formulário de Edição) */}
					<Card className={`p-6 shadow-md hover:shadow-xl transition-all duration-300 rounded-2xl flex-1 border ${theme === "dark"
							? "bg-gray-800 border-gray-700"
							: "bg-white border-gray-200"
						}`}>
						<h3 className={`text-xl font-semibold mb-4 ${theme === "dark" ? "text-gray-50" : "text-gray-900"
							}`}>Informações</h3>
						<p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"
							} mb-6`}>Edite suas informações abaixo:</p>
						<form onSubmit={handleSubmit} className="space-y-5">
							<Input
								className={`rounded-lg ${inputFocusClass} ${inputThemeClass}`}
								name="name"
								value={profile.name}
								onChange={handleChange}
								placeholder="Nome"
							/>

							<Input
								className={`rounded-lg ${inputFocusClass} ${inputThemeClass}`}
								name="email"
								value={profile.email}
								onChange={handleChange}
								placeholder="Email"
							/>

							<Button type="submit" disabled={isSaving} className={`w-full ...`}>
								{isSaving ? "Salvando..." : "Atualizar"}
							</Button>

							{saveMessage && <p className="text-center text-green-500 ...">{saveMessage}</p>}
							{error && <p className="text-center text-red-500 ...">{error}</p>}
						</form>
					</Card>
				</div>
			</main>
		</div>
	);
}