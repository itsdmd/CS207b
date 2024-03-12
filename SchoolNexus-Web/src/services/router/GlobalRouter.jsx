import React from 'react'
import Timetable from '../../components/layout/body/Timetable';
import HomePage from '../../views/Home';
import LoginPage from '../../views/Login';


import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";

export default function GlobalRouter() {
  return (
    <Router>
            <Routes>
                    <Route
                        exact
                        path="/"
                        element= {<LoginPage />}
                    />
                    <Route
                        path = "/home"
                        element = {<HomePage />}
                    />
                    <Route
                        path = "/viewtables"
                        element = {<Timetable />}
                    />

                    <Route
                        path="*"
                        element={<Navigate to="/" />}
                    />
            </Routes>
    </Router>
  )
}
