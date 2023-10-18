import React from 'react'
import {Link} from "react-router-dom";

function GnomeThemeBlock(props) {
	const {name, img} = props
	return (
		<article className='themeblock' style={{"background": `url(${img})`}} >
			<h1>{name}</h1>     
		</article>
	)
}

export default GnomeThemeBlock
