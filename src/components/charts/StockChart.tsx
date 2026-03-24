"use client";

import React, { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import {
	createChart,
	ColorType,
	CandlestickData,
	Time,
	CandlestickSeries,
	HistogramSeries,
} from "lightweight-charts";
import { api } from "@/lib/api";
import { Loader2, TrendingUp, TrendingDown, BarChart2 } from "lucide-react";

interface StockChartProps {
	symbol: string;
	height?: number;
}

const PERIODS = [
	{ label: "1M", value: "1mo" },
	{ label: "3M", value: "3mo" },
	{ label: "6M", value: "6mo" },
	{ label: "1Y", value: "1y" },
	{ label: "2Y", value: "2y" },
];

export default function StockChart({ symbol, height = 400 }: StockChartProps) {
	const [selectedPeriod, setSelectedPeriod] = useState("3mo");
	const chartContainerRef = useRef<HTMLDivElement>(null);
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const chartRef = useRef<ReturnType<typeof createChart> | null>(null);

	const {
		data: historyData,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["stockHistory", symbol, selectedPeriod],
		queryFn: () => api.getStockHistory(symbol, selectedPeriod),
		enabled: !!symbol,
		staleTime: 5 * 60 * 1000, // 5 minutes
	});

	// Create and update chart
	useEffect(() => {
		if (!chartContainerRef.current || !historyData?.data?.length) return;

		// Remove existing chart
		if (chartRef.current) {
			chartRef.current.remove();
			chartRef.current = null;
		}

		// Create new chart
		const chart = createChart(chartContainerRef.current, {
			layout: {
				background: { type: ColorType.Solid, color: "transparent" },
				textColor: "#64748b",
			},
			grid: {
				vertLines: { color: "#e2e8f0" },
				horzLines: { color: "#e2e8f0" },
			},
			width: chartContainerRef.current.clientWidth,
			height: height - 140,
			crosshair: {
				mode: 1,
			},
			rightPriceScale: {
				borderColor: "#e2e8f0",
			},
			timeScale: {
				borderColor: "#e2e8f0",
				timeVisible: true,
				secondsVisible: false,
			},
		});

		chartRef.current = chart;

		// Add candlestick series using v5 API
		const candlestickSeries = chart.addSeries(CandlestickSeries, {
			upColor: "#22c55e",
			downColor: "#ef4444",
			borderDownColor: "#ef4444",
			borderUpColor: "#22c55e",
			wickDownColor: "#ef4444",
			wickUpColor: "#22c55e",
		});

		// Format data for lightweight-charts
		const chartData: CandlestickData<Time>[] = historyData.data.map(
			(d) => ({
				time: d.date as Time,
				open: d.open,
				high: d.high,
				low: d.low,
				close: d.close,
			}),
		);

		candlestickSeries.setData(chartData);

		// Add volume series using v5 API
		const volumeSeries = chart.addSeries(HistogramSeries, {
			color: "#94a3b8",
			priceFormat: {
				type: "volume",
			},
			priceScaleId: "",
		});

		volumeSeries.priceScale().applyOptions({
			scaleMargins: {
				top: 0.8,
				bottom: 0,
			},
		});

		const volumeData = historyData.data.map((d) => ({
			time: d.date as Time,
			value: d.volume,
			color: d.close >= d.open ? "#22c55e40" : "#ef444440",
		}));

		volumeSeries.setData(volumeData);

		// Fit content
		chart.timeScale().fitContent();

		// Handle resize
		const handleResize = () => {
			if (chartContainerRef.current && chartRef.current) {
				chartRef.current.applyOptions({
					width: chartContainerRef.current.clientWidth,
				});
			}
		};

		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
			if (chartRef.current) {
				chartRef.current.remove();
				chartRef.current = null;
			}
		};
	}, [historyData, height]);

	if (isLoading) {
		return (
			<div
				className="flex items-center justify-center bg-white rounded-xl border border-slate-200"
				style={{ height }}
			>
				<div className="flex flex-col items-center gap-3 text-slate-500">
					<Loader2 className="w-8 h-8 animate-spin text-red-500" />
					<p>Loading chart data...</p>
				</div>
			</div>
		);
	}

	if (error || !historyData?.data?.length) {
		return (
			<div
				className="flex items-center justify-center bg-white rounded-xl border border-slate-200"
				style={{ height }}
			>
				<div className="flex flex-col items-center gap-3 text-slate-500">
					<BarChart2 className="w-12 h-12 text-slate-300" />
					<p>Unable to load chart data for {symbol}</p>
				</div>
			</div>
		);
	}

	const chartData = historyData.data;
	const firstPrice = chartData[0]?.close || 0;
	const lastPrice = chartData[chartData.length - 1]?.close || 0;
	const priceChange = lastPrice - firstPrice;
	const priceChangePercent =
		firstPrice > 0 ? (priceChange / firstPrice) * 100 : 0;
	const isPositive = priceChange >= 0;

	return (
		<div className="bg-white rounded-xl border border-slate-200 p-4">
			{/* Header */}
			<div className="flex items-center justify-between mb-4">
				<div className="flex items-center gap-3">
					<div className="flex items-center gap-2">
						<BarChart2 className="w-5 h-5 text-red-500" />
						<h3 className="text-lg font-semibold text-slate-800">
							{symbol} Price Chart
						</h3>
					</div>
					<div
						className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm ${
							isPositive
								? "bg-green-100 text-green-700"
								: "bg-red-100 text-red-700"
						}`}
					>
						{isPositive ? (
							<TrendingUp className="w-4 h-4" />
						) : (
							<TrendingDown className="w-4 h-4" />
						)}
						<span>{priceChangePercent.toFixed(2)}%</span>
					</div>
				</div>

				{/* Period Selector */}
				<div className="flex gap-1 bg-slate-100 rounded-lg p-1">
					{PERIODS.map((period) => (
						<button
							key={period.value}
							onClick={() => setSelectedPeriod(period.value)}
							className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
								selectedPeriod === period.value
									? "bg-white text-red-600 shadow-sm"
									: "text-slate-600 hover:text-slate-800"
							}`}
						>
							{period.label}
						</button>
					))}
				</div>
			</div>

			{/* Price Info */}
			<div className="flex items-baseline gap-4 mb-4">
				<span className="text-2xl font-bold text-slate-800">
					₹
					{lastPrice.toLocaleString("en-IN", {
						maximumFractionDigits: 2,
					})}
				</span>
				<span
					className={`text-sm font-medium ${
						isPositive ? "text-green-600" : "text-red-600"
					}`}
				>
					{isPositive ? "+" : ""}
					{priceChange.toFixed(2)} ({priceChangePercent.toFixed(2)}%)
				</span>
			</div>

			{/* Chart Container */}
			<div ref={chartContainerRef} className="w-full" />
		</div>
	);
}
