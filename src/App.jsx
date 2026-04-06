import Cursor from './components/Cursor'
import BlobField from './components/BlobField'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Confess from './components/Confess'
import Archetypes from './components/Archetypes'
import Feed from './components/Feed'
import About from './components/About'
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
        <Confess />
        <Feed />
        <Archetypes />
        <About />
        <Footer />
      </div>
    </div>
  )
}

export default App
