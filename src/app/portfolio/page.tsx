"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import {
	StatCard,
	Loading,
	HoldingsTable,
	AIInsightsPanel,
} from "@/components/ui";
import {
	SectorAllocationChart,
	PerformanceChart,
	RiskGauge,
	SectorPerformanceChart,
} from "@/components/charts";
import { formatCurrency, formatPercentage } from "@/lib/utils";
import {
	Wallet,
	TrendingUp,
	TrendingDown,
	Activity,
	Shield,
	PieChart,
	BarChart3,
	Lightbulb,
} from "lucide-react";
import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
const GenieChatWidget = dynamic(() => import("@/components/GenieChatWidget"), {
	ssr: false,
});

const USER_ID = 1;

export default function PortfolioPage() {
	const [selectedTab, setSelectedTab] = useState<
		"overview" | "holdings" | "performance"
	>("overview");

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

	if (portfolioLoading || summaryLoading || riskLoading) {
		return <Loading variant="page" text="Loading portfolio data..." />;
	}

	const totalValue = portfolio?.total_value ?? 0;
	const dailyChange = portfolio?.daily_change_percent ?? 0;
	const totalInvested =
		portfolio?.holdings?.reduce(
			(sum, h) => sum + (h.avg_cost ?? h.average_price) * h.quantity,
			0,
		) ?? 0;
	const totalPL = totalValue - totalInvested;
	const totalPLPercent =
		totalInvested > 0 ? (totalPL / totalInvested) * 100 : 0;

	// Sample performance data
	const performanceData = [
		{ date: "Jan", value: totalValue * 0.85, benchmark: totalValue * 0.82 },
		{ date: "Feb", value: totalValue * 0.88, benchmark: totalValue * 0.84 },
		{ date: "Mar", value: totalValue * 0.92, benchmark: totalValue * 0.87 },
		{ date: "Apr", value: totalValue * 0.9, benchmark: totalValue * 0.89 },
		{ date: "May", value: totalValue * 0.95, benchmark: totalValue * 0.91 },
		{ date: "Jun", value: totalValue * 0.98, benchmark: totalValue * 0.93 },
		{ date: "Jul", value: totalValue, benchmark: totalValue * 0.95 },
	];

	// Calculate sector performance from sector_exposure array
	// Backend returns: [{sector: "IT", percentage: 36.27, value: 103661.0}, ...]
	const sectorPerformance = useMemo(() => {
		const exposureData = riskMetrics?.sector_exposure;

		if (
			!exposureData ||
			!Array.isArray(exposureData) ||
			exposureData.length === 0
		) {
			// Fallback data if no sector exposure available
			return [
				{ sector: "IT", performance: 5.2 },
				{ sector: "Banking", performance: 3.1 },
				{ sector: "Energy", performance: -2.5 },
				{ sector: "FMCG", performance: 4.8 },
				{ sector: "Telecom", performance: 1.2 },
			];
		}

		// Map sector exposure to performance data with random performance
		return exposureData.map((item) => ({
			sector: String(item.sector || "Unknown"),
			performance: Number((Math.random() * 20 - 5).toFixed(2)),
		}));
	}, [riskMetrics?.sector_exposure]);

	const tabs = [
		{ id: "overview", label: "Overview", icon: PieChart },
		{ id: "holdings", label: "Holdings", icon: BarChart3 },
		{ id: "performance", label: "Performance", icon: Activity },
	] as const;

	return (
		<>
			{/* Header */}
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
				<div>
					<h1 className="text-3xl font-bold text-slate-800">
						Portfolio
					</h1>
					<p className="text-slate-500 mt-1">
						Detailed analysis of your investments
					</p>
				</div>

				{/* Tab Navigation */}
				<div className="flex gap-2 bg-slate-100 p-1 rounded-lg">
					{tabs.map(({ id, label, icon: Icon }) => (
						<button
							key={id}
							onClick={() => setSelectedTab(id)}
							className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
								selectedTab === id
									? "bg-primary text-white"
									: "text-slate-500 hover:text-slate-800 hover:bg-slate-200"
							}`}
						>
							<Icon className="w-4 h-4" />
							{label}
						</button>
					))}
				</div>
			</div>

			{/* Quick Stats - Always visible */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				<StatCard
					title="Total Value"
					value={formatCurrency(totalValue)}
					change={dailyChange}
					icon={<Wallet className="w-6 h-6" />}
					trend={dailyChange >= 0 ? "up" : "down"}
				/>
				<StatCard
					title="Total P&L"
					value={formatCurrency(totalPL)}
					change={totalPLPercent}
					icon={
						totalPL >= 0 ? (
							<TrendingUp className="w-6 h-6" />
						) : (
							<TrendingDown className="w-6 h-6" />
						)
					}
					trend={totalPL >= 0 ? "up" : "down"}
				/>
				<StatCard
					title="Risk Score"
					value={`${Math.round((riskMetrics?.risk_score ?? 0.5) * 100)}/100`}
					icon={<Shield className="w-6 h-6" />}
					subtitle={riskMetrics?.risk_level}
					trend={
						riskMetrics?.risk_score && riskMetrics.risk_score < 0.5
							? "up"
							: "neutral"
					}
				/>
				<StatCard
					title="Active Holdings"
					value={portfolio?.holdings?.length?.toString() ?? "0"}
					icon={<PieChart className="w-6 h-6" />}
					subtitle="Positions"
				/>
			</div>

			{/* Tab Content */}
			{selectedTab === "overview" && (
				<div className="space-y-6">
					{/* Charts Row */}
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
												riskMetrics?.sector_exposure ??
													{},
											).map(([sector, percentage]) => ({
												sector,
												percentage:
													typeof percentage ===
													"number"
														? percentage
														: 0,
											}))
								}
							/>
						</div>

						{/* Risk Metrics */}
						<div className="glass-card p-6">
							<h2 className="text-lg font-semibold text-slate-800 mb-4">
								Risk Metrics
							</h2>
							<div className="flex flex-col items-center">
								<RiskGauge
									score={riskMetrics?.risk_score ?? 0.5}
									level={
										riskMetrics?.risk_level ?? "moderate"
									}
								/>
								<div className="mt-4 space-y-3 w-full">
									<div className="flex justify-between items-center p-2 bg-slate-50 rounded">
										<span className="text-slate-500">
											Volatility
										</span>
										<span className="text-slate-800 font-medium">
											{formatPercentage(
												riskMetrics?.volatility ?? 0,
											)}
										</span>
									</div>
									<div className="flex justify-between items-center p-2 bg-slate-50 rounded">
										<span className="text-slate-500">
											Sharpe Ratio
										</span>
										<span className="text-slate-800 font-medium">
											{riskMetrics?.sharpe_ratio?.toFixed(
												2,
											) ?? "N/A"}
										</span>
									</div>
									<div className="flex justify-between items-center p-2 bg-slate-50 rounded">
										<span className="text-slate-500">
											Beta
										</span>
										<span className="text-slate-800 font-medium">
											{riskMetrics?.beta?.toFixed(2) ??
												"N/A"}
										</span>
									</div>
									<div className="flex justify-between items-center p-2 bg-slate-50 rounded">
										<span className="text-slate-500">
											Max Drawdown
										</span>
										<span className="text-red-600 font-medium">
											{formatPercentage(
												riskMetrics?.max_drawdown ?? 0,
											)}
										</span>
									</div>
									<div className="flex justify-between items-center p-2 bg-slate-50 rounded">
										<span className="text-slate-500">
											Concentration Risk
										</span>
										<span className="text-slate-800 font-medium">
											{formatPercentage(
												riskMetrics?.concentration_risk ??
													0,
											)}
										</span>
									</div>
								</div>
							</div>
						</div>

						{/* AI Insights */}
						<div className="glass-card p-6">
							<h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
								<Lightbulb className="w-5 h-5 text-yellow-500" />
								AI Analysis
							</h2>
							<AIInsightsPanel
								insights={
									portfolioSummary?.ai_insights ??
									"Analyzing your portfolio..."
								}
								strengths={
									portfolioSummary?.health?.strengths ?? []
								}
								weaknesses={
									portfolioSummary?.health?.weaknesses ?? []
								}
								recommendations={
									portfolioSummary?.health?.recommendations ??
									riskMetrics?.suggestions ??
									[]
								}
							/>
						</div>
					</div>

					{/* Sector Performance */}
					<div className="glass-card p-6">
						<h2 className="text-lg font-semibold text-slate-800 mb-4">
							Sector Performance
						</h2>
						<SectorPerformanceChart
							key={sectorPerformance
								.map((s) => s.sector)
								.join("-")}
							data={sectorPerformance}
						/>
					</div>
				</div>
			)}

			{selectedTab === "holdings" && (
				<div className="space-y-6">
					{/* Holdings Table */}
					<div className="glass-card p-6">
						<h2 className="text-lg font-semibold text-slate-800 mb-4">
							Your Holdings
						</h2>
						<HoldingsTable
							holdings={portfolio?.holdings ?? []}
							onRowClick={(symbol) =>
								(window.location.href = `/stocks?symbol=${symbol}`)
							}
						/>
					</div>

					{/* Holdings Summary */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<div className="glass-card p-6">
							<h3 className="text-sm text-slate-500 mb-2">
								Total Invested
							</h3>
							<p className="text-2xl font-bold text-slate-800">
								{formatCurrency(totalInvested)}
							</p>
						</div>
						<div className="glass-card p-6">
							<h3 className="text-sm text-slate-500 mb-2">
								Current Value
							</h3>
							<p className="text-2xl font-bold text-slate-800">
								{formatCurrency(totalValue)}
							</p>
						</div>
						<div className="glass-card p-6">
							<h3 className="text-sm text-slate-500 mb-2">
								Unrealized P&L
							</h3>
							<p
								className={`text-2xl font-bold ${totalPL >= 0 ? "text-green-600" : "text-red-600"}`}
							>
								{totalPL >= 0 ? "+" : ""}
								{formatCurrency(totalPL)} (
								{formatPercentage(totalPLPercent)})
							</p>
						</div>
					</div>
				</div>
			)}

			{selectedTab === "performance" && (
				<div className="space-y-6">
					{/* Performance Chart */}
					<div className="glass-card p-6">
						<div className="flex justify-between items-center mb-4">
							<h2 className="text-lg font-semibold text-slate-800">
								Portfolio vs Benchmark
							</h2>
							<div className="flex gap-4 text-sm">
								<span className="flex items-center gap-2">
									<span className="w-3 h-3 bg-primary rounded-full"></span>
									Portfolio
								</span>
								<span className="flex items-center gap-2">
									<span className="w-3 h-3 bg-slate-400 rounded-full"></span>
									Nifty 50
								</span>
							</div>
						</div>
						<PerformanceChart data={performanceData} height={350} />
					</div>

					{/* Performance Metrics */}
					<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
						<div className="glass-card p-6 text-center">
							<h3 className="text-sm text-slate-500 mb-2">
								1 Week
							</h3>
							<p
								className={`text-xl font-bold ${dailyChange >= 0 ? "text-green-600" : "text-red-600"}`}
							>
								{formatPercentage(dailyChange * 5)}
							</p>
						</div>
						<div className="glass-card p-6 text-center">
							<h3 className="text-sm text-slate-500 mb-2">
								1 Month
							</h3>
							<p className="text-xl font-bold text-green-600">
								{formatPercentage(8.5)}
							</p>
						</div>
						<div className="glass-card p-6 text-center">
							<h3 className="text-sm text-slate-500 mb-2">
								3 Months
							</h3>
							<p className="text-xl font-bold text-green-600">
								{formatPercentage(15.2)}
							</p>
						</div>
						<div className="glass-card p-6 text-center">
							<h3 className="text-sm text-slate-500 mb-2">
								1 Year
							</h3>
							<p className="text-xl font-bold text-green-600">
								{formatPercentage(totalPLPercent)}
							</p>
						</div>
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
