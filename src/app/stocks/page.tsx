"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Loading, StockAnalysisCard } from "@/components/ui";
import {
	Search,
	TrendingUp,
	TrendingDown,
	BarChart2,
	Clock,
} from "lucide-react";
import dynamic from "next/dynamic";
const GenieChatWidget = dynamic(() => import("@/components/GenieChatWidget"), {
	ssr: false,
});

const POPULAR_STOCKS = [
	"RELIANCE",
	"TCS",
	"HDFCBANK",
	"INFY",
	"ICICIBANK",
	"ITC",
	"SBIN",
	"BHARTIARTL",
	"KOTAKBANK",
	"LT",
	"WIPRO",
	"HCLTECH",
	"MARUTI",
	"BAJFINANCE",
	"TITAN",
	"SUNPHARMA",
	"ASIANPAINT",
	"HINDUNILVR",
	"AXISBANK",
	"ULTRACEMCO",
];

export default function StocksPage() {
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedStock, setSelectedStock] = useState<string | null>(null);
	const [recentSearches, setRecentSearches] = useState<string[]>([]);

	const {
		data: stockAnalysis,
		isLoading: analysisLoading,
		error: analysisError,
	} = useQuery({
		queryKey: ["stockAnalysis", selectedStock],
		queryFn: () => api.getStockAnalysis(selectedStock!),
		enabled: !!selectedStock,
	});

	const { data: stockSentiment, isLoading: sentimentLoading } = useQuery({
		queryKey: ["stockSentiment", selectedStock],
		queryFn: () => api.getStockSentiment(selectedStock!),
		enabled: !!selectedStock,
	});

	const handleSearch = (symbol: string) => {
		const upperSymbol = symbol.toUpperCase().trim();
		if (upperSymbol) {
			setSelectedStock(upperSymbol);
			setRecentSearches((prev) => {
				const filtered = prev.filter((s) => s !== upperSymbol);
				return [upperSymbol, ...filtered].slice(0, 5);
			});
			setSearchQuery("");
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			handleSearch(searchQuery);
		}
	};

	return (
		<>
			{/* Header */}
			<div>
				<h1 className="text-3xl font-bold text-slate-800">
					Stock Analysis
				</h1>
				<p className="text-slate-500 mt-1">
					AI-powered analysis with buy/sell recommendations
				</p>
			</div>

			{/* Search Section */}
			<div className="glass-card p-6">
				<div className="relative">
					<Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
					<input
						type="text"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						onKeyDown={handleKeyDown}
						placeholder="Search for a stock (e.g., RELIANCE, TCS, INFY)..."
						className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
					/>
					<button
						onClick={() => handleSearch(searchQuery)}
						className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-primary text-white rounded-md hover:bg-primary/80 transition-colors"
					>
						Analyze
					</button>
				</div>

				{/* Recent Searches */}
				{recentSearches.length > 0 && (
					<div className="mt-4">
						<div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
							<Clock className="w-4 h-4" />
							Recent
						</div>
						<div className="flex flex-wrap gap-2">
							{recentSearches.map((symbol) => (
								<button
									key={symbol}
									onClick={() => setSelectedStock(symbol)}
									className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
										selectedStock === symbol
											? "bg-primary text-white"
											: "bg-slate-100 text-slate-600 hover:bg-slate-200"
									}`}
								>
									{symbol}
								</button>
							))}
						</div>
					</div>
				)}

				{/* Popular Stocks */}
				<div className="mt-4">
					<div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
						<TrendingUp className="w-4 h-4" />
						Popular Stocks
					</div>
					<div className="flex flex-wrap gap-2">
						{POPULAR_STOCKS.map((symbol) => (
							<button
								key={symbol}
								onClick={() => handleSearch(symbol)}
								className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
									selectedStock === symbol
										? "bg-primary text-white"
										: "bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
								}`}
							>
								{symbol}
							</button>
						))}
					</div>
				</div>
			</div>

			{/* Analysis Results */}
			{selectedStock && (
				<div className="space-y-6">
					{analysisLoading || sentimentLoading ? (
						<Loading
							variant="card"
							text={`Analyzing ${selectedStock}...`}
						/>
					) : analysisError ? (
						<div className="glass-card p-6 border-l-4 border-red-500">
							<h3 className="text-lg font-semibold text-red-600">
								Error
							</h3>
							<p className="text-slate-500 mt-2">
								Could not fetch analysis for {selectedStock}.
								Please check the symbol and try again.
							</p>
						</div>
					) : stockAnalysis ? (
						<StockAnalysisCard
							analysis={stockAnalysis}
							sentiment={stockSentiment}
						/>
					) : null}
				</div>
			)}

			{/* Empty State */}
			{!selectedStock && (
				<div className="glass-card p-12 text-center">
					<BarChart2 className="w-16 h-16 text-slate-400 mx-auto mb-4" />
					<h3 className="text-xl font-semibold text-slate-800 mb-2">
						Search for Any NSE Stock
					</h3>
					<p className="text-slate-500 max-w-md mx-auto mb-4">
						Enter any NSE stock symbol to get AI-powered analysis
						including technical indicators, sentiment analysis, and
						buy/sell recommendations.
					</p>
					<div className="text-sm text-slate-400 bg-slate-50 p-4 rounded-lg max-w-lg mx-auto">
						<p className="font-medium text-slate-600 mb-2">
							Examples of valid stock symbols:
						</p>
						<p>
							TATAMOTORS, ADANIENT, JSWSTEEL, POWERGRID, NTPC,
							ONGC, COALINDIA, BPCL, GRASIM, BAJAJFINSV, TECHM,
							CIPLA, DRREDDY, DIVISLAB, EICHERMOT, HEROMOTOCO,
							M&M, TATASTEEL, VEDL, HINDALCO
						</p>
					</div>
				</div>
			)}

			{/* Stock Comparison (Future Feature) */}
			{selectedStock && stockAnalysis && (
				<div className="glass-card p-6">
					<h2 className="text-lg font-semibold text-slate-800 mb-4">
						Quick Actions
					</h2>
					<div className="flex flex-wrap gap-4">
						<button
							className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
							onClick={() => alert("Feature coming soon!")}
						>
							<TrendingUp className="w-4 h-4" />
							Add to Watchlist
						</button>
						<button
							className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
							onClick={() => alert("Feature coming soon!")}
						>
							<BarChart2 className="w-4 h-4" />
							Compare Stocks
						</button>
						<button
							className="flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-600 rounded-lg hover:bg-amber-200 transition-colors"
							onClick={() => (window.location.href = "/chat")}
						>
							Ask AI About This Stock
						</button>
					</div>
				</div>
			)}
			<GenieChatWidget
				onSendMessage={api.sendChatMessage}
				suggestions={[]}
				fontSize="sm"
				animateFromCorner
			/>
		</>
	);
}
