import React from 'react'

function GnomeThemeBlock(props) {
    const { name, img, setWorkingTheme } = props
    return (
        <article className='themeblock' onDoubleClick={() => setWorkingTheme(name.split('.')[0], 'gnome')} style={{ "background": `url(${img})` }} >
            <span>{name}</span>
        </article>
    )
}

export default GnomeThemeBlock
