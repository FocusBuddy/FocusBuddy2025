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

<div className="mt-12 flex flex-col lg:flex-row justify-center gap-4">
          <div className="group basis-1/3 text-center bg-white py-16 px-10 lg:p-16 rounded-lg shadow-md">
            <h1 className="text-4xl text-greenbg">Free</h1>
            <p className="mt-8 text-md md:text-lg">Free <b>10 sessions</b></p>
            <p className="mt-2 mb-8 text-md md:text-lg">for <b>7 days</b>.</p>
            <Link to={"/signup"}>
              <button
                type="button"
                className=" w-full bg-textcolor text-white text-md xl:text-lg py-3.5 font-medium rounded-md hover:bg-greenbg transition-all duration-500 ease-in-out"
              >
                Sign up
              </button>
            </Link>
          </div>
          <div className="shadow-md basis-1/3 text-center bg-white py-16 px-10 lg:p-16 rounded-lg">
            <h1 className="text-4xl text-greenbg">Plus</h1>
            <div className="relative text-md md:text-lg mt-8 mb-2 line-through text-gray-700">₹1000 per month
            <div
              class="h-black-friday-discount-tag h-pricing-card__discount--tag"
              data-v-d4d02fa0=""
              data-v-f276a9ad=""
            >
              <div
                class="h-black-friday-discount-tag__wrapper"
                data-v-f276a9ad=""
              >
                <span
                  class="h-black-friday-discount-tag__icon"
                  data-v-f276a9ad=""
                >
                  <svg
                    width="21"
                    height="39"
                    viewBox="0 0 21 39"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    data-v-f276a9ad=""
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M18.0808 0C16.5161 0 15.0277 0.67567 13.9977 1.8535L1.34101 16.3268C-0.480869 18.4102 -0.442043 21.5311 1.4311 23.5685L14.0068 37.247C15.034 38.3642 16.4822 39 17.9998 39H20.2725V0L18.0808 0ZM11.361 23.4843C13.5614 23.2888 15.1868 21.3465 14.9912 19.146C14.7957 16.9455 12.8534 15.3202 10.6529 15.5157C8.45245 15.7113 6.82711 17.6536 7.02263 19.8541C7.21815 22.0545 9.16049 23.6799 11.361 23.4843Z"
                      fill="#ff0000"
                      data-v-f276a9ad=""
                    ></path>
                  </svg>
                </span>
                <span
                  class="h-black-friday-discount-tag__text--neon h-black-friday-discount-tag__text t-body-2"
                  data-v-f276a9ad=""
                >
                  25% OFF
                </span>
              </div>
            </div>
            </div>
            <p className="mb-2 text-md md:text-lg">Unlimited sessions</p>
            <p className="mb-8 text-md md:text-xl font-bold">₹750 per month</p>
            
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
          {/* <div className="basis-1/3 text-center bg-white py-16 px-10 lg:p-16  rounded-lg shadow-md">
              <h1 className="text-4xl text-greenbg group-hover:text-white">Plus</h1>
              <p className="mt-8">Unlimited sessions</p>
              <p className="mt-2 mb-8">₹999/mo. billed monthly</p>
              <Link to={'/signup'}>
              <button type="button" className="w-full bg-textcolor text-white text-md xl:text-lg py-3.5 font-medium rounded-md hover:bg-greenbg transition-all duration-500 ease-in-out">Join now</button>
              </Link>
              <p className="mt-6 text-gray-600">Start free. Upgrade anytime.</p>
            </div> */}
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
