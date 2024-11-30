const mongoose = require("mongoose");

const eventSchema = mongoose.Schema({
    myID:{
        type: String,
        required: true,
        unique: true
    },
    duration: {
        type: String,
        required: true,
    },
    start : {
        type: Date,
        required: true,
    },
    recurringEventsArray: [
        {
            _id: false,
            myID: {type: String},
            start: {type: Date},
            end: {type: Date}
        }
    ],
    end : {
        type: Date,
        required: true,
    },
    name : {
        type: String,
    },
    fullName: {
        type: String,
    },
    profilePic: {
        type: String,
    },
    profileLink:{
        type: String,
    },
    // taskType: {
    //     type: String,
    // },
    partner :{
        type: String,
    } ,
    matchedPersonName :{
        type: String,
    },
    matchedPersonFullName: {
        type: String
    },
    matchedPersonProfilePic :{
        type: String,
    },
    matchedPersonProfileLink: {
        type: String
    },
    quiteModeOn:{
        type: Boolean,
    },
    callID: {
        type: String
    },
    callJoin: {
        type: Number,
        default: 0
    },
    otherPersonMissedCall: {
        type: Boolean,
        default: false
    }
}, {
    timeStamps: true,
});

const Event = mongoose.model('Event', eventSchema);


module.exports = Event;