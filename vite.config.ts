import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    const repoName = process.env.GITHUB_REPOSITORY ? process.env.GITHUB_REPOSITORY.split('/').pop() : undefined;
    // If the repo is a user/org site (username.github.io) use root '/', otherwise use '/repo-name/'
    const autoBase = repoName && repoName.endsWith('.github.io') ? '/' : repoName ? `/${repoName}/` : '/';
    const base = env.VITE_BASE || autoBase;

    return {
      base,
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
