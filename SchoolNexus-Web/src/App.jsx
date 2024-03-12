import GlobalRouter from "./services/router/GlobalRouter";
import Gradestable from "./components/layout/body/GradesTable";
import Timetable from "./components/layout/body/Timetable";
const App = () => {
    return (
        <div className="w-50 m-5"> 
            {/* <GlobalRouter /> */}
            <Gradestable />
            
        </div>
    );
};
export default App;
