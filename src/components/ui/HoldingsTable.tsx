"use client";

import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import {
	cn,
	formatCurrency,
	formatPercentage,
	getColorForChange,
} from "@/lib/utils";
import { Holding } from "@/lib/api";

interface HoldingsTableProps {
	holdings: Holding[];
	onSelectStock?: (symbol: string) => void;
	onRowClick?: (symbol: string) => void;
}

export default function HoldingsTable({
	holdings,
	onSelectStock,
	onRowClick,
}: HoldingsTableProps) {
	const handleRowClick = (symbol: string) => {
		if (onRowClick) {
			onRowClick(symbol);
		} else if (onSelectStock) {
			onSelectStock(symbol);
		}
	};
	return (
		<div className="overflow-x-auto">
			<table className="w-full">
				<thead>
					<tr className="text-left text-slate-500 text-sm border-b border-slate-200">
						<th className="pb-4 pl-4">Stock</th>
						<th className="pb-4">Qty</th>
						<th className="pb-4">Avg Price</th>
						<th className="pb-4">Current</th>
						<th className="pb-4">Value</th>
						<th className="pb-4 pr-4">P&L</th>
					</tr>
				</thead>
				<tbody>
					{holdings.map((holding) => {
						const pnl = holding.pnl_percentage || 0;
						const isPositive = pnl >= 0;

						return (
							<tr
								key={holding.symbol}
								className="table-row cursor-pointer"
								onClick={() => handleRowClick(holding.symbol)}
							>
								<td className="py-4 pl-4">
									<div className="flex items-center gap-3">
										<div className="w-10 h-10 rounded-xl bg-gradient-to-r from-red-100 to-amber-50 flex items-center justify-center">
											<span className="text-sm font-bold text-red-600">
												{holding.symbol.slice(0, 2)}
											</span>
										</div>
										<div>
											<p className="font-medium text-slate-800">
												{holding.symbol}
											</p>
											<p className="text-xs text-slate-500">
												{holding.sector || "Stock"}
											</p>
										</div>
									</div>
								</td>
								<td className="py-4 text-slate-800">
									{holding.quantity}
								</td>
								<td className="py-4 text-slate-600">
									{formatCurrency(holding.average_price)}
								</td>
								<td className="py-4 text-slate-800">
									{holding.current_price
										? formatCurrency(holding.current_price)
										: "-"}
								</td>
								<td className="py-4 text-slate-800">
									{holding.current_value
										? formatCurrency(holding.current_value)
										: "-"}
								</td>
								<td className="py-4 pr-4">
									<div
										className={cn(
											"flex items-center gap-1",
											getColorForChange(pnl),
										)}
									>
										{isPositive ? (
											<TrendingUp className="w-4 h-4" />
										) : (
											<TrendingDown className="w-4 h-4" />
										)}
										<span className="font-medium">
											{formatPercentage(pnl)}
										</span>
									</div>
									{holding.pnl !== undefined && (
										<p
											className={cn(
												"text-xs",
												getColorForChange(holding.pnl),
											)}
										>
											{formatCurrency(holding.pnl)}
										</p>
									)}
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
}
