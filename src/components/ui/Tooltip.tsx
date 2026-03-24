"use client";

import React, { useState, useRef } from "react";
import { Info, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

// Support both string content and { title, content } object
type TooltipContent = string | { title: string; content: string };

interface TooltipProps {
	content: TooltipContent;
	title?: string;
	children?: React.ReactNode;
	position?: "top" | "bottom" | "left" | "right";
	variant?: "info" | "help";
	className?: string;
}

export default function Tooltip({
	content,
	title,
	children,
	position = "top",
	variant = "info",
	className,
}: TooltipProps) {
	const [isVisible, setIsVisible] = useState(false);
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);

	// Extract title and content from object if needed
	const tooltipTitle = typeof content === "object" ? content.title : title;
	const tooltipContent =
		typeof content === "object" ? content.content : content;

	const showTooltip = () => {
		if (timeoutRef.current) clearTimeout(timeoutRef.current);
		setIsVisible(true);
	};

	const hideTooltip = () => {
		timeoutRef.current = setTimeout(() => setIsVisible(false), 100);
	};

	const positionClasses = {
		top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
		bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
		left: "right-full top-1/2 -translate-y-1/2 mr-2",
		right: "left-full top-1/2 -translate-y-1/2 ml-2",
	};

	const arrowClasses = {
		top: "top-full left-1/2 -translate-x-1/2 border-t-slate-700 border-x-transparent border-b-transparent",
		bottom: "bottom-full left-1/2 -translate-x-1/2 border-b-slate-700 border-x-transparent border-t-transparent",
		left: "left-full top-1/2 -translate-y-1/2 border-l-slate-700 border-y-transparent border-r-transparent",
		right: "right-full top-1/2 -translate-y-1/2 border-r-slate-700 border-y-transparent border-l-transparent",
	};

	const Icon = variant === "info" ? Info : HelpCircle;

	return (
		<div className={cn("relative inline-flex", className)}>
			<button
				type="button"
				onMouseEnter={showTooltip}
				onMouseLeave={hideTooltip}
				onFocus={showTooltip}
				onBlur={hideTooltip}
				className="inline-flex items-center justify-center p-0.5 rounded-full text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500/20"
				aria-label="More information"
			>
				{children || <Icon className="w-4 h-4" />}
			</button>

			{isVisible && (
				<div
					className={cn(
						"absolute z-50 w-64 p-3 rounded-lg shadow-lg",
						"bg-slate-700 text-white text-sm",
						"animate-in fade-in-0 zoom-in-95 duration-200",
						positionClasses[position],
					)}
					onMouseEnter={showTooltip}
					onMouseLeave={hideTooltip}
				>
					{tooltipTitle && (
						<p className="font-semibold text-red-300 mb-1">
							{tooltipTitle}
						</p>
					)}
					<p className="leading-relaxed text-slate-200">
						{tooltipContent}
					</p>
					<div
						className={cn(
							"absolute w-0 h-0 border-4",
							arrowClasses[position],
						)}
					/>
				</div>
			)}
		</div>
	);
}

// Financial term definitions for tooltips
export const FINANCIAL_TOOLTIPS = {
	riskScore: {
		title: "Risk Score",
		content:
			"A measure from 0-100 indicating portfolio volatility. Lower scores (0-30) mean conservative/low risk, 30-60 is moderate, and 60-100 is aggressive/high risk.",
	},
	volatility: {
		title: "Volatility",
		content:
			"Measures how much your portfolio's value fluctuates. Higher volatility means greater price swings and potential for both gains and losses.",
	},
	sharpeRatio: {
		title: "Sharpe Ratio",
		content:
			"Risk-adjusted return measure. Values above 1.0 are good, above 2.0 are very good. Negative values indicate returns below the risk-free rate.",
	},
	maxDrawdown: {
		title: "Max Drawdown",
		content:
			"The largest peak-to-trough decline in portfolio value. Shows the worst-case historical loss from any peak.",
	},
	beta: {
		title: "Beta",
		content:
			"Measures portfolio sensitivity to market movements. Beta of 1.0 moves with market, below 1.0 is less volatile, above 1.0 is more volatile.",
	},
	rsi: {
		title: "RSI (Relative Strength Index)",
		content:
			"Momentum indicator (0-100). Below 30 suggests oversold (potential buy), above 70 suggests overbought (potential sell).",
	},
	macd: {
		title: "MACD",
		content:
			"Moving Average Convergence Divergence. Positive values suggest bullish momentum, negative values suggest bearish momentum.",
	},
	sma: {
		title: "SMA (Simple Moving Average)",
		content:
			"Average price over a period. SMA 50 is short-term trend, SMA 200 is long-term trend. Price above SMA is bullish.",
	},
	bollingerBands: {
		title: "Bollinger Bands",
		content:
			"Price channels based on volatility. Price near upper band may be overbought, near lower band may be oversold.",
	},
	support: {
		title: "Support Level",
		content:
			"Price level where buying pressure typically prevents further decline. Good potential entry point.",
	},
	resistance: {
		title: "Resistance Level",
		content:
			"Price level where selling pressure typically prevents further rise. May signal potential profit-taking.",
	},
	dayHighLow: {
		title: "Day High/Low",
		content:
			"The highest and lowest prices the stock traded at during today's session.",
	},
	yearHighLow: {
		title: "52-Week High/Low",
		content:
			"The highest and lowest prices over the past 52 weeks. Useful for understanding the stock's price range.",
	},
	confidence: {
		title: "AI Confidence",
		content:
			"How certain the AI model is about its analysis. Higher percentage means stronger conviction in the signal.",
	},
	sentiment: {
		title: "News Sentiment",
		content:
			"AI analysis of recent news articles. Positive sentiment suggests favorable news coverage.",
	},
};
