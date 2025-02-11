import { Link } from "react-router-dom";
import { IoReturnDownBackSharp } from "react-icons/io5";
import moment from "moment";

export default function CancelSubscription({
  userProfile,
  subDetails,
  cancelSubscription,
}) {
  return (
    <>
      <div className="flex flex-col items-start gap-4">
        <button
          className="flex w-fit items-center gap-2 pt-2.5 pb-3 rounded-md text-md xl:text-xl transition duration-500 ease-in-out translate-y-0 hover:-translate-y-1"
          onClick={() => setCancelSub(false)}
          to={"/profile/settings"}
        >
          {" "}
          <IoReturnDownBackSharp className="font-bold" />
          back
        </button>
        <h1 className="mb-4 pb-6 text-2xl xl:text-3xl text-darkbrown font-semibold capitalize ">
          CANCEL YOUR PLAN
        </h1>
      </div>
      <h1 className="mb-6 pb-4 text-lg lg:text-xl text-darkbrown font-semibold capitalize border-b-2 border-b-bordercolor">
        Current Subscription
      </h1>

      <div>
        {/* {userProfile.subscription.planType === "plus_monthly" ? ( */}
          <div className="max-w-lg text-md xl:text-lg text-greenbg font-semibold">
            <p>FocusBuddy Plus Monthly</p>
            <p className="my-1 text-xl xl:text-2xl text-darkbrown">₹750 per month</p>
            <p>
              Your plan will be canceled, but is still avaiable until the end of
              your billing period on{" "}
              {moment.unix(subDetails?.current_end).format("DD/MM/YYYY")}.
            </p>
            <p className="mt-6">
              If you change your mind, you can renew your subscription.
            </p>
            <p className="mt-10 text-[12px] md:text-[15px] text-darkbrown">
              By canceling your plan, you agree to FocusBuddy's 
              <Link className="ps-1" to={"/terms"} target="_blank">
                 Terms of Service
              </Link>{" "}
              and{" "}
              <Link to={"/privacy"} target="_blank">
                Privacy Policy
              </Link>
              .
            </p>
            <button
              onClick={() => cancelSubscription()}
              className="w-full mt-4 px-10 bg-darkbrown text-white py-3  rounded-md hover:bg-greenbg"
            >
              Cancel plan
            </button>
          </div>
        {/* ) : ( */}
          {/* <div className="max-w-lg text-md xl:text-lg text-greenbg font-semibold">
            <p>FocusBuddy Plus Yearly</p>
            <p className="my-1 text-xl xl:text-2xl text-darkbrown">₹699 per year</p>
            <p>
              Your plan will be canceled, but is still avaiable until the end of
              your billing period on{" "}
              {moment.unix(subDetails?.current_end).format("DD/MM/YYYY")}.
            </p>
            <p className="mt-6">
              If you change your mind, you can renew your subscription.
            </p>
            <p className="mt-10 text-[12px] md:text-[15px] text-darkbrown">
              By canceling your plan, you agree to FocusBuddy's
              <Link to={"/terms"} target="_blank">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link to={"/privacy"} target="_blank">
                Privacy Policy
              </Link>
              .
            </p>
            <button
              onClick={() => cancelSubscription()}
              className="mt-4 px-10 bg-darkbrown text-white py-3  rounded-md hover:bg-greenbg"
            >
              Cancel plan
            </button>
          </div>
        )} */}
      </div>
    </>
  );
}
