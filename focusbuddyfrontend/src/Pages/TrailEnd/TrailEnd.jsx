import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Razorpay from "razorpay";
// import handleStripe from "../../utils/handleStripe/handleStripe";
import logo from '../../assets/FocusBuddy_Logo.png'
import { useNavigate } from "react-router-dom";

export default function TrailEnded() {
  const location = useLocation();
  const { profile } = location.state || {};
  // console.log(profile);
  const navigate = useNavigate();

  const handleSubscription = async (plan) => {
    // console.log(plan)
    try {
      // Replace with the user's details collected from your form
      const userDetails = {
        name: profile.user.displayName,
        email: profile.user.email,
      };

      // Call the backend endpoint to create a subscription and get the hosted link
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_PRO_URL}/api/user/create-subscription`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ plan_type: plan, userEmail: profile.user.email }),
        }
      );

      const data = await response.json();
      // console.log(data.subscription)

      // Check if subscription data is valid
      if (!data.subscription || !data.subscription.id) {
        alert("Failed to create subscription. Please try again.");
        return;
      }

      // Razorpay options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        subscription_id: data.subscription.id,
        amount: 75000,
        name: "FocusBuddy",
        description: `${plan} Subscription`,
        image: logo,
        handler: async function (response) {
          const handlerResponse = response
          try{
          // Handle successful payment here
          // console.log("payment-succcess", handlerResponse);
          // Send payment details to the server for verification
          const response = await fetch(`${import.meta.env.VITE_BACKEND_PRO_URL}/api/user/verifypayment`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              payment_id: handlerResponse.razorpay_payment_id,
              // subscription_id: data.subscription.id, // Use the subscription ID you created on the server
              razorpay_signature: handlerResponse.razorpay_signature,
              userEmail: profile.user.email
            }),
          })
            const data = await response.json();
            if(data.success){
              // console.log(data.message);
              navigate('/account/plan/success');
            }else{
              navigate('/signup');
            }
        }catch(err){
          console.log(err);
          throw new Error("Error while verifying payment.")
        }

        },
        prefill: {
          name: profile.user.displayName,
          email: profile.user.email,
        },
        theme: {
          color: "#008080", // Customize the checkout color
        },
        method: {
          upi: false, // Disables UPI payment method
          card: true, // Enables card payment method
          netbanking: true, // Enables netbanking
          wallet: true, // Enables wallet payments
          emi: false, // Enables EMI
      },
      };

      // Open Razorpay Checkout
      const razorpay = new window.Razorpay(options);
      // console.log(razorpay)
      razorpay.open();
    } catch (error) {
      console.error("Error creating subscription:", error);
      alert("Error creating subscription.");
    }
  };

  return (
    <div className="min-h-screen min-w-screen">
      <div className="mt-20 max-w-6xl mx-auto px-6 xl:px-0">
        {
          profile.trial_ended &&
<h1 className="text-greenbg font-medium text-center text-4xl md:text-5xl">
          Your Trial Period Has Ended!
        </h1>
        }
        {
          profile.sub_cancelled &&
          <h1 className="text-greenbg font-medium text-center text-4xl md:text-5xl">
          You Have Cancelled Your Subscription!
        </h1>
        }
        {
          profile.trial_ended &&
          <p className="mt-6 text-lg xl:text-xl text-center leading-9 text-textcolor">
          Thank you for exploring our content during your trial period.
        </p>
        }
        {
          profile.sub_cancelled &&
          <p className="mt-6 text-lg xl:text-xl text-center leading-9 text-textcolor">
          Thank you for exploring our content during your subscription period.
        </p>
        }
        
       
        <p className="mt-6 text-lg xl:text-xl text-center leading-9 text-textcolor">
          We hope you found it valuable and insightful. To continue accessing our exclusive
          content and enjoy uninterrupted benefits, we invite you to subscribe today.
        </p>
      </div>

      <div className="flex flex-col gap-4 md:flex-row w-full lg:w-[78%] xl:w-[70%] 2xl:w-[60%] mx-auto">
      <div
            className="mt-10 mx-auto text-center text-white justify-between px-12 md:px-16 py-12 rounded-lg bg-greenbg"
          >
            <h3 className="mb-4 text-3xl font-medium">Plus</h3>
            <div className="relative bg-white border-2 rounded-lg mb-6 text-formgray border-white py-2 text-md xl:text-lg">
              Monthly
              <div
  className="h-black-friday-discount-tag h-pricing-card__discount--tag"
  data-v-d4d02fa0=""
  data-v-f276a9ad=""
>
  <div className="h-black-friday-discount-tag__wrapper" data-v-f276a9ad="">
    <span className="h-black-friday-discount-tag__icon" data-v-f276a9ad="">
      <svg
        width={21}
        height={39}
        viewBox="0 0 21 39"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        data-v-f276a9ad=""
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M18.0808 0C16.5161 0 15.0277 0.67567 13.9977 1.8535L1.34101 16.3268C-0.480869 18.4102 -0.442043 21.5311 1.4311 23.5685L14.0068 37.247C15.034 38.3642 16.4822 39 17.9998 39H20.2725V0L18.0808 0ZM11.361 23.4843C13.5614 23.2888 15.1868 21.3465 14.9912 19.146C14.7957 16.9455 12.8534 15.3202 10.6529 15.5157C8.45245 15.7113 6.82711 17.6536 7.02263 19.8541C7.21815 22.0545 9.16049 23.6799 11.361 23.4843Z"
          fill="#ff0000"
          data-v-f276a9ad=""
        />
      </svg>
    </span>
    <span
      className="h-black-friday-discount-tag__text--neon h-black-friday-discount-tag__text t-body-2"
      data-v-f276a9ad=""
    >
      25% OFF
    </span>
  </div>
</div>

            </div>
            <p className="text-md xl:text-xl">Unlimited sessions every month</p>
            <p className="mt-2 line-through text-md xl:text-xl">
              ₹1000/month
            </p>
            <p className="my-2 font-bold text-md xl:text-xl">
              ₹750/month
            </p>
            <p className="text-md xl:text-xl">
              billed monthly
            </p>
            <button
              onClick={() => handleSubscription("plus_monthly")}
              className="w-full mt-6 text-md xl:text-lg rounded-md bg-textcolor p-3 px-14 text-white hover:-translate-y-1 transition-all duration-500 ease-in-out"
            >
              Upgrade
            </button>
          </div>
        
        
        {/* {["plus_monthly", "plus_yearly"].map((plan, index) => (
          <div key={index} className="mt-10 mx-auto text-center text-white justify-between px-12 md:px-16 py-12 rounded-lg bg-greenbg">
            <h3 className="mb-4 text-3xl font-medium">Plus</h3>
            <div className="bg-white border-2 rounded-lg mb-6 text-formgray border-white py-2 text-md xl:text-lg">
              {plan === "plus_monthly" ? "Monthly" : "Yearly (save 30%)"}
            </div>
            <p className="text-md xl:text-xl">Unlimited sessions every month</p>
            <p className="mt-2 font-bold text-md xl:text-xl">{plan === 'plus_monthly' ? '₹999/month' : '₹699/month'}</p>
            <p className="text-md xl:text-xl">{plan === 'plus_monthly' ? 'billed monthly' : 'billed yearly'}</p>
            <button
              onClick={() => handleSubscription(plan)}
              className="w-full mt-6 text-md xl:text-lg rounded-md bg-textcolor p-3 px-14 text-white hover:-translate-y-1 transition-all duration-500 ease-in-out"
              
            >
            Upgrade
            </button>
          </div>
        ))} */}
      </div>
    </div>
  );
}


// export default function TrailEnded() {
// return(
//   <>
//     <h1>akjdfhsdlk</h1>
//   </>
// )
// }
