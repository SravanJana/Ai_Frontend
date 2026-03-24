"use client";

import React, { useEffect, useRef, memo } from "react";

interface TradingViewWidgetProps {
	symbol: string;
	theme?: "light" | "dark";
	height?: number;
	interval?: string;
	autosize?: boolean;
}

function TradingViewWidget({
	symbol,
	theme = "light",
	height = 400,
	interval = "D",
	autosize = true,
}: TradingViewWidgetProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const scriptRef = useRef<HTMLScriptElement | null>(null);

	useEffect(() => {
		// Clean up previous widget
		if (containerRef.current) {
			containerRef.current.innerHTML = "";
		}

		// Create the TradingView widget container
		const widgetContainer = document.createElement("div");
		widgetContainer.className = "tradingview-widget-container__widget";
		widgetContainer.style.height = autosize ? "100%" : `${height}px`;
		widgetContainer.style.width = "100%";

		if (containerRef.current) {
			containerRef.current.appendChild(widgetContainer);
		}

		// Format symbol for Indian stocks (NSE)
		const formattedSymbol = symbol.includes(":") ? symbol : `NSE:${symbol}`;

		// Create and load the TradingView widget script
		const script = document.createElement("script");
		script.src =
			"https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
		script.type = "text/javascript";
		script.async = true;
		script.innerHTML = JSON.stringify({
			autosize: autosize,
			symbol: formattedSymbol,
			interval: interval,
			timezone: "Asia/Kolkata",
			theme: theme,
			style: "1",
			locale: "en",
			enable_publishing: false,
			allow_symbol_change: true,
			calendar: false,
			support_host: "https://www.tradingview.com",
			hide_top_toolbar: false,
			hide_legend: false,
			save_image: true,
			studies: [
				"RSI@tv-basicstudies",
				"MASimple@tv-basicstudies",
				"MACD@tv-basicstudies",
			],
			container_id: widgetContainer.id,
			height: autosize ? "100%" : height,
			width: "100%",
		});

		scriptRef.current = script;

		if (containerRef.current) {
			containerRef.current.appendChild(script);
		}

		return () => {
			// Cleanup
			if (scriptRef.current && scriptRef.current.parentNode) {
				scriptRef.current.parentNode.removeChild(scriptRef.current);
			}
		};
	}, [symbol, theme, height, interval, autosize]);

	return (
		<div
			className="tradingview-widget-container rounded-lg overflow-hidden border border-slate-200"
			style={{ height: autosize ? "100%" : height }}
		>
			<div ref={containerRef} style={{ height: "100%", width: "100%" }} />
			<div className="text-center py-1 text-xs text-slate-500 bg-slate-50">
				<a
					href={`https://www.tradingview.com/symbols/NSE-${symbol}/`}
					target="_blank"
					rel="noopener noreferrer"
					className="text-red-600 hover:underline"
				>
					View on TradingView
				</a>
			</div>
		</div>
	);
}

export default memo(TradingViewWidget);
