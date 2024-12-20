import FooterJoinButton from "../../../Components/FooterJoinButton/FooterJoinButton";
import PagesHeading from "../../../Components/PagesHeading/PagesHeading";
import FAQComponent from "../../../Components/FAQComponent/FAQComponent";
import { Link } from "react-router-dom";
import BrownButtonOnWhite from "../../../Components/UI/BrownButtonOnWhite.jsx/BrownButtonOnWhite";
import booking from '../../../assets/booking.webp';
import joinsession from '../../../assets/joinsession.webp';
import celebrate from '../../../assets/celebrate.webp';

const data = [
  {
    question: "What tasks are suitable for FocusBuddy?",
    answer:
      "As long as you remain visible on camera, you can use FocusBuddy for a wide range of activities: desk work, cleaning, cooking, art, music, writing, reading, and even at-home exercise! Simply ensure your camera is positioned to allow your partner to see you while you concentrate on your tasks.",
  },
  {
    question: "Who am I working with?",
    answer:
      "FocusBuddy connects you with a fellow member of our global community, both striving to accomplish tasks. If you find synergy with someone, mark them as a Favorite by tapping the star beside their name. Discover more about Favorite Partners.",
  },
  {
    question: "Do I need to keep the video on the whole time?",
    answer:
      "Please maintain your video on throughout the session, ensuring your visibility within the frame. If your activity involves movement (e.g., cooking or exercising), position your camera accordingly so your partner can observe while you concentrate on your tasks. If you need to step away briefly, inform your partner via chat and return promptly, keeping your video active.",
  },
  {
    question: "How long is a session?",
    answer:
      "FocusBuddy offers sessions of 50-minutes duration.",
  },
];


export default function HowItWorks() {
  return (
    <div className="p-6 lg:p-10 mt-10 mb-32 lg:mb-40 mx-auto max-w-screen-2xl">
      <PagesHeading
        heading={"How It Works"}
        text={"Achieve focus and productivity in three simple steps."}
      />
      <div className="mt-16 lg:mt-36 flex max-w-screen-sm lg:max-w-screen-xl mx-auto">
        <div className="bg-white lg:-mt-20 basis-[100%] lg:basis-[45%] p-8 md:p-10 rounded-lg shadow-2xl shadow-lightbg">
          <img
            src={booking}
            alt="Book a session"
            loading="lazy"
            className="h-auto sm:h-[300px] lg:h-[250px] xl:h-[280px] mx-auto mb-6 rounded-xl shadow-textcolor shadow-2xl "
          />
          <h1 className="mt-1 text-greenbg text-2xl text-center">
            1. Book a session
          </h1>
          <p className="text-formgray text-center text-md xl:text-lg mt-3 max-w-sm mx-auto">
            We'll connect you with a fellow member from our vibrant community
            whenever you're ready to concentrate.
          </p>
        </div>
        <div className="basis-[0%] lg:basis-1/2"></div>
      </div>

      <div className="mt-10 lg:-mt-24 flex max-w-screen-sm lg:max-w-screen-xl mx-auto">
        <div className="basis-[0%] lg:basis-1/2"></div>
        <div className="bg-white basis-[100%] lg:basis-[45%] p-6 md:p-10 rounded-lg shadow-2xl shadow-lightbg">
          <img
            src={joinsession}
            alt="Join video call"
            loading="lazy"
            className="h-auto sm:h-[300px] lg:h-[250px] xl:h-[280px] mx-auto mb-6 rounded-xl shadow-textcolor shadow-2xl "
          />
          <h1 className="mt-1 text-greenbg text-2xl text-center">
            2. Join video call
          </h1>
          <p className="text-formgray text-center text-md lg:text-lg mt-3 max-w-sm mx-auto">
            Say hello to your partner, discuss your session goals, and let's
            dive into work!
          </p>
        </div>
      </div>

      <div className="mt-10 lg:mt-10 flex justify-start max-w-screen-sm lg:max-w-screen-xl mx-auto">
        <div className="bg-white lg:-mt-20 basis-[100%] lg:basis-[45%] p-6 md:p-10 rounded-lg shadow-2xl shadow-lightbg">
          <img
            src={celebrate}
            loading="lazy"
            alt="Celebrate your progress"
            className="h-auto sm:h-[300px] lg:h-[250px] xl:h-[280px] object-cover  mx-auto mb-6 rounded-xl shadow-textcolor shadow-2xl "
          />
          <h1 className="mt-1 text-greenbg text-2xl text-center">
            3. Celebrate your progress
          </h1>
          <p className="text-formgray text-center text-md lg:text-lg mt-3 max-w-sm mx-auto">
            End the session by catching up with your partner and reveling in the
            progress accomplished!
          </p>
        </div>
        <div className="basis-[0%] lg:basis-1/2"></div>
      </div>
      <div className="mt-32 mx-auto text-center max-w-screen-2xl">
        <h1 className="text-greenbg text-center text-4xl md:text-5xl font-normal">
          FAQ
        </h1>
        <FAQComponent data={data} />

        <div className="mx-auto max-w-screen-md">
          <Link to={"/faq"}>
            <BrownButtonOnWhite
              style={{
                padding: "18px",
                fontSize: "17px",
                borderRadius: "8px",
                width: "70%",
              }}
              text={"Have More Questions? Visit Our FAQ"}
            />
          </Link>
        </div>
      </div>

      <FooterJoinButton />
    </div>
  );
}
