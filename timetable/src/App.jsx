import {
  BrowserRouter as Router,
  Route,
  Routes,
  NavLink,
} from "react-router-dom";
import Timetable from "./pages/Timetable";
import Teachers from "./pages/Teachers";
import Classes from "./pages/Classes";
import Home from "./pages/Home";
import TeacherTimetable from "./pages/TeacherTimetable";

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        {/* Navigation Bar */}
        <nav className="bg-blue-600 text-white p-4">
          <div className="container mx-auto flex justify-between">
            <h1 className="text-lg font-bold">School Management</h1>
            <div className="space-x-4">
              <NavLink to="/" className="hover:underline">
                Home
              </NavLink>
              <NavLink to="/timetable" className="hover:underline">
                Timetable
              </NavLink>
              <NavLink to="/teachers" className="hover:underline">
                Teachers
              </NavLink>
              <NavLink to="/teacher" className="hover:underline">
                TeachersTimetable
              </NavLink>
              <NavLink to="/classes" className="hover:underline">
                Classes
              </NavLink>
            </div>
          </div>
        </nav>

        {/* Page Content */}
        <div className="container mx-auto p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/timetable" element={<Timetable />} />
            <Route path="/teachers" element={<Teachers />} />
            <Route path="/classes" element={<Classes />} />
            <Route path="/teacher" element={<TeacherTimetable />} />
          </Routes>
        </div>
      </div>
    </Router>
    // <Timetable/>
  );
};

export default App;
