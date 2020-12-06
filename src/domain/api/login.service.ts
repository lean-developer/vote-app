import ums from './server/ums'
import { LoginResult } from '../models/loginResult'
import { User } from '../models/user'
import { ServiceResult } from '../models/serviceResult'

class LoginService {
  async register (email: string, pw: string): Promise<LoginResult | undefined> {
    try {
      const headers = {
        'Content-Type': 'application/json',
        Authorization: 'Pw ' + pw
      }
      const api = 'signUp/' + email
      const resp = await ums.post(api, null, { headers: headers })
      const result: LoginResult = resp.data as LoginResult
      if (result.code === 'auth/OK') {
        result.isAuth = true
      } else {
        result.isAuth = false
      }
      return result
    } catch (e) {
      console.error(e)
    }
  }

  async login (email: string, pw: string): Promise<LoginResult | undefined> {
    try {
      const headers = {
        'Content-Type': 'application/json',
        Authorization: 'Pw ' + pw
      }
      const api = 'signIn/' + email
      const resp = await ums.post(api, null, { headers: headers })
      const result: LoginResult = resp.data as LoginResult
      if (result.code === 'auth/OK') {
        result.isAuth = true
      } else {
        result.isAuth = false
      }
      return result
    } catch (e) {
      console.error(e)
    }
  }

  async updateDisplayName (token: string, displayName: string): Promise<ServiceResult> {
    try {
      const headers = {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      }
      const api = 'updateProfile/displayName/' + displayName
      const resp = await ums.post(api, null, { headers: headers })
      console.log('API', api)
      console.log('RESULT', resp)
      const result: ServiceResult = resp.data as ServiceResult
      if (result.code === 'updateDisplayName/OK') {
        result.resultState = true
      } else {
        result.resultState = false
        result.message = resp.data.message.message
      }
      return result
    } catch (e) {
      console.error(e)
      return { code: 'updateDisplayName/ERROR', message: e, resultState: false }
    }
  }

  async updatePhoto (email: string, pw: string, photoName: string): Promise<boolean> {
    try {
      const headers = {
        'Content-Type': 'application/json',
        Authorization: 'Pw ' + pw
      }
      const api = 'updateProfile/' + email + '/photoURL/' + photoName
      const resp = await ums.post(api, null, { headers: headers })
      const result: LoginResult = resp.data as LoginResult
      if (result.code === 'updatePhotoURL/OK') {
        return true
      }
    } catch (e) {
      console.error(e)
    }
    return false
  }
}

export default new LoginService()
