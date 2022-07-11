

import react from "react";
import Auth from "./components/Auth";



import {
    BrowserRouter,
    Routes,
    Route,
  } from "react-router-dom";

const App = () => {
    return(
    <div className="bg-gradient-to-r from-cyan-500 to-blue-500">
        <Auth/>
        
    </div>

    )
}

export default App;