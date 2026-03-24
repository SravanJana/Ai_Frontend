"use client";

import React from "react";

interface LoadingProps {
	message?: string;
	variant?: "default" | "page" | "card";
	text?: string;
}

export function LoadingSpinner() {
	return (
		<div className="inline-block w-6 h-6 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin" />
	);
}

export function LoadingDots() {
	return (
		<div className="loading-dots">
			<span></span>
			<span></span>
			<span></span>
		</div>
	);
}

export default function Loading({
	message,
	variant = "default",
	text,
}: LoadingProps) {
	const displayMessage = text || message || "Loading...";

	if (variant === "page") {
		return (
			<div className="min-h-[60vh] flex items-center justify-center">
				<div className="flex flex-col items-center gap-4">
					<div className="relative">
						<div className="w-16 h-16 border-4 border-red-500/30 rounded-full" />
						<div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-red-500 rounded-full animate-spin" />
					</div>
					<p className="text-slate-500">{displayMessage}</p>
				</div>
			</div>
		);
	}

	if (variant === "card") {
		return (
			<div className="glass-card p-8 flex flex-col items-center justify-center gap-4">
				<LoadingSpinner />
				<p className="text-slate-500">{displayMessage}</p>
			</div>
		);
	}

	return (
		<div className="flex flex-col items-center justify-center py-12 gap-4">
			<LoadingSpinner />
			<p className="text-slate-500">{displayMessage}</p>
		</div>
	);
}

export function PageLoading() {
	return (
		<div className="min-h-[60vh] flex items-center justify-center">
			<div className="flex flex-col items-center gap-4">
				<div className="relative">
					<div className="w-16 h-16 border-4 border-red-500/30 rounded-full" />
					<div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-red-500 rounded-full animate-spin" />
				</div>
				<p className="text-slate-500">Loading dashboard...</p>
			</div>
		</div>
	);
}

export function CardLoading() {
	return (
		<div className="animate-pulse">
			<div className="h-4 bg-slate-200 rounded w-1/3 mb-4" />
			<div className="h-8 bg-slate-200 rounded w-2/3 mb-2" />
			<div className="h-4 bg-slate-100 rounded w-1/2" />
		</div>
	);
}
