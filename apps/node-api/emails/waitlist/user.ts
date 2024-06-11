import {Mail} from 'domain/models';

export const template = (): string => {
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<!DOCTYPE html>
<html dir="ltr" lang="en">
  <head>
    <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
    <meta name="x-apple-disable-message-reformatting" />
  </head>
  <div style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0">You&#x27;re on the waitlist for Formizee!<div></div>
  </div>
  <body style="background-color:#fafafa;font-family:&quot;Inter&quot;,&quot;Helvetica Neue&quot;,sans-serif">
    <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="max-width:560px;margin:10px auto;padding:20px 0 48px">
      <tbody>
        <tr style="width:100%">
          <td><img alt="Formizee Logo" src="https://avatars.githubusercontent.com/u/168822716?s=200&amp;v=4" style="display:block;outline:none;border:1px solid #a3a3a3;text-decoration:none;border-radius:11px;margin-top:20px;width:56px;height:56px" />
            <h1 style="font-size:22px;letter-spacing:-0.5px;line-height:1.3;font-weight:500;color:#262626;padding:17px 0 0">You&#x27;re on the Waitlist!</h1>
            <p style="font-size:15px;line-height:1.4;margin:15px 0 25px;color:#525252">Thanks for your interest in Formizee. We&#x27;re excited to have you join our growing community.</p>
            <p style="font-size:15px;line-height:1.4;margin:25px 0 15px;color:#525252">You&#x27;ll be among the first to know when we have news or updates. In the meantime, follow us on social media for a sneak peek at what&#x27;s coming.</p>
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
</html>`;
};

export const joinUserWaitlist = (to: string): Mail => {
  return new Mail(
    'Formizee',
    'noreply@formizee.com',
    to,
    'Thanks For Join With Us',
    template()
  );
};
