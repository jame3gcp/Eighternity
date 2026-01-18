import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['**/*.test.ts', '**/*.test.tsx'],
    exclude: ['node_modules', '.next', 'dist'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
  // .env 파일 로딩 비활성화 (권한 문제 해결)
  envDir: path.resolve(__dirname, './node_modules'), // 존재하는 디렉토리로 설정하여 .env 파일 로딩 방지
  envPrefix: 'VITE_', // VITE_로 시작하는 환경 변수만 로드 (실제로는 로드되지 않음)
});
