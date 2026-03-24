import React, { useState } from "react";
import OptionChain from "@/features/OptionChain";
import CorporateActions from "@/features/CorporateActions";
import StockScreener from "@/features/StockScreener";
import InsiderDeals from "@/features/InsiderDeals";
import MarketHeatmap from "@/features/MarketHeatmap";
import FIIDII from "@/features/FIIDII";
import SectorPerformance from "@/features/SectorPerformance";
import NewsSentiment from "@/features/NewsSentiment";
import IPOTracker from "@/features/IPOTracker";
import HistoricalData from "@/features/HistoricalData";
import MarketBreadth from "@/features/MarketBreadth";
import VolumeGainers from "@/features/VolumeGainers";
import AlertsWatchlist from "@/features/AlertsWatchlist";
import PeerComparison from "@/features/PeerComparison";
import EconomicCalendar from "@/features/EconomicCalendar";

const features = [
	{
		key: "option-chain",
		label: "Option Chain Viewer",
		component: <OptionChain />,
	},
	{
		key: "corporate-actions",
		label: "Corporate Actions Calendar",
		component: <CorporateActions />,
	},
	{
		key: "stock-screener",
		label: "Advanced Stock Screener",
		component: <StockScreener />,
	},
	{
		key: "insider-deals",
		label: "Insider & Bulk Deals Tracker",
		component: <InsiderDeals />,
	},
	{
		key: "market-heatmap",
		label: "Market Heatmap",
		component: <MarketHeatmap />,
	},
	{
		key: "fiidii",
		label: "FII/DII Dashboard",
		component: <FIIDII />,
	},
	{
		key: "sector-performance",
		label: "Sector & Thematic Performance",
		component: <SectorPerformance />,
	},
	{
		key: "news-sentiment",
		label: "News & Sentiment Analysis",
		component: <NewsSentiment />,
	},
	{
		key: "ipo-tracker",
		label: "IPO Tracker",
		component: <IPOTracker />,
	},
	{
		key: "historical-data",
		label: "Historical Data Downloader",
		component: <HistoricalData />,
	},
	{
		key: "market-breadth",
		label: "Market Breadth & Advance/Decline",
		component: <MarketBreadth />,
	},
	{
		key: "volume-gainers",
		label: "Gainers/Losers by Volume & Delivery",
		component: <VolumeGainers />,
	},
	{
		key: "alerts-watchlist",
		label: "Alerts & Watchlist",
		component: <AlertsWatchlist />,
	},
	{
		key: "peer-comparison",
		label: "Peer Comparison Tool",
		component: <PeerComparison />,
	},
	{
		key: "economic-calendar",
		label: "Economic Calendar",
		component: <EconomicCalendar />,
	},
];

export default function AdvancedMarketTools() {
	const [selected, setSelected] = useState<string | null>(null);
	return (
		<div className="glass-card p-6 mt-6">
			<h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
				🛠️ Advanced Market Tools
			</h2>
			<div className="flex flex-wrap gap-2 mb-4">
				{features.map((f) => (
					<button
						key={f.key}
						className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${selected === f.key ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
						onClick={() => setSelected(f.key)}
					>
						{f.label}
					</button>
				))}
			</div>
			{selected ? (
				<div className="mt-4">
					{features.find((f) => f.key === selected)?.component}
				</div>
			) : (
				<div className="text-slate-500 text-sm">
					Select a tool above to get started.
				</div>
			)}
		</div>
	);
}
