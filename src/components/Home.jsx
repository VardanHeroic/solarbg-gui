import { useEffect, useState } from "react";
import xml2js from 'xml2js';
import { Link } from "react-router-dom";
import GnomeThemeBlock from "./GnomeThemeBlock";
import Loading from './Loading'

const fs = window.require('fs').promises
const child_process = window.require('child_process')
const parser = new xml2js.Parser();

export default function Home(props) {
    let { gnomeThemeArr, setGnomeThemeArr, solarThemeArr, setSolarThemeArr, setEditingTheme, themePath, readImg } = props;
    let [isLoading, setIsLoading] = useState(true);

    function deleteTheme(id) {
        fs.rmdir(themePath + solarThemeArr[id].name,{recursive: true})
        let newThemeArr = { ...solarThemeArr }
        newThemeArr = solarThemeArr.filter((_, index) => index !== id)
        setSolarThemeArr(newThemeArr)
    }

    async function ls(path) {
        let currentsolarThemeArr = []
        let currentgnomeThemeArr = []
        let promiseArr = []
        const dir = await fs.readdir(path)
        promiseArr = dir.map(dirent => {
            if (dirent.includes('.xml')) {
                return fs.readFile(path + dirent)
                    .then((data) => {
                        return parser.parseStringPromise(data)
                    })
                    .then(async (result) => {
                        currentgnomeThemeArr.push({
                            name: dirent,
                            img: await readImg(result.background.transition[0].from[0])
                        });
                    })
            }
            else {
                return fs.readdir(path + dirent)
                    .then((files) => {
                        if (files.includes('theme.json')) {
                            return fs.readFile(path + dirent + '/theme.json')
                        }
                    })
                    .then(async (data) => {
                        currentsolarThemeArr.push({
                            name: dirent,
                            img: await readImg(path + dirent + '/' + JSON.parse(data)[0].path),
                            data: JSON.parse(data)
                        })
                        setSolarThemeArr(currentsolarThemeArr)
                    })
           }
        })

        Promise.all(promiseArr).then(() => {
            setGnomeThemeArr(currentgnomeThemeArr)
            setIsLoading(false)
        })
    }

    function setWorkingTheme(themeName, mode, location) {
        child_process.exec('killall solarbg', () => {
            if (mode === "gnome") {
                child_process.exec(`solarbg -m ${mode} -t ${themeName}`)
            }
            else {
                child_process.exec(`solarbg -m ${mode} -t ${themeName} -l ${location}`)
            }
        })
    }

    useEffect(() => {
        ls(themePath).catch(console.error)
    }, [])

    if (isLoading) {
        return <Loading />
    }

    return (
        <div className="home">
            {
                gnomeThemeArr.map((element, index) => {
                    return <GnomeThemeBlock setWorkingTheme={setWorkingTheme} {...element} key={index} />
                })

            }
            {
                solarThemeArr.map((element, index) => {
                    return (
                        <article onDoubleClick={() => { setWorkingTheme(element.name, 'solar', '40:45') }} key={index} className='themeblock' style={{ "backgroundImage": `url(${element.img})`, "backgroundSize": 'cover' }} >
                            <span>{element.name}</span>
                            <Link onClick={() => { setEditingTheme(element) }} to={`/edit/`}><h2>Edit</h2></Link>
                            <button type="button" onClick={() => {deleteTheme(index)}}>X</button>
                        </article>
                    )

                })
            }
            <article className='themeblock'   >
                <Link onClick={() => { setEditingTheme({ data: [], name: 'new theme' }) }} to={`/edit/`}><h2>Create theme</h2></Link>
            </article>

        </div>
    )
}
