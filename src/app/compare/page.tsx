"use client";

import React, { useState } from "react";
import Layout from "@/components/Layout";
import {
	ArrowLeftRight,
	Search,
	TrendingUp,
	TrendingDown,
	Minus,
	Trophy,
	AlertCircle,
	Loader2,
	Scale,
	Target,
	BarChart3,
} from "lucide-react";
import { getStockComparison, StockComparison } from "@/lib/api";
import MarkdownRenderer from "@/components/ui/MarkdownRenderer";
import dynamic from "next/dynamic";
const GenieChatWidget = dynamic(() => import("@/components/GenieChatWidget"), {
	ssr: false,
});

const popularStocks = [
	{ symbol: "RELIANCE", name: "Reliance Industries" },
	{ symbol: "TCS", name: "Tata Consultancy" },
	{ symbol: "INFY", name: "Infosys" },
	{ symbol: "HDFCBANK", name: "HDFC Bank" },
	{ symbol: "ICICIBANK", name: "ICICI Bank" },
	{ symbol: "HINDUNILVR", name: "Hindustan Unilever" },
	{ symbol: "ITC", name: "ITC Limited" },
	{ symbol: "SBIN", name: "State Bank of India" },
	{ symbol: "BHARTIARTL", name: "Bharti Airtel" },
	{ symbol: "WIPRO", name: "Wipro" },
];

export default function ComparePage() {
	const [symbol1, setSymbol1] = useState("");
	const [symbol2, setSymbol2] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [comparison, setComparison] = useState<StockComparison | null>(null);
	const [error, setError] = useState<string | null>(null);

	const handleCompare = async () => {
		if (!symbol1.trim() || !symbol2.trim()) {
			setError("Please enter both stock symbols");
			return;
		}

		if (symbol1.toUpperCase() === symbol2.toUpperCase()) {
			setError("Please select different stocks to compare");
			return;
		}

		setIsLoading(true);
		setError(null);
		setComparison(null);

		try {
			const result = await getStockComparison(
				symbol1.toUpperCase(),
				symbol2.toUpperCase(),
			);
			setComparison(result);
		} catch (err: any) {
			setError(
				err?.response?.data?.detail ||
					err?.message ||
					"Failed to compare stocks",
			);
		} finally {
			setIsLoading(false);
		}
	};

	const formatValue = (
		value: number | string | undefined,
		prefix = "",
		suffix = "",
	) => {
		if (value === undefined || value === null) return "N/A";
		if (typeof value === "string") return value;
		if (Math.abs(value) >= 1e12)
			return `${prefix}${(value / 1e12).toFixed(2)}T${suffix}`;
		if (Math.abs(value) >= 1e9)
			return `${prefix}${(value / 1e9).toFixed(2)}B${suffix}`;
		if (Math.abs(value) >= 1e6)
			return `${prefix}${(value / 1e6).toFixed(2)}M${suffix}`;
		if (Math.abs(value) >= 1e3)
			return `${prefix}${(value / 1e3).toFixed(2)}K${suffix}`;
		return `${prefix}${value.toFixed(2)}${suffix}`;
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case "bullish":
			case "positive":
			case "better":
				return "text-green-600";
			case "bearish":
			case "negative":
			case "worse":
				return "text-red-600";
			default:
				return "text-slate-600";
		}
	};

	const getStatusIcon = (status: string) => {
		switch (status) {
			case "bullish":
			case "positive":
			case "better":
				return <TrendingUp className="w-4 h-4 text-green-500" />;
			case "bearish":
			case "negative":
			case "worse":
				return <TrendingDown className="w-4 h-4 text-red-500" />;
			default:
				return <Minus className="w-4 h-4 text-slate-400" />;
		}
	};

	const handleQuickSelect = (symbol: string, position: 1 | 2) => {
		if (position === 1) {
			setSymbol1(symbol);
		} else {
			setSymbol2(symbol);
		}
	};

	return (
		<Layout>
			<div className="space-y-6">
				{/* Header */}
				<div className="flex items-center gap-4">
					<div className="p-3 rounded-xl bg-gradient-to-r from-red-500 to-amber-500">
						<Scale className="w-8 h-8 text-white" />
					</div>
					<div>
						<h1 className="text-2xl font-bold text-slate-800">
							Stock Comparison
						</h1>
						<p className="text-slate-500">
							Compare two stocks side by side with AI analysis
						</p>
					</div>
				</div>

				{/* Input Section */}
				<div className="glass-card p-6">
					<div className="flex flex-col md:flex-row items-center gap-4">
						{/* Stock 1 Input */}
						<div className="flex-1 w-full">
							<label className="block text-sm font-medium text-slate-700 mb-2">
								First Stock
							</label>
							<div className="relative">
								<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
								<input
									type="text"
									value={symbol1}
									onChange={(e) =>
										setSymbol1(e.target.value.toUpperCase())
									}
									placeholder="e.g., RELIANCE"
									className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
								/>
							</div>
							<div className="flex flex-wrap gap-2 mt-2">
								{popularStocks.slice(0, 5).map((stock) => (
									<button
										key={stock.symbol}
										onClick={() =>
											handleQuickSelect(stock.symbol, 1)
										}
										className={`px-2 py-1 text-xs rounded-lg transition-colors ${symbol1 === stock.symbol ? "bg-red-500 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
									>
										{stock.symbol}
									</button>
								))}
							</div>
						</div>

						{/* VS Divider */}
						<div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-red-500 to-amber-500 text-white font-bold text-lg shadow-lg">
							VS
						</div>

						{/* Stock 2 Input */}
						<div className="flex-1 w-full">
							<label className="block text-sm font-medium text-slate-700 mb-2">
								Second Stock
							</label>
							<div className="relative">
								<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
								<input
									type="text"
									value={symbol2}
									onChange={(e) =>
										setSymbol2(e.target.value.toUpperCase())
									}
									placeholder="e.g., TCS"
									className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
								/>
							</div>
							<div className="flex flex-wrap gap-2 mt-2">
								{popularStocks.slice(5, 10).map((stock) => (
									<button
										key={stock.symbol}
										onClick={() =>
											handleQuickSelect(stock.symbol, 2)
										}
										className={`px-2 py-1 text-xs rounded-lg transition-colors ${symbol2 === stock.symbol ? "bg-red-500 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
									>
										{stock.symbol}
									</button>
								))}
							</div>
						</div>
					</div>

					{/* Compare Button */}
					<button
						onClick={handleCompare}
						disabled={isLoading}
						className="mt-6 w-full btn-primary py-3 flex items-center justify-center gap-2"
					>
						{isLoading ? (
							<>
								<Loader2 className="w-5 h-5 animate-spin" />
								Comparing stocks...
							</>
						) : (
							<>
								<ArrowLeftRight className="w-5 h-5" />
								Compare Stocks
							</>
						)}
					</button>

					{/* Error Message */}
					{error && (
						<div className="mt-4 p-4 rounded-xl bg-red-50 border border-red-200 flex items-center gap-3">
							<AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
							<p className="text-sm text-red-700">{error}</p>
						</div>
					)}
				</div>

				{/* Comparison Results */}
				{comparison && (
					<div className="space-y-6">
						{/* Winner Banner */}
						{comparison.winner && (
							<div className="glass-card p-6 bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200">
								<div className="flex items-center justify-center gap-4">
									<Trophy className="w-10 h-10 text-amber-500" />
									<div className="text-center">
										<p className="text-sm text-amber-600 font-medium">
											Overall Winner
										</p>
										<p className="text-2xl font-bold text-amber-700">
											{comparison.winner}
										</p>
									</div>
								</div>
							</div>
						)}

						{/* Side by Side Comparison */}
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
							{comparison.stocks.map((stock, index) => (
								<div
									key={stock.symbol}
									className={`glass-card p-6 ${comparison.winner === stock.symbol ? "ring-2 ring-amber-400" : ""}`}
								>
									{/* Stock Header */}
									<div className="flex items-center justify-between mb-6">
										<div>
											<h3 className="text-xl font-bold text-slate-800">
												{stock.symbol}
											</h3>
											<p className="text-sm text-slate-500">
												{stock.name}
											</p>
										</div>
										{comparison.winner === stock.symbol && (
											<div className="p-2 rounded-full bg-amber-100">
												<Trophy className="w-5 h-5 text-amber-500" />
											</div>
										)}
									</div>

									{/* Price Info */}
									<div className="mb-6">
										<p className="text-3xl font-bold text-slate-800">
											₹{stock.price?.toFixed(2) || "N/A"}
										</p>
										<p
											className={`text-sm font-medium ${(stock.change_percent || 0) >= 0 ? "text-green-600" : "text-red-600"}`}
										>
											{(stock.change_percent || 0) >= 0
												? "+"
												: ""}
											{stock.change_percent?.toFixed(2)}%
											today
										</p>
									</div>

									{/* Key Metrics */}
									<div className="grid grid-cols-2 gap-4">
										<div className="p-3 bg-slate-50 rounded-lg">
											<p className="text-xs text-slate-500 uppercase">
												Market Cap
											</p>
											<p className="font-semibold text-slate-800">
												{formatValue(stock.market_cap)}
											</p>
										</div>
										<div className="p-3 bg-slate-50 rounded-lg">
											<p className="text-xs text-slate-500 uppercase">
												P/E Ratio
											</p>
											<p className="font-semibold text-slate-800">
												{stock.pe_ratio?.toFixed(2) ||
													"N/A"}
											</p>
										</div>
										<div className="p-3 bg-slate-50 rounded-lg">
											<p className="text-xs text-slate-500 uppercase">
												52W High
											</p>
											<p className="font-semibold text-green-600">
												₹
												{stock.year_high?.toFixed(2) ||
													"N/A"}
											</p>
										</div>
										<div className="p-3 bg-slate-50 rounded-lg">
											<p className="text-xs text-slate-500 uppercase">
												52W Low
											</p>
											<p className="font-semibold text-red-600">
												₹
												{stock.year_low?.toFixed(2) ||
													"N/A"}
											</p>
										</div>
										<div className="p-3 bg-slate-50 rounded-lg">
											<p className="text-xs text-slate-500 uppercase">
												Volume
											</p>
											<p className="font-semibold text-slate-800">
												{formatValue(stock.volume)}
											</p>
										</div>
										<div className="p-3 bg-slate-50 rounded-lg">
											<p className="text-xs text-slate-500 uppercase">
												Avg Volume
											</p>
											<p className="font-semibold text-slate-800">
												{formatValue(stock.avg_volume)}
											</p>
										</div>
									</div>

									{/* Technical Indicators */}
									{stock.technical_indicators && (
										<div className="mt-4 p-4 bg-red-50 rounded-xl">
											<h4 className="text-sm font-semibold text-red-800 mb-3 flex items-center gap-2">
												<BarChart3 className="w-4 h-4" />
												Technical Indicators
											</h4>
											<div className="grid grid-cols-2 gap-3 text-sm">
												{stock.technical_indicators
													.rsi !== undefined && (
													<div className="flex justify-between">
														<span className="text-slate-600">
															RSI (14)
														</span>
														<span
															className={`font-medium ${
																stock
																	.technical_indicators
																	.rsi > 70
																	? "text-red-600"
																	: stock
																				.technical_indicators
																				.rsi <
																		  30
																		? "text-green-600"
																		: "text-slate-800"
															}`}
														>
															{stock.technical_indicators.rsi.toFixed(
																2,
															)}
														</span>
													</div>
												)}
												{stock.technical_indicators
													.sma_20 !== undefined && (
													<div className="flex justify-between">
														<span className="text-slate-600">
															SMA 20
														</span>
														<span className="font-medium text-slate-800">
															₹
															{stock.technical_indicators.sma_20.toFixed(
																2,
															)}
														</span>
													</div>
												)}
												{stock.technical_indicators
													.sma_50 !== undefined && (
													<div className="flex justify-between">
														<span className="text-slate-600">
															SMA 50
														</span>
														<span className="font-medium text-slate-800">
															₹
															{stock.technical_indicators.sma_50.toFixed(
																2,
															)}
														</span>
													</div>
												)}
												{stock.technical_indicators
													.macd !== undefined && (
													<div className="flex justify-between">
														<span className="text-slate-600">
															MACD
														</span>
														<span
															className={`font-medium ${stock.technical_indicators.macd >= 0 ? "text-green-600" : "text-red-600"}`}
														>
															{stock.technical_indicators.macd.toFixed(
																2,
															)}
														</span>
													</div>
												)}
											</div>
										</div>
									)}
								</div>
							))}
						</div>

						{/* Comparison Metrics */}
						{comparison.comparison_metrics &&
							comparison.comparison_metrics.length > 0 && (
								<div className="glass-card p-6">
									<h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
										<Target className="w-5 h-5 text-red-500" />
										Comparison Metrics
									</h3>
									<div className="overflow-x-auto">
										<table className="w-full">
											<thead>
												<tr className="border-b border-slate-200">
													<th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">
														Metric
													</th>
													<th className="text-center py-3 px-4 text-sm font-semibold text-slate-600">
														{comparison.stocks[0]
															?.symbol ||
															"Stock 1"}
													</th>
													<th className="text-center py-3 px-4 text-sm font-semibold text-slate-600">
														{comparison.stocks[1]
															?.symbol ||
															"Stock 2"}
													</th>
													<th className="text-center py-3 px-4 text-sm font-semibold text-slate-600">
														Winner
													</th>
												</tr>
											</thead>
											<tbody>
												{comparison.comparison_metrics.map(
													(metric, idx) => (
														<tr
															key={idx}
															className="border-b border-slate-100 hover:bg-slate-50"
														>
															<td className="py-3 px-4 font-medium text-slate-700">
																{metric.metric}
															</td>
															<td className="text-center py-3 px-4">
																<div className="flex items-center justify-center gap-2">
																	{getStatusIcon(
																		metric.stock1_status,
																	)}
																	<span
																		className={getStatusColor(
																			metric.stock1_status,
																		)}
																	>
																		{
																			metric.stock1_value
																		}
																	</span>
																</div>
															</td>
															<td className="text-center py-3 px-4">
																<div className="flex items-center justify-center gap-2">
																	{getStatusIcon(
																		metric.stock2_status,
																	)}
																	<span
																		className={getStatusColor(
																			metric.stock2_status,
																		)}
																	>
																		{
																			metric.stock2_value
																		}
																	</span>
																</div>
															</td>
															<td className="text-center py-3 px-4">
																<span className="px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
																	{
																		metric.winner
																	}
																</span>
															</td>
														</tr>
													),
												)}
											</tbody>
										</table>
									</div>
								</div>
							)}

						{/* AI Recommendation */}
						{comparison.recommendation && (
							<div className="glass-card p-6">
								<h3 className="text-lg font-semibold text-slate-800 mb-4">
									AI Recommendation
								</h3>
								<div className="prose prose-slate max-w-none">
									<MarkdownRenderer
										content={comparison.recommendation}
									/>
								</div>
							</div>
						)}
					</div>
				)}

				{/* No Comparison Yet */}
				{!comparison && !isLoading && (
					<div className="glass-card p-12 text-center">
						<ArrowLeftRight className="w-16 h-16 text-slate-300 mx-auto mb-4" />
						<h3 className="text-lg font-medium text-slate-700">
							Ready to Compare
						</h3>
						<p className="text-slate-500 mt-2">
							Enter two stock symbols above and click compare to
							see detailed analysis
						</p>
					</div>
				)}
			</div>
		</Layout>
	);
}
