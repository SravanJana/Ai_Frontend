import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function formatCurrency(
	value: number,
	currency: string = "INR",
): string {
	return new Intl.NumberFormat("en-IN", {
		style: "currency",
		currency: currency,
		minimumFractionDigits: 0,
		maximumFractionDigits: 2,
	}).format(value);
}

export function formatNumber(value: number, decimals: number = 2): string {
	return new Intl.NumberFormat("en-IN", {
		minimumFractionDigits: decimals,
		maximumFractionDigits: decimals,
	}).format(value);
}

export function formatPercentage(
	value: number,
	showSign: boolean = true,
): string {
	// Handle NaN, undefined, null, or invalid values
	if (
		value === null ||
		value === undefined ||
		Number.isNaN(value) ||
		!Number.isFinite(value)
	) {
		return "0.00%";
	}
	const formatted = Math.abs(value).toFixed(2);
	if (showSign) {
		return value >= 0 ? `+${formatted}%` : `-${formatted}%`;
	}
	return `${formatted}%`;
}

export function formatLargeNumber(value: number): string {
	if (value >= 10000000) {
		return `${(value / 10000000).toFixed(2)} Cr`;
	} else if (value >= 100000) {
		return `${(value / 100000).toFixed(2)} L`;
	} else if (value >= 1000) {
		return `${(value / 1000).toFixed(2)} K`;
	}
	return value.toFixed(2);
}

export function getColorForChange(change: number): string {
	if (change > 0) return "text-green-400";
	if (change < 0) return "text-red-400";
	return "text-gray-400";
}

export function getBgColorForChange(change: number): string {
	if (change > 0) return "bg-green-500/20";
	if (change < 0) return "bg-red-500/20";
	return "bg-gray-500/20";
}

export function getRiskLevelColor(level: string): string {
	switch (level.toLowerCase()) {
		case "low":
			return "text-green-400";
		case "moderate":
			return "text-yellow-400";
		case "high":
			return "text-orange-400";
		case "very high":
			return "text-red-400";
		default:
			return "text-gray-400";
	}
}

export function getSignalColor(signal: string): string {
	switch (signal.toLowerCase()) {
		case "strong buy":
		case "buy":
			return "text-green-400";
		case "hold":
			return "text-yellow-400";
		case "sell":
		case "strong sell":
			return "text-red-400";
		default:
			return "text-gray-400";
	}
}

export function getSentimentColor(sentiment: string): string {
	switch (sentiment.toLowerCase()) {
		case "positive":
			return "text-green-400";
		case "negative":
			return "text-red-400";
		case "neutral":
			return "text-gray-400";
		default:
			return "text-gray-400";
	}
}

export function getTrendIcon(trend: string): string {
	switch (trend.toLowerCase()) {
		case "bullish":
			return "📈";
		case "bearish":
			return "📉";
		default:
			return "➡️";
	}
}

export function calculateHealthScoreGradient(score: number): string {
	if (score >= 80) return "from-green-500 to-emerald-500";
	if (score >= 60) return "from-yellow-500 to-green-500";
	if (score >= 40) return "from-orange-500 to-yellow-500";
	return "from-red-500 to-orange-500";
}

export const SECTOR_COLORS: Record<string, string> = {
	IT: "#3b82f6",
	Banking: "#22c55e",
	FMCG: "#f59e0b",
	Energy: "#ef4444",
	Pharma: "#8b5cf6",
	Automobile: "#14b8a6",
	Telecom: "#ec4899",
	"Financial Services": "#06b6d4",
	Infrastructure: "#84cc16",
	"Consumer Goods": "#f97316",
	Cement: "#6366f1",
	Other: "#64748b",
};

export function getSectorColor(sector: string): string {
	return SECTOR_COLORS[sector] || SECTOR_COLORS["Other"];
}
