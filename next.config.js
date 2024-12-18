const nextConfig = {
  /* config options here */
  webpack: (
    config,
    { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }
  ) => {
    // console.log("config", config);
    return {
      ...config,
      optimization: {
        ...config.optimization,
        sideEffects: false, // Modifying without direct left-hand assignment
      },
    };
  },
};

export default nextConfig;
