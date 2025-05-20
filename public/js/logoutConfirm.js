const formLogout = document.querySelector('#form-logout')
const btnLogout = document.querySelector('#btn-logout')

btnLogout.addEventListener('click', e => {
  e.preventDefault()
  const konfirmasi = confirm('apakah anda yakin ingin logout?')

  if (konfirmasi) {
    formLogout.submit()
  }
})
