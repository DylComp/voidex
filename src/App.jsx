import Cursor from './components/Cursor'
import BlobField from './components/BlobField'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Protocol from './components/Protocol'
import Modules from './components/Modules'
import Collective from './components/Collective'
import Dispatch from './components/Dispatch'
import Footer from './components/Footer'

function App() {
  return (
    <div className="grain" style={{ position: 'relative', minHeight: '100vh' }}>
      {/* Custom cursor */}
      <Cursor />

      {/* Ambient blob background */}
      <BlobField />

      {/* Page content sits above blobs */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Nav />
        <Hero />
        <Protocol />
        <Modules />
        <Collective />
        <Dispatch />
        <Footer />
      </div>
    </div>
  )
}

export default App
