"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
	LayoutDashboard,
	PieChart,
	TrendingUp,
	MessageSquare,
	Activity,
	Settings,
	Menu,
	X,
	Bot,
	Wallet,
	Scale,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
	children: React.ReactNode;
}

const navItems = [
	{ href: "/", icon: LayoutDashboard, label: "Dashboard" },
	{ href: "/portfolio", icon: PieChart, label: "Portfolio" },
	{ href: "/stocks", icon: TrendingUp, label: "Stocks" },
	{ href: "/compare", icon: Scale, label: "Compare" },
	{ href: "/market", icon: Activity, label: "Market" },
	{ href: "/chat", icon: MessageSquare, label: "AI Assistant" },
];

export default function Layout({ children }: SidebarProps) {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const pathname = usePathname();

	return (
		<div className="min-h-screen">
			{/* Mobile Header */}
			<header className="lg:hidden fixed top-0 left-0 right-0 z-50 glass-card rounded-none border-x-0 border-t-0">
				<div className="flex items-center justify-between p-4">
					<div className="flex items-center gap-3">
						<Image
							src="/abml-logo.svg"
							alt="ABML Logo"
							width={120}
							height={52}
							priority
						/>
					</div>
					<button
						onClick={() => setSidebarOpen(!sidebarOpen)}
						className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors"
					>
						{sidebarOpen ? (
							<X className="w-6 h-6 text-slate-700" />
						) : (
							<Menu className="w-6 h-6 text-slate-700" />
						)}
					</button>
				</div>
			</header>

			{/* Sidebar */}
			<aside
				className={cn(
					"fixed top-0 left-0 z-40 w-64 h-screen transition-transform lg:translate-x-0",
					sidebarOpen ? "translate-x-0" : "-translate-x-full",
				)}
			>
				<div className="h-full glass-card rounded-none border-l-0 border-t-0 border-b-0 flex flex-col">
					{/* Logo */}
					<div className="p-4 border-b border-slate-200">
						<Image
							src="/abml-logo.svg"
							alt="ABML Logo"
							width={160}
							height={70}
							priority
						/>
					</div>

					{/* Navigation */}
					<nav className="flex-1 p-4 space-y-2 overflow-y-auto">
						{navItems.map((item) => {
							const isActive = pathname === item.href;
							return (
								<Link
									key={item.href}
									href={item.href}
									onClick={() => setSidebarOpen(false)}
									className={cn(
										isActive
											? "sidebar-link-active"
											: "sidebar-link",
									)}
								>
									<item.icon className="w-5 h-5" />
									<span>{item.label}</span>
								</Link>
							);
						})}
					</nav>

					{/* User Section */}
					<div className="p-4 border-t border-slate-200">
						<div className="flex items-center gap-3 p-3 rounded-xl bg-red-50">
							<div className="w-10 h-10 rounded-full bg-gradient-to-r from-red-600 to-red-700 flex items-center justify-center">
								<Wallet className="w-5 h-5 text-white" />
							</div>
							<div>
								<p className="text-sm font-medium text-slate-800">
									Demo User
								</p>
								<p className="text-xs text-slate-500">
									User ID: 1
								</p>
							</div>
						</div>
					</div>
				</div>
			</aside>

			{/* Overlay for mobile */}
			{sidebarOpen && (
				<div
					className="fixed inset-0 z-30 bg-black/50 lg:hidden"
					onClick={() => setSidebarOpen(false)}
				/>
			)}

			{/* Main Content */}
			<main className="lg:ml-64 min-h-screen pt-16 lg:pt-0">
				<div className="p-4 lg:p-8">{children}</div>
			</main>
		</div>
	);
}
