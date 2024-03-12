import LoginPage from "./views/Login";
import Timetable from "./components/layout/body/Timetable";
import HomePage from "./views/Home";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";


const App = () => {
    return (
        <div> 
            <Router>
                <Routes>
                    <Route
                        exact
                        path="/"
                        element= {<HomePage />}
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
        </div>
    );
};
export default App;
