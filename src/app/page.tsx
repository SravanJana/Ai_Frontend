"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import {
	StatCard,
	Loading,
	AIInsightsPanel,
	MarketMovers,
	MarketIndices,
	Tooltip,
	FINANCIAL_TOOLTIPS,
} from "@/components/ui";
import {
	SectorAllocationChart,
	PerformanceChart,
	RiskGauge,
} from "@/components/charts";
import {
	formatCurrency,
	formatPercentage,
	getColorForChange,
} from "@/lib/utils";
import {
	Wallet,
	TrendingUp,
	Shield,
	PieChart,
	AlertTriangle,
	Lightbulb,
} from "lucide-react";
import dynamic from "next/dynamic";

const USER_ID = 1; // Demo user
const GenieChatWidget = dynamic(() => import("@/components/GenieChatWidget"), {
	ssr: false,
});

export default function DashboardPage() {
	const { data: portfolio, isLoading: portfolioLoading } = useQuery({
		queryKey: ["portfolio", USER_ID],
		queryFn: () => api.getPortfolio(USER_ID),
	});

	const { data: portfolioSummary, isLoading: summaryLoading } = useQuery({
		queryKey: ["portfolioSummary", USER_ID],
		queryFn: () => api.getPortfolioSummary(USER_ID),
	});

	const { data: riskMetrics, isLoading: riskLoading } = useQuery({
		queryKey: ["risk", USER_ID],
		queryFn: () => api.getRiskAnalysis(USER_ID),
	});

	const { data: marketOverview, isLoading: marketLoading } = useQuery({
		queryKey: ["marketOverview"],
		queryFn: () => api.getMarketOverview(),
	});

	if (portfolioLoading || summaryLoading || riskLoading || marketLoading) {
		return <Loading variant="page" text="Loading your dashboard..." />;
	}

	const totalValue = portfolio?.total_value ?? 0;
	const dailyChange = portfolio?.daily_change_percent ?? 0;
	const riskScore = Math.round((riskMetrics?.risk_score ?? 0.5) * 100);

	// Sample performance data for chart
	const performanceData = [
		{ date: "Jan", value: totalValue * 0.85, benchmark: totalValue * 0.82 },
		{ date: "Feb", value: totalValue * 0.88, benchmark: totalValue * 0.84 },
		{ date: "Mar", value: totalValue * 0.92, benchmark: totalValue * 0.87 },
		{ date: "Apr", value: totalValue * 0.9, benchmark: totalValue * 0.89 },
		{ date: "May", value: totalValue * 0.95, benchmark: totalValue * 0.91 },
		{ date: "Jun", value: totalValue * 0.98, benchmark: totalValue * 0.93 },
		{ date: "Jul", value: totalValue, benchmark: totalValue * 0.95 },
	];

	return (
		<>
			{/* Header */}
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
				<div>
					<h1 className="text-3xl font-bold text-slate-800">
						Dashboard
					</h1>
					<p className="text-slate-500 mt-1">
						Welcome back! Here's your portfolio overview.
					</p>
				</div>
				<div className="text-sm text-slate-500">
					Last updated: {new Date().toLocaleTimeString()}
				</div>
			</div>

			{/* Quick Stats */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				<StatCard
					title="Portfolio Value"
					value={formatCurrency(totalValue)}
					change={dailyChange}
					icon={<Wallet className="w-6 h-6" />}
					trend={dailyChange >= 0 ? "up" : "down"}
				/>
				<StatCard
					title="Today's Return"
					value={formatPercentage(dailyChange)}
					icon={<TrendingUp className="w-6 h-6" />}
					trend={dailyChange >= 0 ? "up" : "down"}
				/>
				<StatCard
					title="Risk Score"
					value={`${riskScore}/100`}
					icon={<Shield className="w-6 h-6" />}
					trend={
						riskScore < 50
							? "up"
							: riskScore < 70
								? "neutral"
								: "down"
					}
					subtitle={riskMetrics?.risk_level}
				/>
				<StatCard
					title="Holdings"
					value={portfolio?.holdings?.length?.toString() ?? "0"}
					icon={<PieChart className="w-6 h-6" />}
					subtitle="Active positions"
				/>
			</div>

			{/* Charts Row */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Performance Chart */}
				<div className="lg:col-span-2 glass-card p-6">
					<h2 className="text-lg font-semibold text-slate-800 mb-4">
						Portfolio Performance
					</h2>
					<PerformanceChart data={performanceData} />
				</div>

				{/* Sector Allocation */}
				<div className="glass-card p-6">
					<h2 className="text-lg font-semibold text-slate-800 mb-4">
						Sector Allocation
					</h2>
					<SectorAllocationChart
						data={
							Array.isArray(riskMetrics?.sector_exposure)
								? riskMetrics.sector_exposure
								: Object.entries(
										riskMetrics?.sector_exposure ?? {},
									).map(([sector, percentage]) => ({
										sector,
										percentage:
											typeof percentage === "number"
												? percentage
												: 0,
									}))
						}
					/>
				</div>
			</div>

			{/* Risk & Insights Row */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Risk Gauge */}
				<div className="glass-card p-6 flex flex-col items-center">
					<div className="flex items-center gap-2 mb-4 self-start">
						<h2 className="text-lg font-semibold text-slate-800">
							Risk Analysis
						</h2>
						<Tooltip content={FINANCIAL_TOOLTIPS.riskScore} />
					</div>
					<RiskGauge
						score={riskMetrics?.risk_score ?? 0.5}
						level={riskMetrics?.risk_level ?? "moderate"}
					/>
					<div className="mt-4 space-y-2 w-full">
						<div className="flex justify-between text-sm items-center">
							<span className="text-slate-500 flex items-center gap-1">
								Volatility
								<Tooltip
									content={FINANCIAL_TOOLTIPS.volatility}
								/>
							</span>
							<span className="text-slate-800 font-medium">
								{formatPercentage(riskMetrics?.volatility ?? 0)}
							</span>
						</div>
						<div className="flex justify-between text-sm items-center">
							<span className="text-slate-500 flex items-center gap-1">
								Sharpe Ratio
								<Tooltip
									content={FINANCIAL_TOOLTIPS.sharpeRatio}
								/>
							</span>
							<span className="text-slate-800 font-medium">
								{riskMetrics?.sharpe_ratio?.toFixed(2) ?? "N/A"}
							</span>
						</div>
						<div className="flex justify-between text-sm items-center">
							<span className="text-slate-500 flex items-center gap-1">
								Max Drawdown
								<Tooltip
									content={FINANCIAL_TOOLTIPS.maxDrawdown}
								/>
							</span>
							<span className="text-red-600 font-medium">
								{formatPercentage(
									riskMetrics?.max_drawdown ?? 0,
								)}
							</span>
						</div>
						<div className="flex justify-between text-sm items-center">
							<span className="text-slate-500 flex items-center gap-1">
								Beta
								<Tooltip content={FINANCIAL_TOOLTIPS.beta} />
							</span>
							<span className="text-slate-800 font-medium">
								{riskMetrics?.beta?.toFixed(2) ?? "N/A"}
							</span>
						</div>
					</div>
				</div>

				{/* AI Insights */}
				<div className="lg:col-span-2 glass-card p-6">
					<h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
						<Lightbulb className="w-5 h-5 text-amber-500" />
						AI Insights & Recommendations
					</h2>
					<AIInsightsPanel
						strengths={
							portfolioSummary?.strengths ?? [
								"Diversified portfolio",
								"Good risk-adjusted returns",
							]
						}
						weaknesses={
							portfolioSummary?.weaknesses ?? [
								"High concentration in tech sector",
							]
						}
						suggestions={
							riskMetrics?.suggestions ?? [
								"Consider rebalancing",
								"Review stop-loss levels",
							]
						}
					/>
				</div>
			</div>

			{/* Market Overview */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<div className="glass-card p-6">
					<h2 className="text-lg font-semibold text-slate-800 mb-4">
						Market Movers
					</h2>
					<MarketMovers
						gainers={marketOverview?.top_gainers ?? []}
						losers={marketOverview?.top_losers ?? []}
					/>
				</div>
				<div className="glass-card p-6">
					<h2 className="text-lg font-semibold text-slate-800 mb-4">
						Market Indices
					</h2>
					<MarketIndices indices={marketOverview?.indices ?? []} />
				</div>
			</div>

			{/* Alerts Section */}
			{riskMetrics?.suggestions && riskMetrics.suggestions.length > 0 && (
				<div className="glass-card p-6 border-l-4 border-yellow-500">
					<h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
						<AlertTriangle className="w-5 h-5 text-yellow-400" />
						Action Items
					</h2>
					<ul className="space-y-2">
						{riskMetrics.suggestions
							.slice(0, 3)
							.map((suggestion, index) => (
								<li
									key={index}
									className="flex items-start gap-2 text-gray-300"
								>
									<span className="text-yellow-400 mt-1">
										•
									</span>
									{suggestion}
								</li>
							))}
					</ul>
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
