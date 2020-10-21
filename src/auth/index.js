const open = require('oauth-open')
const axios = require('axios')
const shortid = require('shortid')
const promisify = require('es6-promisify')

const CLIENT_ID = process.env.CLIENT_ID
const REDIRECT_URL = process.env.CALLBACK_URL
const SCOPE = 'read:user public_repo'

const auth = {
  authorizeUser,
  getAuthenticatedUser
}

async function authorizeUser () {
  const oauthOpen = promisify(open)

  const STATE = shortid.generate()
  const authUrl = 'https://github.com/login/oauth/authorize'
    .concat('?client_id=').concat(CLIENT_ID)
    .concat('&redirect_uri=').concat(REDIRECT_URL)
    .concat('&state=').concat(STATE)
    .concat('&scope=').concat(SCOPE)

  try {
    const resp = await oauthOpen(authUrl)

    if (resp.state === STATE) {
      return await _getAccessToken(resp.code)
    } else {
      return false
    }
  } catch (e) {
    console.error(e)
    return false
  }
}

async function _getAccessToken (code) {
  try {
    const resp = await axios.post('/api/get-access-token', { code: code })
    return resp.data
  } catch (e) {
    console.error(e)
    return false
  }
}

async function getAuthenticatedUser (token) {
  try {
    const resp = await axios.get('https://api.github.com/user', {
      headers: {
        Authorization: 'bearer '.concat(token)
      }
    })
    return resp.data
  } catch (e) {
    console.error(e)
    return false
  }
}

export default auth
