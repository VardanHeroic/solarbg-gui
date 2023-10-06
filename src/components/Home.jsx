import { useEffect, useState } from "react";
import xml2js from 'xml2js';
import img from 'file:///home/vardan/Downloads/ok/0.png'
import {BrowserRouter,Link,Route,Switch} from "react-router-dom";

const {platform,homedir} = window.require('os')
const fs = window.require('fs')
const parser = new xml2js.Parser();


export default function Home() {
	let themePath = homedir() 
	let [gnomeThemeArr, setGnomeThemeArr] = useState([])
	let [solarThemeArr, setSolarThemeArr] = useState([])
		
	useEffect(() => {
		switch(platform()) {
			case 'linux':
				themePath = homedir() + '/.local/share/solarbg/themes/';
				break;
			case 'win32':
				themePath = homedir() +'\\AppData\\Roaming\\solarbg\\themes\\';
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
					let imgPath = ''
					fs.readFile(path + dirent.name,(err,data) => {
						parser.parseString(data,(err, result) => {
							imgPath = result.background.static[0].file[0]
							currentgnomeThemeArr.push({
								name:dirent.name,
								img: imgPath
							});	

							if (gnomeThemeArr.length != currentgnomeThemeArr.length) {
								setGnomeThemeArr(currentgnomeThemeArr)	
							}

						})

					})

				}
				else{
					fs.readdir(path+dirent.name, (err, files) => {
						if(files.includes('theme.json')){
							currentsolarThemeArr.push(dirent.name)
						}
					})
				}
			}
			console.log(currentgnomeThemeArr);
			if (solarThemeArr.length != currentsolarThemeArr.length) {
				setSolarThemeArr(currentsolarThemeArr)
			}
		}
		ls(themePath).catch(console.error)
	})

	
	
//	import( (platform == 'win32' ? 'file:\\' : '') + themePath + (platform == 'win32' ? '\\theme.json' : '/theme.json') ,{ assert: { type: "json" } })
//		.then(module => themeJSON = module.default)
	return (
		<div className="home">
		{
			gnomeThemeArr.map( (element,index) => {
				console.log(element.img);
				return (
					<article key={index} >
						<h1>{element.name}</h1>                                                                     
						<img src={img} alt=""/>
					</article>
				)
				
			})
		}
		{
			solarThemeArr.map( (element,index) => {
				return <h1 key={index} >{element}</h1>
				
			})
		}		
		</div>
	)
}
