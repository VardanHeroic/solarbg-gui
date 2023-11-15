import { useState, useEffect } from "react";
import Loading from './Loading'
import { Link } from "react-router-dom";

const sharp = window.require('sharp')

export default function Edit(props) {
    let { editingTheme, setEditingTheme, readImg } = props;
    let renderEditingTheme = editingTheme
    let [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let promiseArr = renderEditingTheme.data.map(element => {
            return sharp(editingTheme.context + element.path)
                .resize({ height: 180, width: 320 })
                .toBuffer()
                .then(data => { element.img = "data:image/png;base64," + Buffer.from(data).toString('base64'); console.log(0); });
        })
        Promise.all(promiseArr).then(() => {
            setIsLoading(false)
        })
    }, [])

    if (isLoading) {
        return <Loading />
    }

    return (
        <div className="edit">
            <h1>{editingTheme.name}</h1>
            {
                editingTheme.data.map((element, i) => {
                    return (
                        <div key={i}>
                            <img src={element.img} alt="" />
                            \
                            {element.path}
                            \
                            {element.start}
                            \
                            {element.end}
                        </div>
                    )
                })
            }
            <Link to="/" onClick={() => { setEditingTheme({}) }}><h2>Home</h2></Link>
        </div>

    )
}
