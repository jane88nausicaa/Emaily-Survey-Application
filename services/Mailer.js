const sendgrid = require("sendgrid");
const helper = sendgrid.mail;
const keys = require("../config/keys");

/*
helper.Mail is an object that takes a lot of configuration and spits
out a mailer. we want to take that Mail class and provide some addtional
customization to it
super(): make sure that any ocnstructor that is defined on the Mail class
gets executed by calling the super function
*/
class Mailer extends helper.Mail {
  constructor({ subject, recipients }, content) {
    super();

    this.sgApi = sendgrid(keys.sendGridKey);
    this.from_email = new helper.Email("no-reply@emaily.com");
    this.subject = subject;
    this.body = new helper.Content("text/html", content);
    this.recipients = this.formatAddresses(recipients);

    this.addContent(this.body); // addContent is helper.Mail builin funciton
    this.addClickTracking();
    this.addRecipients();
  }
  /* for each recipient, we pull off the email property
  format it with the helper.Email()
  */
  formatAddresses(recipients) {
    return recipients.map(({ email }) => {
      return new helper.Email(email);
    });
  }
  // sendgrid scans the email, replaces every link with own special one
  // addClickTracking() enable this step
  addClickTracking() {
    const trackingSettings = new helper.TrackingSettings();
    const clickTracking = new helper.ClickTracking(true, true);

    trackingSettings.setClickTracking(clickTracking);
    this.addTrackingSettings(trackingSettings);
  }
  /* when we call formatAddresses(), we turn each recipient into one of
  the helper.Email thing above.
  Now take the list of recipients and add them to the mailer
  */
  addRecipients() {
    const personalize = new helper.Personalization();
    this.recipients.forEach(recipient => {
      personalize.addTo(recipient);
    });
    this.addPersonalization(personalize);
  }

  // take this mailer and send it to sendGrid
  async send() {
    const request = this.sgApi.emptyRequest({
      method: "POST",
      path: "/v3/mail/send",
      body: this.toJSON()
    });

    const response = await this.sgApi.API(request);
    return response;
  }
}

module.exports = Mailer;
