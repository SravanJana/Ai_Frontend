"use client";

import React from "react";

interface MarkdownRendererProps {
	content: string;
	className?: string;
}

export default function MarkdownRenderer({
	content,
	className = "",
}: MarkdownRendererProps) {
	const parseMarkdown = (text: string): React.ReactNode[] => {
		const lines = text.split("\n");
		const elements: React.ReactNode[] = [];
		let listItems: string[] = [];
		let listType: "ul" | "ol" | null = null;
		let keyCounter = 0;

		const flushList = () => {
			if (listItems.length > 0 && listType) {
				const ListComponent = listType === "ul" ? "ul" : "ol";
				elements.push(
					<ListComponent
						key={`list-${keyCounter++}`}
						className={
							listType === "ul"
								? "list-disc list-inside space-y-1 my-2"
								: "list-decimal list-inside space-y-1 my-2"
						}
					>
						{listItems.map((item, i) => (
							<li key={i} className="text-sm leading-relaxed">
								{parseInline(item)}
							</li>
						))}
					</ListComponent>,
				);
				listItems = [];
				listType = null;
			}
		};

		const parseInline = (text: string): React.ReactNode => {
			// Parse inline elements: **bold**, *italic*, `code`, and emojis
			const parts: React.ReactNode[] = [];
			let remaining = text;
			let inlineKey = 0;

			while (remaining.length > 0) {
				// Bold: **text**
				const boldMatch = remaining.match(/^\*\*(.+?)\*\*/);
				if (boldMatch) {
					parts.push(
						<strong
							key={`b-${inlineKey++}`}
							className="font-semibold"
						>
							{boldMatch[1]}
						</strong>,
					);
					remaining = remaining.slice(boldMatch[0].length);
					continue;
				}

				// Italic: *text*
				const italicMatch = remaining.match(/^\*(.+?)\*/);
				if (italicMatch) {
					parts.push(
						<em key={`i-${inlineKey++}`} className="italic">
							{italicMatch[1]}
						</em>,
					);
					remaining = remaining.slice(italicMatch[0].length);
					continue;
				}

				// Inline code: `code`
				const codeMatch = remaining.match(/^`(.+?)`/);
				if (codeMatch) {
					parts.push(
						<code
							key={`c-${inlineKey++}`}
							className="px-1.5 py-0.5 bg-slate-200 rounded text-sm font-mono"
						>
							{codeMatch[1]}
						</code>,
					);
					remaining = remaining.slice(codeMatch[0].length);
					continue;
				}

				// Regular character
				parts.push(remaining[0]);
				remaining = remaining.slice(1);
			}

			return parts;
		};

		for (let i = 0; i < lines.length; i++) {
			let line = lines[i];

			// Highlight disclaimer
			if (
				line
					.toLowerCase()
					.includes(
						"disclaimer: this response is for informational purposes only",
					)
			) {
				flushList();
				elements.push(
					<div
						key={`disclaimer-${keyCounter++}`}
						className="my-6 flex justify-center"
					>
						<div
							className="relative px-6 py-5 bg-white/90 rounded-2xl shadow-xl border-2 border-transparent bg-gradient-to-br from-red-50 to-yellow-50"
							style={{
								borderImage:
									"linear-gradient(90deg, #f43f5e 0%, #f59e42 100%) 1",
								maxWidth: 540,
								minWidth: 320,
								width: "100%",
								fontFamily:
									"Inter, Segoe UI, Arial, sans-serif",
							}}
						>
							<div className="flex items-center justify-center mb-2">
								<svg
									width="32"
									height="32"
									viewBox="0 0 24 24"
									fill="none"
									className="mr-2"
								>
									<circle
										cx="12"
										cy="12"
										r="12"
										fill="#f43f5e"
									/>
									<path
										d="M12 7v4"
										stroke="#fff"
										strokeWidth="2"
										strokeLinecap="round"
									/>
									<circle
										cx="12"
										cy="16"
										r="1.2"
										fill="#fff"
									/>
								</svg>
								<span className="text-xl font-extrabold text-red-600 tracking-wide drop-shadow">
									Important Disclaimer
								</span>
							</div>
							<div
								className="text-base font-medium text-slate-700 text-center leading-snug"
								style={{ letterSpacing: 0.1 }}
							>
								{parseInline(line.replace(/^\*|\*$/g, ""))}
							</div>
						</div>
					</div>,
				);
				continue;
			}

			// Skip empty lines but add spacing, except right after disclaimer
			if (!line.trim()) {
				flushList();
				// Only add spacing if previous element is not the disclaimer
				const prev = elements[elements.length - 1];
				const isDisclaimer =
					prev &&
					prev.key &&
					String(prev.key).startsWith("disclaimer-");
				if (!isDisclaimer) {
					elements.push(
						<div key={`space-${keyCounter++}`} className="h-2" />,
					);
				}
				continue;
			}

			// Heading 4: ####
			if (line.startsWith("#### ")) {
				flushList();
				elements.push(
					<h4
						key={`h4-${keyCounter++}`}
						className="text-base font-bold mt-4 mb-2 flex items-center gap-2"
					>
						{parseInline(line.slice(5))}
					</h4>,
				);
				continue;
			}

			// Heading 3: ###
			if (line.startsWith("### ")) {
				flushList();
				elements.push(
					<h3
						key={`h3-${keyCounter++}`}
						className="text-lg font-bold mt-4 mb-2 flex items-center gap-2"
					>
						{parseInline(line.slice(4))}
					</h3>,
				);
				continue;
			}

			// Heading 2: ##
			if (line.startsWith("## ")) {
				flushList();
				elements.push(
					<h2
						key={`h2-${keyCounter++}`}
						className="text-xl font-bold mt-4 mb-2"
					>
						{parseInline(line.slice(3))}
					</h2>,
				);
				continue;
			}

			// Heading 1: #
			if (line.startsWith("# ")) {
				flushList();
				elements.push(
					<h1
						key={`h1-${keyCounter++}`}
						className="text-2xl font-bold mt-4 mb-2"
					>
						{parseInline(line.slice(2))}
					</h1>,
				);
				continue;
			}

			// Unordered list: * or -
			if (line.match(/^[\*\-] /)) {
				if (listType !== "ul") {
					flushList();
					listType = "ul";
				}
				listItems.push(line.slice(2));
				continue;
			}

			// Ordered list: 1. 2. etc
			if (line.match(/^\d+\. /)) {
				if (listType !== "ol") {
					flushList();
					listType = "ol";
				}
				listItems.push(line.replace(/^\d+\. /, ""));
				continue;
			}

			// Regular paragraph
			flushList();
			elements.push(
				<p
					key={`p-${keyCounter++}`}
					className="text-sm leading-relaxed my-1"
				>
					{parseInline(line)}
				</p>,
			);
		}

		flushList();
		return elements;
	};

	return (
		<div className={`markdown-content ${className}`}>
			{parseMarkdown(content)}
		</div>
	);
}
