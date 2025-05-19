const formPostDelete = document.getElementById('form-post-delete')
const deletePostButton = document.getElementById('btn-post-delete')

deletePostButton.addEventListener('click', e => {
  e.preventDefault()
  const konfirmasi = confirm('apakah kamu yakin ingin menghapus post ini?')
  if (konfirmasi) {
    formPostDelete.submit()
  }
})
