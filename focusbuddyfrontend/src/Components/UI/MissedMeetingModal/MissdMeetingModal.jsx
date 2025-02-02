import { BiSolidError } from "react-icons/bi";
import { Modal } from "flowbite-react";
import { Link } from "react-router-dom";

export default function MissedMeetingModal({openMissedMeetingModal,setOpenMissedMeetingModal,userProfile,setUserProfile}){
   
  
  const handleAttendancefall = async () => {
    setOpenMissedMeetingModal(false)
    const response = await fetch(`${import.meta.env.VITE_BACKEND_PRO_URL}/api/user/handleAttendancefall`,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({email:userProfile.email})
    });
    const data = await response.json();
    if(response.ok){
      setUserProfile(data.updatedUser);
    }
  } 


    return(
        <>

            <Modal
              id="MissedMeetingModal"
              className="settingsModal"
              show={openMissedMeetingModal}
              style={{ zIndex: 10000 }}
              size="2xl"
              onClose={handleAttendancefall}
              popup
            >
              <Modal.Header />
              <Modal.Body id="MissedMeetingModalBody" className="p-16">
              <h1 className="text-4xl text-greenbg flex items-center gap-4 ">Need your attention! <BiSolidError className="text-errorred"/></h1>
            <div className="mt-6 space-y-4 text-formgray text-md lg:text-lg">
                <p>We noticed that attendance score dropped to 30%. We understand that sometimes it's unavoidable to miss a session, but regular attendance is crucial for your progress and for maintaining the integrity of our community.</p>
                <p>Please note that allowing your attendance score to drop to 0% will lead to a permanent ban on your account. We value your participation and would love to see you continue benefiting from our sessions.</p>
                <p>You can view your current attendance score by visiting your <Link target="_blank" rel="noopener noreferrer" to={'/profile'} className="underline underline-offset-4 text-textcolor">Profile</Link>.</p>
                <p>If you have any concerns or need assistance, please feel free to reach out to our <a href="mailto:focusbuddy04@gmail.com" className="underline underline-offset-8 text-textcolor">support team.</a></p>
            </div>
              </Modal.Body>
            </Modal>
            
        </>
    )
}