"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ChatInterface, PDFAnalyzer } from "@/components/ui";
import { Bot, FileSearch, MessageSquare } from "lucide-react";
import dynamic from "next/dynamic";
const GenieChatWidget = dynamic(() => import("@/components/GenieChatWidget"), {
	ssr: false,
});

const USER_ID = 1;

export default function ChatPage() {
	const [activeTab, setActiveTab] = useState<"chat" | "pdf">("chat");

	const { data: suggestedPrompts } = useQuery({
		queryKey: ["suggestedPrompts"],
		queryFn: () => api.getSuggestedPrompts(),
	});

	// Async function for ChatInterface that returns the response string
	const handleSendMessage = async (message: string): Promise<string> => {
		const response = await api.sendChatMessage(USER_ID, message);
		return response.response;
	};

	const handleClearHistory = async () => {
		await api.clearChatHistory(USER_ID);
	};

	return (
		<>
			{/* Header with Tabs */}
			<div className="flex justify-between items-center mb-2 flex-shrink-0">
				<div>
					<h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
						<Bot className="w-6 h-6 text-red-500" />
						ABML AI Assistant
					</h1>
					<p className="text-slate-500 text-xs mt-0.5">
						{activeTab === "chat"
							? "Ask me anything about your portfolio, market analysis, or trading strategies"
							: "Upload financial documents for AI-powered analysis"}
					</p>
				</div>
				{/* Tab Buttons */}
				<div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
					<button
						onClick={() => setActiveTab("chat")}
						className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
							activeTab === "chat"
								? "bg-white text-red-600 shadow-sm"
								: "text-slate-600 hover:text-slate-800"
						}`}
					>
						<MessageSquare className="w-4 h-4" />
						Chat
					</button>
					<button
						onClick={() => setActiveTab("pdf")}
						className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
							activeTab === "pdf"
								? "bg-white text-amber-600 shadow-sm"
								: "text-slate-600 hover:text-slate-800"
						}`}
					>
						<FileSearch className="w-4 h-4" />
						PDF Analysis
					</button>
				</div>
			</div>

			{/* Content Area */}
			<div className="flex-1 min-h-0 overflow-hidden">
				{activeTab === "chat" ? (
					<ChatInterface
						onSendMessage={handleSendMessage}
						suggestions={suggestedPrompts?.prompts ?? []}
						onClearHistory={handleClearHistory}
					/>
				) : (
					<div className="h-full overflow-auto">
						<PDFAnalyzer />
					</div>
				)}
			</div>
			<GenieChatWidget
				onSendMessage={async (message) => {
					const res = await api.sendChatMessage(USER_ID, message);
					return res.response || "";
				}}
				suggestions={[]}
				fontSize="sm"
				animateFromCorner
			/>
		</>
	);
}
