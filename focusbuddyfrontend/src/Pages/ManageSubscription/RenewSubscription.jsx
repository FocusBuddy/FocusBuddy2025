import { Link } from "react-router-dom";
import { IoReturnDownBackSharp } from "react-icons/io5";
import moment from "moment";

export default function RenewSubscription({userProfile,subDetails,setRenewSub,handleRenewSubscription}) {
  return (
    <>
      <div className="flex flex-col items-start gap-4">
        <button
          className="flex w-fit items-center gap-2 pt-2.5 pb-3 rounded-md text-md xl:text-xl transition duration-500 ease-in-out translate-y-0 hover:-translate-y-1"
          onClick={() => setRenewSub(false)}
          to={"/profile/settings"}
        >
          {" "}
          <IoReturnDownBackSharp className="font-bold" />
          back
        </button>
        <h1 className="mb-4 pb-6 text-2xl xl:text-3xl text-darkbrown font-semibold capitalize ">
          RENEW YOUR PLAN
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
              Your plan will be renewed and will take effect after your current billing period ends on{" "}
              {moment.unix(subDetails?.current_end).format("DD/MM/YYYY")}.
            </p>
            <p className="mt-6">
              We are happy to see you back!.
            </p>
            <p className="mt-10 text-[12px] md:text-[15px] text-darkbrown">
              By renewing your plan, you agree to FocusBuddy's
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
              onClick={() => handleRenewSubscription("plus_monthly")}
              className="w-full mt-4 px-10 bg-darkbrown text-white py-3  rounded-md hover:bg-greenbg"
            >
              Renew plan
            </button>
          </div>
        {/* ) : ( */}
          {/* <div className="max-w-lg text-md xl:text-lg text-greenbg font-semibold">
            <p>FocusBuddy Plus Yearly</p>
            <p className="my-1 text-xl xl:text-2xl text-darkbrown">₹699 per year</p>
            <p>
              Your plan will be renewed and will take effect after your current billing period ends on{" "}
              {moment.unix(subDetails?.current_end).format("DD/MM/YYYY")}.
            </p>
            <p className="mt-6">
              We are happy to see you back!.
            </p>
            <p className="mt-10 text-[12px] md:text-[15px] text-darkbrown">
              By renewing your plan, you agree to FocusBuddy's
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
              onClick={() => handleRenewSubscription("plus_yearly")}
              className="mt-4 px-10 bg-darkbrown text-white py-3  rounded-md hover:bg-greenbg"
            >
              Renew plan
            </button>
          </div>
        )} */}
      </div>
    </>
  );
}
