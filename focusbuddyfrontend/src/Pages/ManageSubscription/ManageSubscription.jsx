import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { useEffect } from "react";
import { myContext } from "../../utils/PrivateRoutes";
import moment from "moment";
import Loading from "../../Components/UI/LoadingComponent/Loading";
import ErrorTextToast from "../../Components/UI/toast-components/ErrorTextToast";
import SuccessToast from "../../Components/UI/toast-components/SuccessToast";
import { IoReturnDownBackSharp } from "react-icons/io5";
import CancelSubscription from "./CancelSubscription";
import RenewSubscription from "./RenewSubscription";

export default function ManageSubscription() {
  const { userProfile, setUserProfile } = useContext(myContext);
  console.log(userProfile);
  const [subDetails, setSubDetails] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [paymentInvoices, setPaymentInvoices] = useState(null);
  const [cancelSub, setCancelSub] = useState(false);
  const [cancelFail, setCancelFail] = useState(false);
  const [cancelSuccess, setCancelSuccess] = useState(false);
  const [renewFail, setRenewFail] = useState(false);
  const [renewSuccess, setRenewSuccess] = useState(false);
  const [renewSub,setRenewSub] = useState(false);

  const getActiveSub = async () => {
    console.log("getActiveSub called");
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_PRO_URL}/api/user/getSubcription`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sub_id: userProfile.subscription.mainsub_id,
            pay_id: userProfile.subscription.mainpay_id,
          }),
        }
      );
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        setSubDetails(data?.activeSub);
        setPaymentDetails(data?.activeSubPayment);
        setPaymentInvoices(data.paymentInvoice?.items); //more that one items purchased then array of invoices present in items
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (userProfile.subscription.planType !== "free") {
      getActiveSub();
    }
  }, []);

  const cancelSubscription = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_PRO_URL}/api/user/cancelSubcription`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sub_id: userProfile.subscription.mainsub_id,
            userEmail: userProfile.email,
          }),
        }
      );
      const data = await response.json();
      console.log(data.userupdate);
      if (response.ok) {
        setUserProfile(data.userupdate);
        setCancelSuccess(true);
        setTimeout(() => {
          setCancelSuccess(false);
        }, 1000);
        setCancelSub(false);
      } else {
        setCancelFail(true);
        setTimeout(() => {
          setCancelFail(false);
        }, 1000);
      }
    } catch (err) {
      console.log(err);
      throw new Error("Error while cancelling subscription");
    }
  };

  // console.log(subDetails?.current_end,moment.unix(subDetails?.current_end).add(1, 'day').unix());
  const handleRenewSubscription = async (plan_type) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_PRO_URL}/api/user/renewSubscription`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            currentSubEnd: userProfile.subscription.mainsub_id,
            userEmail: userProfile.email,
          }),
        }
      );
      const data = await response.json();
      console.log(data.userupdate);
      if (response.ok) {
        setUserProfile(data.userupdate);
        setRenewSuccess(true);
        setTimeout(() => {
          setRenewSuccess(false);
        }, 1000);
        setRenewSub(false);
      } else {
        setRenewFail(true);
        setTimeout(() => {
          setRenewFail(false);
        }, 1000);
      }
    } catch (err) {
      console.log(err);
      throw new Error("Error while renewing subscription");
    }
  }

  console.log(subDetails, paymentDetails);

  if (!subDetails && !paymentDetails && !paymentInvoices) return <Loading />;

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <div className="w-full md:w-[35%] xl:w-[30%] bg-greenbg text-white p-6 md:pt-20 xl:pt-28 lg:ps-10 lg:pe-20">
        <h1 className="text-4xl xl:text-5xl font-semibold">FocusBuddy</h1>
        <p className="mt-4 mb-6 lg:mt-8 lg:mb-10 text-md xl:text-lg ">
          Maximize Your Efficiency: Experience the FocusBuddy Advantage
        </p>
        <div className="flex w-fit items-center gap-2 bg-darkbrown pt-2.5 pb-3 px-6 md:px-8 rounded-md text-md xl:text-lg">
          <IoReturnDownBackSharp className="font-bold" />
          <Link to={"/profile/settings"}>Go back to settings</Link>
        </div>
      </div>
      <div className="w-full md:w-[65%] xl:w-[70%] flex flex-col p-6 md:pt-20 lg:px-10 xl:pt-28 xl:px-20">
        {userProfile.subscription.planType === "free" ? (
          <h1 className="text-xl lg:text-2xl text-darkbrown font-semibold">
            No active subscription.
          </h1>
        ) : (
          <>
            {cancelSub ? (
              <>
                <CancelSubscription
                  userProfile={userProfile}
                  cancelSubscription={cancelSubscription}
                  subDetails={subDetails}
                  setCancelSub={setCancelSub}
                />
              </>
            ) : 
            renewSub ? (
              <>
                <RenewSubscription
                  userProfile={userProfile}
                  handleRenewSubscription={handleRenewSubscription}
                  subDetails={subDetails}
                  setRenewSub={setRenewSub}
                />
              </>
            )
            :
            (
              <>
                <div>
                  <h1 className="py-2 md:py-4 border-b-2 border-b-bordercolor text-lg xl:text-xl text-darkbrown font-semibold capitalize">
                    CURRENT SUBSCRIPTION
                  </h1>
                  <div className="flex flex-col md:flex-row justify-between rounded-md p-4 mt-6 border-2 border-bordercolor">
                    <div>
                      {/* {userProfile.subscription.planType === "plus_monthly" ? ( */}
                        <div className="text-md xl:text-lg text-greenbg font-semibold">
                          <p>FocusBuddy Plus Monthly</p>
                          <p className="my-1 text-xl xl:text-2xl text-darkbrown">
                            ₹750 per month
                          </p>
                          <p>
                            Your plan renews on{" "}
                            {moment
                              .unix(subDetails?.current_end)
                              .format("DD/MM/YYYY")}
                          </p>
                        </div>
                      {/* // ) : (
                      //   <div className="text-md xl:text-lg text-greenbg font-semibold">
                      //     <p>FocusBuddy Plus Yearly</p>
                      //     <p className="my-1 text-xl xl:text-2xl text-darkbrown">
                      //       ₹699 per year
                      //     </p>
                      //     <p>
                      //       Your plan renews on{" "}
                      //       {moment */}
                      {/* //         .unix(subDetails?.current_end)
                      //         .format("DD/MM/YYYY")}
                      //     </p>
                      //   </div>
                      // )} */}
                    </div>
                    <div className="mt-6 md:mt-0 flex flex-col md:flex-row gap-4">
                      {/* <div className="bg-darkbrown my-auto text-white px-6 py-3 md:py-4 rounded-md hover:bg-greenbg">
                        <Link
                          to={subDetails?.short_url}
                          target="_blank"
                          className=""
                        >
                          Change Subscription
                        </Link>
                      </div> */}

                      {userProfile.subscription.cancel_at_cycle_end ? (
                        <div className="bg-darkbrown my-auto text-white px-6 md:px-4 py-3 md:py-4 rounded-md hover:bg-greenbg">
                          <button
                            onClick={() => setRenewSub(true)}
                            className=""
                          >
                            Renew Subscription
                          </button>
                        </div>
                      ) : (
                        <div className="bg-darkbrown my-auto text-white px-6 md:px-4 py-3 md:py-4 rounded-md hover:bg-greenbg">
                          <button
                            onClick={() => setCancelSub(true)}
                            className=""
                          >
                            Cancel Subscription
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="my-10">
                  {/* <h1  className="text-xl text-darkbrown font-semibold">No active subscription.</h1> */}

                  <h1 className="py-2 md:py-4 border-b-2 border-b-bordercolor text-lg xl:text-xl text-darkbrown font-semibold capitalize">
                    PAYMENT METHOD USED
                  </h1>
                  <div className="flex flex-col md:flex-row justify-between rounded-md p-4 mt-6 border-2 border-bordercolor">
                    {
                      userProfile.subscription.paymentMethod === "card"
                      ? 
                      <div className="text-md text-greenbg font-semibold">
                      <h6>{paymentDetails?.card?.network}</h6>
                      <p>
                        {paymentDetails?.card?.issuer}{" "}
                        {paymentDetails?.card?.type === "credit"
                          ? "Credit Card"
                          : paymentDetails?.card?.type === "debit"
                          ? "Debit Card"
                          : "Card"}{" "}
                        Ending in {paymentDetails?.card?.last4}
                      </p>
                    </div>
                     :
                    <div className="text-md text-greenbg font-semibold">
                      <h6>Upi ID: {paymentDetails?.vpa}</h6>
                      <p>
                        Upi transaction ID: {paymentDetails?.acquirer_data?.upi_transaction_id}{" "}
                      </p>
                    </div>
                    } 
                    
                    {/* <div className="mt-4 md:mt-0 bg-darkbrown my-auto text-white px-6 py-3 md:py-4 rounded-md hover:bg-greenbg cursor-pointer">
                      <Link
                        to={subDetails?.short_url}
                        target="_blank"
                        className=""
                      >
                        Update Payment Method
                      </Link>
                    </div> */}
                  </div>
                </div>
                <div>
                  <h1 className="py-2 md:py-4 border-b-2 border-b-bordercolor text-lg xl:text-xl text-darkbrown font-semibold capitalize">
                    INVOICE HISTORY
                  </h1>
                  <div className="flex flex-row justify-between rounded-md p-4 mt-6 border-2 border-bordercolor">
                    <div className="w-full text-md text-greenbg overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr>
                            <th className="py-3 px-6 text-left text-md xl:text-lg font-semibold text-gray-600">
                              Creation Date
                            </th>
                            <th className="py-3 px-6 text-left text-md xl:text-lg font-semibold text-gray-600">
                              Invoice ID
                            </th>
                            <th className="py-3 px-6 text-left text-md xl:text-lg font-semibold text-gray-600">
                              Amount
                            </th>
                            <th className="py-3 px-6 text-left text-md xl:text-lg font-semibold text-gray-600">
                              Download Invoice
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {paymentInvoices?.map((invoice) => (
                            <tr key={invoice?.id} className="hover:bg-gray-50">
                              <td className="py-4 px-6 text-md text-gray-700">
                                {moment
                                  .unix(invoice?.created_at)
                                  .format("DD/MM/YYYY")}
                              </td>
                              <td className="py-4 px-6 text-md text-gray-700">
                                {invoice?.id}
                              </td>
                              <td className="py-4 px-6 text-md text-gray-700">
                                ₹{invoice?.amount / 100}
                              </td>
                              <td className="py-4 px-6 text-[14px] text-gray-700">
                                <Link
                                  to={invoice?.short_url}
                                  target="_blank"
                                  className="bg-darkbrown px-4 py-2.5 rounded-md text-white hover:bg-greenbg"
                                >
                                  Download
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
      {cancelFail ? (
        <ErrorTextToast text={"Error wile canceling subscription."} />
      ) : null}
      {cancelSuccess ? <SuccessToast text={"Your subcription is canceled."} /> : null}
      {renewFail ? (
        <ErrorTextToast text={"Error wile renewing subscription."} />
      ) : null}
      {renewSuccess ? <SuccessToast text={"Your subcription is renewed."} /> : null}
    </div>
  );
}
