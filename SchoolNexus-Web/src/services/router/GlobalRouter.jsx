import React from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import Timetable from "../../components/layout/body/Timetable";
import HomePage from "../../views/Home";
import LoginPage from "../../views/Login";

export default function GlobalRouter() {
    return (
        <Router>
            <Routes>
                <Route
                    exact
                    path="/"
                    element={<LoginPage />}
                />
                <Route
                    path="/login"
                    element={<LoginPage />}
                />
                <Route
                    path="/home"
                    element={
                        <ProtectedRoute
                            allowedAccountTypes={[
                                "ADMIN",
                                "PRINCIPAL",
                                "TEACHER",
                                "STUDENT",
                            ]}>
                            <HomePage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/timetable"
                    element={
                        <ProtectedRoute
                            allowedAccountTypes={["TEACHER", "STUDENT"]}>
                            <Timetable />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="*"
                    element={<Navigate to="/" />}
                />
            </Routes>
        </Router>
    );
}
