/* One-off: send a contact-form notification email using India-server mail config. */
require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });

const { sendContactNotice } = require("../utils/mail");

const payload = {
  name: "Ashish Singh",
  email: "ashishsingh0828@gmail.com",
  phone: "9625181162",
  company: "Jbh",
  address: "India",
  subject: "Project Enquiry: Jbh",
  message:
    "Testing contact form email for IE Marbles India.\n\nLooking for green marble / data fabric stone options for a residential project. Please confirm this notification reached iemarbletraders@gmail.com.",
};

sendContactNotice("india", payload)
  .then((ok) => {
    console.log(ok ? "TEST_MAIL_SENT" : "TEST_MAIL_SKIPPED");
    process.exit(ok ? 0 : 1);
  })
  .catch((err) => {
    console.error("TEST_MAIL_FAIL", err && err.message ? err.message : err);
    process.exit(1);
  });
