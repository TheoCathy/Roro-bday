// Lightweight interaction for the birthday landing page.
// Celebrate button -> confetti. Poster click -> modal viewer.

function makeConfettiPiece() {
  const el = document.createElement('div')
  el.className = 'confetti'
  const colors = ['#4DA6FF', '#70D6FF', '#2E86FF', '#A1D8FF', '#4DD9B4']
  const size = Math.floor(Math.random() * 12) + 8
  el.style.width = `${size}px`
  el.style.height = `${Math.floor(size * 1.2)}px`
  el.style.left = Math.random() * 100 + 'vw'
  el.style.background = colors[Math.floor(Math.random() * colors.length)]
  el.style.borderRadius = `${Math.random() * 50}%`
  el.style.transform = `rotate(${Math.random() * 360}deg)`
  el.style.animationDelay = `${Math.random() * 200}ms`
  return el
}

function burstConfetti(count = 40) {
  const container = document.body
  for (let i = 0; i < count; i++) {
    const p = makeConfettiPiece()
    container.appendChild(p)
    p.addEventListener('animationend', () => p.remove())
  }
}

function openPosterModal(posterEl) {
  // create overlay
  const overlay = document.createElement('div')
  overlay.className = 'poster-modal'
  const inner = document.createElement('div')
  inner.className = 'inner'


  const img = posterEl.querySelector('#poster-img')
  if (img && img.src) {
    const big = document.createElement('img')
    big.src = img.src
    big.alt = img.alt || "Poster"
    inner.appendChild(big)
  } else {
    // clone the poster block so the style is retained
    const clone = posterEl.cloneNode(true)
    clone.classList.remove('poster')
    clone.style.maxWidth = '720px'
    inner.appendChild(clone)
  }

  overlay.appendChild(inner)
  document.body.appendChild(overlay)

  function close() { overlay.remove() }
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close()
  })
  document.addEventListener('keydown', function esc(e) { if (e.key === 'Escape') { close(); document.removeEventListener('keydown', esc) } })
}

document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('celebrate')
  if (btn) {
    btn.addEventListener('click', () => {
      burstConfetti(50)
      btn.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.06)' }, { transform: 'scale(1)' }], { duration: 300 })
    })
  }

  const poster = document.getElementById('poster')
  if (poster) {

    const posterImg = document.getElementById('poster-img')
    if (posterImg && posterImg.src) {
      // Use poster image as poster background
      poster.style.backgroundImage = `url('${posterImg.src}')`
      poster.classList.add('has-bg')
      // hide the inline image (we'll use it in the modal instead)
      posterImg.style.display = 'none'

      // Try to use a publish-friendly location first (/assets/...).
      // Some hosts (Netlify) serve a `public` or `assets` folder differently; try /assets/IMG_5340.PNG first.
      const publicPath = '/assets/IMG_5340.PNG'
      const tryImg = new Image()
      console.debug('[poster-debug] attempting to load public asset path:', publicPath)
      tryImg.onload = () => {
        console.debug('[poster-debug] public asset loaded successfully:', publicPath)
        // if /assets/IMG_5340.PNG exists on the server, prefer it for the page background
        const pageEl = document.querySelector('.page')
        if (pageEl) {
          pageEl.style.backgroundImage = `url('${publicPath}')`
          pageEl.classList.add('has-poster-bg')
          console.debug('[poster-debug] using public asset as page background:', publicPath)
        }
      }
      tryImg.onerror = () => {
        console.warn('[poster-debug] public asset not available at', publicPath, '- falling back to inline image src')
        // fallback to using the inline poster image's src (this will be absolute to the deployed path)
        const pageEl = document.querySelector('.page')
        if (pageEl) {
          pageEl.style.backgroundImage = `url('${posterImg.src}')`
          pageEl.classList.add('has-poster-bg')
          console.debug('[poster-debug] using inline poster image as page background:', posterImg.src)
        }
      }
      tryImg.src = publicPath
    }

    poster.addEventListener('click', () => openPosterModal(poster))
  }
})
