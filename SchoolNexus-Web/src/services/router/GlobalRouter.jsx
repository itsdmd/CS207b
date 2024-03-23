import React from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import HomePage from "../../views/Home";
import LoginPage from "../../views/Login";
import NewClass from "../../views/Principal/NewClass";
import AssignUser from "../../views/Principal/AssignUser";
import TimetableEdit from "../../views/Principal/TimetableEdit";
import TimetableView from "../../views/TimetableView";
import ManageAccount from "../../views/Admin/ManageAccount";
import ManageSchool from "../../views/Admin/ManageSchool";
import ViewGrade from "../../views/Student/ViewGrade";

export default function GlobalRouter() {
    return (
        <Router>
            <Routes>
                <Route
                    path="/login"
                    element={<LoginPage />}
                />

                <Route
                    path="/"
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
                    path="/class/new"
                    element={
                        <ProtectedRoute allowedAccountTypes={["PRINCIPAL"]}>
                            <NewClass />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/class/assign"
                    element={
                        <ProtectedRoute allowedAccountTypes={["PRINCIPAL"]}>
                            <AssignUser />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/timetable/view"
                    element={
                        <ProtectedRoute
                            allowedAccountTypes={["TEACHER", "STUDENT"]}>
                            <TimetableView />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/grade/edit"
                    element={
                        <ProtectedRoute allowedAccountTypes={["TEACHER"]}>
                            <TimetableView />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/grade/view"
                    element={
                        <ProtectedRoute allowedAccountTypes={["STUDENT"]}>
                            <ViewGrade />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/timetable/edit"
                    element={
                        <ProtectedRoute allowedAccountTypes={["PRINCIPAL"]}>
                            <TimetableEdit />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/user/edit"
                    element={
                        <ProtectedRoute allowedAccountTypes={["ADMIN"]}>
                            <ManageAccount />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/school/edit"
                    element={
                        <ProtectedRoute allowedAccountTypes={["ADMIN"]}>
                            <ManageSchool />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="*"
                    element={<Navigate to="/home" />}
                />
            </Routes>
        </Router>
    );
}
