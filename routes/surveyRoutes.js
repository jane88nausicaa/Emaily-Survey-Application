// structure for routes:
//  define arrow function -> export -> express app object index.js

// url : default module in the NodeJs System for parsing url
const _ = require("lodash");
const { Path } = require("path-parser");
const { URL } = require("url");

const mongoose = require("mongoose");
const requireLogin = require("../middlewares/requireLogin");
const requireCredits = require("../middlewares/requireCredits");
const Mailer = require("../services/Mailer");
const surveyTemplate = require("../services/emailTemplates/surveyTemplate");

const Survey = mongoose.model("surveys");

module.exports = app => {
  // pull out all the surveys created by the current user
  app.get("/api/surveys", requireLogin, async (req, res) => {
    const surveys = await Survey.find({ _user: req.user.id }).select({
      recipients: false
    });
    res.send(surveys);
  });

  app.get("/api/surveys/:surveyId/:choice", (req, res) => {
    res.send("Thanks for voting!");
  });
  /* p.test will return an object with surveyId & choice
  if it is not able to make the match, it returns null
  So no destructuring like {surveyId, choice}
  */
  app.post("/api/surveys/webhooks", (req, res) => {
    // : --> extract this part
    const p = new Path("/api/surveys/:surveyId/:choice");
    _.chain(req.body)
      .map(({ email, url }) => {
        // extract path (route) from URL
        const match = p.test(new URL(url).pathname);
        if (match) {
          return { email, surveyId: match.surveyId, choice: match.choice };
        }
      })
      // compact() removes any elements that are undefined
      .compact()
      .uniqBy("email", "surveyId")
      .each(({ surveyId, email, choice }) => {
        /* [choice] : not create array. Check what's the value of choice variable,
        if 'yes', replace 'yes' here (increase by 1)
        $set: in survey we found, look at the recipient's subdocument collection to
        find the appropriate recipient who was found in original query using $elemMatch
        exec() : execute the query. In Mongo using _id
        */
        Survey.updateOne(
          {
            _id: surveyId,
            recipients: {
              $elemMatch: { email: email, responded: false }
            }
          },
          {
            $inc: { [choice]: 1 },
            $set: { "recipients.$.responded": true },
            lastResponded: new Date()
          }
        ).exec();
      })
      .value();

    res.send({});
  });

  app.post("/api/surveys", requireLogin, requireCredits, async (req, res) => {
    const { title, subject, body, recipients } = req.body;

    /* use mongoose model class to create instance of a survey
    a instance of survey is not automatically persisted to MongoDB
    use save() to save to DB
    */
    /* for map(email => {return {email: email}})
    -> map(email => {return {email}})   // arrow function contains one js expression
    -> map(email => ({email}))
    return an object for every email with a property of email & the value of the email add
    */
    const survey = new Survey({
      title, // ES6 syntax: title: title  =   title
      subject,
      body,
      recipients: recipients.split(",").map(email => ({ email: email.trim() })),
      _user: req.user.id,
      dateSent: Date.now()
    });

    // send an email
    const mailer = new Mailer(survey, surveyTemplate(survey));

    try {
      await mailer.send(); // async function
      await survey.save();
      req.user.credits -= 1;
      const user = await req.user.save();

      res.send(user);
    } catch (err) {
      res.status(422).send(err); // unprocessable entity
    }
  });
};
