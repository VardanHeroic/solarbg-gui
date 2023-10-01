import {BrowserRouter,Link,Route,Switch} from "react-router-dom";

const {platform,homedir} = window.require('os')
const fs = window.require('fs')

export default function Home() {
	let themePath = homedir() 

	switch(platform()) {
		case 'linux':
			themePath += '/.local/share/solarbg/themes/';
			break;
		case 'win32':
			themePath += '\\AppData\\Roaming\\solarbg\\themes\\';
			break;
		default:
			console.log('Your os is not supported');
	}

	async function ls(path) {
		const dir = await fs.promises.opendir(path)
		for await (const dirent of dir) {
			if (dirent.name.includes('.xml')){
				console.log(dirent.name);	
			}
			else{
				fs.readdir(path+dirent.name, (err, files) => {
					if(files.includes('theme.json')){
						console.log(dirent.name)
					}
				})
			}
		}
	}

	ls(themePath).catch(console.error)

//	import( (platform == 'win32' ? 'file:\\' : '') + themePath + (platform == 'win32' ? '\\theme.json' : '/theme.json') ,{ assert: { type: "json" } })
//		.then(module => themeJSON = module.default)
	return (
		<h1>{themePath}</h1>
	)
}
