export default function SettingModal({openSettingModal,setOpenSettingModal}){

    const handleSettingModalClose = () => {
        setOpenSettingModal(false);
    }

    return(
        <>
            <div
        className={
            openSettingModal
            ? "flex bg-[#00000047]  fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%)] max-h-full"
            : "none"
        }
        style={{zIndex:10000}}
      >
        <div className="relative p-4 w-full max-w-2xl max-h-full overflow-y-auto">
          <div className="relative bg-white rounded-lg shadow pt-14 pb-16 px-10 md:px-16">
            <button type="button" className="absolute top-5 right-5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
            onClick={handleSettingModalClose}
            >
            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                    </svg>

            </button>
            <h3 className="text-3xl font-bold mb-8 text-center text-greenbg">
                About Session Settings
            </h3>

            {/* <div>
                <p className="text-formgray text-md xl:text-lg"><span className="text-textcolor font-medium">My Task: </span>Tell us what you're up to, and we'll connect you with someone doing the same thing.</p>
                <ul className="mt-4 space-y-2 text-formgray text-md xl:text-lg marker:text-textcolor list-disc ms-6">
                    <li><span className="text-greenbg font-medium">Desk: </span>Ideal for writing, emailing, coding, and other tasks</li>
                    <li><span className="text-greenbg font-medium">Moving: </span>Perfect for workouts, household chores, and other active tasks</li>
                    <li><span className="text-greenbg font-medium">Anything: </span>When you're multitasking or still making decisions</li>
                </ul>
            </div> */}

            <div className="my-6 py-4 border-y border-formgray">
            <p className="text-formgray text-md xl:text-lg"><span className="text-textcolor font-medium">Quiet Mode: </span>Perfect for situations where you don’t have a mic or can’t talk, like in libraries or shared spaces. Keep your camera on and use the text chat to communicate with your partners.</p>
            <p className="mt-4 text-formgray text-md xl:text-lg">
            Note that your partners may not always be in Quiet Mode, so ensure you can hear them if they provide verbal updates.
            </p>
            </div>

            <div>
                <p className="text-formgray text-md xl:text-lg"><span className="text-textcolor font-medium">Partner: </span>controls who you’re matched with.</p>
                <ul className="mt-4 space-y-2 text-formgray text-md xl:text-lg marker:text-textcolor list-disc ms-6">
                    <li><span className="text-greenbg font-medium">Favorites: </span>Connects you with your favorite partners whenever they are available</li>
                    <li><span className="text-greenbg font-medium">Anyone: </span>Provides the classic FocusBuddy experience by pairing you with the first available person</li>
                </ul>
            </div>

            <div className="mt-10">
              <button
                className="w-full bg-textcolor py-4  px-3.5 hover:bg-darkbrown text-white rounded-md text-lg transition-all duration-500 ease-in-out"
                onClick={handleSettingModalClose}
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      </div>
        </>
    )
}