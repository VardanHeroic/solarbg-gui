import './App.css';
import {BrowserRouter,Link,Route,Routes} from "react-router-dom";
import Edit from './components/Edit';
import Home from './components/Home';

function App() {
	return (
		<BrowserRouter>
			<div className="App">
			    <div className="menu">
					<Link to="/"><h2>Home</h2></Link>
					<Link to="/one"><h2>Edit</h2></Link>
				</div>
				<Routes>
					<Route exact path="/" element=<Home/> />
					<Route exact path="/one" element=<Edit/> />
				</Routes>  	
			</div>
		</BrowserRouter>
	);
}

export default App;
