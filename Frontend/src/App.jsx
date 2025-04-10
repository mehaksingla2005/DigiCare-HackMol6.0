import "./App.css";
import Navbar from "./components/Navbar";


function App() {
  return (
    <BrowserRouter>
      {/* Navbar appears on every page */}
      <Navbar isLoggedIn={isLoggedIn} userEmail={userEmail} onLogout={handleLogout} />


      </BrowserRouter>
  );
}

export default App;