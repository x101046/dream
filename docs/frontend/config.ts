import { DefaultTheme } from 'vitepress'
import { getFileThemme } from "../.vitepress/utils";

const data = getFileThemme('./docs/frontend', '/frontend')

console.log('data', data);


const frontendTheme: DefaultTheme.Config = {
	sidebar: {
		'/frontend/html/': [
			// {
			// 	text: 'Examples',
			// 	collapsed: false,
			// 	items: [
			// 		{ text: 'Markdown Examples', link: '/markdown-examples' },
			// 		{
			// 			text: 'Runtime API Examples',
			// 			items: [
			// 				{ text: 'Runtime API Examples', link: '/api-examples' }
			// 			]
			// 		}
			// 	]
			// }
			{ text: '测试1', link: '/frontend/html/测试1/' },
			{ text: '测试2', link: '/frontend/html/测试2/' },
			{ 
				text: '测试3',
				collapsed: false,
				items: [
					{ text: '测试3子文件夹', link: '/frontend/html/测试3/测试3子文件夹/' },
					{ text: '测试3子文件夹2', link: '/frontend/html/测试3/测试3子文件夹2/' },
				]
			},
		],
		'/frontend/js/': [
			{
				text: '正则表达式',
				link: '/frontend/js/正则表达式/'
			},
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
						{text: 'Html', link:'/frontend/html/测试1/'},
						{text: 'CSS', link:'/frontend/css/测试/'},
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