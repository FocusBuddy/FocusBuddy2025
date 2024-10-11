const mongoose = require('mongoose');
const Event = require('./eventsModel'); 
const cron = require('node-cron');
const User = require('./UsersModel');
const { getIo } = require("../socket");


const pastEventSchema = new mongoose.Schema({
    allpastevents: {
      type: [Event.schema], // Use the event schema for the array elements
    },
    creationDate: {
      type: Date,
      default: Date.now
    }
  }, {
    timestamps: true // Correct spelling is timestamps, not timeStamps
  });
  
  const pastEvent = mongoose.model('pastEvent', pastEventSchema);


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


  async function movePastEvents() {
    const now = new Date();
    const io = getIo();

    try {
        // Find events that have ended
        const pastEvents = await Event.find({ end: { $lt: now } });
        //array of objects
        console.log("pastEvents",pastEvents);

        const eventsWithEmptyJoinLeaveDuration = pastEvents.filter(
          (event) => event.callJoin === 0
        );

        eventsWithEmptyJoinLeaveDuration.forEach((event => {
          const makeChanges = async () => {
            const user_to_which_this_event_belong_to = await User.findOneAndUpdate(
              {displayName: event.fullName},
              {
                $set: { missedMeeting: true }, // Use $set to update specific fields
                $inc: { missedMeetingCount: 1 } // Use $inc to increment the count
              },
              { new: true } 
            );
  
            let getCount = await getAttendanceScrore(user_to_which_this_event_belong_to);
            const updated = await User.findOneAndUpdate(
              { _id: user_to_which_this_event_belong_to._id },
              { attendanceScore: getCount },
              { new: true }
            );
            if (updated) {
              io.emit("sessionMissedNotify", updated);
            }
          }
          makeChanges();
          
        }));



        //when there is someone
        //1st user join , join time, 2ns join , leave , 2nd will have leave time because there is someone
        //join 10, leave 10:03 then directyle join on 10:06 
        // in call
        //when there is no one he can choose to stay in call or leave it in this case we should not change its attendance
        
        //1st user join time after 5 minute on one joined isliye otherPersonMissedCall will be true
        //if this user close call by button leave time and duration will be there but if he close window then only join will be there,
        //if he does this before 5 min then dec attend after 5 min no change
      
        //1st user join waited for 5 min other user didn't join so otherPersonMissedCall become true and then
        //user can choose to stay or leave if he leave by call leave button click or close window directly in
        //both case we will not get leave time and duration, we will get only join time 

        //1st user joined and left within 5min and other user didn't joined
        // const eventsWithEmptyLeaveDurationAndMissLeftBefore5min = pastEvents.filter(
        //   (event) => (event.callJoin !== 0 && event.totalDuration === NaN && otherPersonMissedCall === false)
        // )

        // eventsWithEmptyLeaveDurationAndMissLeftBefore5min.forEach((event) => {
        //   const makeChanges = async () => {
        //     const user_to_which_this_event_belong_to = await User.findOneAndUpdate(
        //       {displayName: event.fullName},
        //       {
        //         $set: { missedMeeting: true }, // Use $set to update specific fields
        //         $inc: { missedMeetingCount: 1 } // Use $inc to increment the count
        //       },
        //       { new: true } 
        //     );
  
        //     let getCount = await getAttendanceScrore(user_to_which_this_event_belong_to);
        //     const updated = await User.findOneAndUpdate(
        //       { _id: user_to_which_this_event_belong_to._id },
        //       { attendanceScore: getCount },
        //       { new: true }
        //     );
        //   }
        //   makeChanges();
        // })

        //1st user joined and left after 5min and other user didn't joined
        // const eventsWithEmptyLeaveDurationAndMissLeftAfter5min = pastEvents.filter(
        //   (event) => (event.callJoin !== "" && event.totalDuration === NaN && otherPersonMissedCall === true)
        // )


        //user A join  after 5 min callJoin !== 0 and otherPersonMissedCall=true because user B is joining after 
        //5min B will have callJoin !===0 otherPersonMissedCall false
        const eventsWithJoinAndOtherUserLate = pastEvents.filter(
          (event) => (event.callJoin !== 0 && event.otherPersonMissedCall === true)
        )

        eventsWithJoinAndOtherUserLate.forEach((event) => {
          const makeChanges = async () => {
            const otherPersonEventWhoMissedCall = await User.findByIdAndUpdate(
              {displayName: event.matchedPersonFullName},
              {
                $set: { missedMeeting: true }, // Use $set to update specific fields
                $inc: { missedMeetingCount: 1 } // Use $inc to increment the count
              },
              { new: true } 
            );
  
            let getCount = await getAttendanceScrore(otherPersonEventWhoMissedCall);
            const updated = await User.findOneAndUpdate(
              { _id: otherPersonEventWhoMissedCall._id },
              { attendanceScore: getCount },
              { new: true }
            );
            if (updated) {
              io.emit("sessionMissedNotify", updated);
            }
          }
          makeChanges();
        })

        //normal scenario both user joined on time
        const eventsWithJoinLeaveDurationAndNoMiss = pastEvents.filter(
          (event) => (event.callJoin !== 0 && event.otherPersonMissedCall === false)
        )
        

        eventsWithJoinLeaveDurationAndNoMiss.forEach((event) => {
          const makeChanges = async () => {
            // if(event.totalCallDuration < 24000000){
            //   const user_to_which_this_event_belong_to = await User.findOneAndUpdate(
            //   {displayName: event.fullName},
            //   {
            //     $inc: { missedMeetingCount: 1 } // Use $inc to increment the count
            //   },
            //   { new: true } 
            // );

            // let getCount = await getAttendanceScrore(user_to_which_this_event_belong_to);

            // const updated = await User.findOneAndUpdate(
            //   { _id: user_to_which_this_event_belong_to._id },
            //   { attendanceScore: getCount },
            //   { new: true }
            // );
            // }else{
              const user_to_which_this_event_belong_to = await User.findOneAndUpdate(
                {displayName: event.fullName},
                {
                  $inc: { totalSessionsAttended: 1 }, // Use $inc to increment the count
                  $set:{
                    "welcomeChecklistState.final": true
                  }
                },
                { new: true } 
              );
              // totalSessionsAttended
            // }
          }
          makeChanges();
        })

       
        if (pastEvents.length > 0) {
            // Find existing pastEvent document or create a new one if none exists
            let existingPastEvent = await pastEvent.findOne();
            console.log('existingPastEvent',existingPastEvent);

            if (!existingPastEvent) {
                existingPastEvent = new pastEvent();
            }

            // Append new past events to the existing allpastevents array
            existingPastEvent.allpastevents.push(...pastEvents);

            // Save the updated pastEvent document
            await existingPastEvent.save();



            // Delete past events from the Event collection
            await Event.deleteMany({ end: { $lt: now } });

            console.log(`${pastEvents.length} events moved to pastEvents collection.`);
        } else {
            console.log('No past events found.');
        }
    } catch (error) {
        console.error('Error moving past events:', error);
    }
}

// Schedule the task to run every 5 minutes
cron.schedule('*/5 * * * *', movePastEvents);


// Schedule task to run every Sunday at 12:00 AM
cron.schedule('0 0 * * 0', async () => {
  try {
      // Calculate the current date
      const currentDate = new Date();

      // Remove past events
      const result = await pastEvent.updateOne(
          // Filter for events where at least one event in the array has a start date in the past
          { 'allpastevents.start': { $lt: currentDate } },
          // Pull events from the array that have a start date in the past
          { $pull: { allpastevents: { start: { $lt: currentDate } } } }
      );

      console.log(`Removed ${result.modifiedCount} past events.`);
  } catch (err) {
      console.error('Error removing past events:', err);
  }
}, {
  timezone: 'Asia/Kolkata' // Adjust according to your timezone, e.g., 'America/New_York'
});
// cron.schedule('0 0 * * 0', async () => {
//   try {
//       // Calculate the current date
//       const currentDate = new Date();

//       // Remove past events
//       const result = await pastEvent.updateOne(
//           // Filter for events where at least one event in the array has a start date in the past
//           { 'allpastevents.start': { $lt: currentDate } },
//           // Pull events from the array that have a start date in the past
//           { $pull: { allpastevents: { start: { $lt: currentDate } } } }
//       );

//       console.log(`Removed ${result.modifiedCount} past events.`);
//   } catch (err) {
//       console.error('Error removing past events:', err);
//   }
// }, {
//   timezone: 'Your/Timezone' // Adjust according to your timezone, e.g., 'America/New_York'
// });



module.exports = pastEvent;