import PagesHeading from "../../../Components/PagesHeading/PagesHeading";
import { FaCode } from "react-icons/fa6";
import { CiBoxList } from "react-icons/ci";
import { FaBookReader } from "react-icons/fa";
import { GiVacuumCleaner } from "react-icons/gi";
import { FaPenFancy } from "react-icons/fa";
import { GrYoga } from "react-icons/gr";
import { BsPalette } from "react-icons/bs";
import { TbHandClick } from "react-icons/tb";
import { HiLightBulb } from "react-icons/hi";
import { Link } from "react-router-dom";
import BrownButtonOnWhite from "../../../Components/UI/BrownButtonOnWhite.jsx/BrownButtonOnWhite.jsx";
import FAQComponent from "../../../Components/FAQComponent/FAQComponent";

const data = [
  {
    question: "What if I prefer using FocusBuddy in a quiet or shared environment?",
    answer:
      "Activate Quiet Mode when working in a serene or collaborative environment, like a library or office, while using FocusBuddy. Your partner will be notified of your Quiet Mode status, allowing you to utilize the in-session text chat to share updates on your goals and progress.",
  },
  {
    question:
      "How do I use FocusBuddy for tasks that involve moving around?",
    answer:
      "Using FocusBuddy for tasks that involve moving around (like cooking or exercising) is similar to using FocusBuddy for desk work. Just make sure to set up your camera so that your partner can see you while you focus on your task(s).",
  },
  {
    question:
      "Can I choose specific people for tasks like exercise or morning routines on FocusBuddy?",
    answer:
      "Certainly. You have options for working with specific people. If you enjoyed collaborating with someone and want to work together again, you can Favorite them and schedule a sessions with them.",
  },
];

export default function UseCases() {
  return (
    <>
      <div className="p-6 lg:p-10 mt-10 mb-32 lg:mb-40 md:max-w-screen-md lg:max-w-screen-xl mx-auto">
        <PagesHeading
          heading={"What Can I Do On FocusBuddy?"}
          text={
            "Discover How Our Community Maximizes Productivity with FocusBuddy!"
          }
        />

        <div className="mt-28 lg:mt-32 flex flex-col lg:flex-row gap-24 lg:gap-4">
          <div className="group basis-1/3 bg-white ps-10 pe-10 pb-10 rounded-lg hover:shadow-lightbg hover:shadow-2xl transition-all duration-500 ease-in-out">
            <div className="-mt-10 w-fit  bg-textcolor p-6 rounded-full text-white text-2xl lg:text-4xl group-hover:bg-greenbg transition-all duration-500 ease-in-out">
              <FaCode />
            </div>
            <h1 className="mt-6 mb-4 text-2xl font-medium text-greenbg group-hover:text-textcolor">
              Coding
            </h1>
            <p className="text-formgray text-md xl:text-lg">
              Whether you're coding, reviewing, or debugging, FocusBuddy helps
              you dive deep into the zone.
            </p>
          </div>
          <div className="group basis-1/3 bg-white ps-10 pe-10 pb-10 rounded-lg hover:shadow-lightbg hover:shadow-2xl transition-all duration-500 ease-in-out">
            <div className="-mt-10 w-fit  bg-textcolor p-6 rounded-full text-white text-2xl lg:text-4xl group-hover:bg-greenbg transition-all duration-500 ease-in-out">
              <CiBoxList />
            </div>
            <h1 className="mt-6 mb-4 text-2xl font-medium text-greenbg group-hover:text-textcolor">
              Planning your day
            </h1>
            <p className="text-formgray text-md xl:text-lg">
              Jumpstart your day, organize tasks, or schedule appointments
              hassle-free.
            </p>
          </div>
          <div className="group basis-1/3 bg-white ps-10 pe-10 pb-10 rounded-lg hover:shadow-lightbg hover:shadow-2xl transition-all duration-500 ease-in-out">
            <div className="-mt-10 w-fit  bg-textcolor p-6 rounded-full text-white text-2xl lg:text-4xl group-hover:bg-greenbg transition-all duration-500 ease-in-out">
              <FaBookReader />
            </div>
            <h1 className="mt-6 mb-4 text-2xl font-medium text-greenbg group-hover:text-textcolor">
              Studying
            </h1>
            <p className="text-formgray text-md xl:text-lg">
              Studying for an exam? Wrapping up assignments? Preparing for
              tomorrow's class? FocusBuddy keeps you on track!
            </p>
          </div>
        </div>

        <div className="mt-24 lg:mt-28 flex flex-col lg:flex-row gap-24 lg:gap-4">
          <div className="group basis-1/3 bg-white ps-10 pe-10 pb-10 rounded-lg hover:shadow-lightbg hover:shadow-2xl transition-all duration-500 ease-in-out">
            <div className="-mt-10 w-fit  bg-textcolor p-6 rounded-full text-white text-2xl lg:text-4xl group-hover:bg-greenbg transition-all duration-500 ease-in-out">
              <GiVacuumCleaner />
            </div>
            <h1 className="mt-6 mb-4 text-2xl font-medium text-greenbg group-hover:text-textcolor">
              Housework
            </h1>
            <p className="text-formgray text-md xl:text-lg">
              Plants thirsty? Laundry pile growing? Dishes stacking up?
              FocusBuddy lends a hand!
            </p>
          </div>
          <div className="group basis-1/3 bg-white ps-10 pe-10 pb-10 rounded-lg hover:shadow-lightbg hover:shadow-2xl transition-all duration-500 ease-in-out">
            <div className="-mt-10 w-fit  bg-textcolor p-6 rounded-full text-white text-2xl lg:text-4xl group-hover:bg-greenbg transition-all duration-500 ease-in-out">
              <FaPenFancy />
            </div>
            <h1 className="mt-6 mb-4 text-2xl font-medium text-greenbg group-hover:text-textcolor">
              Writing and Research
            </h1>
            <p className="text-formgray text-md xl:text-lg">
              From your personal diary to your groundbreaking research proposal,
              or the concluding chapter of your next bestseller – FocusBuddy is
              your writing companion for any project.
            </p>
          </div>
          <div className="group basis-1/3 bg-white ps-10 pe-10 pb-10 rounded-lg hover:shadow-lightbg hover:shadow-2xl transition-all duration-500 ease-in-out">
            <div className="-mt-10 w-fit  bg-textcolor p-6 rounded-full text-white text-2xl lg:text-4xl group-hover:bg-greenbg transition-all duration-500 ease-in-out">
              <GrYoga />
            </div>
            <h1 className="mt-6 mb-4 text-2xl font-medium text-greenbg group-hover:text-textcolor">
              Meditation, yoga, and exercise
            </h1>
            <p className="text-formgray text-md xl:text-lg">
              Boost your energy or unwind with the support and motivation of a
              FocusBuddy partner by your side.
            </p>
          </div>
        </div>
        <div className="mt-24 lg:mt-28 mb-20 lg:mb-36 flex flex-col lg:flex-row gap-24 lg:gap-4">
          <div className="group basis-1/3 bg-white ps-10 pe-10 pb-10 rounded-lg hover:shadow-lightbg hover:shadow-2xl transition-all duration-500 ease-in-out">
            <div className="-mt-10 w-fit  bg-textcolor p-6 rounded-full text-white text-2xl lg:text-4xl group-hover:bg-greenbg transition-all duration-500 ease-in-out">
              <BsPalette />
            </div>
            <h1 className="mt-6 mb-4 text-2xl font-medium text-greenbg group-hover:text-textcolor">
              Creative work
            </h1>
            <p className="text-formgray text-md xl:text-lg">
              Brushing strokes on canvas? Molding clay? Crafting melodies? Let
              FocusBuddy ignite your creative spark.
            </p>
          </div>
          <div className="group basis-1/3 bg-white ps-10 pe-10 pb-10 rounded-lg hover:shadow-lightbg hover:shadow-2xl transition-all duration-500 ease-in-out">
            <div className="-mt-10 w-fit  bg-textcolor p-6 rounded-full text-white text-2xl lg:text-4xl group-hover:bg-greenbg transition-all duration-500 ease-in-out">
              <TbHandClick />
            </div>
            <h1 className="mt-6 mb-4 text-2xl font-medium text-greenbg group-hover:text-textcolor">
              Chores
            </h1>
            <p className="text-formgray text-md xl:text-lg">
              Stay ahead of chores with FocusBuddy, whether you're booking
              flights, stocking groceries, or tackling taxes.
            </p>
          </div>
          <div className="group basis-1/3 bg-white ps-10 pe-10 pb-10 rounded-lg hover:shadow-lightbg hover:shadow-2xl transition-all duration-500 ease-in-out">
            <div className="-mt-10 w-fit  bg-textcolor p-6 rounded-full text-white text-2xl lg:text-4xl group-hover:bg-greenbg">
              <HiLightBulb />
            </div>
            <h1 className="mt-6 mb-10 text-2xl font-medium text-greenbg">
              Anything else!
            </h1>
            <Link className="text-formgray text-md xl:text-lg">
              <BrownButtonOnWhite
                text={"Join for free"}
                style={{ fontSize: "17px", padding: "14px", width: "100%" }}
              />
            </Link>
          </div>
        </div>

        <div className="text-center">
          <h1 className="text-greenbg text-center text-4xl font-normal">FAQ</h1>
          <FAQComponent data={data} />
          <Link to={"/faq"}>
            <BrownButtonOnWhite
              style={{
                padding: "18px 28px",
                fontSize: "17px",
              }}
              text={"Have More Questions? Visit Our FAQ"}
            />
          </Link>
        </div>
      </div>
    </>
  );
}
