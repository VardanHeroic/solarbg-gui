import { useEffect, useState } from "react";
import xml2js from 'xml2js';
import { Link } from "react-router-dom";
import GnomeThemeBlock from "./GnomeThemeBlock";
import Loading from './Loading'

const fs = window.require('fs').promises
const parser = new xml2js.Parser();

export default function Home(props) {
    let { gnomeThemeArr, setGnomeThemeArr, solarThemeArr, setSolarThemeArr, setEditingTheme, themePath, readImg } = props;
    let [isLoading, setIsLoading] = useState(true);


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
                    return <GnomeThemeBlock {...element} key={index} />
                })

            }
            {
                solarThemeArr.map((element, index) => {
                    return (
                        <article key={index} className='themeblock' style={{ "background": `url(${element.img})` }} >
                            <h1>{element.name}</h1>
                            <Link onClick={() => { setEditingTheme(element) }} to={`/edit/`}><h2>Edit</h2></Link>
                        </article>
                    )

                })
            }
        </div>
    )
}
