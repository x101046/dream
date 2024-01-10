import { DefaultTheme } from 'vitepress'

const nodeTheme: DefaultTheme.Config = {
	sidebar: {
		'/3d/babylon/': [
			{
				text: '前置知识',
				items: [
					{ text: '开始', link: '/3d/babylon/开始/' },
				]
			}
		]
	},
	nav: [
		{
			text: '3d',
			activeMatch: '3d',
			items:[
				{text: 'BabylonJs', link:'/3d/babylon/开始/'},
			]
		}
	]
}

export default nodeTheme