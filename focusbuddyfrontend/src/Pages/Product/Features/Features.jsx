import FooterJoinButton from "../../../Components/FooterJoinButton/FooterJoinButton";
import PagesHeading from "../../../Components/PagesHeading/PagesHeading";
import adaptation from   '../../../assets/adaptation.webp';
import favoritepartner from '../../../assets/favourite-partner.webp';
import video from '../../../assets/video.webp';
import quitemode from '../../../assets/quite-mode.webp';
import taskmode from '../../../assets/task-mode.webp';


export default function Features() {
  return (
    <>
      <div className="p-6 xl:p-0 mt-10 xl:mt-20 mb-40 md:max-w-screen-md lg:max-w-screen-xl mx-auto">
        <PagesHeading
          heading={"Features"}
          text={"Explore the features and benefits of FocusBuddy."}
        />

        <div className="mt-10 lg:mt-20 flex flex-col lg:flex-row gap-10 lg:gap-4">
          <div className="basis-1/2 flex flex-col self-center text-start bg-white rounded-lg p-10 shadow-2xl shadow-lightbg ">
            <h2 className="text-2xl font-medium text-greenbg">
              50 minute sessions
            </h2>
            <p className="text-md xl:text-lg text-formgray mt-4 mb-8">
              Extend your focus with 50-minutes sessions.
            </p>
          </div>
          <div className="basis-1/2 self-center my-8 lg:my-0">
            <img
              src={adaptation}
              alt="time slot image"
              loading="lazy"
              className="h-56 mx-auto"
            />
          </div>
        </div>
        <div className="mt-20 mb-10 lg:my-36 flex flex-col-reverse lg:flex-row gap-10 lg:gap-4">
          <div className="my-8 lg:my-0 basis-1/2 self-center flex justify-center">
          <img src={favoritepartner} alt="favrouite partner image" loading="lazy" className="h-40 lg:h-56"/>
          </div>
          <div className="basis-1/2 flex flex-col self-center text-start bg-white rounded-lg p-10 shadow-2xl shadow-lightbg ">
            <h2 className="text-2xl font-medium text-greenbg">Favorite partners</h2>
            <p className="text-md xl:text-lg text-formgray mt-4 mb-8">
            Whether you've found a productive partner and want to reconnect or prefer coworking with a trusted friend, Favorites streamlines the process, making it effortless to select your preferred collaborators.
            </p>
          </div>
        </div>
        <div className="mt-20 mb-10 lg:my-36 flex flex-col lg:flex-row gap-10 lg:gap-4">
          <div className="basis-1/2 flex flex-col self-center text-start bg-white rounded-lg p-10 shadow-2xl shadow-lightbg ">
            <h2 className="text-2xl font-medium text-greenbg">Effortless Session Access</h2>
            <p className="text-md xl:text-lg text-formgray mt-4 mb-8">
            Book and join your sessions swiftly and seamlessly, without the hassle of downloading extra apps. Plus, enjoy convenient features such as screen share, virtual backgrounds, in-video chat, and captions for an enriched experience.
            </p>
          </div>
          <div className="my-8 lg:my-0 basis-1/2 self-center flex justify-center">
            <img src={video} alt="video interface feature image" loading="lazy" className="h-56 object-cover"/>
          </div>
        </div>
        {/* <div className="my-20 lg:my-36 flex flex-col-reverse lg:flex-row gap-10 lg:gap-4">
          <div className="my-8 lg:my-0 basis-1/2 self-center flex justify-center">
            <img src={taskmode} alt="task mode image" loading="lazy" className="h-10 lg:h-12"/>
          </div>
          <div className="basis-1/2 flex flex-col self-center text-start bg-white rounded-lg p-10 shadow-2xl shadow-lightbg ">
            <h2 className="text-2xl font-medium text-greenbg">Task Modes</h2>
            <p className="text-md xl:text-lg text-formgray mt-4 mb-8">
            Whether you're coding, cooking, or multitasking, we've got you covered with our diverse task modes. Opt for Desk Mode for focused coding sessions, Moving for meal preparation, or Anything for a versatile approach—whatever suits your needs.
            </p>
          </div>
        </div> */}
        <div className="mt-20 flex flex-col-reverse lg:flex-row gap-10 lg:gap-4">
        <div className="my-8 lg:my-0 basis-1/2 self-center flex justify-center">
            <img src={quitemode} alt="quite mode image" loading="lazy" className="h-52 lg:h-60"/>
          </div>
          <div className="basis-1/2 flex flex-col self-center text-start bg-white rounded-lg p-10 shadow-2xl shadow-lightbg ">
            <h2 className="text-2xl font-medium text-greenbg">Quite Mode</h2>
            <p className="text-md xl:text-lg text-formgray mt-4 mb-8">
            Activate Quiet Mode for uninterrupted concentration in libraries, cafes, shared offices, or any noise-sensitive environment where using a microphone isn't feasible.
            </p>
          </div>
          
        </div>

        <FooterJoinButton />
      </div>
    </>
  );
}
