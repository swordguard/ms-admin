import { Routes, Route } from "react-router-dom";


import ListComponent from './components/ListComponent'

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/admin/jian" element={<ListComponent />} />
      </Routes>
    </div>
  );
}

export default App;
