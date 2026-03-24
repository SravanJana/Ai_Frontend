/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	output: 'standalone',
	images: {
		domains: ['localhost'],
		unoptimized: true,
	},
	env: {
		NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
	},
	async rewrites() {
		return [
			{
				source: "/api/:path*",
				destination: process.env.NEXT_PUBLIC_API_URL 
					? `${process.env.NEXT_PUBLIC_API_URL}/:path*`
					: "http://localhost:8000/:path*",
			},
		];
	},
};

module.exports = nextConfig;
