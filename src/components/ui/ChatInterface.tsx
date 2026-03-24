"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { LoadingDots } from "./Loading";
import dynamic from "next/dynamic";
const MarkdownRenderer = dynamic(() => import("./MarkdownRenderer"), {
	ssr: false,
});

interface Message {
	id: string;
	role: "user" | "assistant";
	content: string;
	timestamp: Date;
}

interface ChatInterfaceProps {
	onSendMessage: (message: string) => Promise<string>;
	suggestions?: string[];
	isLoading?: boolean;
	onClearHistory?: () => void;
	className?: string;
}

export default function ChatInterface({
	onSendMessage,
	suggestions = [],
	isLoading = false,
	onClearHistory,
	className = "",
}: ChatInterfaceProps) {
	const [messages, setMessages] = useState<Message[]>([
		{
			id: "1",
			role: "assistant",
			content: `👋 Hello! I'm your AI Trading Copilot. I can help you with:

📊 **Portfolio Analysis** - "Analyze my portfolio"
📉 **Risk Assessment** - "What's my risk level?"
📈 **Stock Analysis** - "Should I buy INFY?"
🏛️ **Market Overview** - "How is the market today?"

What would you like to know?`,
			timestamp: new Date(),
		},
	]);
	const [input, setInput] = useState("");
	const [sending, setSending] = useState(false);
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	const handleSend = async () => {
		if (!input.trim() || sending) return;

		const userMessage: Message = {
			id: Date.now().toString(),
			role: "user",
			content: input.trim(),
			timestamp: new Date(),
		};

		setMessages((prev) => [...prev, userMessage]);
		setInput("");
		setSending(true);

		try {
			const response = await onSendMessage(input.trim());

			const assistantMessage: Message = {
				id: (Date.now() + 1).toString(),
				role: "assistant",
				content: response,
				timestamp: new Date(),
			};

			setMessages((prev) => [...prev, assistantMessage]);
		} catch (error) {
			const errorMessage: Message = {
				id: (Date.now() + 1).toString(),
				role: "assistant",
				content: "Sorry, I encountered an error. Please try again.",
				timestamp: new Date(),
			};
			setMessages((prev) => [...prev, errorMessage]);
		} finally {
			setSending(false);
			inputRef.current?.focus();
		}
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSend();
		}
	};

	const handleSuggestionClick = (suggestion: string) => {
		setInput(suggestion);
		inputRef.current?.focus();
	};

	const handleClear = () => {
		setMessages([
			{
				id: "1",
				role: "assistant",
				content: `Chat history cleared. How can I help you?`,
				timestamp: new Date(),
			},
		]);
		onClearHistory?.();
	};

	return (
		<div className={"flex flex-col h-full overflow-hidden " + className}>
			{/* Header - Status bar only */}
			<div className="glass-card rounded-b-none border-b-0 p-2 flex items-center justify-between flex-shrink-0">
				<div className="flex items-center gap-2">
					<span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
					<span className="text-sm text-slate-600">Online</span>
				</div>
				<button
					onClick={handleClear}
					className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors"
					title="Clear chat"
				>
					<RefreshCw className="w-5 h-5 text-slate-500" />
				</button>
			</div>

			{/* Messages */}
			<div
				className="flex-1 overflow-y-auto glass-card rounded-none border-y-0 p-3 space-y-3"
				style={{ minHeight: 0 }}
			>
				{messages.map((message) => (
					<div
						key={message.id}
						className={cn(
							"flex gap-3",
							message.role === "user"
								? "flex-row-reverse"
								: "flex-row",
						)}
					>
						<div
							className={cn(
								"w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
								message.role === "user"
									? "bg-gradient-to-r from-red-600 to-red-700"
									: "bg-slate-100",
							)}
						>
							{message.role === "user" ? (
								<User className="w-4 h-4 text-white" />
							) : (
								<Bot className="w-4 h-4 text-red-600" />
							)}
						</div>
						<div
							className={cn(
								"max-w-[80%] p-4 rounded-2xl",
								message.role === "user"
									? "bg-gradient-to-r from-red-600 to-red-700 text-white rounded-br-sm"
									: "bg-slate-100 text-slate-800 rounded-bl-sm border border-slate-200",
							)}
						>
							{message.role === "assistant" ? (
								<MarkdownRenderer content={message.content} />
							) : (
								<div className="whitespace-pre-wrap text-sm leading-relaxed">
									{message.content}
								</div>
							)}
							<p className="text-xs opacity-50 mt-2">
								{message.timestamp.toLocaleTimeString([], {
									hour: "2-digit",
									minute: "2-digit",
								})}
							</p>
						</div>
					</div>
				))}

				{sending && (
					<div className="flex gap-3">
						<div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
							<Bot className="w-4 h-4 text-red-600" />
						</div>
						<div className="bg-slate-100 p-4 rounded-2xl rounded-bl-sm border border-slate-200">
							<LoadingDots />
						</div>
					</div>
				)}

				<div ref={messagesEndRef} />
			</div>

			{/* Suggestions */}
			{suggestions.length > 0 && !sending && (
				<div className="glass-card rounded-none border-0 p-1 flex gap-2 overflow-x-auto !mb-0 !pb-0">
					<Sparkles className="w-4 h-4 text-amber-500 flex-shrink-0 mt-1" />
					{suggestions.map((suggestion, index) => (
						<button
							key={index}
							onClick={() => handleSuggestionClick(suggestion)}
							className="px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-sm text-slate-700 whitespace-nowrap transition-colors"
						>
							{suggestion}
						</button>
					))}
				</div>
			)}

			{/* Input */}
			<div className="glass-card rounded-t-none border-t-0 p-1 !mb-0 !pb-0">
				<div className="flex gap-2">
					<input
						ref={inputRef}
						type="text"
						value={input}
						onChange={(e) => setInput(e.target.value)}
						onKeyPress={handleKeyPress}
						placeholder="Ask about your portfolio, stocks, or market..."
						className="input-field"
						disabled={sending}
					/>
					<button
						onClick={handleSend}
						disabled={!input.trim() || sending}
						className={cn(
							"btn-primary px-4 flex items-center gap-2",
							(!input.trim() || sending) &&
								"opacity-50 cursor-not-allowed",
						)}
					>
						<Send className="w-4 h-4" />
						<span className="hidden sm:inline">Send</span>
					</button>
				</div>
			</div>
		</div>
	);
}
