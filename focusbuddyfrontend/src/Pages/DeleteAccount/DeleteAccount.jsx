import {Link } from 'react-router-dom';
import { MdDeleteForever } from "react-icons/md";
import { useContext, useState } from 'react';
import { myContext } from '../../utils/PrivateRoutes';
import SuccessToast from '../../Components/UI/toast-components/SuccessToast';
import ErrorTextToast from '../../Components/UI/toast-components/ErrorTextToast';

export default function DeleteAccount() {
const {userProfile} = useContext(myContext);
const [success,setSuccess] = useState(false);
// const [fail,setFail] = useState(false);


    const handleDeleteAccount = async () => {
        try{

            const response = await fetch(`${import.meta.env.VITE_BACKEND_PRO_URL}/api/user/delete-account`,{
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({userToDeleteEmail: userProfile.email})
            });
            const data = await response.json();
            // console.log(data);
            if(response.ok){
                setSuccess(true);
        setTimeout(() => {
            setSuccess(false);
            navigate('/');
          }, 500); 
            }
        }catch(err){
            console.log(err);
        }
    }

  return (
    <>

      <div className="min-w-screen min-h-screen flex flex-col lg:flex-row">
        <div className="w-full lg:w-1/2 bg-greenbg relative p-10">
          <Link to={'/dashboard'} className="text-white text-3xl lg:text-6xl xl:text-7xl absolute top-6 left-5 lg:top-[40%] lg:inset-x-0 text-end lg:text-center font-medium">
            FocusBuddy
          </Link>
        </div>

        <div className="space-y-10 text-center w-full lg:w-1/2 mt-32 md:my-auto px-6 md:px-20 lg:px-10 xl:px-32">
        <h1 className='font-bold text-3xl md:text-4xl text-greenbg'>You sure about this?!</h1>
        <h2 className='text-lg md:text-xl text-formgray leading-8'>Deleting your account will irreversibly erase your entire account
        history. This action is irreversible.</h2>
        
        <div className='text-md xl:text-lg flex flex-col md:flex-row gap-2 md:gap-6'>
            <Link to={'/dashboard'} className='basis-1/2'>
            <button className='w-full bg-textcolor py-4 text-white rounded-md hover:bg-greenbg transition-all duration-500 ease-in-out'>
            I'll stay for now
            </button>
            </Link>
            <button onClick={handleDeleteAccount} type='button' className='basis-1/2 flex justify-center items-center gap-2 bg-textcolor py-4 text-white rounded-md hover:bg-greenbg transition-all duration-500 ease-in-out'>I'm sure, delete it <MdDeleteForever className='text-2xl'/></button>
        </div>
        </div>
      </div>

      {success ? <SuccessToast text={'Account Delted.'}/> : null }
      {/* {fail ? <SuccessToast text={'Error'}/> : null } */}


    </>
  );
}
