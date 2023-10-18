import './App.css';
import {BrowserRouter,Link,Route,Routes} from "react-router-dom";
import Edit from './components/Edit';
import Home from './components/Home';
import { useState } from 'react';

function App() {
	let [gnomeThemeArr, setGnomeThemeArr] = useState([])
	let [solarThemeArr, setSolarThemeArr] = useState([])
	let [editingTheme, setEditingTheme] = useState({});

	return (
		<BrowserRouter>
			<div className="App">
				<Routes>
					<Route exact path="/" element=<Home gnomeThemeArr={gnomeThemeArr} solarThemeArr={solarThemeArr} setGnomeThemeArr={setGnomeThemeArr} setSolarThemeArr={setSolarThemeArr} setEditingTheme={setEditingTheme} /> />
					<Route exact path={`/edit/${editingTheme.name}`} element=<Edit editingTheme={editingTheme} setEditingTheme={setEditingTheme} /> />
				</Routes>  	
			</div>
		</BrowserRouter>
	);
}

export default App;
