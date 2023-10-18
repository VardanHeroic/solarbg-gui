import {BrowserRouter,Link,Route,Switch} from "react-router-dom";


export default function Edit(props) {
	let {editingTheme,setEditingTheme} = props;
	return (
		<div className="edit">
			<h1>{editingTheme.name}</h1>
			{
				editingTheme.data.map((element,i) => {
					return(
						<div key={i}>
							{element.path}
						</div>
					)
				})
			}
			<Link to="/" onClick={() => {setEditingTheme({})}}><h2>Home</h2></Link>
		</div>

	)
}

