import shortid from 'shortid'
import newPage from '@/factories/pageFactory'

function newProject (title) {
  return {
    id: shortid.generate(),
    title: title,
    components: [],
    pages: [newPage('Home', '/')]
  }
}

export default newProject
