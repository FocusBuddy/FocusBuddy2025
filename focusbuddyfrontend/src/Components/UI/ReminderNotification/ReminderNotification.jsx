export default function ReminderNotification({handleCloseReminderNotification}){
    return(
    <>
      <div
        id="toast-default"
        className="fixed bottom-10 z-[9999] right-10 flex items-center w-full max-w-xs px-4 py-4 bg-greenbg text-white rounded-lg shadow"
        role="alert"
        style={{ zIndex: 10000 }}
      >
        <div className="text-3xl">
          {/* <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 20">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.147 15.085a7.159 7.159 0 0 1-6.189 3.307A6.713 6.713 0 0 1 3.1 15.444c-2.679-4.513.287-8.737.888-9.548A4.373 4.373 0 0 0 5 1.608c1.287.953 6.445 3.218 5.537 10.5 1.5-1.122 2.706-3.01 2.853-6.14 1.433 1.049 3.993 5.395 1.757 9.117Z"/>
        </svg>
        <span className="sr-only">Fire icon</span> */}
          ⏰
        </div>
        <div className="ms-3 text-md font-normal">
          Your session starts in just <br /> 1 minute!
        </div>
        <button
          type="button"
          onClick={handleCloseReminderNotification}
          className="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-600 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-2.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8"
          data-dismiss-target="#toast-default"
          aria-label="Close"
        >
          <span className="sr-only">Close</span>
          <svg
            classname="w-3 h-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
            />
          </svg>
        </button>
      </div>
    </>
  );
}