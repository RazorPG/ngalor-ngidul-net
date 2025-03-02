const formUpdatePost = document.getElementById('form-post-update')
const btnFormPost = document.getElementById('btn-post-update')

btnFormPost.addEventListener('click', e => {
  e.preventDefault()
  formUpdatePost.submit()
})
