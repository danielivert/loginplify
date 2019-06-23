import * as nodemailer from 'nodemailer'
import { randomBytes } from 'crypto'
import { promisify } from 'util'
import { EMAIL_HOST, EMAIL_USER, EMAIL_PASSWORD } from './constants'

export async function sendConfirmationEmail(
  host: string,
  token: string,
  email: string
) {
  const transporter = nodemailer.createTransport({
    auth: {
      pass: EMAIL_PASSWORD,
      user: EMAIL_USER
    },
    host: EMAIL_HOST,
    port: 465,
    secure: true
  })

  const LINK = `http://${host}/verify/${token}`

  const mailOptions = {
    from: 'hello@danieltrevino.se',
    subject: `Login service verification`,
    text: `
      Visit this link to verify your account: ${LINK}
    `,
    to: email
  }

  try {
    const response = await transporter.sendMail(mailOptions)
    // tslint:disable-next-line:no-console
    console.log('SENDING EMAIL', response)
  } catch (e) {
    // tslint:disable-next-line:no-console
    console.log('Error', e)
  }

  return true
}

export const isStillValidTokenExpiry = (verifyTokenExpiry: any) => {
  const oneHourAgo = Date.now() - 3600000
  return verifyTokenExpiry > oneHourAgo
}

export const createRandomToken = async () => {
  const randomBytesPromise = promisify(randomBytes)
  const randomToken = (await randomBytesPromise(20)).toString('hex')
  const randomTokenExpiry = Date.now() + 3600000 // 1 hour from now

  return { randomToken, randomTokenExpiry }
}
