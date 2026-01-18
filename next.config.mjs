/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    // 서버 사이드에서만 선택적 의존성 처리
    if (isServer) {
      // pg와 supabase가 없어도 빌드가 실패하지 않도록 처리
      config.resolve.fallback = {
        ...config.resolve.fallback,
        pg: false,
        'pg-native': false,
        '@supabase/supabase-js': false,
      };
      
      // externals에 추가하여 번들에서 제외 (함수 형태로 처리)
      const originalExternals = config.externals;
      config.externals = [
        ...(Array.isArray(originalExternals) 
          ? originalExternals 
          : originalExternals 
            ? [originalExternals] 
            : []),
        ({ request }, callback) => {
          // 선택적 의존성은 외부 모듈로 처리
          if (request === 'pg' || request === 'pg-native' || request === '@supabase/supabase-js') {
            return callback(null, `commonjs ${request}`);
          }
          callback();
        },
      ];
    }
    return config;
  },
};

export default nextConfig;
