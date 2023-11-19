import './App.css';
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import Edit from './components/Edit';
import Home from './components/Home';
import { useState } from 'react';

const { platform, homedir } = window.require('os')
const fs = window.require('fs').promises

function App() {
    let [gnomeThemeArr, setGnomeThemeArr] = useState([])
    let [solarThemeArr, setSolarThemeArr] = useState([])
    let [editingTheme, setEditingTheme] = useState({});
    let themePath = null

    async function readImg(path) {
        return `data:image/png;base64,${await fs.readFile(path, { encoding: 'base64' })}`
    }


    switch (platform()) {
        case 'linux':
            themePath = homedir() + '/.local/share/solarbg/themes/';
            break;
        case 'win32':
            themePath = homedir() + '\\AppData\\Roaming\\solarbg\\themes\\';
            break;
        default:
            console.log('Your os is not supported');
    }


    return (
        <BrowserRouter>
            <div className="App">
                <Routes>
                    <Route exact path="/" element=<Home readImg={readImg} themePath={themePath} gnomeThemeArr={gnomeThemeArr} solarThemeArr={solarThemeArr} setGnomeThemeArr={setGnomeThemeArr} setSolarThemeArr={setSolarThemeArr} setEditingTheme={setEditingTheme} /> />
                    <Route exact path={`/edit/`} element=<Edit themePath={themePath} editingTheme={editingTheme} setEditingTheme={setEditingTheme} /> />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
