import LoginPage from "./views/Login";
import Timetable from "./components/layout/body/Timetable";
import HomePage from "./views/Home";
import GlobalRouter from "./services/router/router";


const App = () => {
    return (
        <div> 
            <GlobalRouter />
        </div>
    );
};
export default App;
