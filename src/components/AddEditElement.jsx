const fs = window.require('fs').promises
const sharp = window.require('sharp')

function AddEditElement(props) {
    let { themePath, setEditingTheme, editingTheme } = props
    function onChange(e) {
        console.log(themePath + editingTheme.name + "/" + e.target.files[0].name,);
        let newEditingTheme = { ...editingTheme }
        sharp(e.target.files[0].path)
            .resize({ height: 180, width: 320 })
            .toBuffer()
            .then(data => { return "data:image/png;base64," + Buffer.from(data).toString('base64') })
            .then(img => {
                newEditingTheme.data.push({
                    path: e.target.files[0].name,
                    start: 0,
                    end: 0,
                    afternoon: false,
                    img: img,
                    fullPath: e.target.files[0].path
                })
                setEditingTheme(newEditingTheme)
            });
    }

    return (
        <div className="addeditelement">
            <input type="file" name="img" id="" onChange={e => onChange(e)} />
        </div>
    )
}

export default AddEditElement
