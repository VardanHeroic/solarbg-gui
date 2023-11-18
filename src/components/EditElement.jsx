import React from 'react'

export default function EditElement(props) {
    return (
        <div className="edit-block" >
            <img src={props.img} alt="" />
            {props.path}
            <input type="number" name="start" id="" defaultValue={props.start} />
            <input type="number" name="end" id="" defaultValue={props.end} />
            <button type="button" onClick={() => { props.close(props.id) }}>X</button>
        </div>

    )
}
