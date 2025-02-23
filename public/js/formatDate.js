// Menggunakan Intl.DateTimeFormat (tanpa library eksternal)
document.addEventListener('DOMContentLoaded', () => {
  const dateElements = document.querySelectorAll('.post-date')
  dateElements.forEach(el => {
    // Asumsikan tanggal mentah disimpan dalam attribute data-date
    const rawDate = el.getAttribute('data-date')
    if (rawDate) {
      const date = new Date(rawDate)
      const formatter = new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        month: 'short',
        day: '2-digit',
        year: 'numeric',
      })
      el.textContent = formatter.format(date)
    }
  })
})
