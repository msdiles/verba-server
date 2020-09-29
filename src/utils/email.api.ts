import nodemailer from "nodemailer"
import Mail from "nodemailer/lib/mailer"
import emailTemplate from "./email.template"

class Email {
  private resetDate: string
  private resetId: string
  private email: string
  private transporter: Mail
  private mailOptions: any
  constructor(resetDate: string, resetId: string, email: string) {
    this.resetDate = resetDate
    this.resetId = resetId
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

  public async sendEmail() {
    try {
      const template = await emailTemplate(
        <string>process.env.CLIENT_URL,
        this.resetId,
        this.resetDate
      )
      this.mailOptions = {
        from: '"VERBA" <misdalose@gmail.com>',
        to: this.email,
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
