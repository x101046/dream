import { defineConfig, DefaultTheme } from 'vitepress'
import nodeTheme from "../../docs/node/config";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "My Awesome Project",
  description: "A VitePress Site",
	outDir: '../dist',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
		logo: '/img/logo.png',
		search: {
      provider: 'local',
    },
    nav: [
      { text: '首页', link: '/' },
			{
				text: '前端',
				activeMatch: 'frontend',
				items:[
					{
						text: '基础',
						items:[
							{text: 'Html', link:'/frontend/html/'},
							{text: 'CSS', link:'/frontend/css/'},
							{text: 'JavaScript', link:'/frontend/js/'},
							{text: 'TypeScript', link:'/frontend/ts/'},
						]
					},
					{
						text: '框架',
						items:[
							{text: 'React', link:'/frontend/react/'},
							{text: 'Vue', link:'/frontend/vue/'},
						]
					}
				]
			},
			...nodeTheme.nav!,
    ],

		sidebar: {
			'/frontend/html/': [
				{
					text: 'Examples',
					items: [
						{ text: 'Markdown Examples', link: '/markdown-examples' },
						{ text: 'Runtime API Examples', link: '/api-examples' }
					]
				}
			],
			...nodeTheme.sidebar,
			// '/node/nest/': [
			// 	{
			// 		text: '前置知识',
			// 		items: [
			// 			{ text: 'IOC控制反转 DI依赖注入', link: '/node/nest/' },
			// 			{ text: '装饰器', link: '/node/nest/adorner' }
			// 		]
			// 	}
			// ]
		},

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
