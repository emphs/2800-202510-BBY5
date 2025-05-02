import { Outlet } from '@tanstack/react-router';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100">
      <Outlet />
    </div>
  );
}

export default App;
