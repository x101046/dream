import { DefaultTheme } from 'vitepress'

const nodeTheme: DefaultTheme.Config = {
	sidebar: {
		'/node/nest/': [
			{
				text: '前置知识',
				items: [
					{ text: 'IOC控制反转 DI依赖注入', link: '/node/nest/' },
					{ text: '装饰器', link: '/node/nest/adorner' }
				]
			}
		]
	},
	nav: [
		{
			text: 'node',
			activeMatch: 'node',
			items:[
				{
					text: '框架',
					items:[
						{text: 'NestJs', link:'/node/nest/'},
					]
				}
			]
		}
	]
}

export default nodeTheme