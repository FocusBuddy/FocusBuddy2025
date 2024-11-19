const express = require("express");
const passport = require("passport");
const userModel = require("../models/UsersModel");
const upload = require("../multer/multer");
const fs = require("fs");
const generateUserProfileLink = require("../utils/generateUserProfileLink.js");
const getGeoInfo = require("../utils/getGeoInfo.js");
// const createStripeTrailPlan = require('../stripe/createStripeTrailPlan.js');
require('../passportJs/passportGoogleStrategy.js');


const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: `${process.env.CLIENT_PRO_URL}/dashboard`,
    failureRedirect: `${process.env.CLIENT_PRO_URL}/signup`,
    // failureFlash: true,
  })
  // passport.authenticate('google', { 
  //   failureRedirect: 'https://focusbuddyfrontend.vercel.app/signup'
  // }),
  // (req, res) => {
  //   res.redirect('https://focusbuddyfrontend.vercel.app/dashboard');
  // }
);


async function dateToUnix(dateString) {
  const date = new Date(dateString);
  return Math.floor(date.getTime() / 1000);
}

async function getTodayUnix() {
  const today = new Date();
  // Set time to midnight (00:00:00) for accurate date comparison
  today.setHours(0, 0, 0, 0);
  return Math.floor(today.getTime() / 1000);
}

async function check_today_greater_than_plan_end(user) {
  const plan_end_date = user.subscription.planEndDate;
  const totalSessions = user.totalSessionsAttended;
  // const plan_end_date_in_unix = await dateToUnix(plan_end_date);
  const now_date_in_unix = await getTodayUnix();

  if ((plan_end_date < now_date_in_unix) && totalSessions > 10) {
    return "expire";
  } else {
    return "not expire";
  }
}



router.get("/checkAuthAndReturnUser", async (req, res) => {
   
  // Check if the user is authenticated
  if (req.isAuthenticated()) {
    try {
      // Find the user by their ID
      const user = await userModel.findById(req.user._id);
      const expires_or_not = await check_today_greater_than_plan_end(user);

      if (user.subscription.planType === 'free' && expires_or_not === 'expire') {
        return res.status(403).json({
          authenticated: true,
          user: req.user,
          trial_ended: true,
          status: false,
          message: "Your trial period has ended. Please subscribe to log in.",
          isLoggedIn: false,
        });
      }else if(user.subscription.planStatus === 'pause' && expires_or_not === 'expire'){
        return res.status(403).json({
          authenticated: true,
          user: req.user,
          sub_cancelled:true,
          status: false,
          message: "You have cancelled your subscription. Please subscribe to a new plan to log in.",
          isLoggedIn: false,
        });
      }else if(user.attendance0BanAccount === true){
        return res.status(403).json({
          authenticated: true,
          user: req.user,
          status: false,
          message: "Your Attendance dropped to 0%. So Account ban!.",
          isLoggedIn: false,
        });
      }

      // If subscription is not canceled, return the authenticated status and user details
      return res.status(200).json({
        authenticated: true,
        user: req.user,
        status: true,
        isLoggedIn: true,
      });
    } catch (err) {
      // Handle any errors that occur during user lookup
      return res.status(500).json({
        authenticated: false,
        message: "Internal Server Error",
        isLoggedIn: false,
        status: false,
      });
    }
  } else {
    // If the user is not authenticated, return unauthorized status
    return res.status(401).json({
      authenticated: false,
      message: "Unauthorized",
      isLoggedIn: false,
      status: false,
    });
  }
});

router.post("/local/checkregister", async (req, res) => {
  try {
    const { email } = req.body;
    let user = await userModel.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    } else {
      return res.status(200).json({ message: "User do not exists" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});


async function addMonths(date, months) {
  const newDate = new Date(date);
  Math.floor(newDate.setMonth(newDate.getMonth() + months) / 1000);
  return newDate;
}

async function getSubscriptionDetails() {
  const today = Math.floor(new Date()/1000);
  const sevenDaysLater = today + 7 * 24 * 60 * 60;

  const plan_start_date = today;
  const plan_end_date = sevenDaysLater;
  const plan_status = "created";
  const plan_type = "free";

  return {
    planStatus: plan_status,
    planType: plan_type,
    planStartDate: plan_start_date,
    planEndDate: plan_end_date,
  };
}

router.post(
  "/local/register",
  upload.single("profilePhoto"),
  async (req, res) => {
    console.log(req.file, req.body);
    try {
      // console.log(req.body);
      const { email, password, profilePic, oldPic, firstname, lastname } =
        req.body;
      const profile_questons = {
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
      };
      let welcome_checklist = {
        works: false,
        guidelines: false,
        booking: false,
        final: false,
      };

      let subscriptionDetails = await getSubscriptionDetails();


      if (email) {
      const full_name = firstname.split(" ").join('') + " " + lastname.split(" ").join('');
        console.log("post contain email");
        const location = await getGeoInfo();
        console.log("location local", location);
        const link = await generateUserProfileLink(firstname.split(" ").join(''), lastname.split(" ").join(''));
        user = new userModel({
          googleId: crypto.randomUUID(),
          email,
          password,
          displayName: full_name,
          userLocation: location,
          profilePic,
          genderPresent: ["Prefer not to say"],
          matchWithGender: "everyone",
          noMatchWithGender: "everyone",
          availabilityStatus: "No one",
          quiteModeMatchAllowed: true,
          givenName: firstname.split(" ").join(''),
          familyName: lastname.split(" ").join(''),
          userProfileLink: link,
          userProfileQuestions: profile_questons,
          favorites: [],
          memberSince: new Date(),
          welcomeChecklistState: welcome_checklist,
          attendanceScore: '100%',
            totalSessionsAttended: 0,
            missedMeeting: false,
            missedMeetingCount: 0,
          subscription: subscriptionDetails,
        });
        const saved_user = await user.save();

        // await createStripeTrailPlan(email, full_name);


        res
          .status(201)
          .json({
            message: "User registered successfully.",
            profilePic: profilePic,
          });
      } else {
        console.log("post not contain email");
        if (req.file) {
          if (
            oldPic &&
            oldPic !== `${process.env.BACKEND_PRO_URL}/uploads/defaultImages.png`
          ) {
            fs.unlink(oldPic.replace(`${process.env.BACKEND_PRO_URL}/`, ""), (err) => {
              if (err) {
                console.log("Error deleting the previous profile pic.", err);
              }
            });
          }
        }
        res
          .status(201)
          .json({
            message: "Profile picture changed",
            profilePic: `${process.env.BACKEND_PRO_URL}/uploads/${req.file.filename}`,
          });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: err.message });
    }
  }
);

router.post("/local/login", async (req, res, next) => {
  passport.authenticate("local", async (err, user, info) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    if (!user) {
      return res
        .status(400)
        .json({ message: "Either email or password is wrong." });
    }

    req.logIn(user, (err) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }
      console.log("session after login", req.session);
      console.log("User is authenticated:", req.isAuthenticated());
      // const link =  await generateUserProfileLink(req.user);
      // const newuser_with_link = await saveLink(link,req.user);
      res.status(200).json({ message: "Logged in", user });
    });
  })(req, res, next);
});

router.post("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }
      res.clearCookie("connect.sid");
      res.status(200).json({ message: "Logged out!." });
    });
  });
});

module.exports = router;
