import { DefaultTheme } from 'vitepress'
import { getFileThemme } from "../.vitepress/utils";

const data = getFileThemme('./docs/tools/', '/tools/')

// console.log('data', data);


const frontendTheme: DefaultTheme.Config = {
	sidebar: data,
	nav: [
		{ text: '常用库', link: '/tools/toolContent/vue2/' },
	]
}

export default frontendTheme