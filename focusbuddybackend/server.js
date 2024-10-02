const express = require('express')
const session = require('express-session');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./db/connectDB');
// const randomSessionID = require('./sessionID genrator/generateRandomId');
const mongoose = require('mongoose')
const MongoStore = require('connect-mongo');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const LocalStrategy = require('passport-local').Strategy;
const errorHandler = require('./middleware/ErrorHandler');
const passportLocalStrategy = require('./passportJs/passportLocalStrategy'); 
const {initializeSocket} = require('./socket');
const http = require('http');
const path =require('path')

const eventsRoutes = require('./routes/eventsRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const videoRoutes = require('./videoSDK/videoSDK');
const razorPayWebhooks = require('./razorpay/razorpay-webhooks');



dotenv.config();
// mongoose();

connectDB();
const app = express();
const server = http.createServer(app);

initializeSocket(server)


// Serve static files from the 'emailTemplates' directory
app.use('/emailTemplates', express.static(path.join(__dirname, 'emailTemplates')));
app.use('/uploads', express.static('uploads'));


// app.use((req,res,next) => {
//     res.set('Cross-Origin-Embedded-Policy', 'require-corp');
//     res.set('Cross-Origin-Opener-Policy', 'same-origin');
//     next();
// })

// Use the cors middleware
app.use(cors({
    origin: process.env.CLIENT_PRO_URL,
    // origin: 'https://focusbuddyfrontend.vercel.app',
    methods: "GET,POST,PUT,DELETE",
    credentials: true
}));

const port = process.env.PORT;

app.use(cookieParser());
// app.enable('trust proxy');
app.set('trust proxy', 1);
app.use(express.json());
app.use(express.urlencoded({extended: true}));


//express session configurations
app.use(
    session({
        //to generate session ID
        // genid: randomSessionID,
        secret: process.env.SESSION_SECRET,
        // secret: 'r8yAALyweVJbO6gQTnkl4asgsrhnOyNO',
        resave: false,
        saveUninitialized: false,
        proxy: true,
        cookie: {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            // maxAge: 60 * 60 * 1000
            secure: true,
            domain: process.env.CLIENT_PRO_URL,
            sameSite: "lax",
        },
        store: MongoStore.create({
            client: mongoose.connection.getClient(),
            collectionName: 'userSessions',
            ttl: 7 * 24 * 60 * 60, // 1 week in seconds
            autoRemove: 'disable', // Default mode to use MongoDB's TTL index
        })
    })
)
//app.use(passport.authenticate('userSessions'));

// initialize passport
app.use(passport.initialize());
app.use(passport.session());
passportLocalStrategy(passport); 
require('./passportJs/passportGoogleStrategy');


//Routes
app.use("/api/events",eventsRoutes);
app.use("/auth", authRoutes);
app.use("/api/user",userRoutes);
app.use("/api/video",videoRoutes);
app.use("/api/webhook",razorPayWebhooks);
app.use(errorHandler);



app.get('/',(req,res) => {
    res.send('ngrok started....');
})


//automatically delete events which are older than current date
// async function deleteOutdatedEvents(){
//     try{
//       const currentDate = new Date();
//       const result = await Event.deleteMany({ end: { $lt: currentDate } });
//       console.log(`Deleted ${result.deletedCount} outdated events.`);
//       if (result.deletedCount > 0) {
//         io.emit('eventsUpdated');
//       }
//     }catch(err){
//       console.log(err);
//     }
  
//   }
  
//   cron.schedule('* * * * *', () => {
//     console.log('Running scheduled task to delete outdated events...');
//     deleteOutdatedEvents();
//   });
  


server.listen(port , (req,res) => {
    console.log(`server started listening on port: ${port}`);
})
