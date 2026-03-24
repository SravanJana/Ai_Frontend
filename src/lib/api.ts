import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const axiosInstance = axios.create({
	baseURL: API_BASE_URL,
	headers: {
		"Content-Type": "application/json",
	},
	timeout: 120000, // 2 minute timeout for AI responses
});

// Add request/response interceptors for debugging
axiosInstance.interceptors.request.use(
	(config) => {
		console.log(
			`[API Request] ${config.method?.toUpperCase()} ${config.url}`,
			config.data,
		);
		return config;
	},
	(error) => {
		console.error("[API Request Error]", error);
		return Promise.reject(error);
	},
);

axiosInstance.interceptors.response.use(
	(response) => {
		console.log(`[API Response] ${response.status}`, response.data);
		return response;
	},
	(error) => {
		console.error(
			"[API Response Error]",
			error?.response?.status,
			error?.response?.data || error?.message,
		);
		return Promise.reject(error);
	},
);

// Types
export interface Holding {
	symbol: string;
	quantity: number;
	average_price: number;
	avg_cost?: number; // Alias for average_price
	current_price?: number;
	current_value?: number;
	pnl?: number;
	pnl_percentage?: number;
	sector?: string;
}

export interface Portfolio {
	user_id: number;
	total_value: number;
	total_investment: number;
	total_pnl: number;
	total_pnl_percentage: number;
	daily_change_percent?: number;
	holdings: Holding[];
}

export interface SectorExposure {
	sector: string;
	percentage: number;
	value?: number;
}

export interface RiskMetrics {
	risk_score: number;
	risk_level: string;
	volatility: number;
	sharpe_ratio: number;
	max_drawdown: number;
	beta: number;
	sector_exposure: SectorExposure[];
	concentration_risk: number;
	suggestions: string[];
}

export interface PortfolioSummary {
	user_id: number;
	portfolio: {
		total_value: number;
		total_investment: number;
		total_pnl: number;
		total_pnl_percentage: number;
		holdings_count: number;
	};
	risk: {
		risk_score: number;
		risk_level: string;
		volatility: number;
		sharpe_ratio: number;
		beta: number;
		sector_exposure: SectorExposure[];
	};
	health: {
		score: number;
		status: string;
		strengths: string[];
		weaknesses: string[];
		recommendations: string[];
	};
	top_performers: { symbol: string; pnl_percentage: number }[];
	worst_performers: { symbol: string; pnl_percentage: number }[];
	ai_insights: string;
	rebalance_suggestions: any[];
	// Convenience aliases at top level
	strengths?: string[];
	weaknesses?: string[];
}

export interface TechnicalIndicators {
	rsi: number;
	macd: number;
	macd_signal: number;
	macd_histogram: number;
	sma_20: number;
	sma_50: number;
	sma_200: number;
	ema_12: number;
	ema_26: number;
	bollinger_upper: number;
	bollinger_middle: number;
	bollinger_lower: number;
	atr: number;
	volume_sma: number;
}

export interface StockAnalysis {
	symbol: string;
	name?: string;
	current_price: number;
	day_high?: number;
	day_low?: number;
	year_high?: number;
	year_low?: number;
	trend: string;
	signal: string;
	confidence: number;
	technical_indicators: TechnicalIndicators;
	support_level: number;
	resistance_level: number;
	target_price?: number;
	stop_loss?: number;
	analysis_summary: string;
}

export interface StockMover {
	symbol: string;
	name: string;
	price: number;
	change: number;
	change_percentage: number;
	volume: number;
}

export interface MarketIndex {
	symbol: string;
	name: string;
	value: number;
	change: number;
	change_percentage: number;
	trend: string;
}

export interface MarketOverview {
	indices: MarketIndex[];
	top_gainers: StockMover[];
	top_losers: StockMover[];
	market_breadth: { advancing: number; declining: number };
	sector_performance: Record<string, number>;
	market_sentiment: string;
	overall_sentiment?: {
		sentiment: string;
		score?: number;
	};
}

export interface NewsSentiment {
	headline: string;
	source: string;
	sentiment: string;
	confidence: number;
	url?: string;
}

export interface OverallSentiment {
	symbol: string;
	overall_sentiment: string;
	sentiment_score: number;
	confidence: number;
	news_count: number;
	positive_count: number;
	negative_count: number;
	neutral_count: number;
	news_items: NewsSentiment[];
}

export interface ChatResponse {
	response: string;
	suggestions?: string[];
	data?: any;
}

// API Functions

// Portfolio APIs
export const getPortfolio = async (userId: number): Promise<Portfolio> => {
	const response = await axiosInstance.get(`/portfolio/${userId}/detailed`);
	return response.data;
};

export const getPortfolioRisk = async (
	userId: number,
): Promise<RiskMetrics> => {
	const response = await axiosInstance.get(`/portfolio/${userId}/risk`);
	return response.data;
};

export const getPortfolioSummary = async (
	userId: number,
): Promise<PortfolioSummary> => {
	const response = await axiosInstance.get(
		`/portfolio/ai/portfolio-summary/${userId}`,
	);
	return response.data;
};

// Stock Analysis APIs
export const getStockAnalysis = async (
	symbol: string,
): Promise<StockAnalysis> => {
	const response = await axiosInstance.get(`/ai/stock-analysis/${symbol}`);
	return response.data;
};

export const getStockSentiment = async (
	symbol: string,
): Promise<OverallSentiment> => {
	const response = await axiosInstance.get(`/ai/stock-sentiment/${symbol}`);
	return response.data;
};

export interface StockHistoryData {
	date: string;
	open: number;
	high: number;
	low: number;
	close: number;
	volume: number;
}

export interface StockHistory {
	symbol: string;
	period: string;
	data: StockHistoryData[];
}

export const getStockHistory = async (
	symbol: string,
	period: string = "3mo",
): Promise<StockHistory> => {
	const response = await axiosInstance.get(
		`/ai/stock-history/${symbol}?period=${period}`,
	);
	return response.data;
};

export const getAvailableStocks = async (): Promise<{
	stocks: { symbol: string; sector: string }[];
}> => {
	const response = await axiosInstance.get("/ai/available-stocks");
	return response.data;
};

export const compareStocks = async (symbol1: string, symbol2: string) => {
	const response = await axiosInstance.get(
		`/ai/compare/${symbol1}/${symbol2}`,
	);
	return response.data;
};

// Market APIs
export const getMarketOverview = async (): Promise<MarketOverview> => {
	const response = await axiosInstance.get("/ai/market-overview");
	return response.data;
};

// Market sector types for top movers
export type MarketSector =
	// NSE Sectors
	| "NIFTY" // NIFTY 50
	| "BANKNIFTY" // Bank Nifty (uses index API)
	| "NIFTYNEXT50" // NIFTY Next 50
	| "SecGtr20" // Securities > Rs 20
	| "SecLwr20" // Securities < Rs 20
	| "FOSec" // F&O Securities
	| "allSec" // All Securities
	// NSE Sectoral Indices
	| "NIFTY_IT" // IT Sector
	| "NIFTY_PHARMA" // Pharma Sector
	| "NIFTY_AUTO" // Auto Sector
	| "NIFTY_FMCG" // FMCG Sector
	| "NIFTY_METAL" // Metal Sector
	| "NIFTY_REALTY" // Realty Sector
	| "NIFTY_ENERGY" // Energy Sector
	| "NIFTY_PSU_BANK" // PSU Bank
	| "NIFTY_PRIVATE_BANK" // Private Bank
	| "NIFTY_FIN_SERVICE" // Financial Services
	// BSE Sectors
	| "BSE_ALL" // All BSE stocks
	| "SENSEX"; // BSE SENSEX 30

export const MARKET_SECTORS: { key: MarketSector; label: string }[] = [
	// NSE Main Indices
	{ key: "allSec", label: "All (NSE)" },
	{ key: "NIFTY", label: "Nifty 50" },
	{ key: "BANKNIFTY", label: "Bank Nifty" },
	{ key: "NIFTYNEXT50", label: "Nifty Next 50" },
	{ key: "FOSec", label: "F&O" },
	// BSE Sectors
	{ key: "BSE_ALL", label: "All (BSE)" },
	{ key: "SENSEX", label: "Sensex 30" },
	// NSE Sectoral Indices
	{ key: "NIFTY_IT", label: "IT" },
	{ key: "NIFTY_PHARMA", label: "Pharma" },
	{ key: "NIFTY_AUTO", label: "Auto" },
	{ key: "NIFTY_FMCG", label: "FMCG" },
	{ key: "NIFTY_METAL", label: "Metal" },
	{ key: "NIFTY_PSU_BANK", label: "PSU Bank" },
	{ key: "NIFTY_PRIVATE_BANK", label: "Pvt Bank" },
	{ key: "NIFTY_FIN_SERVICE", label: "Finance" },
	{ key: "NIFTY_REALTY", label: "Realty" },
	{ key: "NIFTY_ENERGY", label: "Energy" },
	// Price based
	{ key: "SecGtr20", label: "> Rs.20" },
	{ key: "SecLwr20", label: "< Rs.20" },
];

export const getTopMovers = async (
	count: number = 5,
	sector: MarketSector = "allSec",
) => {
	const response = await axiosInstance.get(
		`/ai/top-movers?count=${count}&sector=${sector}`,
	);
	return response.data;
};

export const getMarketSentiment = async () => {
	const response = await axiosInstance.get("/ai/market-sentiment");
	return response.data;
};

export interface MarketNewsItem {
	title: string;
	source: string;
	time: string;
	sentiment: string;
	url?: string;
}

export const getMarketNews = async (
	limit: number = 10,
): Promise<{ news: MarketNewsItem[] }> => {
	const response = await axiosInstance.get(`/ai/market-news?limit=${limit}`);
	return response.data;
};

// Chat API
export const sendChatMessage = async (
	userId: number,
	message: string,
): Promise<ChatResponse> => {
	try {
		console.log("Sending chat message:", { userId, message });
		const response = await axiosInstance.post("/ai/chat", {
			user_id: userId,
			message: message,
		});
		console.log("Chat response:", response.data);
		return response.data;
	} catch (error: any) {
		console.error("Chat API error details:", {
			status: error?.response?.status,
			data: error?.response?.data,
			message: error?.message,
		});
		throw error;
	}
};

export const getSuggestedPrompts = async (): Promise<{ prompts: string[] }> => {
	const response = await axiosInstance.get("/ai/suggested-prompts");
	return response.data;
};

export const clearChatHistory = async (userId: number) => {
	const response = await axiosInstance.delete(`/ai/chat/${userId}/history`);
	return response.data;
};

// PDF Analysis API
export interface PDFAnalysisResult {
	success: boolean;
	filename: string;
	document_id?: string;
	document_type?: string;
	page_count?: number;
	extracted_metrics?: Record<string, number>;
	analysis?: string;
	text_preview?: string;
	error?: string;
	timestamp?: string;
}

export interface PDFQuestionResponse {
	success: boolean;
	question?: string;
	answer?: string;
	document_id?: string;
	filename?: string;
	error?: string;
}

export const analyzePDF = async (file: File): Promise<PDFAnalysisResult> => {
	const formData = new FormData();
	formData.append("file", file);

	const response = await axios.post(
		`${API_BASE_URL}/ai/analyze-pdf`,
		formData,
		{
			headers: {
				"Content-Type": "multipart/form-data",
			},
			timeout: 120000, // 2 minute timeout for PDF processing
		},
	);
	return response.data;
};

export const askPDFQuestion = async (
	documentId: string,
	question: string,
): Promise<PDFQuestionResponse> => {
	const response = await axiosInstance.post("/ai/pdf-question", {
		document_id: documentId,
		question: question,
	});
	return response.data;
};

// Stock Comparison Interface
export interface StockComparisonMetric {
	metric: string;
	stock1_value: string | number;
	stock2_value: string | number;
	stock1_status: string;
	stock2_status: string;
	winner: string;
}

export interface StockComparisonStock {
	symbol: string;
	name: string;
	price: number;
	change_percent?: number;
	market_cap?: number;
	pe_ratio?: number;
	volume?: number;
	avg_volume?: number;
	day_high?: number;
	day_low?: number;
	year_high?: number;
	year_low?: number;
	trend?: string;
	signal?: string;
	confidence?: number;
	technical_indicators?: {
		rsi?: number;
		macd?: number;
		sma_20?: number;
		sma_50?: number;
		sma_200?: number;
	};
	support?: number;
	resistance?: number;
	target_price?: number;
	stop_loss?: number;
}

export interface StockComparison {
	stocks: StockComparisonStock[];
	comparison_metrics: StockComparisonMetric[];
	recommendation: string;
	winner: string | null;
}

export const getStockComparison = async (
	symbol1: string,
	symbol2: string,
): Promise<StockComparison> => {
	const response = await axiosInstance.get(
		`/ai/compare/${symbol1}/${symbol2}`,
	);
	return response.data;
};

// Export api object for convenient access
export const api = {
	getPortfolio,
	getRiskAnalysis: getPortfolioRisk,
	getPortfolioSummary,
	getStockAnalysis,
	getStockSentiment,
	getStockHistory,
	getMarketOverview,
	getMarketNews,
	getMarketSentiment,
	getTopMovers,
	sendChatMessage,
	getSuggestedPrompts,
	clearChatHistory,
	compareStocks,
	analyzePDF,
	askPDFQuestion,
	getStockComparison,
};

export default axiosInstance;
