const nextConfig = {
    reactStrictMode: true,
    experimental: {
        optimizeCss: true
    },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "ecommerce.routemisr.com",
                pathname: "/**"
            }
        ]
    }
};

export default nextConfig;
