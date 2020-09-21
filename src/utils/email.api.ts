import nodemailer from "nodemailer"
import Mail from "nodemailer/lib/mailer"
import emailTemplate from "./email.template"

class Email {
  private token: string
  private id: string
  private email: string
  private transporter: Mail
  private mailOptions: any
  constructor(token: string, id: string, email: string) {
    this.token = token
    this.id = id
    this.email = email
    this.transporter = nodemailer.createTransport({
      service: <string>process.env.GMAIL_SERVICE_NAME,
      host: <string>process.env.GMAIL_SERVICE_HOST,
      port: Number(process.env.GMAIL_SERVICE_PORT) || 0,
      secure: true,
      auth: {
        user: <string>process.env.GMAIL_USER_NAME,
        pass: <string>process.env.GMAIL_USER_PASSWORD,
      },
    })
  }

  public async sendEmail(email: string, id: string, token: string) {
    try {
      const template = await emailTemplate(
        <string>process.env.CLIENT_URL,
        id,
        token
      )
      this.mailOptions = {
        from: '"VERBA-AT-VERSUS" <misdalose@gmail.com>',
        to: email,
        subject: "Reset password",
        html: template,

      }
      await this.transporter.verify()
      await this.transporter.sendMail(this.mailOptions)

      console.log("Email sended")
    } catch (e) {
      console.error(e)
    }
  }
}

export default Email
