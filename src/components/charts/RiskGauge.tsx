"use client";

import React from "react";

interface RiskGaugeProps {
	score: number; // 0 to 1
	level: string;
}

export default function RiskGauge({ score, level }: RiskGaugeProps) {
	const percentage = Math.min(Math.max(score * 100, 0), 100);
	const rotation = (percentage / 100) * 180 - 90;

	const getColor = () => {
		if (percentage < 25) return "#22c55e";
		if (percentage < 50) return "#eab308";
		if (percentage < 75) return "#f97316";
		return "#ef4444";
	};

	const getGradient = () => {
		return `conic-gradient(
      #22c55e 0deg,
      #22c55e 45deg,
      #eab308 45deg,
      #eab308 90deg,
      #f97316 90deg,
      #f97316 135deg,
      #ef4444 135deg,
      #ef4444 180deg,
      transparent 180deg
    )`;
	};

	return (
		<div className="flex flex-col items-center gap-4">
			<div className="relative w-48 h-24 overflow-hidden">
				{/* Background arc */}
				<div
					className="absolute bottom-0 left-0 w-48 h-48 rounded-full"
					style={{
						background: getGradient(),
						opacity: 0.3,
					}}
				/>

				{/* Active arc */}
				<div
					className="absolute bottom-0 left-0 w-48 h-48 rounded-full"
					style={{
						background: getGradient(),
						clipPath: `polygon(0 100%, 50% 50%, 100% 100%, 0 100%)`,
					}}
				/>

				{/* Center cover */}
				<div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-36 h-36 rounded-full bg-white" />

				{/* Needle */}
				<div
					className="absolute bottom-0 left-1/2 origin-bottom transition-transform duration-1000 ease-out"
					style={{
						transform: `translateX(-50%) rotate(${rotation}deg)`,
					}}
				>
					<div
						className="w-1 h-20 rounded-full"
						style={{ background: getColor() }}
					/>
					<div
						className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full"
						style={{ background: getColor() }}
					/>
				</div>

				{/* Labels */}
				<span className="absolute bottom-0 left-2 text-xs text-slate-500">
					Low
				</span>
				<span className="absolute bottom-0 right-2 text-xs text-slate-500">
					High
				</span>
			</div>

			<div className="text-center">
				<p className="text-3xl font-bold text-slate-800">
					{(score * 100).toFixed(0)}%
				</p>
				<p
					className="text-lg font-medium capitalize"
					style={{ color: getColor() }}
				>
					{level}
				</p>
			</div>
		</div>
	);
}
