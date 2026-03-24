"use client";

import React from "react";
import {
	Bot,
	Sparkles,
	AlertTriangle,
	CheckCircle,
	XCircle,
	Lightbulb,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AIInsightsPanelProps {
	insights?: string;
	recommendations?: string[];
	suggestions?: string[];
	strengths?: string[];
	weaknesses?: string[];
}

export default function AIInsightsPanel({
	insights,
	recommendations,
	suggestions,
	strengths,
	weaknesses,
}: AIInsightsPanelProps) {
	// Use suggestions as fallback for recommendations
	const actionItems = recommendations || suggestions || [];

	// Auto-generate insights if not provided
	const displayInsights =
		insights ||
		(strengths && weaknesses
			? `Based on your portfolio analysis, we've identified ${strengths.length} strengths and ${weaknesses.length} areas for improvement. Review the details below for actionable recommendations.`
			: "Your portfolio is being analyzed. Check back for personalized insights and recommendations.");

	return (
		<div className="space-y-5">
			{/* Main Insights */}
			<div className="p-4 rounded-xl bg-gradient-to-r from-red-50 to-amber-50 border border-red-200">
				<div className="flex items-start gap-3">
					<div className="p-2 rounded-lg bg-gradient-to-r from-red-600 to-red-700 flex-shrink-0">
						<Sparkles className="w-4 h-4 text-white" />
					</div>
					<p className="text-slate-700 leading-relaxed">
						{displayInsights}
					</p>
				</div>
			</div>

			{/* Strengths */}
			{strengths && strengths.length > 0 && (
				<div>
					<h4 className="text-sm font-medium text-green-600 mb-3 flex items-center gap-2">
						<CheckCircle className="w-4 h-4" />
						Portfolio Strengths
					</h4>
					<ul className="space-y-2">
						{strengths.map((strength, index) => (
							<li
								key={index}
								className="flex items-start gap-2 text-sm text-slate-600 p-2 rounded-lg bg-green-50 border border-green-100"
							>
								<span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0" />
								{strength}
							</li>
						))}
					</ul>
				</div>
			)}

			{/* Weaknesses */}
			{weaknesses && weaknesses.length > 0 && (
				<div>
					<h4 className="text-sm font-medium text-red-600 mb-3 flex items-center gap-2">
						<XCircle className="w-4 h-4" />
						Areas of Concern
					</h4>
					<ul className="space-y-2">
						{weaknesses.map((weakness, index) => (
							<li
								key={index}
								className="flex items-start gap-2 text-sm text-slate-600 p-2 rounded-lg bg-red-50 border border-red-100"
							>
								<span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 flex-shrink-0" />
								{weakness}
							</li>
						))}
					</ul>
				</div>
			)}

			{/* Recommendations/Suggestions */}
			{actionItems.length > 0 && (
				<div>
					<h4 className="text-sm font-medium text-amber-600 mb-3 flex items-center gap-2">
						<Lightbulb className="w-4 h-4" />
						Recommendations
					</h4>
					<ul className="space-y-2">
						{actionItems.map((rec, index) => (
							<li
								key={index}
								className="flex items-start gap-2 text-sm text-slate-600 p-3 rounded-lg bg-amber-50 border border-amber-100"
							>
								<span className="text-amber-600 font-medium flex-shrink-0">
									{index + 1}.
								</span>
								{rec}
							</li>
						))}
					</ul>
				</div>
			)}

			{/* Empty state */}
			{!strengths?.length &&
				!weaknesses?.length &&
				!actionItems.length && (
					<div className="text-center py-4 text-slate-500">
						<Bot className="w-8 h-8 mx-auto mb-2 text-slate-400" />
						<p className="text-sm">
							AI analysis will appear here once your portfolio
							data is loaded.
						</p>
					</div>
				)}
		</div>
	);
}
