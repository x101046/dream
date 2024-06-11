import * as fs from 'fs'

/**
 * 根据路径生成siderbar
 * @param filePath 当前文件路径 例：'./docs/frontend/' 根据根路径来拿到当前的路径
 * @param urlPath 当前文件夹 例：'/frontend/'
 * @returns 
 */
export function getFileThemme(filePath, urlPath) {
	const obj: any = {}
	const rootFilePath = {}
	const fileList = fs.readdirSync(filePath);
	fileList.forEach((file) => {
		if (file.includes('.ts')) {return}
		const newFilepath = `${filePath}${file}/`
		const newUrlPath = `${urlPath}${file}/`
		if (fs.statSync(newFilepath).isDirectory()) { // 文件夹
			obj[`${newUrlPath}`] = []
			rootFilePath[`${newUrlPath}`] = newFilepath
		}
	})

	for (const key in obj) {
		obj[key] = getSubFile(rootFilePath[key], key)
	}
	return obj
}

function getSubFile(filePath, linkPath) {
	const arr: any = []
	const subFileList = fs.readdirSync(filePath)
	subFileList.map(dir => {
		const dirFileList = fs.readdirSync(`${filePath}${dir}`)
		
		if (dirFileList.includes('index.md')) {
			arr.push({
				text: dir,
				link: `${linkPath}${dir}/`
			})
		} else {
			arr.push({
				text: dir,
				collapsed: false,
				items: getSubFile(`${filePath}${dir}/`, `${linkPath}${dir}/`)
			})
		}
	})
	return arr
}