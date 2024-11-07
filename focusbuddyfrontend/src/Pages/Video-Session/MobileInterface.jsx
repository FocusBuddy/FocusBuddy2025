import { IoMdMore } from "react-icons/io";
import { Link } from "react-router-dom";
import { initFlowbite } from "flowbite";
import { useEffect } from "react";

export default function MobileInterface({
  availableEvents,
  setReportModal,
  reportModal,
  reportSelect,
  reportText,
  setReportSelect,
  setReportText,
  sending,
  handleReportModalSave,
}) {
  useEffect(() => {
    initFlowbite();
  }, []);

  return (
    <div
      style={{ zIndex: 3000 }}
      className="absolute md:static flex gap-4 bg-white px-3 py-4 rounded-md"
    >
      <div
        id="videodropdownbutton"
        data-dropdown-toggle="videodropdown"
        className="flex font-medium items-center gap-2 cursor-pointer text-[14px] md:text-md"
        type="button"
        // onClick={() => setDropdown(!dropdown)}
      >
        <span className="sr-only">Open user menu</span>
        <IoMdMore className="text-xl cursor-pointer" /> More
      </div>
      <div
        id="videodropdown"
        // className={
        //   dropdown
        //     ? "inline z-10 absolute top-20 bg-white divide-y divide-gray-100 rounded-md shadow w-50"
        //     : "hidden"
        // }
        className="z-10 hidden bg-white divide-y divide-gray-100 rounded-md shadow-lg w-56"
      >
        <ul
          className="py-2 text-xm md:text-md space-y-2 text-formgray"
          aria-labelledby="videodropdownbutton"
        >
          <li>
            <Link
              to={"/community"}
              target="_blank"
              rel="noopener noreferrer"
              className="flex  no-underline items-center gap-2 px-4 py-2 text-formgray hover:bg-greenbg hover:text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                version="1.1"
                width={30}
                height={30}
                viewBox="0 0 256 256"
                xmlSpace="preserve"
              >
                <defs></defs>
                <g
                  style={{
                    stroke: "none",
                    strokeWidth: 0,
                    strokeDasharray: "none",
                    strokeLinecap: "butt",
                    strokeLinejoin: "miter",
                    strokeMiterlimit: 10,
                    fill: "none",
                    fillRule: "nonzero",
                    opacity: 1,
                  }}
                  transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)"
                >
                  <rect
                    x="6.77"
                    y="16.48"
                    rx={0}
                    ry={0}
                    width="77.37"
                    height="49.46"
                    style={{
                      stroke: "none",
                      strokeWidth: 1,
                      strokeDasharray: "none",
                      strokeLinecap: "butt",
                      strokeLinejoin: "miter",
                      strokeMiterlimit: 10,
                      fill: "rgb(152,192,229)",
                      fillRule: "nonzero",
                      opacity: 1,
                    }}
                    transform=" matrix(1 0 0 1 0 0) "
                  />
                  <path
                    d="M 85.623 18.117 c 0 -1.852 -1.501 -3.353 -3.353 -3.353 H 7.73 c -1.852 0 -3.353 1.501 -3.353 3.353 v 49.247 h 81.246 V 18.117 z M 82.541 64.282 H 7.459 V 18.117 c 0 -0.149 0.121 -0.27 0.27 -0.27 H 82.27 c 0.149 0 0.27 0.121 0.27 0.27 V 64.282 z"
                    style={{
                      stroke: "none",
                      strokeWidth: 1,
                      strokeDasharray: "none",
                      strokeLinecap: "butt",
                      strokeLinejoin: "miter",
                      strokeMiterlimit: 10,
                      fill: "rgb(49,68,88)",
                      fillRule: "nonzero",
                      opacity: 1,
                    }}
                    transform=" matrix(1 0 0 1 0 0) "
                    strokeLinecap="round"
                  />
                  <path
                    d="M 86.586 70.107 C 86.586 70.107 86.586 70.107 86.586 70.107 l -83.172 0 c 0 0 0 0 0 0 H 0 c 0 2.828 2.3 5.128 5.128 5.128 h 79.744 c 2.828 0 5.128 -2.301 5.128 -5.128 H 86.586 z"
                    style={{
                      stroke: "none",
                      strokeWidth: 1,
                      strokeDasharray: "none",
                      strokeLinecap: "butt",
                      strokeLinejoin: "miter",
                      strokeMiterlimit: 10,
                      fill: "rgb(49,68,88)",
                      fillRule: "nonzero",
                      opacity: 1,
                    }}
                    transform=" matrix(1 0 0 1 0 0) "
                    strokeLinecap="round"
                  />
                </g>
              </svg>
              Review Session Guidelines
            </Link>
          </li>
          {availableEvents[0].matchedPersonFullName === "Matching..." ? null : (
            <li>
              <div
                onClick={() => setReportModal(true)}
                className="flex cursor-pointer items-center gap-2 px-4  py-2 hover:bg-greenbg hover:text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  version="1.1"
                  width={30}
                  height={30}
                  viewBox="0 0 256 256"
                  xmlSpace="preserve"
                >
                  <defs></defs>
                  <g
                    style={{
                      stroke: "none",
                      strokeWidth: 0,
                      strokeDasharray: "none",
                      strokeLinecap: "butt",
                      strokeLinejoin: "miter",
                      strokeMiterlimit: 10,
                      fill: "none",
                      fillRule: "nonzero",
                      opacity: 1,
                    }}
                    transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)"
                  >
                    <path
                      d="M 50.619 30.076 C 39.471 32.628 27.781 42.6 27.781 54.522 l 3.371 18.432 h 38.934 V 54.522 C 70.086 42.6 61.766 32.628 50.619 30.076 z"
                      style={{
                        stroke: "none",
                        strokeWidth: 1,
                        strokeDasharray: "none",
                        strokeLinecap: "butt",
                        strokeLinejoin: "miter",
                        strokeMiterlimit: 10,
                        fill: "rgb(251,66,57)",
                        fillRule: "nonzero",
                        opacity: 1,
                      }}
                      transform=" matrix(1 0 0 1 0 0) "
                      strokeLinecap="round"
                    />
                    <path
                      d="M 50.619 30.076 c -1.807 -0.414 -3.686 -0.64 -5.619 -0.64 c -13.854 0 -25.086 11.231 -25.086 25.086 v 18.432 h 11.237 V 54.522 C 31.152 42.6 39.471 32.628 50.619 30.076 z"
                      style={{
                        stroke: "none",
                        strokeWidth: 1,
                        strokeDasharray: "none",
                        strokeLinecap: "butt",
                        strokeLinejoin: "miter",
                        strokeMiterlimit: 10,
                        fill: "rgb(226,23,23)",
                        fillRule: "nonzero",
                        opacity: 1,
                      }}
                      transform=" matrix(1 0 0 1 0 0) "
                      strokeLinecap="round"
                    />
                    <path
                      d="M 73.61 72.954 H 28.824 v 13.916 h 48.618 V 76.786 C 77.442 74.669 75.727 72.954 73.61 72.954 z"
                      style={{
                        stroke: "none",
                        strokeWidth: 1,
                        strokeDasharray: "none",
                        strokeLinecap: "butt",
                        strokeLinejoin: "miter",
                        strokeMiterlimit: 10,
                        fill: "rgb(202,237,255)",
                        fillRule: "nonzero",
                        opacity: 1,
                      }}
                      transform=" matrix(1 0 0 1 0 0) "
                      strokeLinecap="round"
                    />
                    <path
                      d="M 31.072 78.637 v -5.683 H 16.39 c -2.116 0 -3.832 1.716 -3.832 3.832 v 8.382 c 0 2.116 1.716 3.832 3.832 3.832 h 57.22 c 2.116 0 3.832 -1.716 3.832 -3.832 v -0.546 H 37.057 C 33.752 84.622 31.072 81.942 31.072 78.637 z"
                      style={{
                        stroke: "none",
                        strokeWidth: 1,
                        strokeDasharray: "none",
                        strokeLinecap: "butt",
                        strokeLinejoin: "miter",
                        strokeMiterlimit: 10,
                        fill: "rgb(118,194,224)",
                        fillRule: "nonzero",
                        opacity: 1,
                      }}
                      transform=" matrix(1 0 0 1 0 0) "
                      strokeLinecap="round"
                    />
                    <path
                      d="M 70.086 73.954 H 19.915 c -0.552 0 -1 -0.447 -1 -1 V 54.521 c 0 -14.384 11.702 -26.085 26.085 -26.085 s 26.086 11.702 26.086 26.085 v 18.433 C 71.086 73.507 70.639 73.954 70.086 73.954 z M 20.915 71.954 h 48.171 V 54.521 c 0 -13.281 -10.805 -24.085 -24.086 -24.085 c -13.281 0 -24.085 10.805 -24.085 24.085 V 71.954 z"
                      style={{
                        stroke: "none",
                        strokeWidth: 1,
                        strokeDasharray: "none",
                        strokeLinecap: "butt",
                        strokeLinejoin: "miter",
                        strokeMiterlimit: 10,
                        fill: "rgb(0,0,0)",
                        fillRule: "nonzero",
                        opacity: 1,
                      }}
                      transform=" matrix(1 0 0 1 0 0) "
                      strokeLinecap="round"
                    />
                    <path
                      d="M 73.61 90 H 16.39 c -2.665 0 -4.833 -2.168 -4.833 -4.832 v -8.382 c 0 -2.664 2.168 -4.832 4.833 -4.832 h 57.22 c 2.664 0 4.832 2.168 4.832 4.832 v 8.382 C 78.442 87.832 76.274 90 73.61 90 z M 16.39 73.954 c -1.562 0 -2.833 1.271 -2.833 2.832 v 8.382 c 0 1.562 1.271 2.832 2.833 2.832 h 57.22 c 1.562 0 2.832 -1.271 2.832 -2.832 v -8.382 c 0 -1.562 -1.271 -2.832 -2.832 -2.832 H 16.39 z"
                      style={{
                        stroke: "none",
                        strokeWidth: 1,
                        strokeDasharray: "none",
                        strokeLinecap: "butt",
                        strokeLinejoin: "miter",
                        strokeMiterlimit: 10,
                        fill: "rgb(0,0,0)",
                        fillRule: "nonzero",
                        opacity: 1,
                      }}
                      transform=" matrix(1 0 0 1 0 0) "
                      strokeLinecap="round"
                    />
                    <path
                      d="M 45 16.246 c -0.552 0 -1 -0.448 -1 -1 V 1 c 0 -0.552 0.448 -1 1 -1 s 1 0.448 1 1 v 14.246 C 46 15.798 45.552 16.246 45 16.246 z"
                      style={{
                        stroke: "none",
                        strokeWidth: 1,
                        strokeDasharray: "none",
                        strokeLinecap: "butt",
                        strokeLinejoin: "miter",
                        strokeMiterlimit: 10,
                        fill: "rgb(0,0,0)",
                        fillRule: "nonzero",
                        opacity: 1,
                      }}
                      transform=" matrix(1 0 0 1 0 0) "
                      strokeLinecap="round"
                    />
                    <path
                      d="M 20.111 26.555 c -0.256 0 -0.512 -0.098 -0.707 -0.293 L 9.331 16.189 c -0.391 -0.391 -0.391 -1.023 0 -1.414 s 1.023 -0.391 1.414 0 l 10.073 10.073 c 0.391 0.391 0.391 1.023 0 1.414 C 20.623 26.458 20.367 26.555 20.111 26.555 z"
                      style={{
                        stroke: "none",
                        strokeWidth: 1,
                        strokeDasharray: "none",
                        strokeLinecap: "butt",
                        strokeLinejoin: "miter",
                        strokeMiterlimit: 10,
                        fill: "rgb(0,0,0)",
                        fillRule: "nonzero",
                        opacity: 1,
                      }}
                      transform=" matrix(1 0 0 1 0 0) "
                      strokeLinecap="round"
                    />
                    <path
                      d="M 69.889 26.555 c -0.256 0 -0.512 -0.098 -0.707 -0.293 c -0.391 -0.391 -0.391 -1.023 0 -1.414 l 10.073 -10.073 c 0.391 -0.391 1.023 -0.391 1.414 0 s 0.391 1.023 0 1.414 L 70.596 26.262 C 70.4 26.458 70.145 26.555 69.889 26.555 z"
                      style={{
                        stroke: "none",
                        strokeWidth: 1,
                        strokeDasharray: "none",
                        strokeLinecap: "butt",
                        strokeLinejoin: "miter",
                        strokeMiterlimit: 10,
                        fill: "rgb(0,0,0)",
                        fillRule: "nonzero",
                        opacity: 1,
                      }}
                      transform=" matrix(1 0 0 1 0 0) "
                      strokeLinecap="round"
                    />
                    <path
                      d="M 45 51.515 L 45 51.515 c -3.297 0 -5.969 2.673 -5.969 5.969 v 15.47 h 11.939 v -15.47 C 50.969 54.187 48.297 51.515 45 51.515 z"
                      style={{
                        stroke: "none",
                        strokeWidth: 1,
                        strokeDasharray: "none",
                        strokeLinecap: "butt",
                        strokeLinejoin: "miter",
                        strokeMiterlimit: 10,
                        fill: "rgb(254,192,7)",
                        fillRule: "nonzero",
                        opacity: 1,
                      }}
                      transform=" matrix(1 0 0 1 0 0) "
                      strokeLinecap="round"
                    />
                    <path
                      d="M 50.97 73.954 H 39.031 c -0.552 0 -1 -0.447 -1 -1 v -15.47 c 0 -3.843 3.126 -6.97 6.969 -6.97 s 6.97 3.127 6.97 6.97 v 15.47 C 51.97 73.507 51.522 73.954 50.97 73.954 z M 40.031 71.954 h 9.939 v -14.47 c 0 -2.74 -2.229 -4.97 -4.97 -4.97 s -4.969 2.229 -4.969 4.97 V 71.954 z"
                      style={{
                        stroke: "none",
                        strokeWidth: 1,
                        strokeDasharray: "none",
                        strokeLinecap: "butt",
                        strokeLinejoin: "miter",
                        strokeMiterlimit: 10,
                        fill: "rgb(0,0,0)",
                        fillRule: "nonzero",
                        opacity: 1,
                      }}
                      transform=" matrix(1 0 0 1 0 0) "
                      strokeLinecap="round"
                    />
                  </g>
                </svg>
                Report {availableEvents[0].matchedPersonFullName}
              </div>
            </li>
          )}
          {availableEvents[0].matchedPersonFullName === "Matching..." ? null : (
            <li>
              <Link
                to={availableEvents[0].matchedPersonProfileLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex  no-underline items-center gap-2 px-4 py-2 text-formgray hover:bg-greenbg hover:text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  version="1.1"
                  width={30}
                  height={30}
                  viewBox="0 0 256 256"
                  xmlSpace="preserve"
                >
                  <defs />
                  <g
                    style={{
                      stroke: "none",
                      strokeWidth: 0,
                      strokeDasharray: "none",
                      strokeLinecap: "butt",
                      strokeLinejoin: "miter",
                      strokeMiterlimit: 10,
                      fill: "none",
                      fillRule: "nonzero",
                      opacity: 1,
                    }}
                    transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)"
                  >
                    <circle
                      cx={45}
                      cy={45}
                      r={45}
                      style={{
                        stroke: "none",
                        strokeWidth: 1,
                        strokeDasharray: "none",
                        strokeLinecap: "butt",
                        strokeLinejoin: "miter",
                        strokeMiterlimit: 10,
                        fill: "rgb(60,178,43)",
                        fillRule: "nonzero",
                        opacity: 1,
                      }}
                      transform="  matrix(1 0 0 1 0 0) "
                    />
                    <path
                      d="M 45 54.287 c -8.9 0 -16.14 -7.24 -16.14 -16.14 S 36.1 22.007 45 22.007 c 8.899 0 16.14 7.241 16.14 16.14 S 53.899 54.287 45 54.287 z"
                      style={{
                        stroke: "none",
                        strokeWidth: 1,
                        strokeDasharray: "none",
                        strokeLinecap: "butt",
                        strokeLinejoin: "miter",
                        strokeMiterlimit: 10,
                        fill: "rgb(255,255,255)",
                        fillRule: "nonzero",
                        opacity: 1,
                      }}
                      transform=" matrix(1 0 0 1 0 0) "
                      strokeLinecap="round"
                    />
                    <path
                      d="M 72.957 71.22 c -3.177 -5.75 -8.143 -10.477 -14.049 -13.341 c -2.008 -0.974 -4.352 -0.959 -6.436 0.041 c -2.343 1.126 -4.857 1.696 -7.473 1.696 c -2.616 0 -5.13 -0.571 -7.473 -1.696 c -2.081 -0.999 -4.426 -1.015 -6.435 -0.041 c -5.906 2.864 -10.872 7.59 -14.05 13.341 C 23.877 78.957 33.865 83.843 45 83.843 C 56.135 83.843 66.123 78.957 72.957 71.22 z"
                      style={{
                        stroke: "none",
                        strokeWidth: 1,
                        strokeDasharray: "none",
                        strokeLinecap: "butt",
                        strokeLinejoin: "miter",
                        strokeMiterlimit: 10,
                        fill: "rgb(255,255,255)",
                        fillRule: "nonzero",
                        opacity: 1,
                      }}
                      transform=" matrix(1 0 0 1 0 0) "
                      strokeLinecap="round"
                    />
                  </g>
                </svg>
                {availableEvents[0].matchedPersonFullName} profile
              </Link>
            </li>
          )}
        </ul>
      </div>

      <div
        className={
          reportModal
            ? "flex  bg-[#00000047] fixed top-0 right-0 left-0 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
            : "hidden"
        }
        style={{ zIndex: 10000 }}
        // style={zoomLoaded ? {display: 'flex'} : {display: 'none'}}
      >
        <div className="relative p-4 w-full max-w-2xl max-h-full">
          <div className="relative bg-white rounded-lg shadow">
            <button
              type="button"
              className="absolute top-5 right-5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
              onClick={() => setReportModal(false)}
            >
              <svg
                className="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
            </button>
            <div className="p-6 md:p-10">
              <h1 className="text-3xl md:text-4xl font-medium text-greenbg ">
                Report{" "}
                <span className="capitalize text-textcolor">
                  {availableEvents[0].matchedPersonName}
                </span>
              </h1>
              <div className="mt-8 text-formgray text-md space-y-3">
                <p>
                  Thank you for helping us keep FocusBuddy safe and productive!
                </p>
                <p>
                  We will review your report and take action within 48 hours.
                  Your report is completely confidential.
                </p>
                <p>
                  Select the option that best describes how violated our
                  Community Guidelines.
                </p>
              </div>
              <form
                className="mt-6 w-full mx-auto space-y-6"
                onSubmit={handleReportModalSave}
              >
                <select
                  id="countries"
                  className="bg-gray-50 border border-formgray text-gray-900 text-md rounded-lg focus:ring-greenbg focus:border-greenbg block w-full p-2.5 "
                  required
                  value={reportSelect}
                  onChange={(e) => setReportSelect(e.target.value)}
                >
                  <option value={""} disabled>
                    Please choose a reason
                  </option>
                  <option value="Fake Profile">Fake Profile</option>
                  <option value="Offensice Profile">Offensive Profile</option>
                  <option value="Misconduct/Other">Misconduct/Other</option>
                </select>

                <textarea
                  id="message"
                  rows="4"
                  className="block p-2.5 w-full text-md text-gray-900 bg-gray-50 rounded-lg border border-formgray focus:ring-greenbg focus:border-greenbg"
                  placeholder="Please describe your concern..."
                  value={reportText}
                  onChange={(e) => setReportText(e.target.value)}
                  required
                ></textarea>

                <div className="p-4 md:p-5 border-t border-gray-200 rounded-b">
                  <button
                    id="modalButton"
                    type="submit"
                    className="w-full bg-textcolor py-3 text-md px-3 hover:bg-darkbrown text-white rounded-md transition-all duration-500 ease-in-out"
                  >
                    {sending ? (
                      <div className="flex justify-center gap-2 items-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Sending report
                      </div>
                    ) : (
                      "Report"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
