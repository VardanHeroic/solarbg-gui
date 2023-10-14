import { useEffect, useState } from "react";
import xml2js from 'xml2js';
import {BrowserRouter,Link,Route,Switch} from "react-router-dom";
const { remote } = window.require('electron');
const {platform,homedir} = window.require('os')
const fs = window.require('fs')
const parser = new xml2js.Parser();

function arraysEqual(a, b) {
	return JSON.stringify(a)==JSON.stringify(b);
}


export default function Home() {
	let themePath = homedir() 
	let [gnomeThemeArr, setGnomeThemeArr] = useState([])
	let [solarThemeArr, setSolarThemeArr] = useState([])
	




	async function ls(path) {
		let currentsolarThemeArr = []
		let currentgnomeThemeArr = []
		const dir = await fs.promises.opendir(path)
		for await (const dirent of dir) {
			if (dirent.name.includes('.xml')){
				fs.readFile(path + dirent.name,(err,data) => {
					parser.parseString(data,(err, result) => {
						let imgPath = `${result.background.transition[0].from[0]}`	
						fs.readFile(imgPath,(err,data) => {
							if (err) {
								console.error(err);
								return
							}

							currentgnomeThemeArr.push({
								name:dirent.name,
								img:`data:image/png;base64,${Buffer.from(data).toString('base64')}`
							});

							setGnomeThemeArr(currentgnomeThemeArr)	
						})
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
		if (solarThemeArr.length != currentsolarThemeArr.length) {
			setSolarThemeArr(currentsolarThemeArr)
		}
	}



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
	
		ls(themePath).catch(console.error)
	},[])

	
	
	return (
		<div className="home">
		{
			gnomeThemeArr.map( (element,index) => {
				return (
					<article key={index} >
						<h1>{element.name}</h1>                                                                     
						<img src={element.img} height="500" alt=""/>
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
