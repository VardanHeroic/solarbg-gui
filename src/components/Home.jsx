import { useEffect, useState } from "react";
import {BrowserRouter,Link,Route,Switch} from "react-router-dom";

const {platform,homedir} = window.require('os')
const fs = window.require('fs')

export default function Home() {
	let themePath = homedir() 
	let [gnomeThemeArr, setGnomeThemeArr] = useState([])
	let [solarThemeArr, setSolarThemeArr] = useState([])
		
	useEffect(() => {
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
			let currentsolarThemeArr = []
			let currentgnomeThemeArr = []
			const dir = await fs.promises.opendir(path)
			for await (const dirent of dir) {
				if (dirent.name.includes('.xml')){
					currentgnomeThemeArr.push(dirent.name);	
				}
				else{
					fs.readdir(path+dirent.name, (err, files) => {
						if(files.includes('theme.json')){
							currentsolarThemeArr.push(dirent.name)
						}
					})
				}
			}
			if (gnomeThemeArr.length != currentgnomeThemeArr.length) {
				setGnomeThemeArr(currentgnomeThemeArr)	
			}
			if (solarThemeArr.length != currentsolarThemeArr.length) {
				setSolarThemeArr(currentsolarThemeArr)
			}
		}
		ls(themePath).catch(console.error)
	})

	
	
//	import( (platform == 'win32' ? 'file:\\' : '') + themePath + (platform == 'win32' ? '\\theme.json' : '/theme.json') ,{ assert: { type: "json" } })
//		.then(module => themeJSON = module.default)
	console.log(gnomeThemeArr);
	return (
		<div className="home">
		{
			gnomeThemeArr.map( (element) => {
				return <h1>{element}</h1>
				
			})
		}
		{
			solarThemeArr.map( (element) => {
				return <h1>{element}</h1>
				
			})
		}		
		</div>
	)
}
