const express = require("express");
const Event = require("../models/eventsModel");
const pastEvent = require("../models/pastEventModel");
const passport = require("passport");
const router = express.Router();
const { getIo } = require("../socket");
const crypto = require("crypto");

// router.get('/dashboard', showEvents);
router.get("/", async (req, res) => {
  try {
    const io = getIo();
    const allUsers = await Event.find();
    if (allUsers) {
      // console.log('emit')
      io.emit("SessionCreated", allUsers);
    }
    res.status(200).json({ data: allUsers });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "something went wrong with retriving sessions.",
      error: err,
    });
  }
});

async function updateMatchedEvent(body) {
  console.log(
    "foundUser",
    body.foundUser,
    "newUser",
    body.newUserName,
    body.newUserFullName,
    body.newUserPic,
    body.newUserProfileLink
  );
  // console.log("foundUser", foundUser);
  try {
    const event = await Event.findOneAndUpdate(
      {
        name: body.foundUser.name,
        start: body.foundUser.start,
        end: body.foundUser.end,
      },
      {
        matchedPersonName: body.newUserName,
        matchedPersonFullName: body.newUserFullName,
        matchedPersonProfilePic: body.newUserPic,
        matchedPersonProfileLink: body.newUserProfileLink
      },
      { new: true }
    );
    console.log("updated event", event);
    return event;
  } catch (err) {
    console.log(err);
  }
}

async function updatenewMatchedEvent(body) {
  console.log(
    "foundUser",
    body.foundUser,
    "newUser",
    body.newUserName,
    body.newUserFullName,
    body.newUserPic,
    body.newUserProfileLink,
    body.newUserCallID
  );
  // console.log("foundUser", foundUser);
  try {
    const event = await Event.findOneAndUpdate(
      {
        name: body.foundUser.name,
        start: body.foundUser.start,
        end: body.foundUser.end,
      },
      {
        matchedPersonName: body.newUserName,
        matchedPersonFullName: body.newUserFullName,
        matchedPersonProfilePic: body.newUserPic,
        matchedPersonProfileLink: body.newUserProfileLink,
        callID: body.newUserCallID
      },
      { new: true }
    );
    console.log("updated event", event);
    return event;
  } catch (err) {
    console.log(err);
  }
}



router.post("/", async (req, res) => {
  const {
    myID,
    duration,
    start,
    end,
    name,
    fullName,
    profileLink,
    matchedPersonName,
    matchedPersonFullName,
    matchedPersonProfilePic,
    profilePic,
    // taskType,
    partner,
    quiteModeOn,
    callID,
    matchedPersonProfileLink,
  } = req.body;
  console.log(start, end);
  try {
    let matchedWithWhom = matchedPersonName; //matching...
    let matchedWithWhomFullName = matchedPersonFullName; //matching...
    let matchedWithLook = matchedPersonProfilePic; //searchhing
    let matchedWithWhomLink = matchedPersonProfileLink; //''
    let updatedEvent, newEvent;

    //i have already booked session for that time
    const query = {
      $or: [
        {
          start: { $lt: end },
          end: { $gt: start },
          name: name,
        },
      ],
    };

    const overlappingEvents = await Event.find(query);
    // console.log("overlapping", overlappingEvents);
    if (overlappingEvents.length > 0) {
      return res.status(401).json({ message: "notallowed" });
    }

    //a session is booked by someone and i am booking session with them
    const overlappingEventsButOtherUser = await Event.find({
      start: start,
      end: end,
      // taskType: taskType, //try to find event which has similar task type
      matchedPersonName: "Matching...",
    })
      .sort()
      .limit(1);
    console.log(overlappingEventsButOtherUser, "sdgsg");

    if (overlappingEventsButOtherUser.length > 0) {
      updatedEvent = await updateMatchedEvent({
        foundUser: overlappingEventsButOtherUser[0], //the person with same task type
        newUserName: name,
        newUserFullName: fullName,
        newUserPic: profilePic,
        newUserProfileLink:profileLink 
      });
      // console.log('data after put',updatedEvent.updatedEvent);
      //found bunch of them taken the first one that's why [0]
      matchedWithWhom = overlappingEventsButOtherUser[0].name;
      matchedWithWhomFullName = overlappingEventsButOtherUser[0].fullName;
      matchedWithLook = overlappingEventsButOtherUser[0].profilePic;
      matchedWithWhomLink = overlappingEventsButOtherUser[0].profileLink;

      newEvent = {
        myID: myID,
        duration: duration,
        start: start,
        end: end,
        name: name,
        fullName: fullName,
        matchedPersonName: matchedWithWhom,
        matchedPersonFullName: matchedWithWhomFullName,
        matchedPersonProfilePic: matchedWithLook,
        matchedPersonProfileLink: matchedWithWhomLink,
        profilePic: profilePic,
        profileLink: profileLink,
        // taskType: taskType,
        partner: partner,
        quiteModeOn: quiteModeOn,
        callID: overlappingEventsButOtherUser[0].callID,
        callJoin: 0,
        otherPersonMissedCall: false,
      };
    }else{

      newEvent = {
        myID: myID,
        duration: duration,
        start: start,
        end: end,
        name: name,
        fullName: fullName,
        //didn't found any events so will place matching and searching and wait for match
        matchedPersonName: matchedWithWhom,
        matchedPersonFullName: matchedWithWhomFullName,
        matchedPersonProfilePic: matchedWithLook,
        matchedPersonProfileLink: matchedWithWhomLink,
        profilePic: profilePic,
        profileLink: profileLink,
        // taskType: taskType,
        partner: partner,
        quiteModeOn: quiteModeOn,
        callID: callID,
        callJoin: 0,
        otherPersonMissedCall: false,
      // };
    }
    }

    //have event with same start and end but doesn't have same task type then match with person of any other task type
    // if (overlappingEventsButOtherUser.length === 0) {
      // const overlappingEventsButOtherUserDifferentTaskType = await Event.find({
      //   start: start,
      //   end: end, //now task type doesn't matter
      //   matchedPersonName: "Matching...",
      // })
      //   .sort()
      //   .limit(1);

      // if (overlappingEventsButOtherUserDifferentTaskType.length > 0) {
      //   //i found the event to make a match
      //   //this function will update mine details in their event
      //   updatedEvent = await updateMatchedEvent({
      //     foundUser: overlappingEventsButOtherUserDifferentTaskType[0], //the person with same task type
      //     newUserName: name,
      //     newUserFullName: fullName,
      //     newUserPic: profilePic,
      //     newUserProfileLink: profileLink,
      //   });

      //   //i found the event to make a match i will place there details in mine event
      //   matchedWithWhom =
      //     overlappingEventsButOtherUserDifferentTaskType[0].name;
      //   matchedWithWhomFullName =
      //     overlappingEventsButOtherUserDifferentTaskType[0].fullName;
      //   matchedWithLook =
      //     overlappingEventsButOtherUserDifferentTaskType[0].profilePic;
      //     matchedWithWhomLink = overlappingEventsButOtherUserDifferentTaskType[0].profileLink;

      //   newEvent = {
      //     myID: myID,
      //     duration: duration,
      //     start: start,
      //     end: end,
      //     name: name,
      //     fullName: fullName,
      //     matchedPersonName: matchedWithWhom,
      //     matchedPersonFullName: matchedWithWhomFullName,
      //     matchedPersonProfilePic: matchedWithLook,
      //     matchedPersonProfileLink: matchedWithWhomLink,
      //     profilePic: profilePic,
      //     profileLink: profileLink,
      //     taskType: taskType,
      //     partner: partner,
      //     quiteModeOn: quiteModeOn,
      //     callID: overlappingEventsButOtherUserDifferentTaskType[0].callID,
      //     callJoin: 0,
      //   otherPersonMissedCall: false,
      //   };
      // } else {
        //else means we couldn't find any match so create a meet and put matching and search image.

        
    // }

    // console.log(newEvent);
    const event = new Event(newEvent);
    const save_event = await event.save();

    res.status(201).json({
      message: "success",
      updatedEvent: updatedEvent,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "something went wrong with retriving sessions.",
      error: err,
    });
  }
});

router.delete("/deletesession", async (req, res) => {
  try {
    const { eventId } = req.body;
    let requestBody;
    let firstUserChange;

    //deleting the event with ID
    const deleteevent = await Event.findOneAndDelete({ myID: eventId });
    console.log("eventtodelete", deleteevent);

    //deleteevent is the person who is cancelling event

    if (deleteevent.matchedPersonName !== "Matching...") {
      console.log("matching not present");

      //findevent is the person with whom it had event with
      let findevent = await Event.find({
        matchedPersonName: deleteevent.name,
        start: deleteevent.start,
        end: deleteevent.end,
      });
      console.log("findevent", findevent);//m

      //find if there is any person with matching... status and similar taskType for findevent
      const findUser = await Event.find({
        matchedPersonName: "Matching...",
        start: findevent[0].start,
        end: findevent[0].end,
        // taskType: findevent[0].taskType,
      })
        .sort()
        .limit(1);

      console.log("what now findevent", findUser);//s

      if (findUser.length === 0) {
        //if there are event with same start and end but not same taskType then find any other taskType person
        // console.log(findevent, "line158");

        // const findUserWithOtherTaskType = await Event.find({
        //   matchedPersonName: "Matching...",
        //   start: findevent[0].start,
        //   end: findevent[0].end,
        // })
        //   .sort()
        //   .limit(1);

        // if (findUserWithOtherTaskType.length > 0) {
        //   requestBody = {
        //     foundUser: findUserWithOtherTaskType[0], //new found user with same taskType
        //     newUserName: findevent[0].name, //event who had session with
        //     newUserFullName: findevent[0].fullName,
        //     newUserPic: findevent[0].profilePic,
        //     newUserProfileLink: findevent[0].profileLink,
        //     newUserCallID: findevent[0].callID
        //   };

        //   firstUserChange = await updateMatchedEvent({
        //     foundUser: findevent[0], 
        //     newUserName: findUserWithOtherTaskType[0].name,
        //     newUserFullName: findUserWithOtherTaskType[0].fullName,
        //     newUserPic: findUserWithOtherTaskType[0].profilePic,
        //     newUserProfileLink: findUserWithOtherTaskType[0].profileLink,
        //   });
        //   console.log("data after firstUserChange", firstUserChange);

        //   const updatedEvent = await updatenewMatchedEvent(requestBody);
        //   console.log("data after put", updatedEvent);

        //   return res.status(200).json({
        //     messge: "Session remove successfully.",
        //     updatedEvent: updatedEvent,
        //     firstUserChange: firstUserChange,
        //   });
        // } else {
          //still found 0 matched event so changing the person with whom i had event to matching... and search pic
          requestBody = {
            foundUser: findevent[0],
            newUserName: "Matching...",
            newUserFullName: "Matching...",
            newUserPic: `https://res.cloudinary.com/dnbiuntjt/image/upload/v1732370053/search_rydjkq.jpg`,
            newUserProfileLink: '',
            newUserCallID: findevent[0].callID,
          };
          await updateMatchedEvent(requestBody);

          return res
            .status(200)
            .json({ messge: "Session remove successfully.", updatedEvent: [] });
        // }
      } else {
        requestBody = {
          //rupesh with & test
          foundUser: findUser[0], //event who had session with
          newUserName: findevent[0].name, //new found user with same taskType
          newUserFullName: findevent[0].fullName,
          newUserPic: findevent[0].profilePic,
          newUserProfileLink: findevent[0].profileLink,
          newUserCallID: findevent[0].callID
        };

        firstUserChange = await updateMatchedEvent({
          //test with rupesh
          foundUser: findevent[0], //new person with same taskTypee
          newUserName: findUser[0].name,
          newUserFullName: findUser[0].fullName,
          newUserPic: findUser[0].profilePic,
          newUserProfileLink: findUser[0].profileLink,
        });
        console.log("data after firstUserChange", firstUserChange);
        //found the new event with same task type and then change matched person details of it with findevent

        const updatedEvent = await updatenewMatchedEvent(requestBody);
        console.log("data after put", updatedEvent);

        return res.status(200).json({
          messge: "Session remove successfully.",
          updatedEvent: updatedEvent,
          firstUserChange: firstUserChange,
        });
      }
    }

    return res
      .status(200)
      .json({ messge: "Session remove successfully.", updatedEvent: [] });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});


router.post("/findupcomingevent", async (req, res) => {
  // console.log(req.body.username);
  try {
    const event = await Event.find({ name: req.body.username})
      .sort({ start: 1 })
      .limit(1);
    // console.log('upcoming',event);
    res.status(201).json({ upcomingEvent: event });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});

router.get("/getpastevents", async (req, res) => {
  // console.log(req.body.username);
  const name = req.query.thisPerson;
  console.log(name);
  try {
    console.log(await pastEvent.findOne());
    const allEventsCollection = await pastEvent.findOne();
    // const event = await allEventsCollection.find({"allpastevents.fullName" : name})
    const allpastevent = allEventsCollection.allpastevents.filter(
      (event) => event.fullName === name
    );
    console.log("pastevent", allpastevent);
    if (allpastevent.length === 0) {
      return res.status(201).json({
        events: allpastevent,
        message: "no past events for this user",
      });
    }
    return res
      .status(201)
      .json({ events: allpastevent, message: "found all past events" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});

router.put("/editsession", async (req, res) => {
  const { eventid, partner, quite } = req.body;
  try {
    const event = await Event.findOneAndUpdate(
      { myID: eventid },
      { partner: partner, quiteModeOn: quite },
      { new: true }
    );
    console.log(event);
    res
      .status(200)
      .json({ message: "Session edited successfully!", updatedEvent: event });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});

async function check_locked_in_person_is_matching_or_already_booked(
  lockWith, //mera event
  locked_person_event
) {
  try {
    let firstUserChange, requestBody;

    const event = new Event(lockWith);
    const save_event = await event.save();

    //so the favorites with whom i want to lock session may have matching status or have booked session with someone already

    if (locked_person_event[0].matchedPersonName === "Matching...") {
      console.log("locked person event has matching in matchedpersonname");
      //it has meeting info

      requestBody = {
        foundUser: lockWith, //event who had session with
        newUserName: locked_person_event[0].name, //new found user with same taskType
        newUserFullName: locked_person_event[0].fullName,
        newUserPic: locked_person_event[0].profilePic,
        newUserProfileLink: locked_person_event[0].profileLink,
        newUserCallID: locked_person_event[0].callID,
      };

      firstUserChange = await updateMatchedEvent({
        foundUser: locked_person_event[0], //new person with same taskTypee
        newUserName: lockWith.name,
        newUserFullName: lockWith.fullName,
        newUserPic: lockWith.profilePic,
        newUserProfileLink: lockWith.profileLink,
      });
      console.log("data after firstUserChange", firstUserChange);

      const updatedEvent = await updatenewMatchedEvent(requestBody);
      console.log("data after put", updatedEvent);

      const return_data = {
        message: "session locked with favorites",
        firstUserChange,
        updatedEvent,
      };

      return return_data;
    } else {
      //already matched with someone then this fav is having meeting info of that person then replace this meeting info with my details

      //adding this meeting info in my locked in person event
      const adding_neweeting_info_in_locked_person =
        await Event.findOneAndUpdate(
          {
            name: lockWith.matchedPersonName,
            start: lockWith.start,
            end: lockWith.end,
            duration: lockWith.duration,
          },
          {
            matchedPersonName: lockWith.name,
            matchedPersonFullName: lockWith.fullName,
            matchedPersonProfilePic: lockWith.profilePic,
            matchedPersonProfileLink: lockWith.profileLink,
            callID: lockWith.callID
          },
          { new: true }
        );

      //person with whom my locked person had event with
      const my_locked_person_already_locked_partner = await Event.find({
        name: locked_person_event[0].matchedPersonName,
        start: locked_person_event[0].start,
        end: locked_person_event[0].end,
        duration: locked_person_event[0].duration,
      });

      //find if there is any other person with matching... at same place
      const any_other_person_at_same_place = await Event.find({
        matchedPersonName: "Matching...",
        start: locked_person_event[0].start,
        end: locked_person_event[0].end,
        duration: locked_person_event[0].duration,
      })
        .sort()
        .limit(1);

      if (any_other_person_at_same_place.lenght > 0) {
       
        requestBody = {
          foundUser: my_locked_person_already_locked_partner[0], //event who had session with
          newUserName: any_other_person_at_same_place[0].name, //new found user with same taskType
          newUserFullName: any_other_person_at_same_place[0].fullName,
          newUserPic: any_other_person_at_same_place[0].profilePic,
          newUserProfileLink: any_other_person_at_same_place[0].profileLink,
          newUserCallID:any_other_person_at_same_place[0].callID
        };

        firstUserChange = await updateMatchedEvent({
          foundUser: any_other_person_at_same_place[0], //new person with same taskTypee
          newUserName: my_locked_person_already_locked_partner[0].name,
          newUserFullName: my_locked_person_already_locked_partner[0].fullName,
          newUserPic: my_locked_person_already_locked_partner[0].profilePic,
          newUserProfileLink: my_locked_person_already_locked_partner[0].profileLink
        });
        console.log("data after firstUserChange", firstUserChange);

        const updatedEvent = await updatenewMatchedEvent(requestBody);
        console.log("data after put", updatedEvent);

        const return_data = {
          messge: "Session remove successfully.",
          a: add_meeting_info_in_my_event,
          b: adding_neweeting_info_in_locked_person,
          d: updatedEvent,
          c: firstUserChange,
        };

        return return_data;
      } else {
        //didn't found any other person change locked person

        const changing_my_locked_person_already_locked_partner_to_matching =
          await Event.findOneAndUpdate(
            {
              name: locked_person_event[0].matchedPersonName,
              start: locked_person_event[0].start,
              end: locked_person_event[0].end,
              duration: locked_person_event[0].duration,
            },
            {
              matchedPersonName: "Matching...",
              matchedPersonFullName: "Matching...",
              matchedPersonProfilePic: `https://res.cloudinary.com/dnbiuntjt/image/upload/v1732370053/search_rydjkq.jpg`,
              matchedPersonProfileLink: ''
            },
            { new: true }
          );

        const return_data = {
          messge: "Session remove successfully.",
          a: add_meeting_info_in_my_event,
          b: adding_neweeting_info_in_locked_person,
          c: changing_my_locked_person_already_locked_partner_to_matching,
        };

        return return_data;
      }
    }
  } catch (err) {
    console.log(err);
  }
}

router.post("/locksession", async (req, res) => {
  const { lockWith } = req.body;
  console.log(lockWith);
  try {
    let requestBody, firstUserChange;

    const locked_person_event = await Event.find({
      name: lockWith.matchedPersonName,
      start: lockWith.start,
      end: lockWith.end,
      duration: lockWith.duration,
    });
    console.log(locked_person_event);

    //if i already have event booked at the same place it could be in matching status or matched with someone
    const find_if_i_have_already_booked_at_same_place = await Event.find({
      name: lockWith.name,
      start: lockWith.start,
      end: lockWith.end,
      duration: lockWith.duration,
    });

    if (find_if_i_have_already_booked_at_same_place.length > 0) {
      console.log("have my already booked event at same place");
      const get_that_other_person = await Event.find({
        name: find_if_i_have_already_booked_at_same_place[0].matchedPersonName,
        start: find_if_i_have_already_booked_at_same_place[0].start,
        end: find_if_i_have_already_booked_at_same_place[0].end,
        duration: find_if_i_have_already_booked_at_same_place[0].duration,
      });

      //check if there is any other person with matching to match other person with
      const any_other_person_at_same_place = await Event.find({
        matchedPersonName: "Matching...",
        start: get_that_other_person[0].start,
        end: get_that_other_person[0].end,
        duration: get_that_other_person[0].duration,
      })
        .sort()
        .limit(1);

      if (any_other_person_at_same_place.lenght > 0) {
        requestBody = {
          foundUser: get_that_other_person[0], //event who had session with
          newUserName: any_other_person_at_same_place[0].name, //new found user with same taskType
          newUserFullName: any_other_person_at_same_place[0].fullName,
          newUserPic: any_other_person_at_same_place[0].profilePic,
          newUserProfileLink: any_other_person_at_same_place[0].profileLink,
          newUserCallID: any_other_person_at_same_place[0].callID
        };

        firstUserChange = await updateMatchedEvent({
          foundUser: any_other_person_at_same_place[0], //new person with same taskTypee
          newUserName: get_that_other_person[0].name,
          newUserFullName: get_that_other_person[0].fullName,
          newUserPic: get_that_other_person[0].profilePic,
          newUserProfileLink: get_that_other_person[0].profileLink
        });
        console.log("data after firstUserChange", firstUserChange);

        const updatedEvent = await updatenewMatchedEvent(requestBody);
        console.log("data after put", updatedEvent);


        //delete my previous event
        const delete_previous_my_event = await Event.findOneAndDelete({
          name: find_if_i_have_already_booked_at_same_place[0].name,
          start: find_if_i_have_already_booked_at_same_place[0].start,
          end: find_if_i_have_already_booked_at_same_place[0].end,
          duration: find_if_i_have_already_booked_at_same_place[0].duration,
        });

        const data_after_change =
          check_locked_in_person_is_matching_or_already_booked(
            lockWith,
            locked_person_event
          );

        return res
          .status(201)
          .json({
            message: "session locked with favorite",
            e: requestBody,
            f: firstUserChange,
            data_after_change,
          });
      } else {
        //delete my previous event which is present and change the already matched person to matching keep meeting

        const update_that_other_person_with_matching =
          await Event.findOneAndUpdate(
            {
              name: get_that_other_person[0].name,
              start: get_that_other_person[0].start,
              end: get_that_other_person[0].end,
              duration: get_that_other_person[0].duration,
            },
            {
              matchedPersonName: "Matching...",
              matchedPersonFullName: "Matching...",
              matchedPersonProfilePic: `https://res.cloudinary.com/dnbiuntjt/image/upload/v1732370053/search_rydjkq.jpg`,
              matcherPersonProfileLink: ''
            },
            { new: true }
          );

        //delete my previous event
        const delete_previous_my_event = await Event.findOneAndDelete({
          name: find_if_i_have_already_booked_at_same_place[0].name,
          start: find_if_i_have_already_booked_at_same_place[0].start,
          end: find_if_i_have_already_booked_at_same_place[0].end,
          duration: find_if_i_have_already_booked_at_same_place[0].duration,
        });

        const data_after_change =
          check_locked_in_person_is_matching_or_already_booked(
            lockWith,
            locked_person_event
          );

        return res
          .status(201)
          .json({
            message: "session locked with favorite",
            f: update_that_other_person_with_matching,
            data_after_change,
          });
      }
    } else {
      const data_after_change =
        check_locked_in_person_is_matching_or_already_booked(
          lockWith,
          locked_person_event
        );

      return res
        .status(201)
        .json({ message: "session locked with favorite", data_after_change });
    }
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "Error while locking session with favorites" });
  }
});


router.post('/getEvent', async(req,res) => {
  const {callid,fullname} = req.body;
  console.log(callid,fullname);
  try {
    const event = await Event.find({callID: callid, fullName: fullname});
    // const user = await Event.find({ callID: callid });
    // if (!user) {
    //   return res.status(404).json({ message: "user not found" });
    // }
    res.status(201).json({ event: event });
  } catch (err) {
    console.log(err);
    res.status(500).json({message: 'Error while geting available event for video sdk.'})
  }
})


router.post("/updateUserCallJoinTiming", async (req,res) => {
  try{
    const { participantsDetails, availableEvents } = req.body;
    console.log(participantsDetails);
    const joinTime = new Date(
      participantsDetails?.participant?.joined_at
    ).getTime();


    const updated = await Event.findOneAndUpdate(
      {
        callID: availableEvents.callID,
        fullName: participantsDetails?.participant?.user?.name,
      },
      {
        callJoin: new Date(
          participantsDetails?.participant?.joined_at
        ).getTime()
      },
      {new: true}
    )

    // console.log("updateTiming", updated);
    res.status(200).json({ callDetails: updated });

  }catch(err){
    console.log(err);
    res
      .status(500)
      .json({ message: "Error while updating call join timing." });
  }
});

router.post("/getMatchedUserEvent", async (req,res) => {
  const {callid,matchedUserName} = req.body;
  console.log("getMatchedUserEvent", callid,matchedUserName);
  try{
    const matcheduserevent = await Event.find({fullName: matchedUserName, callID: callid});
    console.log(matcheduserevent)
    res.status(200).json({event: matcheduserevent[0]});
  }catch(err){
    console.log(err);
    res.status(500).json({message: "Error while getting matched user event for video sdk"})
  }
})


// router.post("/updateUserCallLeaveTiming", async (req, res) => {
//   try {
//     const { participantsDetails, availableEvents } = req.body;
//     // console.log(
//     //   "participantDetails",
//     //   participantsDetails
//     // );

//     const leaveTime = new Date(participantsDetails?.participant?.user?.last_active).getTime();

//     const event_of_user_which_left_the_call = await Event.findOne({
//       callID: availableEvents.callID,
//       fullName: participantsDetails?.participant?.user?.name,
//     });

//     const totalDuration = leaveTime - event_of_user_which_left_the_call.callJoin
    
//     const updated = await Event.updateOne(
//       {
//         callID: event_of_user_which_left_the_call.callID,
//         fullName: event_of_user_which_left_the_call.fullName,
//       },
//       {
//         $set: {
//           callLeave: leaveTime,
//           totalCallDuration: event_of_user_which_left_the_call.totalCallDuration + totalDuration
//         },
//       }
//     );
//     console.log("updateTimingoncallleave", updated);
//     res.status(200).json({ callDetails: updated });
//   } catch (err) {
//     console.log(err);
//     res
//       .status(500)
//       .json({ message: "Error while updating call leave timing." });
//   }
// });

// router.post("/updateAttendanceOnCallEnd", async (req,res) => {
//   const {callDetails, availableEvents} = req.body;
//   console.log(callDetails);
//   try{
//     const io = getIo();
//     io.emit("updateSessionAttendance", callDetails);
//     res.status(200).json({ message: "session details for attendance", calldetails: callDetails });
//   }catch(err){
//     console.log(err);
//     res
//     .status(500)
//     .json({ message: "Error while updating call leave timing." });
//   }
// })

module.exports = router;
