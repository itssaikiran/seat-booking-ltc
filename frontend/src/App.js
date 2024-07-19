import "./App.css";
import Login from "./Login";
import Signup from "./Signup";
import Admin from "./Admin";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Hoe from "./Hoe";
import Manager from "./Manager";
import Header from "./Header";
import { Employee } from "./Employee";
// import AuthProvider from "./AuthProvider";
import ProtectedRoute from "./ProtectedRoute";

function App() {
  return (
    <div className="App">
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<Admin />} />
            <Route path="/hoe" element={<Hoe />} />
            <Route path="/manager" element={<Manager />} />
            <Route path="/employee" element={<Employee />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
