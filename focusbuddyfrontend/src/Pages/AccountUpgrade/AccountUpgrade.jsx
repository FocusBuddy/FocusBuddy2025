import { useContext, useEffect, useState } from "react";
import { myContext } from "../../utils/PrivateRoutes";
import { useNavigate } from "react-router-dom";
import Razorpay from "razorpay";
import logo from "../../assets/FocusBuddy_Logo.png";
import SuccessToast from "../../Components/UI/toast-components/SuccessToast";
import ErrorTextToast from "../../Components/UI/toast-components/ErrorTextToast";


export default function AccountUpgrade() {
  const { userProfile } = useContext(myContext);
  const navigate = useNavigate();
  // console.log(userProfile);
  const [activeTab, setActiveTab] = useState("plus_monthly");
  const[updateSuccess,setUpdateSuccess] = useState(false);
  const[updateFail,setUpdateFail] = useState(false);
  // const [loading, setLoading] = useState(false);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleSubscription = async () => {
    try {
      // Replace with the user's details collected from your form
      const userDetails = {
        name: userProfile.displayName,
        email: userProfile.email,
      };

      // Call the backend endpoint to create a subscription and get the hosted link
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_PRO_URL}/api/user/create-subscription`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ plan_type: activeTab, userEmail: userProfile.email }),
        }
      );

      const data = await response.json();

      // Check if subscription data is valid
      if (!data.subscription || !data.subscription.id) {
        alert("Failed to create subscription. Please try again.");
        return;
      }

      // Razorpay options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        subscription_id: data.subscription.id,
        amount: activeTab === "plus_monthly" ? 99900 : 69900,
        name: "FocusBuddy",
        description: `${activeTab} Subscription`,
        image: logo,
        handler: async function (response) {
          const handlerResponse = response
          try{
          // Handle successful payment here
          console.log("payment-succcess", handlerResponse);
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
              userEmail: userProfile.email
            }),
          })
            const data = await response.json();
            if(data.success){
              console.log(data.message);
              navigate('/account/plan/success');
            }else{
              navigate('/account/plan/payment-failed');
            }
        }catch(err){
          console.log(err);
          throw new Error("Error while verifying payment.")
        }

        },
        prefill: {
          name: userProfile.displayName,
          email: userProfile.email,
        },
        theme: {
          color: "#008080", // Customize the checkout color
        },
        method: {
          upi: true, // Disables UPI payment method
          card: true, // Enables card payment method
          netbanking: true, // Enables netbanking
          wallet: true, // Enables wallet payments
          emi: false, // Enables EMI
      },
      };

      // Open Razorpay Checkout
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Error creating subscription:", error);
      alert("Error creating subscription.");
    }
  };


  const handleUpdateSubscription = async (newplan) => {
    try{
      const response = await fetch(`${import.meta.env.VITE_BACKEND_PRO_URL}/api/user/${userProfile.subscription.payment_method === "cards" ? "updateCardSubscription" : "updateUpiSubscription"}`,
        {
          method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              newPlan: newplan,
              userEmail: userProfile.email,
              sub_id:userProfile.subscription.mainsub_id
            }),
        }
      )
      const data = await response.json();
      if (response.ok) {
        setUpdateSuccess(true);
        setTimeout(() => {
          setUpdateSuccess(false);
        }, 2000);
        setUpdateSub(false);
      } else {
        setUpdateFail(true);
        setTimeout(() => {
          setUpdateFail(false);
        }, 1000);
      }
    }catch(err){
      console.log(err);
      throw new Error("Error while handling update subscription.")
    }
  }

  return (
    <>
      <div className="md:container mx-auto min-w-screen min-h-screen py-20 px-6">
        <h1 className="text-4xl font-bold text-greenbg text-center">
          Upgrade to FocusBuddy Plus
        </h1>
        <p className="my-4 text-formgray text-xl text-center">
          Boost your productivity with{" "}
          <span className="font-medium">endless sessions</span>
        </p>
        <p className="text-center"><span className="font-semibold">Note:</span></p>

        {userProfile.subscription.planType === "free" ? (
          <div className="mt-10 w-full lg:w-[80%] xl:w-[65%] 2xl:w-[58%] mx-auto flex flex-col md:flex-row justify-between gap-4">
            <div className="w-full md:w-[50%] text-center p-10 bg-white text-textcolor rounded-3xl border-2 border-greenbg space-y-2">
              <h3 className="mb-8 text-3xl font-medium">Free</h3>
              <p className="pb-10 text-md xl:text-xl">
                unlimited session for a month
              </p>
              <p className=" text-greenbg font-bold text-md xl:text-xl py-3 px-6 border-2 border-greenbg rounded-md">
                Your current plan
              </p>
            </div>
            <div className="w-full md:w-[50%] text-center p-10 bg-greenbg text-white rounded-3xl border-2 border-bordercolor space-y-2">
              <h3 className="mb-4 text-3xl font-medium">Plus</h3>

              <div className=" relative">
                <ul
                  className="md:container mx-auto text-md xl:text-lg border-2 border-white rounded-md relative flex flex-wrap p-1 list-none"
                  data-tabs="tabs"
                  role="list"
                >
                  <li className="z-30 w-[38%] md:w-[40%] text-center">
                    <a
                      className={`z-30 flex items-center border-2 border-bordercolor  justify-center w-full py-1.5 transition-all ease-in-out cursor-pointer bg-inherit ${
                        activeTab === "plus_monthly"
                          ? "activetab bg-white border-2 border-white text-textcolor rounded-md"
                          : " border-2 border-greenbg"
                      }`}
                      data-tab-target=""
                      role="tab"
                      aria-selected={activeTab === "plus_monthly"}
                      aria-controls="plus_monthly"
                      onClick={() => handleTabClick("plus_monthly")}
                    >
                      <span className="ml-1">Monthly</span>
                    </a>
                  </li>
                  <li className="z-30 w-[62%] md:w-[60%] text-center">
                    <a
                      className={`z-30 flex items-center justify-center w-full px-0 py-1.5 transition-all ease-in-out cursor-pointer ${
                        activeTab === "plus_yearly"
                          ? "activetab bg-white border-2 border-white text-textcolor rounded-md"
                          : " border-2 border-greenbg"
                      }`}
                      data-tab-target=""
                      role="tab"
                      aria-selected={activeTab === "plus_yearly"}
                      aria-controls="plus_yearly"
                      onClick={() => handleTabClick("plus_yearly")}
                    >
                      <span className="ml-1">Yearly (save 30%)</span>
                    </a>
                  </li>
                </ul>
                <div data-tab-content="" className="md:container mx-auto pt-6">
                  <div
                    className={`${
                      activeTab === "plus_monthly"
                        ? "opacity-100"
                        : "hidden opacity-0"
                    }`}
                    id="plus_monthly"
                    role="tabpanel"
                  >
                    <p className="text-md xl:text-xl">
                      Unlimited sessions every month
                    </p>
                    <p className="mt-2 font-bold text-md xl:text-xl">
                      ₹999/month
                    </p>
                    <p className="text-md xl:text-xl">billed monthly</p>
                    <button
                      onClick={() => handleSubscription(activeTab)}
                      className="mt-6 text-md xl:text-lg rounded-md bg-textcolor p-3 px-14 text-white"
                    >
                        Upgrade
                    </button>
                  </div>
                  <div
                    className={`${
                      activeTab === "plus_yearly"
                        ? "opacity-100"
                        : "hidden opacity-0"
                    }`}
                    id="plus_yearly"
                    role="tabpanel"
                  >
                    <p className="text-md xl:text-xl">
                      Unlimited sessions every month
                    </p>
                    <p className="mt-2 font-bold text-md xl:text-xl">
                      ₹699/month
                    </p>
                    <p className="text-md xl:text-xl">billed yearly</p>
                    <button
                      onClick={() => handleSubscription(activeTab)}
                      className="mt-6 text-md xl:text-lg rounded-md bg-textcolor p-3 px-14 text-white"
                    >
                      Upgrade
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /** if user is subscribed to a plan */
          <div className="flex flex-col gap-4 md:flex-row w-full lg:w-[78%] xl:w-[70%] 2xl:w-[60%] mx-auto">
            {["plus_monthly", "plus_yearly"].map((items, index) => (
              <div
                key={index}
                className={`mt-10 mx-auto text-center  justify-between px-12 md:px-16 py-12 rounded-lg ${
                  items === userProfile.subscription.planType
                    ? "text-white bg-greenbg"
                    : "text-textcolor bg-white border-2 border-textcolor"
                }`}
              >
                <h3 className="mb-4 text-3xl font-medium">Plus</h3>
                <div
                  className={`${
                    items === userProfile.subscription.planType
                      ? "bg-white text-formgray "
                      : "bg-greenbg text-white"
                  } rounded-lg mb-6 py-3 text-md xl:text-lg`}
                >
                  {items === "plus_monthly" ? "Monthly" : "Yearly (save 30%)"}
                </div>
                <p className="text-md xl:text-xl">
                  Unlimited sessions every month
                </p>
                <p className="mt-2 font-bold text-md xl:text-xl">
                  {items === userProfile.subscription.planType
                    ? "₹999/month"
                    : "₹699/month"}
                </p>
                <p className="text-md xl:text-xl">
                  {items === userProfile.subscription.planType
                    ? "billed monthly"
                    : "billed yearly"}
                </p>

                {items === userProfile.subscription.planType ? (
                  <p className="mt-6 text-white font-bold text-md xl:text-xl py-3 px-6 border-2 border-white rounded-md">
                    Your current plan
                  </p>
                ) : (
                  <button
                  onClick={() => handleUpdateSubscription(items)}
                    className=" w-full mt-6 font-bold text-md xl:text-lg rounded-md bg-greenbg p-3 px-14 text-white hover:-translate-y-1 transition-all duration-500 ease-in-out"
                  >
                    Change Plan
                  </button>
                )}
              </div>
            ))}
          </div>
)}
{updateFail ? (
        <ErrorTextToast text={"Error wile updating subscription."} />
      ) : null}
      {updateSuccess ? <SuccessToast text={"Your subcription is updated, It may take a while to reflect."} /> : null}
      </div>
    </>
  );
}
