// Menggunakan Intl.DateTimeFormat (tanpa library eksternal)
document.addEventListener('DOMContentLoaded', () => {
  const dateElements = document.querySelectorAll('.post-date')
  dateElements.forEach(el => {
    const date = new Date(el.textContent.trim())
    const formatter = new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    })
    el.textContent = formatter.format(date)
  })
})
