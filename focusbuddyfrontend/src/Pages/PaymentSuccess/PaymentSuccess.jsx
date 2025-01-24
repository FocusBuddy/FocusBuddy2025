import { useState, useEffect, useContext } from "react"
import { myContext } from "../../utils/PrivateRoutes";
import { Link } from "react-router-dom";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";

export default function PaymentSuccess(){
    const {userProfile, setUserProfile} = useContext(myContext);


    // useEffect(() => {
    //     const paymentSuccess = async () => {
    //         try{

    //             const response = await fetch(`${import.meta.env.VITE_BACKEND_PRO_URL}/api/user/v1/payment-success`,{
    //                 method: 'POST',
    //                 headers: {
    //                     "Content-Type": "application/json"
    //                 },
    //                 body: JSON.stringify({userWhoisBooking: userProfile})
    //             });
    //             const data = await response.json();
    //             console.log(data);
    //             setUserProfile(data.updatedUser);

    //         }catch(err){
    //             console.log(err);
    //         }
    //     }

    //     paymentSuccess();
        
    // },[])

    return(
        <>
            <div className='px-6 flex flex-col justify-center items-center min-h-screen min-w-screen'>
        <div className="flex flex-col justify-center items-center">
          <IoMdCheckmarkCircleOutline className='text-[6rem] md:text-[7rem] text-greenbg'/>
          <h2 className='my-3 text-[2rem] md:text-[3rem] text-formgray font-medium text-center'>Payment Successful!.</h2>

        </div>
          <div className='mt-6 flex gap-2'>
            <Link to={'/dashboard'} type='button' className='bg-textcolor py-3 px-10 text-white rounded-md text-md xl:text-lg border-2 border-textcolor hover:text-formgray hover:bg-white hover:border-2 hover:border-greenbg'>Dashboard</Link>
          </div>
      </div>
        </>
    )
}