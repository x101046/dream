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
    // https://vitepress.dev/reference/default-theme-config
		// logo: 'https://s21.ax1x.com/2024/05/28/pk1hLNQ.png',
		logo: './img/logo.png',
		algolia: {
      indexName: 'Dream',
      appId: 'FI5EDJ70PW',
      apiKey: 'e238df0cc3d340e36779e1be052db2db',
      placeholder: '搜索文档',
      translations: {
        button: {
          buttonText: '搜索'
        },
        modal: {
          searchBox: {
            resetButtonTitle: '清除查询条件',
            resetButtonAriaLabel: '清除查询条件',
            cancelButtonText: '取消',
            cancelButtonAriaLabel: '取消'
          },
          startScreen: {
            recentSearchesTitle: '搜索历史',
            noRecentSearchesText: '没有搜索历史',
            saveRecentSearchButtonTitle: '保存到搜索历史',
            removeRecentSearchButtonTitle: '从搜索历史中移除',
            favoriteSearchesTitle: '收藏',
            removeFavoriteSearchButtonTitle: '从收藏中移除'
          },
          errorScreen: {
            titleText: '无法获取结果',
            helpText: '你可能需要检查你的网络连接'
          },
          footer: {
            selectText: '选择',
            navigateText: '切换',
            closeText: '关闭',
            searchByText: '搜索供应商'
          },
          noResultsScreen: {
            noResultsText: '无法找到相关结果',
            suggestedQueryText: '你可以尝试查询',
            reportMissingResultsText: '你认为这个查询应该有结果？',
            reportMissingResultsLinkText: '向我们反馈'
          }
        }
      },
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
