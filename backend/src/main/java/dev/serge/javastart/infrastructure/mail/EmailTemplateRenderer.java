package dev.serge.javastart.infrastructure.mail;

import org.springframework.web.util.HtmlUtils;

public class EmailTemplateRenderer {
  public RenderedEmail renderVerifyEmail(VerifyEmailTemplateData data) {
    String identity = firstPresent(data.username(), data.email());
    String safeIdentity = HtmlUtils.htmlEscape(identity);
    String safeAppName = HtmlUtils.htmlEscape(data.appName());
    String safeEmail = HtmlUtils.htmlEscape(data.email());
    String safeSupport = HtmlUtils.htmlEscape(data.supportEmail());
    String safeUrl = HtmlUtils.htmlEscape(data.verifyUrl());
    String subject = "Verify your Java Start account";
    String textBody =
        """
        java-start://identity

        Confirm your access for %s

        identity: %s
        email: %s
        status: pending_email_verification
        decision: click verify

        Verify this email to activate your learning cabinet.
        This link expires in %d minutes.

        %s

        Did not request this? Ignore the message or contact %s.
        """
            .formatted(
                data.appName(),
                identity,
                data.email(),
                data.expiresInMinutes(),
                data.verifyUrl(),
                data.supportEmail());
    String htmlBody =
        """
        <!doctype html>
        <html lang="en">
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>Verify your Java Start account</title>
          </head>
          <body style="margin:0;background:#fffdf8;color:#27231f;font-family:Arial,Helvetica,sans-serif;">
            <table role="presentation" width="100%%" cellspacing="0" cellpadding="0" style="background:#fffdf8;margin:0;padding:32px 16px;">
              <tr>
                <td align="center">
                  <table role="presentation" width="100%%" cellspacing="0" cellpadding="0" style="max-width:640px;background:#ffffff;border:1px solid #eadfce;border-radius:12px;overflow:hidden;">
                    <tr>
                      <td style="padding:28px 28px 8px 28px;">
                        <div style="font-family:Courier New,Courier,monospace;color:#147d64;font-size:15px;font-weight:700;letter-spacing:0;">java-start://identity</div>
                        <h1 style="margin:18px 0 8px 0;color:#27231f;font-size:34px;line-height:1.05;font-weight:800;letter-spacing:0;">Confirm your access</h1>
                        <p style="margin:0;color:#6f665c;font-size:16px;line-height:1.55;">Email verification for %s.</p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:16px 28px 0 28px;">
                        <table role="presentation" width="100%%" cellspacing="0" cellpadding="0" style="background:#fff8ec;border-left:3px solid #147d64;">
                          <tr>
                            <td style="padding:16px 18px;color:#4d463f;font-family:Courier New,Courier,monospace;font-size:16px;line-height:1.6;">
                              <div><span style="color:#6f665c;">identity:</span> %s</div>
                              <div><span style="color:#6f665c;">email:</span> %s</div>
                              <div><span style="color:#6f665c;">status:</span> pending_email_verification</div>
                              <div><span style="color:#c95b43;">decision:</span> click verify</div>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:24px 28px 8px 28px;">
                        <p style="margin:0 0 18px 0;color:#4d463f;font-size:16px;line-height:1.6;">Verify this email to activate your learning cabinet. This link expires in %d minutes.</p>
                        <a href="%s" style="display:block;background:#147d64;color:#fffdf8;text-decoration:none;text-align:center;border-radius:8px;padding:16px 20px;font-size:16px;font-weight:800;">Verify Email</a>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:18px 28px 28px 28px;">
                        <p style="margin:0;color:#6f665c;font-size:13px;line-height:1.6;word-break:break-all;">If the button fails, open this link:<br><a href="%s" style="color:#147d64;text-decoration:none;">%s</a></p>
                        <p style="margin:18px 0 0 0;color:#6f665c;font-size:13px;line-height:1.6;">Did not request this? Ignore the message or contact %s.</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
        """
            .formatted(
                safeAppName,
                safeIdentity,
                safeEmail,
                data.expiresInMinutes(),
                safeUrl,
                safeUrl,
                safeUrl,
                safeSupport);
    return new RenderedEmail(subject, htmlBody, textBody);
  }

  private String firstPresent(String primary, String fallback) {
    if (primary != null && !primary.isBlank()) {
      return primary.trim();
    }
    return fallback == null ? "" : fallback.trim();
  }
}
