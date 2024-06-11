import {Mail} from 'domain/models';

const verifyLinkedEmailTemplate = (email: string, link: string): string => {
  return `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<!DOCTYPE html>
<html dir="ltr" lang="en">
  <head>
    <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
    <meta name="x-apple-disable-message-reformatting" />
  </head>
  <div style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0">Verify ${email} as your new linked email for Formizee<div></div>
  </div>
  <body style="background-color:#fafafa;font-family:&quot;Inter&quot;,&quot;Helvetica Neue&quot;,sans-serif">
    <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="max-width:560px;margin:10px auto;padding:20px 0 48px">
      <tbody>
        <tr style="width:100%">
          <td><img alt="Formizee Logo" src="https://avatars.githubusercontent.com/u/168822716?s=200&amp;v=4" style="display:block;outline:none;border:1px solid #a3a3a3;text-decoration:none;border-radius:11px;margin-top:20px;width:56px;height:56px" />
            <h1 style="font-size:22px;letter-spacing:-0.5px;line-height:1.3;font-weight:500;color:#262626;padding:17px 0 0">Verify Your New Linked Email</h1>
            <p style="font-size:15px;line-height:1.4;margin:15px 0 25px;color:#525252">We noticed you&#x27;re adding <span style="color:#f59e0b;text-decoration-line:underline;font-weight:500">${email}</span> to your Formizee account.<br />To finish setting this up, click in the button below.</p>
            <p style="font-size:15px;line-height:1.4;margin:15px 0 25px;color:#525252"></p><a href="${link}" style="line-height:100%;text-decoration:none;display:inline-block;max-width:100%;font-size:14px;border-radius:6px;border:1px solid #E4E4E7;padding:8px 16px 8px 16px;background:#fff;color:#000" target="_blank"><span><!--[if mso]><i style="letter-spacing: 16px;mso-font-width:-100%;mso-text-raise:12" hidden>&nbsp;</i><![endif]--></span><span style="max-width:100%;display:inline-block;line-height:120%;mso-padding-alt:0px;mso-text-raise:6px"><div style="display:flex;flex-direction:row;align-items:center"><span style="margin-right:8px;font-weight:500">Verify Email</span><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
                <path fill-rule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clip-rule="evenodd"></path>
              </svg></div></span><span><!--[if mso]><i style="letter-spacing: 16px;mso-font-width:-100%" hidden>&nbsp;</i><![endif]--></span></a>
            <p style="font-size:15px;line-height:1.4;margin:25px 0 15px;color:#525252">This link will expire in one hour. If you don&#x27;t verify your email within that time, just request a new link when you&#x27;re ready.</p>
            <hr style="width:100%;border:none;border-top:1px solid #eaeaea;border-color:#d4d4d4;margin:18px 0 13px" />
            <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="max-width:37.5em;flex-direction:row;justify-content:space-between;align-items:center;display:flex">
              <tbody>
                <tr style="width:100%">
                  <td><a href="https://formizee.com" style="color:#a3a3a3;text-decoration:none;font-size:14px" target="_blank">Formizee S.L.</a></td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  </body>
</html>
  `;
};

export const verifyLinkedEmail = (to: string, link: string): Mail => {
  const html = verifyLinkedEmailTemplate(to, link);

  return new Mail(
    'Formizee',
    'noreply@formizee.com',
    to,
    'Linked Email Verification',
    html
  );
};
