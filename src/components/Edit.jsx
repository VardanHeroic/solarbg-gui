import { useState, useEffect } from "react";
import Loading from './Loading'
import { Link } from "react-router-dom";

const sharp = window.require('sharp')

export default function Edit(props) {
    let { editingTheme, setEditingTheme, readImg } = props;
    let [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        console.log(editingTheme);
        let promiseArr = editingTheme.data.map(element => {
            return sharp(editingTheme.context + element.path)
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
        let startArr = [...e.target.elements.start].map(input => input.value)
        let endArr = [...e.target.elements.end].map(input => input.value)
        let finalArr = editingTheme.data.map((element, i) => {
            return {
                path: element.path,
                start: startArr[i],
                end: endArr[i],
                afternoon: element.afternoon
            }
        })
        console.log(finalArr);

    }



    if (isLoading) {
        return <Loading />
    }

    return (
        <form onSubmit={save} className="edit">
            <h1>{editingTheme.name}</h1>
            {
                editingTheme.data.map((element, i) => {
                    return (
                        <div className="edit-block" key={i}>
                            <img src={element.img} alt="" />
                            {element.path}
                            <input type="text" name="start" id="" defaultValue={element.start} />
                            <input type="text" name="end" id="" defaultValue={element.end} />
                            <button type="button">X</button>
                        </div>
                    )
                })
            }
            <Link to="/" onClick={() => { setEditingTheme({}) }}><h2>Back</h2></Link>
            <button type="submit">Save</button>
        </form>

    )
}
