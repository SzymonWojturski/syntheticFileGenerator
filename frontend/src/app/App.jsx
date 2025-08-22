import "./App.css"
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import FormPage from "./pages/FormPage.jsx";
import DemoFile from "./pages/DemoFile.jsx";

function App() {
  return(
    <Router>
      <Routes>
        <Route path="/" element={<FormPage />} />
        {/* <Route path="/demo" element={<DemoFile/>} /> */}
      </Routes>
    </Router>
  )
}

export default App;
