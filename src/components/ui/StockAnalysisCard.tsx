"use client";

import React from "react";
import {
	TrendingUp,
	TrendingDown,
	Target,
	AlertTriangle,
	BarChart3,
	Activity,
	Gauge,
	ArrowUpDown,
	Calendar,
} from "lucide-react";
import {
	cn,
	formatCurrency,
	formatPercentage,
	getSignalColor,
	getSentimentColor,
} from "@/lib/utils";
import { StockAnalysis, OverallSentiment } from "@/lib/api";
import { TradingViewWidget } from "@/components/charts";
import Tooltip, { FINANCIAL_TOOLTIPS } from "./Tooltip";

interface StockAnalysisCardProps {
	analysis: StockAnalysis;
	sentiment?: OverallSentiment;
}

export default function StockAnalysisCard({
	analysis,
	sentiment,
}: StockAnalysisCardProps) {
	const isPositive =
		analysis.signal === "Buy" || analysis.signal === "Strong Buy";

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="glass-card p-6">
				<div className="flex items-start justify-between mb-4">
					<div>
						<h2 className="text-2xl font-bold text-slate-800">
							{analysis.symbol}
						</h2>
						{analysis.name && (
							<p className="text-slate-500">{analysis.name}</p>
						)}
					</div>
					<div
						className={cn(
							"px-4 py-2 rounded-xl font-medium",
							isPositive
								? "bg-green-100 text-green-600"
								: analysis.signal === "Hold"
									? "bg-yellow-100 text-yellow-600"
									: "bg-red-100 text-red-600",
						)}
					>
						{analysis.signal}
					</div>
				</div>

				<div className="grid sm:grid-cols-3 gap-4">
					<div>
						<p className="text-sm text-slate-500">Current Price</p>
						<p className="text-2xl font-bold text-slate-800">
							{formatCurrency(analysis.current_price)}
						</p>
					</div>
					<div>
						<p className="text-sm text-slate-500">Trend</p>
						<p
							className={cn(
								"text-xl font-medium flex items-center gap-2",
								analysis.trend === "Bullish"
									? "text-green-600"
									: analysis.trend === "Bearish"
										? "text-red-600"
										: "text-slate-500",
							)}
						>
							{analysis.trend === "Bullish" ? (
								<TrendingUp className="w-5 h-5" />
							) : analysis.trend === "Bearish" ? (
								<TrendingDown className="w-5 h-5" />
							) : null}
							{analysis.trend}
						</p>
					</div>
					<div>
						<div className="flex items-center gap-1">
							<p className="text-sm text-slate-500">Confidence</p>
							<Tooltip content={FINANCIAL_TOOLTIPS.confidence} />
						</div>
						<div className="flex items-center gap-2">
							<div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
								<div
									className="h-full bg-gradient-to-r from-red-500 to-amber-500 rounded-full transition-all"
									style={{
										width: `${analysis.confidence * 100}%`,
									}}
								/>
							</div>
							<span className="text-slate-800 font-medium">
								{(analysis.confidence * 100).toFixed(0)}%
							</span>
						</div>
					</div>
				</div>
			</div>

			{/* Day & Year High/Low */}
			<div className="grid sm:grid-cols-2 gap-4">
				<div className="glass-card p-4">
					<div className="flex items-center gap-2 mb-3">
						<ArrowUpDown className="w-4 h-4 text-red-600" />
						<p className="text-sm font-medium text-slate-700">
							Day Range
						</p>
						<Tooltip content={FINANCIAL_TOOLTIPS.dayHighLow} />
					</div>
					<div className="flex justify-between items-center">
						<div>
							<p className="text-xs text-slate-500">Low</p>
							<p className="text-lg font-bold text-red-600">
								{analysis.day_low
									? formatCurrency(analysis.day_low)
									: "N/A"}
							</p>
						</div>
						<div className="flex-1 mx-4 h-2 bg-gradient-to-r from-red-200 via-yellow-200 to-green-200 rounded-full relative">
							{analysis.day_low && analysis.day_high && (
								<div
									className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-red-600 rounded-full border-2 border-white shadow-md"
									style={{
										left: `${((analysis.current_price - analysis.day_low) / (analysis.day_high - analysis.day_low)) * 100}%`,
									}}
								/>
							)}
						</div>
						<div className="text-right">
							<p className="text-xs text-slate-500">High</p>
							<p className="text-lg font-bold text-green-600">
								{analysis.day_high
									? formatCurrency(analysis.day_high)
									: "N/A"}
							</p>
						</div>
					</div>
				</div>
				<div className="glass-card p-4">
					<div className="flex items-center gap-2 mb-3">
						<Calendar className="w-4 h-4 text-amber-500" />
						<p className="text-sm font-medium text-slate-700">
							52-Week Range
						</p>
						<Tooltip content={FINANCIAL_TOOLTIPS.yearHighLow} />
					</div>
					<div className="flex justify-between items-center">
						<div>
							<p className="text-xs text-slate-500">Low</p>
							<p className="text-lg font-bold text-red-600">
								{analysis.year_low
									? formatCurrency(analysis.year_low)
									: "N/A"}
							</p>
						</div>
						<div className="flex-1 mx-4 h-2 bg-gradient-to-r from-red-200 via-yellow-200 to-green-200 rounded-full relative">
							{analysis.year_low && analysis.year_high && (
								<div
									className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-amber-600 rounded-full border-2 border-white shadow-md"
									style={{
										left: `${((analysis.current_price - analysis.year_low) / (analysis.year_high - analysis.year_low)) * 100}%`,
									}}
								/>
							)}
						</div>
						<div className="text-right">
							<p className="text-xs text-slate-500">High</p>
							<p className="text-lg font-bold text-green-600">
								{analysis.year_high
									? formatCurrency(analysis.year_high)
									: "N/A"}
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* TradingView Chart */}
			<div className="glass-card p-6">
				<h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
					<BarChart3 className="w-5 h-5 text-red-600" />
					Price Chart
				</h3>
				<div style={{ height: "500px" }}>
					<TradingViewWidget
						symbol={analysis.symbol}
						height={500}
						autosize={false}
					/>
				</div>
			</div>

			{/* Key Levels */}
			<div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
				<div className="glass-card p-4">
					<div className="flex items-center gap-2 mb-2">
						<Target className="w-4 h-4 text-green-500" />
						<p className="text-sm text-slate-500">Support</p>
						<Tooltip content={FINANCIAL_TOOLTIPS.support} />
					</div>
					<p className="text-xl font-bold text-slate-800">
						{formatCurrency(analysis.support_level)}
					</p>
				</div>
				<div className="glass-card p-4">
					<div className="flex items-center gap-2 mb-2">
						<Target className="w-4 h-4 text-red-500" />
						<p className="text-sm text-slate-500">Resistance</p>
						<Tooltip content={FINANCIAL_TOOLTIPS.resistance} />
					</div>
					<p className="text-xl font-bold text-slate-800">
						{formatCurrency(analysis.resistance_level)}
					</p>
				</div>
				{analysis.target_price && (
					<div className="glass-card p-4">
						<div className="flex items-center gap-2 mb-2">
							<TrendingUp className="w-4 h-4 text-amber-500" />
							<p className="text-sm text-slate-500">Target</p>
						</div>
						<p className="text-xl font-bold text-slate-800">
							{formatCurrency(analysis.target_price)}
						</p>
					</div>
				)}
				{analysis.stop_loss && (
					<div className="glass-card p-4">
						<div className="flex items-center gap-2 mb-2">
							<AlertTriangle className="w-4 h-4 text-yellow-500" />
							<p className="text-sm text-slate-500">Stop Loss</p>
						</div>
						<p className="text-xl font-bold text-slate-800">
							{formatCurrency(analysis.stop_loss)}
						</p>
					</div>
				)}
			</div>

			{/* Technical Indicators */}
			<div className="glass-card p-6">
				<h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
					<BarChart3 className="w-5 h-5 text-red-600" />
					Technical Indicators
				</h3>
				<div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
					<div>
						<div className="flex items-center gap-1 mb-1">
							<p className="text-sm text-slate-500">RSI (14)</p>
							<Tooltip content={FINANCIAL_TOOLTIPS.rsi} />
						</div>
						<div className="flex items-center gap-2">
							<p
								className={cn(
									"text-xl font-bold",
									analysis.technical_indicators.rsi < 30
										? "text-green-600"
										: analysis.technical_indicators.rsi > 70
											? "text-red-600"
											: "text-slate-800",
								)}
							>
								{analysis.technical_indicators.rsi.toFixed(1)}
							</p>
							<span className="text-xs text-slate-500">
								{analysis.technical_indicators.rsi < 30
									? "Oversold"
									: analysis.technical_indicators.rsi > 70
										? "Overbought"
										: "Neutral"}
							</span>
						</div>
					</div>
					<div>
						<div className="flex items-center gap-1 mb-1">
							<p className="text-sm text-slate-500">MACD</p>
							<Tooltip content={FINANCIAL_TOOLTIPS.macd} />
						</div>
						<p
							className={cn(
								"text-xl font-bold",
								analysis.technical_indicators.macd > 0
									? "text-green-600"
									: "text-red-600",
							)}
						>
							{analysis.technical_indicators.macd.toFixed(4)}
						</p>
					</div>
					<div>
						<div className="flex items-center gap-1 mb-1">
							<p className="text-sm text-slate-500">SMA 50</p>
							<Tooltip content={FINANCIAL_TOOLTIPS.sma} />
						</div>
						<p className="text-xl font-bold text-slate-800">
							{formatCurrency(
								analysis.technical_indicators.sma_50,
							)}
						</p>
					</div>
					<div>
						<p className="text-sm text-slate-500 mb-1">SMA 200</p>
						<p className="text-xl font-bold text-slate-800">
							{formatCurrency(
								analysis.technical_indicators.sma_200,
							)}
						</p>
					</div>
				</div>

				<div className="grid sm:grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-200">
					<div>
						<div className="flex items-center gap-1 mb-1">
							<p className="text-sm text-slate-500">
								Bollinger Upper
							</p>
							<Tooltip
								content={FINANCIAL_TOOLTIPS.bollingerBands}
							/>
						</div>
						<p className="text-lg font-medium text-slate-800">
							{formatCurrency(
								analysis.technical_indicators.bollinger_upper,
							)}
						</p>
					</div>
					<div>
						<p className="text-sm text-slate-500 mb-1">
							Bollinger Middle
						</p>
						<p className="text-lg font-medium text-slate-800">
							{formatCurrency(
								analysis.technical_indicators.bollinger_middle,
							)}
						</p>
					</div>
					<div>
						<p className="text-sm text-slate-500 mb-1">
							Bollinger Lower
						</p>
						<p className="text-lg font-medium text-slate-800">
							{formatCurrency(
								analysis.technical_indicators.bollinger_lower,
							)}
						</p>
					</div>
				</div>
			</div>

			{/* Sentiment */}
			{sentiment && (
				<div className="glass-card p-6">
					<h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
						<Activity className="w-5 h-5 text-amber-500" />
						News Sentiment
						<Tooltip content={FINANCIAL_TOOLTIPS.sentiment} />
					</h3>
					<div className="flex items-center gap-6 mb-4">
						<div>
							<p className="text-sm text-slate-500">Overall</p>
							<p
								className={cn(
									"text-xl font-bold",
									getSentimentColor(
										sentiment.overall_sentiment,
									),
								)}
							>
								{sentiment.overall_sentiment}
							</p>
						</div>
						<div>
							<p className="text-sm text-slate-500">Score</p>
							<p className="text-xl font-bold text-slate-800">
								{(sentiment.sentiment_score * 100).toFixed(0)}%
							</p>
						</div>
						<div>
							<p className="text-sm text-slate-500">
								News Analyzed
							</p>
							<p className="text-xl font-bold text-slate-800">
								{sentiment.news_count}
							</p>
						</div>
					</div>

					{sentiment.news_items.length > 0 && (
						<div className="space-y-2">
							<p className="text-sm text-slate-500">
								Recent Headlines
							</p>
							{sentiment.news_items
								.slice(0, 5)
								.map((news, index) => (
									<div
										key={index}
										className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex items-start gap-3"
									>
										<span
											className={cn(
												"px-2 py-0.5 rounded text-xs font-medium",
												news.sentiment === "Positive"
													? "bg-green-100 text-green-600"
													: news.sentiment ===
														  "Negative"
														? "bg-red-100 text-red-600"
														: "bg-slate-200 text-slate-600",
											)}
										>
											{news.sentiment}
										</span>
										<p className="text-sm text-slate-700 flex-1">
											{news.headline}
										</p>
									</div>
								))}
						</div>
					)}
				</div>
			)}

			{/* Analysis Summary */}
			<div className="glass-card p-6">
				<h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
					<Gauge className="w-5 h-5 text-red-600" />
					Analysis Summary
				</h3>
				<p className="text-slate-600 leading-relaxed">
					{analysis.analysis_summary}
				</p>
			</div>
		</div>
	);
}
