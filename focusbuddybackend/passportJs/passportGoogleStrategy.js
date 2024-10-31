const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const dotenv = require("dotenv");
const User = require("../models/UsersModel");
dotenv.config();
const generateUserProfileLink = require("../utils/generateUserProfileLink.js");
const getGeoInfo = require("../utils/getGeoInfo.js");
// const createStripeTrailPlan = require('../stripe/createStripeTrailPlan.js')


async function addMonths(date, months) {
  const newDate = new Date(date);
  Math.floor(newDate.setMonth(newDate.getMonth() + months) / 1000);
  return newDate;
}

async function getSubscriptionDetails() {
  const today = Math.floor(new Date()/1000);
  const nextMonthDate = await addMonths(today, 1);

  const plan_start_date = today;
  const plan_end_date = nextMonthDate;
  const plan_status = "created";
  const plan_type = "free";

  return {
    planStatus: plan_status,
    planType: plan_type,
    planStartDate: plan_start_date,
    planEndDate: plan_end_date,
  };
}

async function firstNameHaveSpaceOrNot(firstName){
  if (firstName.includes(" ")) {
    return true;
  } else {
    return false;
  }
}


passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      // callbackURL: 'https://focusbuddybackend-production.up.railway.app/auth/google/callback',
      callbackURL:process.env.CALLBACK_URL,
      scope: ['profile'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists in the database
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          // If user not found in the database, create a new user
          const location = await getGeoInfo();
          const link = await generateUserProfileLink(
            profile.name.givenName,
            profile.name.familyName
          );

          let subscriptionDetails = await getSubscriptionDetails();
          let firstNameContainSpace = await firstNameHaveSpaceOrNot(profile.name.givenName);

          let noLastNameSoNumber = Math.floor(Math.random() * 101);
console.log(profile);
          const userDetails = {
            googleId: profile.id,
            displayName: firstNameContainSpace ? profile.displayName : profile.displayName + ' ' + noLastNameSoNumber,
            email: profile.emails[0].value,
            userGender: ["Prefer not to say"],
            matchWithGender: "everyone",
            noMatchWithGender: "everyone",
            availabilityStatus: "No one",
            quiteModeMatchAllowed: true,
            givenName: profile.name.givenName,
            familyName: profile.name.familyName === undefined && firstNameContainSpace === false ? noLastNameSoNumber : '',
            profilePic: profile.photos[0].value,
            userLocation: location,
            memberSince: new Date(),
            userProfileLink: link,
            userProfileQuestions: {
              "today-q1": "",
              "today-q2": "",
              "today-q3": "",
              "today-q4": "",
              "profile-q1": "",
              "profile-q2": "",
              "profile-q3": "",
              "profile-q4": "",
              "profile-q5": "",
              "profile-q6": "",
              "hiw-q1": "",
              "hiw-q2": "",
              "hiw-q3": "",
              "hiw-q4": "",
              "hiw-q5": "",
              "focusbuddy-q1": "",
              "focusbuddy-q2": "",
              "focusbuddy-q3": "",
              "focusbuddy-q4": "",
              "focusbuddy-q5": "",
            },
            favorites: [],
            welcomeChecklistState: {
              works: false,
              guidelines: false,
              booking: false,
              final: false,
            },
          subscription: subscriptionDetails,
          };

          user = new User(userDetails);
          const saved_user = await user.save();
          // await createStripeTrailPlan(saved_user.email, saved_user.displayName);
        }

        done(null, user);
      }catch (err) {
        console.log(err);
        done(err);
      }
    }
  )
);


passport.serializeUser((user, done) => {
  // console.log("serialize",user);
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    // console.log("deserialize",user);
    done(null, user);
  } catch (err) {
    done(err);
  }
});
