import { User } from "@retro/shared"

import { OAuth2Client, TokenPayload } from 'google-auth-library'

const client = new OAuth2Client('337655515304-0bjq5sbn6ddai2a8roodjou25ngo3psu.apps.googleusercontent.com')

interface UserInfo {
    sub: string,
    name: string,
    given_name: string,
    family_name: string,
    picture: string,
    email: string,
    email_verified: boolean,
    local: string,
    hd: string
}

export async function getUserData(auth: {jwt?: string, code?: string, token?: string}) : Promise<User> {
    try {
        if(auth.jwt) {
            const claims = await verifyCredentials(auth.jwt)
            return {
                uuid: claims.sub,
                name: claims.name,
                picture: claims.picture,
            } as User
        } else if(auth.code) {
            const userInfo = await verifyCode(auth.code)
            return {
                uuid: userInfo.sub,
                name: userInfo.name,
                picture: userInfo.picture,
            } as User
        } else if(auth.token) {
            const userInfo = await verifyToken(auth.token)
            return {
                uuid: userInfo.sub,
                name: userInfo.name,
                picture: userInfo.picture,
            } as User
        }
        throw 'NO_AUTH'
    } catch(e) {
        console.error('unable to login', e)
        throw 'ERROR_LOGIN'
    }

}

// Call this function to validate the JWT credential sent from client-side
async function verifyCredentials(credential: string) : Promise<TokenPayload> {
    const ticket = await client.verifyIdToken({
        idToken: credential,
        })
        const payload = ticket.getPayload()
        if(!payload) throw 'ERROR GETTING PAYLOAD'
        return payload
  }

  // Call this function to validate OAuth2 authorization code sent from client-side
async function verifyCode(code: string) : Promise<UserInfo> {
    let { tokens } = await client.getToken(code)
    client.setCredentials({ access_token: tokens.access_token })
    const userinfo = await client.request<UserInfo>({
      url: 'https://www.googleapis.com/oauth2/v3/userinfo'
    })
    console.log(userinfo)
    return userinfo.data
  }

  // Call this function to validate OAuth2 authorization code sent from client-side
async function verifyToken(token: string) : Promise<UserInfo>  {
    client.setCredentials({ access_token: token })
    const userinfo = await client.request<UserInfo>({
      url: "https://www.googleapis.com/oauth2/v3/userinfo",
    });
    return userinfo.data
  }