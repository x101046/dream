import { defineConfig, DefaultTheme } from 'vitepress'

import nodeTheme from "../node/config";
import threedTheme from "../3d/config";
import frontendTheme from "../frontend/config";
import toolTheme from "../tools/config";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "My Awesome Project",
	description: "A VitePress Site",
	outDir: '../dist',
	lastUpdated: true, // 显示上一次更新时间
	markdown: {
		lineNumbers: true, // 显示代码行号
	},
	head: [['link', { rel: 'icon', href: '/img/favicon.ico' }]],
  themeConfig: {
		logo: './img/logo.png',
		search: {
      provider: 'local',
    },
		docFooter: {
			prev: '上一页',
			next: '下一页',
		},
		// 导航栏
    nav: [
      { text: '首页', link: '/' },
			...toolTheme.nav!,
			...frontendTheme.nav!,
			...nodeTheme.nav!,
			...threedTheme.nav!,
    ],
		// 侧边栏
		sidebar: {
			...toolTheme.sidebar,
			...frontendTheme.sidebar,
			...nodeTheme.sidebar,
			...threedTheme.sidebar,
		},

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
