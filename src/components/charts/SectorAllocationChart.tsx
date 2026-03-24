"use client";

import React from "react";
import {
	PieChart,
	Pie,
	Cell,
	ResponsiveContainer,
	Legend,
	Tooltip,
} from "recharts";
import { getSectorColor } from "@/lib/utils";

interface SectorAllocationChartProps {
	data: { sector: string; percentage: number }[];
}

export default function SectorAllocationChart({
	data,
}: SectorAllocationChartProps) {
	// Handle cases where data is undefined, null, or not an array
	const safeData = Array.isArray(data) ? data : [];

	const chartData = safeData.map((item) => ({
		name: item.sector,
		value: item.percentage,
		color: getSectorColor(item.sector),
	}));

	if (chartData.length === 0) {
		return (
			<div className="flex items-center justify-center h-64 text-slate-500">
				No sector data available
			</div>
		);
	}

	const CustomTooltip = ({ active, payload }: any) => {
		if (active && payload && payload.length) {
			return (
				<div className="glass-card p-3 rounded-lg border border-slate-200">
					<p className="text-slate-800 font-medium">
						{payload[0].payload.name}
					</p>
					<p className="text-red-600">
						{payload[0].value.toFixed(1)}%
					</p>
				</div>
			);
		}
		return null;
	};

	const renderCustomizedLabel = ({
		cx,
		cy,
		midAngle,
		innerRadius,
		outerRadius,
		percent,
		name,
	}: any) => {
		const RADIAN = Math.PI / 180;
		const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
		const x = cx + radius * Math.cos(-midAngle * RADIAN);
		const y = cy + radius * Math.sin(-midAngle * RADIAN);

		if (percent < 0.08) return null;

		return (
			<text
				x={x}
				y={y}
				fill="white"
				textAnchor={x > cx ? "start" : "end"}
				dominantBaseline="central"
				className="text-xs font-medium"
			>
				{`${(percent * 100).toFixed(0)}%`}
			</text>
		);
	};

	return (
		<div className="h-[300px] w-full">
			<ResponsiveContainer width="100%" height="100%">
				<PieChart>
					<Pie
						data={chartData}
						cx="50%"
						cy="50%"
						labelLine={false}
						label={renderCustomizedLabel}
						outerRadius={100}
						innerRadius={60}
						dataKey="value"
						animationDuration={800}
					>
						{chartData.map((entry, index) => (
							<Cell
								key={`cell-${index}`}
								fill={entry.color}
								strokeWidth={0}
							/>
						))}
					</Pie>
					<Tooltip content={<CustomTooltip />} />
					<Legend
						layout="vertical"
						align="right"
						verticalAlign="middle"
						iconType="circle"
						iconSize={10}
						wrapperStyle={{ paddingLeft: 20 }}
						formatter={(value) => (
							<span className="text-gray-300 text-sm">
								{value}
							</span>
						)}
					/>
				</PieChart>
			</ResponsiveContainer>
		</div>
	);
}
