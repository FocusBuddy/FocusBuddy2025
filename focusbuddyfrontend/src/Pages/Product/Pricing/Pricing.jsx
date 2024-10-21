import FAQComponent from "../../../Components/FAQComponent/FAQComponent";
import PagesHeading from "../../../Components/PagesHeading/PagesHeading";
import BrownButtonOnWhite from "../../../Components/UI/BrownButtonOnWhite.jsx/BrownButtonOnWhite.jsx";
import { Link } from "react-router-dom";

const data = [
  {
    question:
      "What if I can't use my mic in a shared or quiet space on FocusBuddy?",
    answer:
      "In situations where you're in a quiet or shared environment like a library or office, you can activate Quiet Mode on FocusBuddy. This notifies your partner, and you can utilize the in-session text chat to stay connected and share your goals and progress.",
  },
  {
    question:
      "How do I make the most of FocusBuddy for tasks involving physical activity?",
    answer:
      "When engaging in tasks that involve movement, such as cooking or exercising, the FocusBuddy experience mirrors that of desk work. Simply ensure your camera is positioned to allow your partner to observe you as you concentrate on your activities.",
  },
  {
    question:
      "Can I choose specific people for tasks like exercise or morning routines on FocusBuddy?",
    answer:
      "Certainly. You have options for working with specific people. If you enjoyed collaborating with someone and want to work together again, you can Favorite them and schedule a sessions with them.",
  },
];

export default function Pricing() {
  return (
    <>
      <div className="p-6 lg:p-10 mt-10 mb-32 lg:mb-40  md:max-w-screen-md lg:max-w-screen-xl mx-auto">
        <PagesHeading
          heading={"Pricing"}
          text={"Streamlined pricing for a clear focus on your priorities."}
        />

        <div className="mt-20 flex flex-col lg:flex-row gap-4">
          <div className="group basis-1/3 text-center bg-white py-20 px-10 lg:p-16 xl:p-20 rounded-lg shadow-md">
            <h1 className="text-4xl text-greenbg">Free</h1>
            <p className="my-8">
              Unlimited sessions for <br />1 month.
            </p>
            <Link to={"/signup"}>
              <button
                type="button"
                className=" w-full bg-textcolor text-white text-md xl:text-lg py-3.5 font-medium rounded-md hover:bg-greenbg transition-all duration-500 ease-in-out"
              >
                Sign up
              </button>
            </Link>
          </div>
          <div className="shadow-md basis-1/3 text-center bg-white py-20 px-10 lg:p-16 xl:p-20  rounded-lg">
            <h1 className="text-4xl text-greenbg">Plus</h1>
            <p className="mt-8">Unlimited sessions</p>
            <p className="mt-2 mb-8">₹699/mo. billed yearly</p>
            <Link to={"/signup"}>
              <button
                type="button"
                className="w-full bg-textcolor text-white text-md xl:text-lg py-3.5 font-medium rounded-md hover:bg-greenbg transition-all duration-500 ease-in-out"
              >
                Join now
              </button>
            </Link>
            <p className="mt-6 text-gray-600">Start free. Upgrade anytime.</p>
          </div>
          <div className="basis-1/3 text-center bg-white py-20 px-10 lg:p-16 xl:p-20  rounded-lg shadow-md">
            <h1 className="text-4xl text-greenbg group-hover:text-white">
              Plus
            </h1>
            <p className="mt-8">Unlimited sessions</p>
            <p className="mt-2 mb-8">₹999/mo. billed monthly</p>
            <Link to={"/signup"}>
              <button
                type="button"
                className="w-full bg-textcolor text-white text-md xl:text-lg py-3.5 font-medium rounded-md hover:bg-greenbg transition-all duration-500 ease-in-out"
              >
                Join now
              </button>
            </Link>
            <p className="mt-6 text-gray-600">Start free. Upgrade anytime.</p>
          </div>
        </div>

        <div className="mt-28 lg:mt-36 text-center">
          <h1 className="text-greenbg text-center text-4xl font-normal">FAQ</h1>
          <FAQComponent data={data} />
          <Link to={"/faq"}>
            <BrownButtonOnWhite
              style={{
                padding: "18px 28px",
                fontSize: "18px",
              }}
              text={"Have More Questions? Visit Our FAQ"}
            />
          </Link>
        </div>
      </div>
    </>
  );
}
