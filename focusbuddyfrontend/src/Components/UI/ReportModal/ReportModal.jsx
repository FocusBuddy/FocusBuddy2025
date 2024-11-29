import sendReport from "../../../utils/SendRport/sendReport";


export default function ReportModal({setReportModal, name, email,setReportSelect, reportSelect, reportText,setReportText, sending,setSending}){
    
    const handleReportModalSave = async (e, email,name) => {
        setSending(true);
        e.preventDefault();
          const reportResponse = await sendReport(reportSelect,reportText,userProfile.email,email,name);
          if (reportResponse === 200) {
            setSending(false);
            setReportSuccess(true);
            setReportModal(false);
            setReportSelect("");
            setReportText("");
          } else if (reportResponse === 400) {
            setReportModal(false);
            throw new Error("Seems like one of field was empty.");
          }else{
            throw new Error("Error occur while reporting user.");
          }
      };
    

    
    return(
        <div
                className={ "flex  bg-[#00000047] fixed top-0 right-0 left-0 justify-center items-center w-full md:inset-0 h-[calc(100%)] max-h-full"
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
                    <div className="p-8 md:p-20">
                      <h1 className="text-3xl lg:text-4xl font-medium text-greenbg ">
                        Report{" "}
                        <span className="capitalize text-textcolor">{name}</span>
                      </h1>
                      <div className="mt-8 text-formgray text-md xl:text-lg space-y-3">
                        <p>
                          Thank you for helping us keep FocusBuddy safe and
                          productive!
                        </p>
                        <p>
                          We will review your report and take action within 48
                          hours. Your report is completely confidential.
                        </p>
                        <p>
                          Select the option that best describes how violated our
                          Community Guidelines.
                        </p>
                      </div>
                      <form
                        className="mt-6 w-full mx-auto space-y-6"
                        onSubmit={(e) => handleReportModalSave(e, email,name)}
                      >
                        <select
                          id="countries"
                          className="bg-gray-50 border border-formgray text-gray-900 text-md xl:text-lg rounded-lg focus:ring-greenbg focus:border-greenbg block w-full p-2.5 "
                          required
                          value={reportSelect}
                          onChange={(e) => setReportSelect(e.target.value)}
                        >
                          <option value={""} disabled>
                            Please choose a reason
                          </option>
                          <option value="Fake Profile">Fake Profile</option>
                          <option value="Offensice Profile">
                            Offensive Profile
                          </option>
                          <option value="Misconduct/Other">
                            Misconduct/Other
                          </option>
                        </select>

                        <textarea
                          id="message"
                          rows="4"
                          className="block p-2.5 w-full text-md xl:text-lg text-gray-900 bg-gray-50 rounded-lg border border-formgray focus:ring-greenbg focus:border-greenbg"
                          placeholder="Please describe your concern..."
                          value={reportText}
                          onChange={(e) => setReportText(e.target.value)}
                          required
                        ></textarea>

                        <div className="p-4 md:p-5 border-t border-gray-200 rounded-b">
                          <button
                            id="modalButton"
                            type="submit"
                            className="w-full bg-textcolor py-3 text-lg px-3.5 hover:bg-darkbrown text-white rounded-md transition-all duration-500 ease-in-out"
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
    )
}