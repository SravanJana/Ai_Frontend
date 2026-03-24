"use client";

import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import {
	cn,
	formatCurrency,
	formatPercentage,
	getColorForChange,
} from "@/lib/utils";

interface StatCardProps {
	title: string;
	value: string | number;
	change?: number;
	changeLabel?: string;
	icon?: React.ReactNode;
	format?: "currency" | "percentage" | "number";
	className?: string;
	trend?: "up" | "down" | "neutral";
	subtitle?: string;
}

export default function StatCard({
	title,
	value,
	change,
	changeLabel,
	icon,
	format = "number",
	className,
	trend,
	subtitle,
}: StatCardProps) {
	const formattedValue =
		typeof value === "number"
			? format === "currency"
				? formatCurrency(value)
				: format === "percentage"
					? formatPercentage(value, false)
					: value.toLocaleString("en-IN", {
							minimumFractionDigits: 2,
							maximumFractionDigits: 2,
						})
			: value;

	const ChangeIcon =
		change !== undefined
			? change > 0
				? TrendingUp
				: change < 0
					? TrendingDown
					: Minus
			: null;

	return (
		<div className={cn("glass-card-hover p-6", className)}>
			<div className="flex items-start justify-between">
				<div className="flex-1">
					<p className="text-sm text-slate-500 mb-1">{title}</p>
					<p className="text-2xl lg:text-3xl font-bold text-slate-800">
						{formattedValue}
					</p>
					{change !== undefined && (
						<div
							className={cn(
								"flex items-center gap-1 mt-2",
								getColorForChange(change),
							)}
						>
							{ChangeIcon && <ChangeIcon className="w-4 h-4" />}
							<span className="text-sm font-medium">
								{formatPercentage(change)}
							</span>
							{changeLabel && (
								<span className="text-slate-500 text-sm ml-1">
									{changeLabel}
								</span>
							)}
						</div>
					)}
					{subtitle && (
						<p className="text-sm text-slate-500 mt-1">
							{subtitle}
						</p>
					)}
				</div>
				{icon && (
					<div className="p-3 rounded-xl bg-gradient-to-r from-red-100 to-amber-50 text-red-600">
						{icon}
					</div>
				)}
			</div>
		</div>
	);
}
