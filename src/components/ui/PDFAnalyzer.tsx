"use client";

import React, { useState, useRef } from "react";
import {
	Upload,
	FileText,
	Loader2,
	X,
	CheckCircle,
	AlertCircle,
	FileSearch,
	MessageCircle,
	Send,
	Bot,
	User,
} from "lucide-react";
import { analyzePDF, askPDFQuestion, PDFAnalysisResult } from "@/lib/api";
import MarkdownRenderer from "./MarkdownRenderer";

interface ChatMessage {
	role: "user" | "assistant";
	content: string;
}

interface PDFAnalyzerProps {
	onClose?: () => void;
}

export default function PDFAnalyzer({ onClose }: PDFAnalyzerProps) {
	const [file, setFile] = useState<File | null>(null);
	const [isAnalyzing, setIsAnalyzing] = useState(false);
	const [result, setResult] = useState<PDFAnalysisResult | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [dragActive, setDragActive] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);

	// Chat state
	const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
	const [currentQuestion, setCurrentQuestion] = useState("");
	const [isAskingQuestion, setIsAskingQuestion] = useState(false);
	const chatEndRef = useRef<HTMLDivElement>(null);

	const handleDrag = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		if (e.type === "dragenter" || e.type === "dragover") {
			setDragActive(true);
		} else if (e.type === "dragleave") {
			setDragActive(false);
		}
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setDragActive(false);

		if (e.dataTransfer.files && e.dataTransfer.files[0]) {
			const droppedFile = e.dataTransfer.files[0];
			if (droppedFile.type === "application/pdf") {
				setFile(droppedFile);
				setError(null);
				setResult(null);
			} else {
				setError("Please upload a PDF file");
			}
		}
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			const selectedFile = e.target.files[0];
			if (selectedFile.type === "application/pdf") {
				setFile(selectedFile);
				setError(null);
				setResult(null);
			} else {
				setError("Please upload a PDF file");
			}
		}
	};

	const handleAnalyze = async () => {
		if (!file) return;

		setIsAnalyzing(true);
		setError(null);

		try {
			const analysisResult = await analyzePDF(file);

			// Check if analysis was successful
			if (!analysisResult.success) {
				setError(analysisResult.error || "Failed to analyze PDF");
				return;
			}

			setResult(analysisResult);
		} catch (err: any) {
			setError(
				err?.response?.data?.detail ||
					err?.message ||
					"Failed to analyze PDF",
			);
		} finally {
			setIsAnalyzing(false);
		}
	};

	const handleReset = () => {
		setFile(null);
		setResult(null);
		setError(null);
		setChatMessages([]);
		setCurrentQuestion("");
		if (inputRef.current) {
			inputRef.current.value = "";
		}
	};

	const handleAskQuestion = async () => {
		if (!currentQuestion.trim() || !result?.document_id) return;

		const question = currentQuestion.trim();
		setCurrentQuestion("");

		// Add user message
		setChatMessages((prev) => [
			...prev,
			{ role: "user" as const, content: question },
		]);
		setIsAskingQuestion(true);

		try {
			const response = await askPDFQuestion(result.document_id, question);

			if (response.success && response.answer) {
				setChatMessages((prev) => [
					...prev,
					{
						role: "assistant" as const,
						content: response.answer as string,
					},
				]);
			} else {
				setChatMessages((prev) => [
					...prev,
					{
						role: "assistant" as const,
						content:
							response.error ||
							"Sorry, I couldn't answer that question.",
					},
				]);
			}
		} catch (err: any) {
			setChatMessages((prev) => [
				...prev,
				{
					role: "assistant" as const,
					content:
						"Sorry, an error occurred while processing your question.",
				},
			]);
		} finally {
			setIsAskingQuestion(false);
			// Scroll to bottom
			setTimeout(() => {
				chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
			}, 100);
		}
	};

	const formatDocumentType = (type: string | undefined) => {
		if (!type) return "Financial Document";
		return type
			.split("_")
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(" ");
	};

	return (
		<div className="glass-card p-6">
			<div className="flex items-center justify-between mb-6">
				<div className="flex items-center gap-3">
					<div className="p-2 rounded-xl bg-gradient-to-r from-red-500 to-amber-500">
						<FileSearch className="w-6 h-6 text-white" />
					</div>
					<div>
						<h2 className="text-lg font-semibold text-slate-800">
							PDF Document Analyzer
						</h2>
						<p className="text-sm text-slate-500">
							Upload financial documents for AI analysis
						</p>
					</div>
				</div>
				{onClose && (
					<button
						onClick={onClose}
						className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
					>
						<X className="w-5 h-5 text-slate-500" />
					</button>
				)}
			</div>

			{!result && (
				<>
					{/* Drag & Drop Area */}
					<div
						onDragEnter={handleDrag}
						onDragLeave={handleDrag}
						onDragOver={handleDrag}
						onDrop={handleDrop}
						onClick={() => inputRef.current?.click()}
						className={`
              relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
              ${dragActive ? "border-red-500 bg-red-50" : "border-slate-300 hover:border-red-400 hover:bg-slate-50"}
              ${file ? "border-green-500 bg-green-50" : ""}
            `}
					>
						<input
							ref={inputRef}
							type="file"
							accept=".pdf"
							onChange={handleFileChange}
							className="hidden"
						/>

						{file ? (
							<div className="flex flex-col items-center gap-3">
								<div className="p-3 rounded-full bg-green-100">
									<FileText className="w-8 h-8 text-green-600" />
								</div>
								<div>
									<p className="font-medium text-slate-800">
										{file.name}
									</p>
									<p className="text-sm text-slate-500">
										{(file.size / 1024 / 1024).toFixed(2)}{" "}
										MB
									</p>
								</div>
								<button
									onClick={(e) => {
										e.stopPropagation();
										handleReset();
									}}
									className="text-sm text-red-500 hover:text-red-600"
								>
									Remove file
								</button>
							</div>
						) : (
							<div className="flex flex-col items-center gap-3">
								<div className="p-3 rounded-full bg-slate-100">
									<Upload className="w-8 h-8 text-slate-400" />
								</div>
								<div>
									<p className="font-medium text-slate-700">
										Drop your PDF here or click to browse
									</p>
									<p className="text-sm text-slate-500 mt-1">
										Supports earnings reports, annual
										reports, balance sheets, and more
									</p>
								</div>
							</div>
						)}
					</div>

					{/* PDF Analysis Suggestions */}
					<div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-red-50 to-amber-50 border border-red-100">
						<h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
							<Bot className="w-4 h-4 text-red-500" />
							What Our AI Can Analyze
						</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
							<div>
								<p className="font-medium text-slate-700 mb-1">
									📄 Supported Documents:
								</p>
								<ul className="text-slate-600 space-y-1 ml-4">
									<li>• Annual Reports & 10-K Filings</li>
									<li>• Quarterly Earnings Reports</li>
									<li>
										• Balance Sheets & Income Statements
									</li>
									<li>• Investment Research Reports</li>
								</ul>
							</div>
							<div>
								<p className="font-medium text-slate-700 mb-1">
									🔍 AI Analysis Includes:
								</p>
								<ul className="text-slate-600 space-y-1 ml-4">
									<li>• Key financial metrics extraction</li>
									<li>• Investment risks & opportunities</li>
									<li>• Sentiment analysis of text</li>
									<li>• Q&A chat about the document</li>
								</ul>
							</div>
						</div>
						<p className="text-xs text-slate-500 mt-3">
							💡 <strong>Tip:</strong> After analysis, you can ask
							questions like &quot;What are the main risks?&quot;
							or &quot;Summarize the revenue growth&quot;
						</p>
					</div>

					{/* Error Message */}
					{error && (
						<div className="mt-4 p-4 rounded-xl bg-red-50 border border-red-200 flex items-center gap-3">
							<AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
							<p className="text-sm text-red-700">{error}</p>
						</div>
					)}

					{/* Analyze Button */}
					{file && (
						<button
							onClick={handleAnalyze}
							disabled={isAnalyzing}
							className="mt-4 w-full btn-primary py-3 flex items-center justify-center gap-2"
						>
							{isAnalyzing ? (
								<>
									<Loader2 className="w-5 h-5 animate-spin" />
									Analyzing document...
								</>
							) : (
								<>
									<FileSearch className="w-5 h-5" />
									Analyze Document
								</>
							)}
						</button>
					)}

					{/* Supported Documents */}
					<div className="mt-6 p-4 bg-slate-50 rounded-xl">
						<h3 className="text-sm font-semibold text-slate-700 mb-2">
							Supported Documents
						</h3>
						<div className="grid grid-cols-2 gap-2 text-sm text-slate-600">
							<div className="flex items-center gap-2">
								<CheckCircle className="w-4 h-4 text-green-500" />
								Earnings Reports
							</div>
							<div className="flex items-center gap-2">
								<CheckCircle className="w-4 h-4 text-green-500" />
								Annual Reports
							</div>
							<div className="flex items-center gap-2">
								<CheckCircle className="w-4 h-4 text-green-500" />
								Balance Sheets
							</div>
							<div className="flex items-center gap-2">
								<CheckCircle className="w-4 h-4 text-green-500" />
								Income Statements
							</div>
							<div className="flex items-center gap-2">
								<CheckCircle className="w-4 h-4 text-green-500" />
								Portfolio Statements
							</div>
							<div className="flex items-center gap-2">
								<CheckCircle className="w-4 h-4 text-green-500" />
								Research Reports
							</div>
						</div>
					</div>
				</>
			)}

			{/* Analysis Result */}
			{result && (
				<div className="space-y-6">
					{/* Document Info */}
					<div className="p-4 bg-slate-50 rounded-xl">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-3">
								<div className="p-2 rounded-lg bg-green-100">
									<CheckCircle className="w-5 h-5 text-green-600" />
								</div>
								<div>
									<p className="font-medium text-slate-800">
										{result.filename}
									</p>
									<p className="text-sm text-slate-500">
										{formatDocumentType(
											result.document_type,
										)}
										{result.page_count &&
											` • ~${result.page_count} pages`}
									</p>
								</div>
							</div>
							<button
								onClick={handleReset}
								className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
							>
								Analyze Another
							</button>
						</div>
					</div>

					{/* Extracted Metrics */}
					{result.extracted_metrics &&
						Object.keys(result.extracted_metrics).length > 0 && (
							<div className="p-4 bg-red-50 rounded-xl">
								<h3 className="text-sm font-semibold text-red-800 mb-3">
									Extracted Metrics
								</h3>
								<div className="grid grid-cols-2 md:grid-cols-3 gap-3">
									{Object.entries(
										result.extracted_metrics,
									).map(([key, value]) => (
										<div
											key={key}
											className="bg-white p-3 rounded-lg"
										>
											<p className="text-xs text-slate-500 uppercase">
												{key.replace(/_/g, " ")}
											</p>
											<p className="font-semibold text-slate-800">
												{typeof value === "number"
													? key.includes("growth") ||
														key.includes("ratio")
														? `${value.toFixed(2)}%`
														: `₹${value.toLocaleString()}`
													: value}
											</p>
										</div>
									))}
								</div>
							</div>
						)}

					{/* AI Analysis */}
					{result.analysis && (
						<div className="glass-card p-4">
							<h3 className="text-lg font-semibold text-slate-800 mb-4">
								AI Analysis
							</h3>
							<div className="prose prose-slate max-w-none">
								<MarkdownRenderer content={result.analysis} />
							</div>
						</div>
					)}

					{/* Text Preview */}
					{result.text_preview && (
						<details className="glass-card p-4">
							<summary className="font-medium text-slate-700 cursor-pointer hover:text-slate-900">
								View Document Preview
							</summary>
							<pre className="mt-4 p-4 bg-slate-50 rounded-lg text-xs text-slate-600 whitespace-pre-wrap font-mono overflow-auto max-h-64">
								{result.text_preview}
							</pre>
						</details>
					)}

					{/* Q&A Chat Interface */}
					{result.document_id && (
						<div className="glass-card p-4">
							<h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
								<MessageCircle className="w-5 h-5 text-red-500" />
								Ask Questions About This Document
							</h3>

							{/* Chat Messages */}
							{chatMessages.length > 0 && (
								<div className="mb-4 max-h-80 overflow-y-auto space-y-3 p-3 bg-slate-50 rounded-xl">
									{chatMessages.map((message, index) => (
										<div
											key={index}
											className={`flex items-start gap-2 ${
												message.role === "user"
													? "flex-row-reverse"
													: ""
											}`}
										>
											<div
												className={`p-2 rounded-full ${
													message.role === "user"
														? "bg-red-100"
														: "bg-slate-200"
												}`}
											>
												{message.role === "user" ? (
													<User className="w-4 h-4 text-red-600" />
												) : (
													<Bot className="w-4 h-4 text-slate-600" />
												)}
											</div>
											<div
												className={`flex-1 p-3 rounded-xl ${
													message.role === "user"
														? "bg-red-500 text-white"
														: "bg-white border border-slate-200"
												}`}
											>
												{message.role ===
												"assistant" ? (
													<MarkdownRenderer
														content={
															message.content
														}
													/>
												) : (
													<p className="text-sm">
														{message.content}
													</p>
												)}
											</div>
										</div>
									))}
									{isAskingQuestion && (
										<div className="flex items-start gap-2">
											<div className="p-2 rounded-full bg-slate-200">
												<Bot className="w-4 h-4 text-slate-600" />
											</div>
											<div className="flex-1 p-3 rounded-xl bg-white border border-slate-200">
												<div className="flex items-center gap-2">
													<Loader2 className="w-4 h-4 animate-spin text-red-500" />
													<span className="text-sm text-slate-500">
														Analyzing document...
													</span>
												</div>
											</div>
										</div>
									)}
									<div ref={chatEndRef} />
								</div>
							)}

							{/* Suggested Questions */}
							{chatMessages.length === 0 && (
								<div className="mb-4">
									<p className="text-sm text-slate-500 mb-2">
										Suggested questions:
									</p>
									<div className="flex flex-wrap gap-2">
										{[
											"What can you analyze from this document?",
											"What are the key financial highlights?",
											"What is the revenue growth?",
											"Are there any risks mentioned?",
											"What is the overall financial health?",
										].map((question, index) => (
											<button
												key={index}
												onClick={() =>
													setCurrentQuestion(question)
												}
												className="px-3 py-1.5 text-sm bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
											>
												{question}
											</button>
										))}
									</div>
								</div>
							)}

							{/* Input Area */}
							<div className="flex gap-2">
								<input
									type="text"
									value={currentQuestion}
									onChange={(e) =>
										setCurrentQuestion(e.target.value)
									}
									onKeyDown={(e) => {
										if (e.key === "Enter" && !e.shiftKey) {
											e.preventDefault();
											handleAskQuestion();
										}
									}}
									placeholder="Ask a question about the document..."
									className="flex-1 px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
									disabled={isAskingQuestion}
								/>
								<button
									onClick={handleAskQuestion}
									disabled={
										isAskingQuestion ||
										!currentQuestion.trim()
									}
									className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
								>
									{isAskingQuestion ? (
										<Loader2 className="w-4 h-4 animate-spin" />
									) : (
										<Send className="w-4 h-4" />
									)}
								</button>
							</div>
						</div>
					)}
				</div>
			)}
		</div>
	);
}
