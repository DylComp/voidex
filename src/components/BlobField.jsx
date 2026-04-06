export default function BlobField() {
  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', zIndex: 0, pointerEvents: 'none' }}>
      {/* Lavender blob — top left */}
      <div style={{
        position: 'absolute', top: '-120px', left: '-80px',
        width: 520, height: 520, borderRadius: '999px',
        background: 'var(--lavender)', opacity: 0.38, filter: 'blur(70px)',
        animation: 'blob1 16s ease-in-out infinite',
      }} />
      {/* Mint blob — top right */}
      <div style={{
        position: 'absolute', top: '-60px', right: '-100px',
        width: 440, height: 440, borderRadius: '999px',
        background: 'var(--mint)', opacity: 0.32, filter: 'blur(65px)',
        animation: 'blob2 20s ease-in-out infinite',
      }} />
      {/* Peach blob — bottom left */}
      <div style={{
        position: 'absolute', bottom: '10%', left: '5%',
        width: 360, height: 360, borderRadius: '999px',
        background: 'var(--peach)', opacity: 0.3, filter: 'blur(60px)',
        animation: 'blob3 14s ease-in-out infinite',
      }} />
      {/* Blush blob — bottom right */}
      <div style={{
        position: 'absolute', bottom: '-80px', right: '10%',
        width: 400, height: 400, borderRadius: '999px',
        background: 'var(--blush)', opacity: 0.28, filter: 'blur(70px)',
        animation: 'blob1 22s ease-in-out infinite reverse',
      }} />
      {/* Sky blob — center */}
      <div style={{
        position: 'absolute', top: '40%', left: '40%',
        width: 300, height: 300, borderRadius: '999px',
        background: 'var(--sky)', opacity: 0.22, filter: 'blur(55px)',
        animation: 'blob2 18s ease-in-out infinite 4s',
      }} />
    </div>
  )
}
