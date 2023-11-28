import { useState, useEffect } from "react";
import Loading from './Loading'
import { Link } from "react-router-dom";
import EditElement from "./EditElement";
import AddEditElement from "./AddEditElement";

const sharp = window.require('sharp')
const fs = window.require('fs')

export default function Edit(props) {
    let { editingTheme, setEditingTheme, themePath } = props;
    let [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let promiseArr = editingTheme.data.map(element => {
            return sharp(themePath + editingTheme.name + '/' + element.path)
                .resize({ height: 180, width: 320 })
                .toBuffer()
                .then(data => { element.img = "data:image/png;base64," + Buffer.from(data).toString('base64') });
        })
        Promise.all(promiseArr).then(() => {
            setIsLoading(false)
        })
    }, [])


    function save(e) {
        e.preventDefault()
        if (!e.target.elements.start || !e.target.elements.end) {
            return
        }
        let startArr = [...e.target.elements.start].map(input => input.valueAsNumber)
        let endArr = [...e.target.elements.end].map(input => input.valueAsNumber)
        let finalArr = editingTheme.data.map((element, i) => {
            return {
                path: element.path,
                start: startArr[i],
                end: endArr[i],
                afternoon: startArr[i] > endArr[i]
            }
        })

        if (fs.existsSync(themePath + editingTheme.name)) {
            fs.promises.writeFile(`${themePath + editingTheme.name}/theme.json`, JSON.stringify(finalArr, null, "\t")).then(() => {
                if (editingTheme.name != e.target.elements.themeName.value) {
                    fs.promises.rename(themePath + editingTheme.name, themePath + e.target.elements.themeName.value)
                }

            })
        }
        else if (fs.existsSync(themePath + e.target.elements.themeName.value)) {
            fs.promises.writeFile(`${themePath + e.target.elements.themeName.value}/theme.json`, JSON.stringify(finalArr, null, "\t"))
        }
        console.log(JSON.stringify(finalArr, null, "\t"));

    }

    function close(id) {
        let newEditingTheme = { ...editingTheme }
        newEditingTheme.data = editingTheme.data.filter((_, index) => index !== id)
        setEditingTheme(newEditingTheme)
    }

    if (isLoading) {
        return <Loading />
    }

    return (
        <form onSubmit={save} className="edit">
            <input type="text" name="themeName" defaultValue={editingTheme.name} required />
            {

                editingTheme.data.map((element, i) => {
                    return <EditElement {...element} key={i} id={i} close={close} />
                })
            }
            <AddEditElement {...props} />
            <Link to="/" onClick={() => { setEditingTheme({}) }}><h2>Back</h2></Link>
            <button type="submit">Save</button>
        </form>

    )
}
