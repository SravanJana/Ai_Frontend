"use client";
import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X } from "lucide-react";
import dynamic from "next/dynamic";

const ChatInterface = dynamic(() => import("./ui/ChatInterface"), {
	ssr: false,
});

export default function GenieChatWidget({
	onSendMessage,
	suggestions = [],
	fontSize = "base",
	animateFromCorner = false,
}: {
	onSendMessage: (message: string) => Promise<string>;
	suggestions?: string[];
	fontSize?: "sm" | "base";
	animateFromCorner?: boolean;
}) {
	const [open, setOpen] = useState(false);
	const widgetRef = useRef<HTMLDivElement>(null);

	// Close on outside click
	useEffect(() => {
		function handleClick(e: MouseEvent) {
			if (
				open &&
				widgetRef.current &&
				!widgetRef.current.contains(e.target as Node)
			) {
				setOpen(false);
			}
		}
		if (open) document.addEventListener("mousedown", handleClick);
		return () => document.removeEventListener("mousedown", handleClick);
	}, [open]);

	return (
		<div className="fixed z-50 bottom-6 right-6 flex flex-col items-end">
			{open && (
				<div
					ref={widgetRef}
					className={
						"w-[370px] max-w-[95vw] h-[540px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden " +
						(animateFromCorner
							? "animate-genie-slide-in"
							: "animate-fade-in")
					}
					style={fontSize === "sm" ? { fontSize: "0.92rem" } : {}}
				>
					<div className="flex items-center justify-between px-4 py-2 bg-gradient-to-r from-pink-500 to-yellow-400 text-white font-bold text-lg">
						<span className="flex items-center gap-2">
							<span className="text-2xl">🧞‍♂️</span> Genie AI
						</span>
						<button
							onClick={() => setOpen(false)}
							className="hover:bg-white/20 rounded-full p-1"
						>
							<X className="w-5 h-5" />
						</button>
					</div>
					<div className="flex-1 bg-slate-50">
						<ChatInterface
							onSendMessage={onSendMessage}
							suggestions={suggestions}
							className={fontSize === "sm" ? "text-sm" : ""}
						/>
					</div>
				</div>
			)}
			<button
				aria-label="Open Genie Chatbot"
				className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-yellow-400 shadow-xl flex items-center justify-center text-white text-4xl border-4 border-white hover:scale-105 transition-all"
				style={{ boxShadow: "0 8px 32px 0 rgba(0,0,0,0.18)" }}
				onClick={() => setOpen((v) => !v)}
			>
				<span role="img" aria-label="Genie">
					🧞‍♂️
				</span>
			</button>
		</div>
	);
}
