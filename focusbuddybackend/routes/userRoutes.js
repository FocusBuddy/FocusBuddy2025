const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const userModel = require("../models/UsersModel");
const Event = require("../models/eventsModel.js");
const pastEvent = require("../models/pastEventModel.js");
const passport = require("passport");
const upload = require("../multer/multer");
const router = express.Router();
const fs = require("fs");
const { getIo } = require("../socket");
const KJUR = require("jsrsasign");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const generateUserProfileLink = require("../utils/generateUserProfileLink.js");
const crypto = require('crypto')
const Razorpay = require('razorpay');
const cron = require('node-cron');
const cloudinary = require("../cloudinary/cloudinary.js");
// const { getIo } = require('../socket');

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "rupeshchincholkar14@gmail.com",
    pass: "mlur bmcf cmny cccm",
  },
});

const razorpay_instance = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET })


const getFormattedName = (name) => {
  const parts = name.split(" ");
  if (parts.length === 1) {
    return name; // Return the name as is if there's only one part
  }
  return `${parts[0]} ${parts[1][0]}`;
};

async function changeEveryWereThatImageIs(userWhoIsChangingImage) {
  const formatted_name = await getFormattedName(
    userWhoIsChangingImage.displayName
  );
  // console.log('photo',userWhoIsChangingImage, userWhoIsChangingImage.profilePic);
  const allchangedusers = await userModel.updateMany(
    { "favorites.email": userWhoIsChangingImage.email },
    { $set: { "favorites.$[elem].link": userWhoIsChangingImage.profilePic } },
    { arrayFilters: [{ "elem.email": userWhoIsChangingImage.email }] }
  );
  // console.log(allchangedusers);
  const allchangedevents = await Event.updateMany(
    { name: formatted_name },
    { profilePic: userWhoIsChangingImage.profilePic }
  );
  const allmatchedevent = await Event.updateMany(
    { matchedPersonName: formatted_name },
    { matchedPersonProfilePic: userWhoIsChangingImage.profilePic }
  );
  console.log(allchangedevents, allmatchedevent);
}

//upload.single('profilePhoto')
// router.put(
//   "/uploadProfilePic",
//   upload.single("profilePhoto"),
//   async (req, res) => {
//     console.log("file", req.file);
//     console.log('filename',req.file.filename);
//     try {
//       const io = getIo();
//       const findUser = await userModel.findOne({ googleId: req.body.googleID });
//       console.log(findUser.profilePic);
//       if (!findUser) {
//         return res.status(404).json({ message: "User not found" });
//       }

//       // Handle profile picture replacement
//       if (req.file) {
//         // Upload new profile picture to Cloudinary
//         const result = await cloudinary.uploader.upload(req.file.path, {
//           folder: "profile_pics", // Cloudinary folder for profile pictures
//           public_id: `user_${findUser._id}`, // Unique identifier for the image
//           overwrite: true, // Replace the image if it exists
//         });

//         // Delete old file if it exists and meets conditions
//         if (
//           findUser.profilePic &&
//           findUser.profilePic !== `${process.env.BACKEND_PRO_URL}/uploads/defaultImages.png` &&
//           findUser.password === null
//         ) {
//           if (fs.existsSync(oldFilePath)) {
//             fs.unlink(oldFilePath, (err) => {
//               if (err) {
//                 console.log(
//                   "Error deleting the previous profile picture:",
//                   err
//                 );
//               } else {
//                 console.log("Previous profile picture deleted:", oldFilePath);
//               }
//             });
//           } else {
//             console.log("Previous profile picture does not exist:", oldFilePath);
//           }
//         }

//         // Update user's profile picture with the new file
//         findUser.profilePic = `${process.env.BACKEND_PRO_URL}/uploads/${req.file.filename}`;
//         console.log("New profile picture path:", findUser.profilePic);
//       }
      
//       const updatedUser = await findUser.save();

//       await changeEveryWereThatImageIs(findUser);

//       res
//         .status(201)
//         .json({ message: "Profile picture updated.", data: updatedUser });
//     } catch (err) {
//       res
//         .status(500)
//         .json({ message: "something went wrong with file upload", error: err });
//     }
//   }
// );
router.put(
  "/uploadProfilePic",
  upload.single("profilePhoto"),
  async (req, res) => {
    console.log("file", req.file);
    console.log('filename',req.file.filename);
    try {
      const io = getIo();
      const findUser = await userModel.findOne({ googleId: req.body.googleID });
      console.log(findUser.profilePic);
      if (!findUser) {
        return res.status(404).json({ message: "User not found" });
      }

      // Handle profile picture replacement
      if (req.file) {
        // Delete old profile picture from Cloudinary if it exists
        if (
          findUser.profilePic &&
          findUser.profilePic !== 'https://res.cloudinary.com/dnbiuntjt/image/upload/v1732370053/defaultImages_mauluu.png' && // Ensure not to delete default image
          findUser.password === null
        ) {
          const publicId = findUser.profilePic.split('/').pop().split('.')[0];
          try {
            await cloudinary.uploader.destroy(publicId);
            console.log("Old profile picture deleted:", publicId);
          } catch (err) {
            console.log("Error deleting old Cloudinary image:", err);
          }
        }

        
         // Upload new profile picture to Cloudinary
         const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "profile_pics", // Cloudinary folder for profile pictures
          public_id: `user_${findUser._id}`, // Unique identifier for the image
          overwrite: true, // Replace the image if it exists
        });

        console.log("Cloudinary upload response:", result);

        // Update user's profile picture URL
        findUser.profilePic = result.secure_url;
        console.log("New profile picture URL:", findUser.profilePic);

        // Remove the temporary file
        fs.unlink(req.file.path, (err) => {
          if (err) {
            console.log("Error deleting temporary file:", err);
          } else {
            console.log("Temporary file deleted.");
          }
        });
      }
      
      const updatedUser = await findUser.save();

      await changeEveryWereThatImageIs(findUser);

      res
        .status(201)
        .json({ message: "Profile picture updated.", data: updatedUser });
    } catch (err) {
      res
        .status(500)
        .json({ message: "something went wrong with file upload", error: err });
    }
  }
);

async function getAttendanceScrore(foundUser) {
  const no_of_meeting_missed = foundUser.missedMeetingCount;
  let attendance_score;
  if (no_of_meeting_missed === 0 || no_of_meeting_missed === 1) {
    attendance_score = "100%";
  } else if (no_of_meeting_missed === 2 || no_of_meeting_missed === 3) {
    attendance_score = "90%";
  } else if (no_of_meeting_missed === 4 || no_of_meeting_missed === 5) {
    attendance_score = "80%";
  } else if (no_of_meeting_missed === 6 || no_of_meeting_missed === 7) {
    attendance_score = "70%";
  } else if (no_of_meeting_missed === 8 || no_of_meeting_missed === 9) {
    attendance_score = "60%";
  } else if (no_of_meeting_missed === 10 || no_of_meeting_missed === 11) {
    attendance_score = "50%";
  } else if (no_of_meeting_missed === 12 || no_of_meeting_missed === 13) {
    attendance_score = "40%";
  } else if (no_of_meeting_missed === 14 || no_of_meeting_missed === 15) {
    attendance_score = "30%";
  } else if (no_of_meeting_missed === 16 || no_of_meeting_missed === 17) {
    attendance_score = "20%";
  } else if (no_of_meeting_missed === 18 || no_of_meeting_missed === 19) {
    attendance_score = "10%";
  } else if (no_of_meeting_missed === 20) {
    attendance_score = "0%";
  } else {
    attendance_score = "---";
  }

  return attendance_score;
}

/** Video Session routes */
router.post("/missedsession", async (req, res) => {
  try {
    const io = getIo();
    const { sessionDetails, meetInfo } = req.body;
    // console.log(sessionDetails, meetInfo);
    const updateMissedStatus = await Event.findOneAndUpdate({
      callID: meetInfo.callID,
      myID: meetInfo.myID
    },{
      otherPersonMissedCall: true 
    },{
      new: true
    })
    const updated = await userModel.findOneAndUpdate(
      {
        profilePic: meetInfo.matchedPersonProfilePic,
      },
      {
        missedMeeting: true
      },
      {new: true}
    )
    if(updated){
      io.emit("sessionMissedNotify", updated);
    }
    res.status(200).json({ message: "notified user", updatedUser: updated, missedStatus: updateMissedStatus });
    // const foundUser = await userModel.findOne({
    //   profilePic: meetInfo.matchedPersonProfilePic,
    // });
    // await userModel.updateOne(
    //   { _id: foundUser._id },
    //   { $inc: { missedMeetingCount: 1 } }
    // );
    // // res.status(200).json({message:'notified'});
    // let getCount = await getAttendanceScrore(foundUser);
    // const updated = await userModel.findOneAndUpdate(
    //   { _id: foundUser._id },
    //   { missedMeeting: true, attendanceScore: getCount },
    //   { new: true }
    // );
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "error in missed session" });
  }
});

router.post("/updatemissmeetingstatus", async (req, res) => {
  try {
    const { updateThis } = req.body;
    const update = await userModel.findOneAndUpdate(
      { email: updateThis },
      { missedMeeting: false }
    );
    res.status(200).json({
      message: "Missed meeting status changed successfully.",
      updatedUser: update,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "error in updating miss meeting status." });
  }
});

router.post("/handleAttendancefall", async(req,res) => {
  const {email} = req.body;
  try{
    const user = await userModel.findOneAndUpdate(
      {email: email},
      {userSawAttendanceFallModal: true},
      {new:true}
    );
    res.status(200).json({
      message: "Attendance fall model saw by user and status changed successfully.",
      updatedUser: user,
    });
  }catch(err){
    res.status(500).json({message: "error while changing attendance fall status to false"});
  }
})


router.get("/getUserDetails", async (req, res) => {
  const matchedName = req.query.name;
  console.log(matchedName);
  try {
    const user = await userModel.find({ displayName: matchedName });
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    res.status(201).json({ user });
  } catch (err) {
    console.log(err);
  }
});


router.post("/sessionCompleted", async (req, res) => {
  const { meetInfo } = req.body;
  console.log(meetInfo);
  try {
    const io = getIo();

    io.emit("updateSessionAttendance", updated);

    res.status(200).json({ message: "session attendance", user: updated });


  } catch (err) {
    console.log(err);
  }
});
// router.post("/updaterecentcall", async (req, res) => {
//   const { personeventname, callid } = req.body;
//   console.log(personeventname, callid);
//   try {
   
//     const user = await userModel.findOneAndUpdate(
//       {
//         displayName: personeventname,
//       },
//       {
//         recentCallID: callid
//       }
//     )
//     res.status(200).json({ message: "recent call id added"});


//   } catch (err) {
//     console.log(err);
//   }
// });

router.post("/reset-password-request", async (req, res) => {
  const { email } = req.body;
  console.log(email);
  try {
    const findUser = await userModel.findOne({ email: email });
    if (!findUser) {
      return res.status(404).json({ message: "User not found" });
    }
    const iat = Math.floor(Date.now() / 1000); // Current time in seconds
    const exp = iat + 60 * 15;

    const oHeader = { alg: "HS256", typ: "JWT" };
    const oPayload = {
      userId: findUser.googleId,
      iat: iat,
      exp: exp,
    };

    const sHeader = JSON.stringify(oHeader);
    const sPayload = JSON.stringify(oPayload);
    const sdkJWT = KJUR.jws.JWS.sign(
      "HS256",
      sHeader,
      sPayload,
      process.env.RESET_PASSWORD_SECRET
    );

    console.log("googleID", findUser.googleId, "token", sdkJWT);

    var mailOptions = {
      from: "FocusBuddy <rupeshchincholkar14@gmail.com>",
      to: "rupeshchincholkar07@gmail.com",
      subject: "Reset your password for FocusBuddy",
      //   text: `That was easy!: http://localhost:5173/reset-password/${findUser.googleId}/${sdkJWT}`,
      html: `
        <p>Hello,</p>
        <p>Follow this link to reset your FocusBuddy password for your ${email} account.</p>
        <a href=${process.env.CLIENT_PRO_URL}/login/reset-password/${findUser.googleId}/${sdkJWT}  target="_blank">${process.env.CLIENT_PRO_URL}/login/reset-password/${findUser.googleId}/${sdkJWT}</a>
        <p>If you didn’t ask to reset your password, you can ignore this email.</p>
        <p>Thanks!</p>
        <p>Your Hardworking FocusBuddy Team</p>
      `,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
        res
          .status(201)
          .json({ message: "Password reset link send successfully!." });
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});

router.put("/confirm-password", async (req, res) => {
  const { paramId, token, newPassword } = req.body;
  try {
    var isValid = KJUR.jws.JWS.verify(
      token,
      process.env.RESET_PASSWORD_SECRET,
      ["HS256"]
    );
    if (isValid) {
      const hash_pass = await bcrypt.hash(newPassword, 10);
      const user = await userModel.findOneAndUpdate(
        { googleId: paramId },
        { password: hash_pass },
        { new: true }
      );
      console.log(user);
    } else {
      return res
        .status(401)
        .json({ message: "Not Authorize to reset password" });
    }
    res.status(200).json({ message: "Password changed successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});

router.put("/saveprofilequestions", async (req, res) => {
  const { allQuestion, email } = req.body;
  try {
    const user = await userModel.findOneAndUpdate(
      { email: email },
      { userProfileQuestions: allQuestion },
      { new: true }
    );
    console.log(user);
    res
      .status(200)
      .json({ message: "profile questions saved successfully.", user });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});

router.get("/search", async (req, res) => {
  const userLink = req.query.profileLink;
  // console.log('user link',userLink);
  if (!userLink) {
    return res.status(400).send("Email query parameter is required");
  }
  try {
    const user = await userModel.findOne({ userProfileLink: userLink });
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.status(200).json({ message: "user found", user: user });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error while getting user profile." });
  }
});

router.put("/addfavorites", async (req, res) => {
  const { email, name } = req.body;
  console.log(email, name);
  try {
    // const final_name = await extractName(name);
    const user_email = await userModel.findOne({ displayName: name });
    console.log("user_email", user_email);
    if (!user_email) {
      return res
        .status(404)
        .json({ message: "No user with that name in favorites." });
    }
    const user = await userModel.findOneAndUpdate(
      { email: email },
      {
        $addToSet: {
          favorites: {
            email: user_email.email,
            name: name,
            link: user_email.profilePic,
            plink: user_email.userProfileLink,
            availability: user_email.availabilityStatus,
            favoritesArray: user_email.favorites,
          },
        },
      },
      { new: true }
    );
    console.log(user);
    res.status(200).json({ message: "user added to favorites.", user });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error while adding user to favorite." });
  }
});

router.put("/removefavorites", async (req, res) => {
  const { email, name } = req.body;
  // console.log(email,name);
  try {
    // const final_name = await extractName(name);
    const user_email = await userModel.findOne({ displayName: name });
    if (!user_email) {
      return res
        .status(404)
        .json({ message: "No user with that name in favorites." });
    } // console.log('user_email',user_email);
    const user = await userModel.findOneAndUpdate(
      { email: email },
      { $pull: { favorites: { email: user_email.email } } },
      { new: true }
    );
    // console.log(user);
    res.status(200).json({ message: "user removed to favorites.", user });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error while removing user to favorite." });
  }
});

router.post("/reportuser", async (req, res) => {
  const {
    reportSelect,
    reportText,
    reportingUser,
    reportedUser,
    reportedUserName,
  } = req.body;
  console.log(
    reportSelect,
    reportText,
    reportingUser,
    reportedUser,
    reportedUserName
  );
  try {
    if (!reportingUser) {
      return res.status(400).json({ message: "Required fields are missing." });
    }

    const mailOptions = {
      from: "FocusBuddy <rupeshchincholkar14@gmail.com>",
      to: "rupeshchincholkar07@gmail.com", // whatever email where reporting details are collected
      subject: `${reportingUser} wants to report ${
        reportedUser ? reportedUser : reportedUserName
      }`,
      text: `Report details:
      Reporting User: ${reportingUser}
      Reported User: ${reportedUser ? reportedUser : reportedUserName}
      Reason: ${reportSelect}
      Additional Info: ${reportText}`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
        res.status(201).json({ message: "Report request saved." });
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "" });
  }
});

router.put("/welcomecheckliststate", async (req, res) => {
  const { whatdone, whichuser } = req.body;
  let updatethis;

  switch (whatdone) {
    case "works":
      updatethis = "works";
      break;
    case "guidelines":
      updatethis = "guidelines";
      break;
    case "booking":
      updatethis = "booking";
      break;
    default:
      updatethis = "works";
      break;
  }
  try {
    const user = await userModel.findOneAndUpdate(
      { email: whichuser },
      {
        $set: {
          [`welcomeChecklistState.${updatethis}`]: true,
        },
      },
      { new: true }
    );
    if (!user) {
      return res
        .status(404)
        .json({ message: "found no user to update welcome checklist state" });
    }

    return res.status(201).json({
      message: "updated user welcome checklist state",
      updatedProfile: user,
    });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "Error while updating welcome checklist state" });
  }
});

async function change_name_everywhere_with_newname(newuser, pname) {
  console.log("changenameeverywhere", newuser);
  let shortname = newuser.givenName + " " + newuser.familyName[0];
  let fullname = newuser.displayName;
  try {
    const presentevents = await Event.updateMany(
      { fullName: pname },
      { name: shortname, fullName: newuser.displayName }
    );
    const presentevents2 =  await Event.updateMany(
      {matchedPersonFullName: pname},
      {matchedPersonFullName: fullname, matchedPersonName: shortname}
    )
    const pastevents = await pastEvent.updateMany(
      { fullName: pname },
      {
        $set: {
          "allpastevents.$[elem].name": shortname,
          "allpastevents.$[elem].fullName": fullname,
        },
      },
      {
        arrayFilters: [{ elem: { $exists: true } }],
      }
    );
    const pastevents2 = await pastEvent.updateMany(
      { matchedPersonFullName: pname },
      {
        $set: {
          "allpastevents.$[elem].matchedPersonName": shortname,
          "allpastevents.$[elem].matchedPersonFullName": fullname,
        },
      },
      {
        arrayFilters: [{ elem: { $exists: true } }],
      }
    );
  } catch (err) {
    console.log(err);
  }
}

router.put("/setting_change_name", async (req, res) => {
  const { email, firstName, lastName, showName, previousFullName } = req.body;
  try {
    const new_link = await generateUserProfileLink(firstName, lastName);
    const user = await userModel.findOneAndUpdate(
      { email: email },
      {
        givenName: firstName,
        familyName: lastName,
        displayName: showName,
        userProfileLink: new_link,
      },
      { new: true }
    );
    await change_name_everywhere_with_newname(user, previousFullName);
    res
      .status(201)
      .json({ message: "user's name updated successfully", updatedUser: user });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error while updating name in profile" });
  }
});

router.put("/setting_change_gender", async (req, res) => {
  const { email, gender } = req.body;
  try {
    const user = await userModel.findOneAndUpdate(
      { email: email },
      {
        $set: {
          userGender: gender,
        },
      },
      { new: true }
    );
    res.status(201).json({
      message: "user's gender updated successfully",
      updatedUser: user,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error while updating gender in profile" });
  }
});

router.put("/setting_change_gender_preference", async (req, res) => {
  const { email, matchWith, noMatchWith } = req.body;
  try {
    if (matchWith) {
      const user = await userModel.findOneAndUpdate(
        { email: email },
        { matchWithGender: matchWith },
        { new: true }
      );
      return res.status(201).json({
        message: "user's gender updated successfully",
        updatedUser: user,
      });
    }

    if (noMatchWith) {
      const user = await userModel.findOneAndUpdate(
        { email: email },
        { noMatchWithGender: noMatchWith },
        { new: true }
      );
      return res.status(201).json({
        message: "user's gender updated successfully",
        updatedUser: user,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error while updating gender in profile" });
  }
});

async function change_availability_everywhere(email, availability) {
  try {
    const alluser = await userModel.updateMany(
      { "favorites.email": email },
      {
        $set: {
          "favorites.$.availability": availability,
        },
      }
    );
  } catch (err) {
    console.log(err);
  }
}

router.put("/setting_change_availability", async (req, res) => {
  const { email, availability } = req.body;
  try {
    const user = await userModel.findOneAndUpdate(
      { email: email },
      { availabilityStatus: availability },
      { new: true }
    );
    await change_availability_everywhere(email, availability);
    res.status(201).json({
      message: "user's availability preference updated",
      updatedUser: user,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error while updating gender in profile" });
  }
});

router.put("/setting_change_quitemode_preference", async (req, res) => {
  const { email, quiteModeState } = req.body;
  console.log(quiteModeState);
  let quiteMode;
  switch (quiteModeState) {
    case "matchwithquite":
      quiteMode = true;
      break;
    case "donotmatchwithquite":
      quiteMode = false;
      break;
    default:
      quiteMode = true;
      break;
  }
  try {
    console.log(quiteMode);
    const user = await userModel.findOneAndUpdate(
      { email: email },
      { quiteModeMatchAllowed: quiteMode },
      { new: true }
    );
    res
      .status(201)
      .json({ message: "user's name updated successfully", updatedUser: user });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error while updating name in profile" });
  }
});


router.post('/delete-account',async (req,res) => {
  const {userToDeleteEmail} = req.body;
  try{

     const get_user = await userModel.findOne({email: userToDeleteEmail});
    

      // const user = await userModel.findOneAndDelete(
      //   {email: userToDelete.email}
      // );

      const all_eventsof_that_user = await Event.find(
        {
          fullName: get_user.displayName
        }
      )

      for(const events of all_eventsof_that_user){
        const user = await Event.findOneAndDelete(
          {name: events.matchedPersonName, start: events.start, end: events.end}
        )
      }

      const delelte_from_favorites = await userModel.updateMany(
        { "favorites.name": get_user.displayName },
        { $pull: { favorites: { name: get_user.displayName } } }
      );

      const delete_all_eventsof_that_user = await Event.deleteMany(
        {fullName: get_user.displayName}
      )

      res.status(201).json({message: 'account delete.'})
  }catch(err){
    console.log(err);
    res.status(500).json({ message: "error while delete account" });
  }
})


router.post('/create-subscription',async (req,res) => {
  const {plan_type,userEmail} = req.body;
  try{

    // let planID;
    // switch (plan_type) {
    //   case "plus_monthly":
    //     planID = process.env.RAZORPAY_MONTHLY_PLAN_ID;
    //     break;
    //   case "plus_yearly":
    //     planID = process.env.RAZORPAY_YEARLY_PLAN_ID;
    //     break;
    //   default:
    //     planID = 'free';
    //     break;
    // }
    const subscription = await razorpay_instance.subscriptions.create({
      // plan_id: 'plan_OtPbXyiQAvQ979', //focusbuddy_plus_monthly
      plan_id: process.env.RAZORPAY_MONTHLY_PLAN_ID, //focusbuddy_plus_monthly
      total_count: 50, // 0 for unlimited billing cycles
      customer_notify: 1, // Send email notification to the customer
    });

    const save_sub = await userModel.findOneAndUpdate(
      {email: userEmail},
      {
        $set: {
          "subscription.upgradesub_id": subscription.id,
        },
      },
      { new: true }
    )

      res.json({ subscription: subscription });

  }catch(err){
    console.log(err);
    res.status(500).json({ message: "error while  creating subscription." });
  }
})

router.post('/verifypayment', async (req, res) => {
  try{
  const { payment_id, razorpay_signature, userEmail } = req.body;

  // Replace with your Razorpay key secret
  const key_secret = process.env.RAZORPAY_KEY_SECRET;
  const subID = await userModel.findOne({email: userEmail});

  // Create the HMAC SHA256 signature
  const generated_signature = crypto
    .createHmac('sha256', key_secret)
    .update(`${payment_id}|${subID.subscription.upgradesub_id}`)
    .digest('hex');

  // Compare the generated signature with the signature received from Razorpay
  if (generated_signature === razorpay_signature) {
    // Payment is authentic
    res.json({ success: true, message: 'Payment verified successfully' });
  } else {
    // Payment verification failed
    res.json({ success: false, message: 'Payment verification failed' });
  }
  }catch(err){
    console.log(err);
    res.status(500).json({ message: "error while verifying payment." });
  }
});


router.post('/getSubcription', async (req,res) => {
  const {sub_id,pay_id} = req.body;
  let activeSubPayment;
  console.log(sub_id,pay_id);
  try{
    const activeSub = await razorpay_instance.subscriptions.fetch(sub_id);
    if(activeSub.payment_method === "card"){
      activeSubPayment = await razorpay_instance.payments.fetch(pay_id,{"expand[]":"card"});
    }else{
      activeSubPayment = await razorpay_instance.payments.fetch(pay_id)
    }

    const paymentInvoice = await razorpay_instance.invoices.all();
    res.status(200).json({activeSub,activeSubPayment,paymentInvoice});
  }catch(err){
    console.log(err);
    res.status(500).json({ message: "error while verifying payment." });
  }
})


router.post('/cancelSubcription',async (req,res) =>{
  const {sub_id, userEmail} = req.body;
  try{

    const pausesub = await razorpay_instance.subscriptions.pause(sub_id,{
      pause_at : 'now'
    })
    console.log(pausesub);

      const userupdate = await userModel.findOneAndUpdate(
        {email: userEmail},
        {
          $set: {
            "subscription.planStatus": pausesub.status,
            "subscription.cancel_at_cycle_end": true,
          },
        },
        { new: true }
      ) 
    res.status(200).json({userupdate});
  }catch(err){
    console.log(err);
    res.status(500).json({ message: "error while canceling subscription." });
  }
})


router.post('/renewSubscription',async (req,res) => {
  const {userEmail,currentSubEnd} = req.body;
  try{
    const resumesub = await razorpay_instance.subscriptions.resume(currentSubEnd,{
      resume_at : 'now'
    })
    console.log("resumesub",resumesub)

    const save_sub = await userModel.findOneAndUpdate(
      {email: userEmail},
      {
        $set: {
          "subscription.planStatus": resumesub.status,
          "subscription.cancel_at_cycle_end": false
        },
      },
      { new: true }
    )

      res.json({ userupdate: save_sub });

  }catch(err){
    console.log(err);
    res.status(500).json({ message: "error while  renewing subscription." });
  }
})

// router.post('/updateCardSubscription', async (req,res) => {
//   const {newPlan,userEmail,sub_id} = req.body;
//   try{
//     let newPlanID;
//     if(newPlan === 'plus_monthly'){
//       newPlanID = process.env.RAZORPAY_MONTHLY_PLAN_ID;
//     }else{
//       newPlanID = process.env.RAZORPAY_YEARLY_PLAN_ID;
//     }

//     const options = {
//       plan_id: newPlanID,
//       quantity: 1,
//       remaining_count: 50
//     };

//     const updatedsubscription = await razorpay_instance.subscriptions.update(sub_id,options)
//     console.log("updatedsubscription",updatedsubscription)

//    res.status(200).json({message: "subscription updated.",updatedsubscription})

//   }catch(err){
//     console.log(err);
//     res.status(500).json({ message: "error while updating subscription." });
//   }
// });


// router.post('/updateUpiSubscription', async (req,res) => {
//   const {newPlan,userEmail,sub_id} = req.body;
//   try{

//     let newPlanID;
//     if(newPlan === 'plus_monthly'){
//       newPlanID = process.env.RAZORPAY_MONTHLY_PLAN_ID;
//     }else{
//       newPlanID = process.env.RAZORPAY_YEARLY_PLAN_ID;
//     }
  
// //cancel subscription at billing cycle end
//     const cancelsubscription = await razorpay_instance.subscriptions.cancel(sub_id,true)
//     console.log("updatedsubscription",cancelsubscription);

//     const subscription = await razorpay_instance.subscriptions.create({
//       plan_id: newPlanID, 
//       total_count: 50, 
//       customer_notify: 1, 
//       start_at : cancelsubscription.current_end
//     });

//     const save_sub = await userModel.findOneAndUpdate(
//       {email: userEmail},
//       {
//         $set: {
//           "subscription.mainsub_id": subscription.id,
//         },
//       },
//       { new: true }
//     )

//    res.status(200).json({message: "subscription updated."})

//   }catch(err){
//     console.log(err);
//     res.status(500).json({ message: "error while updating subscription." });
//   }
// });




cron.schedule('0 0 1 * *', async () => {
  console.log('Running monthly task to cancel paused subscriptions...');

  // Get today's date without the time part
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const today_in_seconds = Math.floor(today.getTime() / 1000);

  try {
    // Query to find users with paused subscription and planEndDate less than today
    const users = await userModel.find({
      'subscription.planStatus': 'pause',
      'subscription.planEndDate': { $lt: today_in_seconds },
    });

    console.log(users);

    // Loop through the users and cancel subscriptions
    for (const user of users) {
      try {
        // Cancel the subscription using Razorpay
        const cancel = await razorpay_instance.subscriptions.cancel(user.mainsub_id,false);
        console.log(`Subscription cancelled for user: ${user.displayName}`);
      } catch (cancelError) {
        console.error(`Error cancelling subscription for user: ${user.displayName}`, cancelError);
      }
    }
  } catch (error) {
    console.error('Error finding paused users or cancelling subscriptions:', error);
  }
});


module.exports = router;
