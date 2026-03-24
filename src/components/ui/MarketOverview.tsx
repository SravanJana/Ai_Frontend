"use client";

import React from "react";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";
import {
	cn,
	formatNumber,
	formatPercentage,
	getColorForChange,
} from "@/lib/utils";
import { StockMover, MarketIndex } from "@/lib/api";

interface MarketMoversProps {
	gainers: StockMover[];
	losers: StockMover[];
}

export function MarketMovers({ gainers, losers }: MarketMoversProps) {
	const MoverItem = ({
		mover,
		isGainer,
	}: {
		mover: StockMover;
		isGainer: boolean;
	}) => (
		<div className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
			<div className="flex items-center gap-3">
				<div
					className={cn(
						"w-8 h-8 rounded-lg flex items-center justify-center",
						isGainer ? "bg-green-100" : "bg-red-100",
					)}
				>
					{isGainer ? (
						<TrendingUp className="w-4 h-4 text-green-600" />
					) : (
						<TrendingDown className="w-4 h-4 text-red-600" />
					)}
				</div>
				<div>
					<p className="font-medium text-slate-800">{mover.symbol}</p>
					<p className="text-xs text-slate-500">
						₹{formatNumber(mover.price)}
					</p>
				</div>
			</div>
			<div
				className={cn(
					"text-right",
					isGainer ? "text-green-600" : "text-red-600",
				)}
			>
				<p className="font-medium">
					{formatPercentage(mover.change_percentage)}
				</p>
				<p className="text-xs">
					₹{formatNumber(Math.abs(mover.change))}
				</p>
			</div>
		</div>
	);

	return (
		<div className="grid lg:grid-cols-2 gap-6">
			{/* Top Gainers */}
			<div className="glass-card p-6">
				<div className="flex items-center gap-2 mb-4">
					<TrendingUp className="w-5 h-5 text-green-600" />
					<h3 className="text-lg font-semibold text-slate-800">
						Top Gainers
					</h3>
				</div>
				<div className="space-y-1">
					{gainers.map((mover) => (
						<MoverItem
							key={mover.symbol}
							mover={mover}
							isGainer={true}
						/>
					))}
				</div>
			</div>

			{/* Top Losers */}
			<div className="glass-card p-6">
				<div className="flex items-center gap-2 mb-4">
					<TrendingDown className="w-5 h-5 text-red-600" />
					<h3 className="text-lg font-semibold text-slate-800">
						Top Losers
					</h3>
				</div>
				<div className="space-y-1">
					{losers.map((mover) => (
						<MoverItem
							key={mover.symbol}
							mover={mover}
							isGainer={false}
						/>
					))}
				</div>
			</div>
		</div>
	);
}

interface MarketIndicesProps {
	indices: MarketIndex[];
}

export function MarketIndices({ indices }: MarketIndicesProps) {
	// Ensure indices is an array
	const indicesArray = Array.isArray(indices) ? indices : [];

	if (indicesArray.length === 0) {
		return (
			<div className="text-center text-slate-500 py-4">
				No market indices available
			</div>
		);
	}

	return (
		<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
			{indicesArray.map((index) => {
				const isPositive = index.change >= 0;
				return (
					<div
						key={index.symbol}
						className="glass-card-hover p-4 text-center"
					>
						<div className="flex items-center justify-center gap-2 mb-2">
							<div
								className={cn(
									"p-2 rounded-lg",
									isPositive ? "bg-green-100" : "bg-red-100",
								)}
							>
								<Activity
									className={cn(
										"w-4 h-4",
										isPositive
											? "text-green-600"
											: "text-red-600",
									)}
								/>
							</div>
							<p className="text-xs text-slate-500 font-medium">
								{index.name}
							</p>
						</div>
						<p className="text-xl font-bold text-slate-800">
							{formatNumber(index.value, 2)}
						</p>
						<p
							className={cn(
								"text-sm font-semibold mt-1",
								getColorForChange(index.change),
							)}
						>
							{formatPercentage(index.change_percentage)}
						</p>
					</div>
				);
			})}
		</div>
	);
}
