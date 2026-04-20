import Navbar from './components/layout/Navbar';
import Home from './pages/Home';

function App() {
  return (
    <div className="relative min-h-screen bg-brand-black">
      <Navbar />
      <main>
        {/* all pages come here */}
        <Home />
      </main>
    </div>
  );
}

export default App;