import { useEffect, useState } from "react";
import xml2js from 'xml2js';
import {BrowserRouter,Link,Route,Switch} from "react-router-dom";
import GnomeThemeBlock from "./GnomeThemeBlock";
const { remote } = window.require('electron');
const {platform,homedir} = window.require('os')
const fs = window.require('fs')
const parser = new xml2js.Parser();

export default function Home(props) {
	let {gnomeThemeArr,setGnomeThemeArr,solarThemeArr,setSolarThemeArr,setEditingTheme} = props;
	let themePath = homedir() 
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
			else {
				fs.readdir(path+dirent.name, (err, files) => {
					if(files.includes('theme.json')){
						fs.readFile(path + dirent.name + '/theme.json',(err,data) => {
							fs.readFile(path + dirent.name + '/' +  JSON.parse(data)[0].path,(err,imgdata) => {
								currentsolarThemeArr.push({
									name:dirent.name,
									img:`data:image/png;base64,${Buffer.from(imgdata).toString('base64')}`,
									data: JSON.parse(data)
								})
								setSolarThemeArr(currentsolarThemeArr)
									
							})
						})
					}
				})
			}
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
				return <GnomeThemeBlock {...element} key={index} />
			})

		}
		{
			solarThemeArr.map( (element,index) => {
				return (
					<article key={index} className='themeblock' style={{"background": `url(${element.img})`}} >
						<h1>{element.name}</h1>     
						<Link onClick={() => {setEditingTheme(element)}} to={`/edit/${element.name}`}><h2>Edit</h2></Link>
					</article>
				)
				
			})
		}		
		</div>
	)
}
