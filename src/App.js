// Filename - App.js

import React from "react";
// import Navbar from "./components/navbar";
// import {
// 	BrowserRouter as Router,
// 	Routes,
// 	Route,
// } from "react-router-dom";
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "./pages";
import RoundBegin from "./pages/round_begin";
import RoundFinish from "./pages/round_finish"
import SignUp from "./pages/signup";
import RoundStarted from "./pages/round_started";
import "./App.css";

function App() {
	return (
		<Router>
			{/* <Navbar /> */}
			<Routes>
				<Route exact path="/" element={<Home />} />
				<Route path="/round_begin" element={<RoundBegin />} />
				<Route path="/round_started" element={<RoundStarted />} />
				<Route path="/round_finish" element={<RoundFinish />} />
				<Route path="/sign-up" element={<SignUp />} />
			</Routes>
		</Router>
	);
}

export default App;

