import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default {
  title: "My Awesome Project",
  description: "A VitePress Site",
	outDir: '../dist',
	base: './', 
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: 'Examples', link: '/markdown-examples' },
			{
				text: '前端',
				activeMatch: 'frontend',
				items: [
					{
						text: 'JavaScript',
						link: '/frontend/js'
					},
					{
						text: 'Vue',
						link: '/frontend/vue/'
					}
				]
			}
    ],

		logo: '/img/logo.png',
    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
}
