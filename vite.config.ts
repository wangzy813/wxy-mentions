import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import {resolve} from 'path'
// import dts from 'vite-plugin-dts'

// https://vitejs.dev/config/
export default defineConfig({
  // plugins: [vue(), dts()],
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    }
  },
  server: {
    hmr: true,
    port: 3000,
  },
  build: {
    lib: {
      // 入口指向组件库入口模块
        entry: resolve(__dirname, 'src/mentions/index.ts'),
        name: 'mentions',
        // 构建生成的文件名，与package.json中配置一致
        fileName: (format) => `mentions.${format}.ts`
    },
    rollupOptions: {
        // 确保外部化处理那些你不想打包进库的依赖
        external: ['vue'],
        output: {
            globals: {
                // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
                vue: 'Vue'
            }
        }
    }
}
})
