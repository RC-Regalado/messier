import axios from 'axios'

/**
 * Guarda el proyecto actual en el repositorio especificado
 *
 * @param  {object} project : Project definition to be saved in the repository (as vue.gg)
 * @param  {string} owner : Owner
 * @param  {string} repo : Repository where to save the project definition
 * @param  {string} token : Authentication token
 * @return {object} : returns a JSON of the created file of false is something goes wrong
 */
async function saveProject (project, owner, repo, token) {
  try {
    return await axios.post('/api/project', { project, owner, repo, token })
  } catch (e) {
    console.error(e)
    return false
  }
}

/**
 * Retrieves the base64 vue.gg project definition from the especified repository.
 *
 * @param  {string} owner : owner of the repository
 * @param  {string} repo : repository to get the vue.gg project definition from
 * @param  {string} [token] : oauth2 token (for access private repos) [unused for now]
 * @return {string} : base64 string of the vue.gg file of the repository
 */
async function getProject (owner, repo, token) {
  try {
    return await axios.get('/api/project', { params: { owner, repo, token } })
  } catch (e) {
    console.error(e)
    return false
  }
}

/**
 * Generated vuejs sources from a vuegg project definition
 *
 * @param  {object} project : current project
 * @return {blob} : A zip file containing the vuejs sources of the passed project
 */
async function generateSources (project) {
  try {
    return await axios.post('/api/generate', project, { responseType: 'blob' })
  } catch (e) {
    console.error(e)
    return false
  }
}

const api = {
  saveProject,
  getProject,
  generateSources
}
export default api
