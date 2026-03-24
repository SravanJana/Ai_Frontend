"use client";

import React from "react";
import {
	AreaChart,
	Area,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from "recharts";
import { formatCurrency } from "@/lib/utils";

interface PerformanceChartProps {
	data: { date: string; value: number; benchmark?: number }[];
	color?: string;
	height?: number;
}

export default function PerformanceChart({
	data,
	color = "#3b82f6",
	height = 300,
}: PerformanceChartProps) {
	// Handle cases where data is undefined, null, or not an array
	const safeData = Array.isArray(data) ? data : [];

	if (safeData.length === 0) {
		return (
			<div
				className={`flex items-center justify-center h-[${height}px] text-slate-500`}
			>
				No performance data available
			</div>
		);
	}

	const CustomTooltip = ({ active, payload, label }: any) => {
		if (active && payload && payload.length) {
			return (
				<div className="glass-card p-3 rounded-lg border border-slate-200">
					<p className="text-slate-500 text-sm">{label}</p>
					<p className="text-slate-800 font-medium">
						{formatCurrency(payload[0].value)}
					</p>
				</div>
			);
		}
		return null;
	};

	return (
		<div style={{ height: `${height}px` }} className="w-full">
			<ResponsiveContainer width="100%" height="100%">
				<AreaChart
					data={safeData}
					margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
				>
					<defs>
						<linearGradient
							id="colorValue"
							x1="0"
							y1="0"
							x2="0"
							y2="1"
						>
							<stop
								offset="5%"
								stopColor={color}
								stopOpacity={0.4}
							/>
							<stop
								offset="95%"
								stopColor={color}
								stopOpacity={0}
							/>
						</linearGradient>
					</defs>
					<CartesianGrid
						strokeDasharray="3 3"
						stroke="rgba(148,163,184,0.2)"
					/>
					<XAxis
						dataKey="date"
						axisLine={false}
						tickLine={false}
						tick={{ fill: "#94a3b8", fontSize: 12 }}
					/>
					<YAxis
						axisLine={false}
						tickLine={false}
						tick={{ fill: "#94a3b8", fontSize: 12 }}
						tickFormatter={(value) =>
							`₹${(value / 1000).toFixed(0)}K`
						}
					/>
					<Tooltip content={<CustomTooltip />} />
					<Area
						type="monotone"
						dataKey="value"
						stroke={color}
						strokeWidth={2}
						fillOpacity={1}
						fill="url(#colorValue)"
						animationDuration={800}
					/>
				</AreaChart>
			</ResponsiveContainer>
		</div>
	);
}
