import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import Navbar from "./components/Navbar";
import Home from './components/pages/Home';
import Login from './components/pages/Login';
import SignUp from './components/pages/SignUp';
import store from './store/store'; // Import the Redux store
import Dashboard from './components/Dashboard/Dashboard';

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <div className="overflow-x-hidden text-neutral-900 antialiased selection:bg-cyan-400 selection:text-cyan-900">
          <div className='fixed top-0 -z-10 h-full w-full'>
            <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]">
            </div>
          </div>
          
          <div className='container mx-auto px-8'>
            <Navbar />
            
            {/* Define the routes here */}
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="dashboard" element={<Dashboard />} />
            </Routes>
          </div>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
