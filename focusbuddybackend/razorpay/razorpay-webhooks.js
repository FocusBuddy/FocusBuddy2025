const express = require("express");
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const dotenv = require("dotenv");
dotenv.config();
const User = require('../models/UsersModel');

// Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

router.get('/getrazorpay', async (req, res) => {
  // res.send('getrazor');
  const getsubid = await User.findOne({email:'rupeshchincholkar14@gmail.com'});
  const subDetails = await razorpay.subscriptions.fetch(getsubid.subscription.mainsub_id);
  res.json({subDetails});
});


// async function verifyPaymentAndCreateSubcription() {

// }



async function storeSubscriptionDetails(id, pid, amount, email, current_start, current_end, status,payment_method) {
  try {
    // let plan_type;

    // // Determine the plan based on the amount
    // if (amount === 99900) {
    //   plan_type = 'plus_monthly';
    // } else {
    //   plan_type = 'plus_yearly';
    // }

    const subObj = {
      mainsub_id: id,
      mainpay_id: pid,
      planStatus: status,
      planType: 'plus_monthly',
      planStartDate: current_start,
      planEndDate: current_end,
      paymentMethod:payment_method
    };

    // Update user subscription details
    const user = await User.findOneAndUpdate(
      { email: email },
      { $set: { subscription: subObj } },
      { new: true }
    );

    console.log('Subscription details updated:', user);
  } catch (error) {
    console.error('Error updating subscription details:', error);
  }
}



// Webhook endpoint to handle Razorpay events
router.post('/razorpay', async (req, res) => {
  try {
    console.log('webhook req body',req.body);
    // Retrieve webhook signature from headers
    const razorpaySignature = req.headers['x-razorpay-signature'];
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    // const secret = 'FocusBuddy@123';

     // Create a hash to validate the webhook signature
     const body = JSON.stringify(req.body);
    //  console.log('Stringified payload:', body);
     const hmac = crypto.createHmac('sha256', secret);
     hmac.update(body);
     const expectedSignature = hmac.digest('hex');

    // console.log(razorpaySignature,expectedSignature);
    // Compare the signatures to verify the webhook source
    if (expectedSignature !== razorpaySignature) {
      console.log("invalid signature");
      return res.status(400).send('Invalid signature');
    }

    // Handle different webhook events
    const event = req.body.event;
    const payload = req.body.payload;
    console.log("event",event, "payload",req.body.payload)

    switch(event){
      case 'subscription.activated': {
        const { id, current_start, current_end, status, payment_method} = payload.subscription.entity;
        const { id:pid, amount, email} = payload.payment.entity;
        await storeSubscriptionDetails(id, pid, amount, email, current_start, current_end, status, payment_method);
  
        res.status(200).json({ success: true, message: 'Subscription activated and details stored' });
      }
     
      break;

      case 'subscription.charged': {
        const {current_start,current_end,payment_method} = payload.subscription.entity;
        const {email} = payload.payment.entity;
        const getsubid = await User.findOne({email:email});
        console.log("subscription.charged" ,getsubid);

        if(getsubid.subscription.mainsub_id){
        

        const user = await User.findOneAndUpdate(
          {
            email: email
          },
          { $set: { 
            "subscription.planStartDate": current_start,
            "subscription.planEndDate": current_end,
            "subscription.paymentMethod": payment_method 
            } 
          },
          {new:true}
        )

      }
      res.status(200).json({ success: true, message: 'updated plan start and end date to new billing cycle.' });

      }
      break;

      // case "subscription.updated": 
      //   const {id,plan_id,current_end,current_start} = payload.subscription.entity;
      //   let newPlanType;
      //   if(plan_id === process.env.RAZORPAY_YEARLY_PLAN_ID){
      //     newPlanType = 'plus_yearly'
      //   }else{
      //     newPlanType = 'plus_monthly'
      //   }
       
        
      //   const updateuser = await User.findOneAndUpdate(
      //     {"subscription.mainsub_id": id},
      //     { $set: { 
      //       "subscription.planType": newPlanType,
      //       "subscription.planStartDate": current_start,
      //       "subscription.planEndDate": current_end
      //       } 
      //     },
      //     {new:true}
      //   )

      // res.status(200).json({ success: true, message: 'user updated plan so changed details.' });

      //   break;

      // case "payment.captured":
      //   const {id,created_at,email} = payload.payment.entity;
      //   const timestamp = created_at;
      //   const date = new Date(timestamp * 1000);
      //   date.setMonth(date.getMonth() + 1);
      //   const startdate = date.toISOString().split("T")[0]
      //   const formattedDate = date.toISOString().split('T')[0];
      //   const getsubid = await User.findOne({email:email});

      //   if(getsubid.subscription.mainsub_id){

      //     const subDetails = await razorpay.subscriptions.fetch(getsubid.subscription.mainsub_id);
      //     console.log("subscription details",subDetails);
  
      //     const user = await User.findOneAndUpdate(
      //       { email: email },
      //       { $set: { 
      //         "subscription.mainpay_id": id,
      //         "subscription.planStartDate": startdate,
      //         "subscription.planEndDate": formattedDate 
      //         } 
      //       },
      //       { new: true }
      //     );

      //   }
      //   // res.status(200).json({ success: true, message: 'Subscription amount paid.' });
      //   res.status(200).json({ success: true, message: 'Subscription amount paid.' });
        
       

      //   break;
      // case "subscription.cancelled": 
      // //cancelled
      // const {status} = payload.subscription.entity.status;
      // const updateuser = await User.findOneAndUpdate(
      //   { email: email },
      //   { $set: { 
      //     "subscription.planStatus": status,
      //     } 
      //   },
      //   { new: true }
      // );
      // res.status(200).json({ success: true, message: 'Subscription cancelled status changed to cancelled' });

      // break;

      default:
      res.status(200).json({ success: true, message: 'Event received' });

    }
  } catch (error) {
    console.error('Error handling webhook:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
  }
});

module.exports = router;


/*

event payment.authorized payload {
  payment: {
    entity: {
      id: 'pay_OuCpn8M8dwC6SZ',
      entity: 'payment',
      amount: 99900,
      currency: 'INR',
      status: 'authorized',
      order_id: 'order_OuCpSDLj3vaezf',
      invoice_id: 'inv_OuCpS3DGZYECpt',
      international: false,
      method: 'card',
      amount_refunded: 0,
      refund_status: null,
      captured: false,
      description: 'plus_monthly Subscription',
      card_id: 'card_OuCpnlXlFj9KSd',
      card: [Object],
      bank: null,
      wallet: null,
      vpa: null,
      email: 'rupeshchincholkar14@gmail.com',
      contact: '+917875643452',
      token_id: 'token_OuCpnvoEXuKoJZ',
      notes: [],
      fee: null,
      tax: null,
      error_code: null,
      error_description: null,
      error_source: null,
      error_step: null,
      error_reason: null,
      acquirer_data: [Object],
      created_at: 1725696725,
      reward: null
    }
  }
}
Error handling webhook: ReferenceError: payload is not defined
    at C:\Users\rupes\OneDrive\Desktop\Freelancing\new focusbuddy\changes focusbuddy\focusbuddybackend\razorpay\razorpay-webhooks.js:49:40
    at Layer.handle [as handle_request] (C:\Users\rupes\OneDrive\Desktop\Freelancing\new focusbuddy\changes focusbuddy\focusbuddybackend\node_modules\express\lib\router\layer.js:95:5)
    at next (C:\Users\rupes\OneDrive\Desktop\Freelancing\new focusbuddy\changes focusbuddy\focusbuddybackend\node_modules\express\lib\router\route.js:149:13)
    at Route.dispatch (C:\Users\rupes\OneDrive\Desktop\Freelancing\new focusbuddy\changes focusbuddy\focusbuddybackend\node_modules\express\lib\router\route.js:119:3)
    at Layer.handle [as handle_request] (C:\Users\rupes\OneDrive\Desktop\Freelancing\new focusbuddy\changes focusbuddy\focusbuddybackend\node_modules\express\lib\router\layer.js:95:5)
    at C:\Users\rupes\OneDrive\Desktop\Freelancing\new focusbuddy\changes focusbuddy\focusbuddybackend\node_modules\express\lib\router\index.js:284:15
    at Function.process_params (C:\Users\rupes\OneDrive\Desktop\Freelancing\new focusbuddy\changes focusbuddy\focusbuddybackend\node_modules\express\lib\router\index.js:346:12)
    at next (C:\Users\rupes\OneDrive\Desktop\Freelancing\new focusbuddy\changes focusbuddy\focusbuddybackend\node_modules\express\lib\router\index.js:280:10)
    at Function.handle (C:\Users\rupes\OneDrive\Desktop\Freelancing\new focusbuddy\changes focusbuddy\focusbuddybackend\node_modules\express\lib\router\index.js:175:3)
    at router (C:\Users\rupes\OneDrive\Desktop\Freelancing\new focusbuddy\changes focusbuddy\focusbuddybackend\node_modules\express\lib\router\index.js:47:12)
event payment.captured payload {
  payment: {
    entity: {
      id: 'pay_OuCpn8M8dwC6SZ',
      entity: 'payment',
      amount: 99900,
      currency: 'INR',
      base_amount: 99900,
      status: 'captured',
      order_id: 'order_OuCpSDLj3vaezf',
      invoice_id: 'inv_OuCpS3DGZYECpt',
      international: false,
      method: 'card',
      amount_refunded: 0,
      amount_transferred: 0,
      refund_status: null,
      captured: true,
      description: 'plus_monthly Subscription',
      card_id: 'card_OuCpnlXlFj9KSd',
      card: [Object],
      bank: null,
      wallet: null,
      vpa: null,
      email: 'rupeshchincholkar14@gmail.com',
      contact: '+917875643452',
      token_id: 'token_OuCpnvoEXuKoJZ',
      notes: [],
      fee: 2898,
      tax: 0,
      error_code: null,
      error_description: null,
      error_source: null,
      error_step: null,
      error_reason: null,
      acquirer_data: [Object],
      emi_plan: null,
      created_at: 1725696725,
      reward: null
    }
  }
}
event subscription.authenticated payload {
  subscription: {
    entity: {
      id: 'sub_OuCpRXMpUTMaql',
      entity: 'subscription',
      plan_id: 'plan_OtPbXyiQAvQ979',
      customer_id: null,
      status: 'active',
      current_start: 1725696725,
      current_end: 1728239400,
      ended_at: null,
      quantity: 1,
      notes: [],
      charge_at: 1728239400,
      start_at: 1725696725,
      end_at: 1985970600,
      auth_attempts: 0,
      total_count: 100,
      paid_count: 1,
      customer_notify: true,
      created_at: 1725696704,
      expire_by: null,
      short_url: null,
      has_scheduled_changes: false,
      change_scheduled_at: null,
      source: 'api',
      payment_method: 'card',
      offer_id: null,
      remaining_count: 99
    }
  }
}
event subscription.charged payload {
  subscription: {
    entity: {
      id: 'sub_OuCpRXMpUTMaql',
      entity: 'subscription',
      plan_id: 'plan_OtPbXyiQAvQ979',
      customer_id: null,
      status: 'active',
      current_start: 1725696725,
      current_end: 1728239400,
      ended_at: null,
      quantity: 1,
      notes: [],
      charge_at: 1728239400,
      start_at: 1725696725,
      end_at: 1985970600,
      auth_attempts: 0,
      total_count: 100,
      paid_count: 1,
      customer_notify: true,
      created_at: 1725696704,
      expire_by: null,
      short_url: null,
      has_scheduled_changes: false,
      change_scheduled_at: null,
      source: 'api',
      payment_method: 'card',
      offer_id: null,
      remaining_count: 99
    }
  },
  payment: {
    entity: {
      id: 'pay_OuCpn8M8dwC6SZ',
      entity: 'payment',
      amount: 99900,
      currency: 'INR',
      status: 'captured',
      order_id: 'order_OuCpSDLj3vaezf',
      invoice_id: 'inv_OuCpS3DGZYECpt',
      international: false,
      method: 'card',
      amount_refunded: 0,
      amount_transferred: 0,
      refund_status: null,
      captured: '1',
      description: 'plus_monthly Subscription',
      card_id: 'card_OuCpnlXlFj9KSd',
      card: [Object],
      bank: null,
      wallet: null,
      vpa: null,
      email: 'rupeshchincholkar14@gmail.com',
      contact: '+917875643452',
      customer_id: null,
      token_id: 'token_OuCpnvoEXuKoJZ',
      notes: [],
      fee: 2898,
      tax: 0,
      error_code: null,
      error_description: null,
      acquirer_data: [Object],
      created_at: 1725696725
    }
  }
}
event subscription.activated payload {
  subscription: {
    entity: {
      id: 'sub_OuCpRXMpUTMaql',
      entity: 'subscription',
      plan_id: 'plan_OtPbXyiQAvQ979',
      customer_id: null,
      status: 'active',
      current_start: 1725696725,
      current_end: 1728239400,
      ended_at: null,
      quantity: 1,
      notes: [],
      charge_at: 1728239400,
      start_at: 1725696725,
      end_at: 1985970600,
      auth_attempts: 0,
      total_count: 100,
      paid_count: 1,
      customer_notify: true,
      created_at: 1725696704,
      expire_by: null,
      short_url: null,
      has_scheduled_changes: false,
      change_scheduled_at: null,
      source: 'api',
      payment_method: 'card',
      offer_id: null,
      remaining_count: 99
    }
  },
  payment: {
    entity: {
      id: 'pay_OuCpn8M8dwC6SZ',
      entity: 'payment',
      amount: 99900,
      currency: 'INR',
      status: 'captured',
      order_id: 'order_OuCpSDLj3vaezf',
      invoice_id: 'inv_OuCpS3DGZYECpt',
      international: false,
      method: 'card',
      amount_refunded: 0,
      amount_transferred: 0,
      refund_status: null,
      captured: '1',
      description: 'plus_monthly Subscription',
      card_id: 'card_OuCpnlXlFj9KSd',
      card: [Object],
      bank: null,
      wallet: null,
      vpa: null,
      email: 'rupeshchincholkar14@gmail.com',
      contact: '+917875643452',
      customer_id: null,
      token_id: 'token_OuCpnvoEXuKoJZ',
      notes: [],
      fee: 2898,
      tax: 0,
      error_code: null,
      error_description: null,
      acquirer_data: [Object],
      created_at: 1725696725
    }
  }
}
pastEvents []
No past events found.
Client disconnected
Client disconnected


 mainsub_id: 'sub_OvKgmYSsr8EHgX',
    mainpay_id: 'pay_OvKhhZi5l9FjVp',
    planStatus: 'active',
    planType: 'plus_monthly',
    planStartDate: '2024-09-10',
    planEndDate: '2024-10-09'
*/