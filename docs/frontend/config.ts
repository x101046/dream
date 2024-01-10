import { DefaultTheme } from 'vitepress'

const frontendTheme: DefaultTheme.Config = {
	sidebar: {
		'/frontend/html/': [
			{
				text: 'Examples',
				collapsed: false,
				items: [
					{ text: 'Markdown Examples', link: '/markdown-examples' },
					{
						text: 'Runtime API Examples',
						items: [
							{ text: 'Runtime API Examples', link: '/api-examples' }
						]
					}
				]
			}
		],
		'/frontend/js/': [
			{
				text: '正则表达式',
				link: '/frontend/js/正则表达式/'
			}
		]
	},
	nav: [
		{
			text: '前端',
			activeMatch: 'frontend',
			items:[
				{
					text: '基础',
					items:[
						{text: 'Html', link:'/frontend/html/'},
						{text: 'CSS', link:'/frontend/css/'},
						{text: 'JavaScript', link:'/frontend/js/正则表达式/'},
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
	]
}

export default frontendTheme