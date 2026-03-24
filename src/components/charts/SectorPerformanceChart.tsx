"use client";

import React from "react";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	Cell,
} from "recharts";
import { getSectorColor } from "@/lib/utils";

interface SectorPerformanceChartProps {
	data: { sector: string; performance: number }[];
}

export default function SectorPerformanceChart({
	data,
}: SectorPerformanceChartProps) {
	// Debug: log the data being received
	console.log("SectorPerformanceChart received data:", data);

	// Handle cases where data is undefined, null, or not an array
	const safeData = Array.isArray(data)
		? data.filter(
				(item) =>
					item &&
					typeof item.sector === "string" &&
					item.sector.length > 0,
			)
		: [];

	console.log("SectorPerformanceChart safeData:", safeData);

	if (safeData.length === 0) {
		return (
			<div className="flex items-center justify-center h-[300px] text-slate-500">
				No sector performance data available
			</div>
		);
	}

	const CustomTooltip = ({ active, payload }: any) => {
		if (active && payload && payload.length) {
			const value = payload[0].value;
			const sectorName = payload[0].payload?.sector || "Unknown";
			return (
				<div className="glass-card p-3 rounded-lg border border-slate-200">
					<p className="text-slate-800 font-medium">{sectorName}</p>
					<p
						className={
							value >= 0 ? "text-green-600" : "text-red-600"
						}
					>
						{value >= 0 ? "+" : ""}
						{value.toFixed(2)}%
					</p>
				</div>
			);
		}
		return null;
	};

	return (
		<div className="h-[300px] w-full">
			<ResponsiveContainer width="100%" height="100%">
				<BarChart
					data={safeData}
					layout="vertical"
					margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
				>
					<CartesianGrid
						strokeDasharray="3 3"
						stroke="rgba(148,163,184,0.2)"
						horizontal={true}
						vertical={false}
					/>
					<XAxis
						type="number"
						axisLine={false}
						tickLine={false}
						tick={{ fill: "#94a3b8", fontSize: 12 }}
						tickFormatter={(value) => `${value}%`}
					/>
					<YAxis
						type="category"
						dataKey="sector"
						axisLine={false}
						tickLine={false}
						tick={{ fill: "#64748b", fontSize: 12 }}
						width={100}
					/>
					<Tooltip content={<CustomTooltip />} />
					<Bar
						dataKey="performance"
						radius={[0, 4, 4, 0]}
						animationDuration={800}
					>
						{safeData.map((entry, index) => (
							<Cell
								key={`cell-${index}`}
								fill={
									entry.performance >= 0
										? "#22c55e"
										: "#ef4444"
								}
							/>
						))}
					</Bar>
				</BarChart>
			</ResponsiveContainer>
		</div>
	);
}
