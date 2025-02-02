const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const router = express.Router();
const {StreamVideoClient} = require('@stream-io/video-client')
const KJUR = require('jsrsasign')

// Define values.
const api_key = process.env.GETSTREAM_KEY_ID;
const api_secret = process.env.GETSTREAM_KEY_SECRET;

function generateToken(user_id,api_key,api_secret){
//     const iat = (new Date(tokenDate).getTime() / 1000.0).toFixed(0);
//   console.log(iat);
// issuedAt should be unix timestamp
  const issuedAt = Math.floor(Date.now() / 1000);
  const exp = Math.round(new Date().getTime() / 1000) + 60 * 60;
  // console.log(exp);
  const oHeader = { alg: 'HS256', typ: 'JWT' }

  const oPayload = {
    apiKey: api_key,
    apiSecret: api_secret,
    tokenIssue: issuedAt,
    exp: exp,
    user_id: user_id,
    role: "admin"
  }

  const sHeader = JSON.stringify(oHeader)
  const sPayload = JSON.stringify(oPayload)
  const sdkJWT = KJUR.jws.JWS.sign('HS256', sHeader, sPayload, api_secret)
  return sdkJWT
}

// console.log(t);

router.get('/getVideoToken',async (req,res) => {
    try{
        // const issuedAt = Math.floor(Date.now() / 1000);
        // console.log(issuedAt);
        const t = generateToken('homelander',api_key,api_secret);
        res.json({token:t});
    }catch(err){
        console.log(err);
    }
});

// Create User Token
router.post('/generate-token', async (req, res) => {
    const userId = req.body.userId;  // Get user ID from the request
    try{

      const t = generateToken(userId,api_key,api_secret);
      return res.status(200).json({token:t});
    }catch(err){
      console.log(err);
      return res.status(500).json({message: 'Error while creating new zoom meeting.'})
    }
  });

module.exports = router;