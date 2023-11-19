export default function EditElement(props) {
    let { start, end, id, close, img, path } = props
    return (
        <div className="edit-block" >
            <img src={img} alt="" />
            {path}
            <input type="number" name="start" id="" defaultValue={start} />
            <input type="number" name="end" id="" defaultValue={end} />
            <button type="button" onClick={() => { close(id) }}>X</button>
        </div>

    )
}
