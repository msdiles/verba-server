const emailTemplate = (url: string, id: string, token: string) => {
  return `<table style="padding :0 15%;width:100%; font-size: 18px; font-family: Arial, sans-serif;">
  <tr>
    <td>
      <table style="width:100%;">
        <tr style="background-color:#546e7a; width: 100%;">
          <td>
            <p style="color:white;text-align: center;">VERBA</p>
          </td>
        </tr>
        <tr style="background-color: white;">
          <td>
            <table align="center" style="padding: 15px;">
              <tr>
                <td>
                  <table style="background-color: rgb(231, 229, 229); border-radius: 5px; padding: 5px;">
                    <tr>
                      <td>
                        <h4 style="text-align: center;"><b>Reset your Password</b></h4>
                        <p style="text-align: center;">To reset your password, click this button:</p>
                        <table style="width:100%">
                          <tbody style="width:100%">
                            <tr style="width:100%">
                              <td align="center">
                                <a href="${process.env.CLIENT_URL}/reset/${id}/${token}"
                                  style="font-size:16px;color:#000000;display:inline-block;color:white;background-color:#2196F3;text-transform:uppercase;text-decoration:none;border-radius:30px;font-weight:800;padding:10px 40px">
                                  Reset password</a><br>
                                <br>
                                <p>
                                  If you did not make this request, please ignore this email
                                </p><br>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr style="background-color:#546e7a;">
          <td>
            <p style="color:white;text-align: center;">Verba Team</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>`
}

export default emailTemplate
