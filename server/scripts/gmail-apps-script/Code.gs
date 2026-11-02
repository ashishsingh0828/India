/**
 * Deploy as Web App (Execute as: Me, Who has access: Anyone).
 * Paste the Web App URL into Render env as GMAIL_SCRIPT_URL.
 * This uses the logged-in Google account's Gmail (iemarbletraders@gmail.com).
 */
function doPost(e) {
  try {
    const data = JSON.parse((e && e.postData && e.postData.contents) || "{}");
    const to = data.to || Session.getActiveUser().getEmail();
    const subject = data.subject || "New enquiry";
    const text = data.text || "";
    const html = data.html || text;
    const replyTo = data.replyTo || "";
    const options = { htmlBody: html, name: data.fromName || "IE Marbles" };
    if (replyTo) options.replyTo = replyTo;
    MailApp.sendEmail(to, subject, text, options);
    return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(
      ContentService.MimeType.JSON
    );
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ ok: false, error: String(err && err.message ? err.message : err) })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService.createTextOutput("IE Marbles mail webhook OK");
}
