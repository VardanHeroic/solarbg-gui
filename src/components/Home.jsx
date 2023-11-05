import { useEffect, useState } from "react";
import xml2js from 'xml2js';
import { Link } from "react-router-dom";
import GnomeThemeBlock from "./GnomeThemeBlock";
const fs = window.require('fs')
const parser = new xml2js.Parser();

export default function Home(props) {
	let {gnomeThemeArr,setGnomeThemeArr,solarThemeArr,setSolarThemeArr,setEditingTheme,themePath,readImg} = props;
	let [isLoading,setIsLoading] = useState(true);
	


	async function ls(path) {
		let currentsolarThemeArr = []
		let currentgnomeThemeArr = []
		const dir = await fs.promises.opendir(path)

		for await (const dirent of dir) {
			if (dirent.name.includes('.xml')){
				fs.readFile(path + dirent.name,(err,data) => {
					parser.parseStringPromise(data)
						.then(async(result) => {
							currentgnomeThemeArr.push({
								name:dirent.name,
								img: await readImg(result.background.transition[0].from[0])
							});
							setGnomeThemeArr(currentgnomeThemeArr)	
						})
				})
			}
			else {
				fs.readdir(path+dirent.name, (err, files) => {
					if(files.includes('theme.json')){
						fs.readFile(path + dirent.name + '/theme.json', async (err,data) => {
							currentsolarThemeArr.push({
								name:dirent.name,
								context: path + dirent.name + '/',
								img: await readImg(path + dirent.name + '/' +  JSON.parse(data)[0].path),
								data: JSON.parse(data)
							})
							setSolarThemeArr(currentsolarThemeArr)			
						})
					}
				})
			}
		}
	}



	useEffect(() => {	
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
						<Link onClick={() => {setEditingTheme(element)}} to={`/edit/`}><h2>Edit</h2></Link>
					</article>
				)
				
			})
		}		
		</div>
	)
}
