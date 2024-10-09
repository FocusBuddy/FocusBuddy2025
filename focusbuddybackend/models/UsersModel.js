const mongoose = require("mongoose");
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    googleId: {
        type: String,
        unique: true
    },
    email: {
        type: String,
        required: true,
        default: null
    },
    password: {
        type: String,
        select: false,
        default: null,
        // required: true
    },
    displayName: {
        type: String,
        default: '',
    },
    userGender: {
        type: Array,
        default: ['Prefer not to say']
    },
    matchWithGender: {
        type: String,
        default: "everyone"
    },
    noMatchWithGender: {
        type: String,
        default: "everyone"
    },
    availabilityStatus: {
        type: String,
        default: "No one"
    },
    quiteModeMatchAllowed: {
        type: Boolean,
        default: false
    },
    givenName: {
        type: String,
        default: '',
    },
    familyName: {
        type: String,
        default: '',
    },
    profilePic: {
        type: String,
        default: '',
        // default: 'http://localhost:8000/uploads/defaultImages.png'
    },
    userLocation: {
        'region': {type: String, default:null},
        'country': {type: String, default:null}
    },
    memberSince: {
        type: Date,
        default: Date.now
    },
    attendanceScore: {
        type: String,
        default: '100%'
    },
    totalSessionsAttended: {
        type: Number,
        default: 0
    },
    missedMeeting: {
        type: Boolean,
        default: false
    },
    missedMeetingCount: {
        type: Number,
        default :0
    },
    userSawAttendanceFallModal: {
        type: Boolean,
        default: false
    },
    attendance0BanAccount:{
        type: Boolean,
        default: false
    },
    userProfileLink: {
        type: String,
        unique: true,
    },
    userProfileQuestions: {
        "today-q1": { type: String, default: '' },
        "today-q2": { type: String, default: '' },
        "today-q3": { type: String, default: '' },
        "today-q4": { type: String, default: '' },
        "profile-q1": { type: String, default: '' },
        "profile-q2": { type: String, default: '' },
        "profile-q3": { type: String, default: '' },
        "profile-q4": { type: String, default: '' },
        "profile-q5": { type: String, default: '' },
        "profile-q6": { type: String, default: '' },
        "hiw-q1": { type: String, default: '' },
        "hiw-q2": { type: String, default: '' },
        "hiw-q3": { type: String, default: '' },
        "hiw-q4": { type: String, default: '' },
        "hiw-q5": { type: String, default: '' },
        "focusbuddy-q1": { type: String, default: '' },
        "focusbuddy-q2": { type: String, default: '' },
        "focusbuddy-q3": { type: String, default: '' },
        "focusbuddy-q4": { type: String, default: '' },
        "focusbuddy-q5": { type: String, default: '' },
    },
    favorites: [
        {
            _id: false,
            email: {type: String},
            name: {type: String},
            link: {type: String},
            plink: {type: String},
            availability: {type:String},
            favoritesArray: {type: Array},
        }
    ],
    welcomeChecklistState: {
        "works": {
            type: Boolean,
            default: false
        },
        "guidelines": {
            type: Boolean,
            default: false
        },
        "booking": {
            type: Boolean,
            default: false
        },
        "final": {
            type: Boolean,
            default: false
        },
    },
    subscription:{
        "upgradesub_id": {
            type: String,
            default: ''
        },
        "mainsub_id": {
            type: String,
            default: ''
        },
        "mainpay_id": {
            type: String,
            default: ''
        },
        "planStatus": {
            type: String,
            default: ''
        },
        "planType": {
            type: String,
            default: ''
        },
        "planStartDate": {
            type: Number,
            default: 0
        },
        "planEndDate": {
            type: Number,
            default: 0
        },
        "cancel_at_cycle_end": {
            type: Boolean,
            default: false
        },
        "paymentMethod": {
            type:String,
            default:''
        }
    }
}, {
    timeStamps: true,
})

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
      return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    console.log(this.password);

        next();
      } catch (err) {
        next(err);
      }
  });
  
  userSchema.methods.matchPassword = async function(password) {
    return await bcrypt.compare(password, this.password);
  };

const User = mongoose.model('User', userSchema);


module.exports = User;
