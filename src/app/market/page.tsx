"use client";

import { useState, Fragment } from "react";
import { useQuery } from "@tanstack/react-query";
import { api, MarketSector, MARKET_SECTORS } from "@/lib/api";
import { Loading, MarketMovers, MarketIndices } from "@/components/ui";
import { SectorPerformanceChart } from "@/components/charts";
import { formatPercentage, getColorForChange, cn } from "@/lib/utils";
import {
	TrendingUp,
	TrendingDown,
	Activity,
	Globe,
	BarChart3,
	Newspaper,
	RefreshCw,
} from "lucide-react";
import AdvancedMarketTools from "@/components/AdvancedMarketTools";
import dynamic from "next/dynamic";
const GenieChatWidget = dynamic(() => import("@/components/GenieChatWidget"), {
	ssr: false,
});

export default function MarketPage() {
	const [selectedSector, setSelectedSector] =
		useState<MarketSector>("allSec");

	const { data: marketOverview, isLoading } = useQuery({
		queryKey: ["marketOverview"],
		queryFn: () => api.getMarketOverview(),
		refetchInterval: 60000, // Refresh every minute
	});

	// Separate query for top movers with sector filter
	const {
		data: topMovers,
		isLoading: moversLoading,
		refetch: refetchMovers,
	} = useQuery({
		queryKey: ["topMovers", selectedSector],
		queryFn: () => api.getTopMovers(5, selectedSector),
		refetchInterval: 30000, // Refresh every 30 seconds
	});

	const {
		data: newsData,
		isLoading: newsLoading,
		refetch: refetchNews,
	} = useQuery({
		queryKey: ["marketNews"],
		queryFn: () => api.getMarketNews(8),
		refetchInterval: 300000, // Refresh every 5 minutes
	});

	if (isLoading) {
		return <Loading variant="page" text="Loading market data..." />;
	}

	// Use sector performance from API, fallback to sample data
	const sectorData = marketOverview?.sector_performance
		? Object.entries(marketOverview.sector_performance).map(
				([sector, performance]) => ({
					sector,
					performance:
						typeof performance === "number" ? performance : 0,
				}),
			)
		: [
				{ sector: "Technology", performance: 5.2 },
				{ sector: "Banking", performance: 3.8 },
				{ sector: "Energy", performance: -1.5 },
				{ sector: "Healthcare", performance: 2.1 },
				{ sector: "FMCG", performance: 1.8 },
				{ sector: "Auto", performance: -0.5 },
				{ sector: "Infrastructure", performance: 4.2 },
				{ sector: "Metals", performance: -2.3 },
			];

	// Market news from API with fallback
	const marketNews = newsData?.news || [
		{
			title: "Loading market news...",
			source: "Loading",
			time: "...",
			sentiment: "neutral",
		},
	];

	return (
		<Fragment>
			{/* Header */}
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
				<div>
					<h1 className="text-3xl font-bold text-slate-800">
						Market Overview
					</h1>
					<p className="text-slate-500 mt-1">
						Real-time market data and analysis
					</p>
				</div>
				<div className="flex items-center gap-2 text-sm">
					<span
						className={`w-2 h-2 rounded-full ${marketOverview ? "bg-green-500 animate-pulse" : "bg-red-500"}`}
					></span>
					<span className="text-slate-500">
						{marketOverview ? "Live" : "Offline"} • Last updated:{" "}
						{new Date().toLocaleTimeString()}
					</span>
				</div>
			</div>

			{/* Market Indices */}
			<div className="glass-card p-6">
				<h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
					<Activity className="w-5 h-5 text-primary" />
					Major Indices
				</h2>
				<MarketIndices indices={marketOverview?.indices ?? []} />
			</div>

			{/* Sector Tabs for Top Movers */}
			<div className="glass-card p-6">
				<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
					<h2
						className="text-lg font-semibold mb-4 flex items-center gap-2"
						style={{ color: "#1e293b" }} // slate-800
					>
						<Activity className="w-5 h-5 text-primary" />
						Top Movers by Sector
					</h2>
					<button
						onClick={() => refetchMovers()}
						className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
						title="Refresh data"
					>
						<RefreshCw
							className={`w-4 h-4 text-slate-500 ${moversLoading ? "animate-spin" : ""}`}
						/>
					</button>
				</div>
				{/* Horizontally scrollable sector tabs */}
				<div className="overflow-x-auto pb-2 mb-4">
					<div className="flex gap-2 min-w-max">
						{MARKET_SECTORS.map((sector) => (
							<Fragment key={sector.key}>
								{/* Add visual separator between NSE and BSE sections */}
								{sector.key === "BSE_ALL" && (
									<div className="w-px h-8 bg-slate-300 mx-1 self-center" />
								)}
								{sector.key === "NIFTY_IT" && (
									<div className="w-px h-8 bg-slate-300 mx-1 self-center" />
								)}
								{sector.key === "SecGtr20" && (
									<div className="w-px h-8 bg-slate-300 mx-1 self-center" />
								)}
								<button
									onClick={() =>
										setSelectedSector(sector.key)
									}
									className={cn(
										"px-3 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap",
										selectedSector === sector.key
											? sector.key.startsWith("BSE") ||
												sector.key === "SENSEX"
												? "bg-amber-600 text-white shadow-md"
												: "bg-slate-800 text-white shadow-md"
											: sector.key.startsWith("BSE") ||
												  sector.key === "SENSEX"
												? "bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200"
												: "bg-slate-100 text-slate-600 hover:bg-slate-200",
									)}
								>
									{sector.label}
								</button>
							</Fragment>
						))}
					</div>
				</div>

				{/* Market Movers Row */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					{/* Top Gainers */}
					<div className="bg-slate-50 rounded-xl p-4">
						<h3 className="text-md font-semibold text-slate-800 mb-3 flex items-center gap-2">
							<TrendingUp className="w-5 h-5 text-green-600" />
							Top Gainers
						</h3>
						<div className="space-y-2">
							{moversLoading ? (
								<div className="text-center py-8 text-slate-500">
									<RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2" />
									Loading...
								</div>
							) : (
								(topMovers?.gainers ?? [])
									.slice(0, 5)
									.map((stock: any, index: number) => (
										<div
											key={stock.symbol}
											className="flex items-center justify-between p-3 bg-white rounded-lg hover:bg-slate-100 transition-colors cursor-pointer shadow-sm"
											onClick={() =>
												(window.location.href = `/stocks?symbol=${stock.symbol}`)
											}
										>
											<div className="flex items-center gap-3">
												<span className="w-6 h-6 flex items-center justify-center bg-green-100 text-green-600 rounded text-xs font-bold">
													{index + 1}
												</span>
												<div>
													<p className="font-medium text-slate-800">
														{stock.symbol}
													</p>
													<p className="text-sm text-slate-500">
														{stock.name ||
															stock.symbol}
													</p>
												</div>
											</div>
											<div className="text-right">
												<p className="text-slate-800 font-medium">
													₹{stock.price?.toFixed(2)}
												</p>
												<p className="text-green-600 text-sm font-medium">
													{formatPercentage(
														stock.change_percentage,
													)}
												</p>
											</div>
										</div>
									))
							)}
							{!moversLoading &&
								(!topMovers?.gainers ||
									topMovers.gainers.length === 0) && (
									<p className="text-slate-500 text-center py-4">
										No gainers data available
									</p>
								)}
						</div>
					</div>

					{/* Top Losers */}
					<div className="bg-slate-50 rounded-xl p-4">
						<h3 className="text-md font-semibold text-slate-800 mb-3 flex items-center gap-2">
							<TrendingDown className="w-5 h-5 text-red-600" />
							Top Losers
						</h3>
						<div className="space-y-2">
							{moversLoading ? (
								<div className="text-center py-8 text-slate-500">
									<RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2" />
									Loading...
								</div>
							) : (
								(topMovers?.losers ?? [])
									.slice(0, 5)
									.map((stock: any, index: number) => (
										<div
											key={stock.symbol}
											className="flex items-center justify-between p-3 bg-white rounded-lg hover:bg-slate-100 transition-colors cursor-pointer shadow-sm"
											onClick={() =>
												(window.location.href = `/stocks?symbol=${stock.symbol}`)
											}
										>
											<div className="flex items-center gap-3">
												<span className="w-6 h-6 flex items-center justify-center bg-red-100 text-red-600 rounded text-xs font-bold">
													{index + 1}
												</span>
												<div>
													<p className="font-medium text-slate-800">
														{stock.symbol}
													</p>
													<p className="text-sm text-slate-500">
														{stock.name ||
															stock.symbol}
													</p>
												</div>
											</div>
											<div className="text-right">
												<p className="text-slate-800 font-medium">
													₹{stock.price?.toFixed(2)}
												</p>
												<p className="text-red-600 text-sm font-medium">
													{formatPercentage(
														stock.change_percentage,
													)}
												</p>
											</div>
										</div>
									))
							)}
							{!moversLoading &&
								(!topMovers?.losers ||
									topMovers.losers.length === 0) && (
									<p className="text-slate-500 text-center py-4">
										No losers data available
									</p>
								)}
						</div>
					</div>
				</div>
			</div>

			{/* Sector Performance */}
			<div className="glass-card p-6">
				<h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
					<BarChart3 className="w-5 h-5 text-primary" />
					Sector Performance
				</h2>
				<SectorPerformanceChart data={sectorData} />
			</div>

			{/* Market News */}
			<div className="glass-card p-6">
				<div className="flex items-center justify-between mb-4">
					<h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
						<Newspaper className="w-5 h-5 text-primary" />
						Market Headlines
					</h2>
					<button
						onClick={() => refetchNews()}
						className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
						title="Refresh news"
					>
						<RefreshCw
							className={`w-4 h-4 text-slate-500 ${newsLoading ? "animate-spin" : ""}`}
						/>
					</button>
				</div>
				<div className="space-y-4">
					{newsLoading && !newsData ? (
						<div className="text-center py-8 text-slate-500">
							Loading news...
						</div>
					) : marketNews.length === 0 ? (
						<div className="text-center py-8 text-slate-500">
							No news available
						</div>
					) : (
						marketNews.map(
							(
								news: {
									title: string;
									source: string;
									time: string;
									sentiment: string;
									url?: string;
								},
								index: number,
							) => (
								<a
									key={index}
									href={news.url || "#"}
									target="_blank"
									rel="noopener noreferrer"
									className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
								>
									<div
										className={`w-1 h-full min-h-[60px] rounded-full ${
											news.sentiment === "positive"
												? "bg-green-500"
												: news.sentiment === "negative"
													? "bg-red-500"
													: "bg-gray-500"
										}`}
									/>
									<div className="flex-1">
										<h3 className="text-slate-800 font-medium">
											{news.title}
										</h3>
										<div className="flex items-center gap-2 mt-2 text-sm text-slate-500">
											<span>{news.source}</span>
											<span>•</span>
											<span>{news.time}</span>
										</div>
									</div>
									<span
										className={`px-2 py-1 text-xs rounded ${
											news.sentiment === "positive"
												? "bg-green-100 text-green-600"
												: news.sentiment === "negative"
													? "bg-red-100 text-red-600"
													: "bg-slate-200 text-slate-600"
										}`}
									>
										{news.sentiment}
									</span>
								</a>
							),
						)
					)}
				</div>
			</div>

			{/* Market Stats */}
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
				<div className="glass-card p-6 text-center">
					<Globe className="w-8 h-8 text-primary mx-auto mb-2" />
					<p className="text-2xl font-bold text-slate-800">
						{marketOverview?.overall_sentiment?.sentiment ??
							"Neutral"}
					</p>
					<p className="text-sm text-slate-500">Market Sentiment</p>
				</div>
				<div className="glass-card p-6 text-center">
					<TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
					<p className="text-2xl font-bold text-slate-800">
						{marketOverview?.top_gainers?.length ?? 0}
					</p>
					<p className="text-sm text-slate-500">Advancing</p>
				</div>
				<div className="glass-card p-6 text-center">
					<TrendingDown className="w-8 h-8 text-red-600 mx-auto mb-2" />
					<p className="text-2xl font-bold text-slate-800">
						{marketOverview?.top_losers?.length ?? 0}
					</p>
					<p className="text-sm text-slate-500">Declining</p>
				</div>
				<div className="glass-card p-6 text-center">
					<Activity className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
					<p className="text-2xl font-bold text-slate-800">High</p>
					<p className="text-sm text-slate-500">Volatility</p>
				</div>
			</div>

			{/* Advanced Market Tools */}
			<AdvancedMarketTools />

			{/* Floating Genie AI Chatbot */}
			<GenieChatWidget
				onSendMessage={async (message) => {
					// Use a default/anonymous userId for Genie
					const res = await api.sendChatMessage(0, message);
					return res.response || "";
				}}
				suggestions={[
					"Analyze my portfolio",
					"What's my risk level?",
					"Should I buy Infosys?",
					"How is the market today?",
					"Best stocks to buy today",
					"Why is my portfolio risky?",
					"Compare TCS vs Infosys",
					"What should I sell?",
					"Portfolio rebalancing suggestions",
					"Market sentiment analysis",
				]}
			/>
		</Fragment>
	);
}
