import { Link, useNavigate } from "react-router-dom";
import LocalAuth from "../../Components/AuthComponent/LocalAuth";
import { useState,useEffect } from "react";
import ErrorTextToast from "../../Components/UI/toast-components/ErrorTextToast";
import { FaUserFriends } from "react-icons/fa";
import FAQComponent from "../../Components/FAQComponent/FAQComponent";
import BrownButtonOnWhite from "../../Components/UI/BrownButtonOnWhite.jsx/BrownButtonOnWhite.jsx";
import Loading from '../../Components/UI/LoadingComponent/Loading.jsx';
import homehero from '../../assets/home-hero.webp';
import adaptation from '../../assets/adaptation.webp';
import map from '../../assets/map.webp';
import effortless from '../../assets/effortless.webp';


const data = [
  {
    question: "What tasks are suitable for FocusBuddy?",
    answer:
      "As long as you remain visible on camera, you can use FocusBuddy for a wide range of activities: desk work, cleaning, cooking, art, music, writing, reading, and even at-home exercise! Simply ensure your camera is positioned to allow your partner to see you while you concentrate on your tasks.",
  },
  {
    question: "Who can benefit from FocusBuddy?",
    answer:
      "FocusBuddy is ideal for individuals seeking to boost their productivity and accomplish tasks efficiently.",
  },
  {
    question: "Who am I working with?",
    answer:
      "FocusBuddy connects you with a fellow member of our global community, both striving to accomplish tasks. If you find synergy with someone, mark them as a Favorite by tapping the star beside their name. Discover more about Favorite Partners.",
  },
  {
    question: "Is FocusBuddy free?",
    answer:
      "We have 1 month Trial period after that you need to buy subscription.",
  },
  {
    question: "Do I have to download another video call app?",
    answer:
      "No additional app downloads required. Simply schedule and participate in sessions directly on FocusBuddy. Plus, we'll send calendar invites to ensure your FocusBuddy sessions seamlessly integrate with your schedule.",
  },
];


export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();



  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_PRO_URL}/auth/checkAuthAndReturnUser`, {
          method: 'GET',
          credentials: 'include',
        });
        const data = await response.json();
        
        if (response.ok) {
          navigate('/dashboard'); // Redirect if authenticated
        } else {
          setLoading(false); // Stop loading if not authenticated
        }
      } catch (err) {
        console.log(err);
        setLoading(false); // Stop loading on error
      }
    };

    checkAuth();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(email, password);
    setEmail("");
    setPassword("");
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_PRO_URL}/auth/local/checkregister`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: email, password: password }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        navigate("/signup/profile", { state: { email, password } });
        console.log(data.message);
      } else if (response.status === 400) {
        setShowMessage(true);
        setErrorMsg(data.message);
      }
    } catch (err) {
      console.log(err);
      throw new Error("Either Username or Password is not acceptable.");
    }
  };

  if (showMessage) {
    setTimeout(() => {
      setShowMessage(false);
    }, 2000);
  }


  if (loading) {
    return <Loading/>;
  }

  return (
    <>
    <div className="mx-6"> 
    <div className="mt-10 mb-32 flex flex-col lg:flex-row md:max-w-screen-md md:mx-auto lg:max-w-screen-2xl bg-white rounded-lg xl:mx-auto shadow-lightbg shadow-2xl">
        <div className="pt-12 pb-20 lg:pt-6 lg:pb-12 px-4 md:px-16 flex flex-col self-center basis-1/2  rounded-s-lg lg:ps-8 xl:ps-16">
          <h1 className="text-4xl xl:text-5xl leading-[45px] text-center lg:text-start xl:leading-[60px] text-greenbg">
            <span className="text-darkbrown">Maximize Your Efficiency:</span>{" "}
            Experience the FocusBuddy Advantage
          </h1>

          <p className="my-4 text-lg xl:text-2xl text-center lg:text-start  text-formgray md:max-w-md mx-auto lg:mx-0">
            Virtual coworking: Where productivity meets accomplishment.
          </p>

          <div className="mt-8 w-fit -translate-y-0 hover:-translate-y-2 transition-all duration-500 ease-in-out mx-auto lg:mx-0">
            <Link
              to={"/signup"}
              className="bg-greenbg py-4 text-md xl:text-lg px-6 -translate-y-0 hover:-translate-y-10  text-white rounded-md transition-all duration-500 ease-in-out"
            >
              Start Free Now!
            </Link>
          </div>
        </div>
        <div className="basis-1/2 rounded-e-xl">
          <img
            src={homehero}
            alt=""
            className="rounded-b-lg lg:rounded-e-lg h-full object-cover"
            loading="lazy"
          />
        </div>
      </div>
    </div>
     

      <div className="flex flex-col-reverse lg:flex-row gap-10 lg:gap-4  px-6  md:max-w-screen-md lg:max-w-screen-xl mx-auto">
        <div className="mt-6 lg:mt-0 basis-1/2 self-center">
          <img src={adaptation} alt="time slot image" loading="lazy" className="h-68 md:h-72"/>
        </div>
        <div className="basis-1/2 flex flex-col self-center bg-white rounded-lg p-10 shadow-2xl shadow-lightbg ">
          <h2 className="text-2xl font-medium text-greenbg">Adaptable</h2>
          <p className="text-md xl:text-lg text-formgray mt-4 mb-8">
            Tailor your focus, whether it's a quick task
            or a deep dive. 50-minute sessions for managing daily
            tasks (like cleaning utensils) or conquering major endeavors (like
            completing thesis).
          </p>
          <Link to={'/features'} className="w-[75%] -translate-y-0 hover:-translate-y-2 transition-all duration-500 ease-in-out"><BrownButtonOnWhite text={'Discover more features'} style={{padding: '16px', fontSize:'18px'}}/></Link>
        </div>
      </div>

      <div className="my-20 lg:my-40 flex flex-col lg:flex-row px-6 gap-10 lg:gap-4  md:max-w-screen-md lg:max-w-screen-xl mx-auto">
        <div className="flex flex-col self-center text-start basis-1/2 bg-white rounded-lg p-10 shadow-2xl shadow-lightbg ">
          <h2 className="text-2xl font-medium text-greenbg">Driven by Community</h2>
          <p className="text-md xl:text-lg text-formgray mt-4 mb-8">
          Join forces with students, engineers, homemakers, and more from over 150 countries to achieve your goals. Easily find study buddies or coworkers and book sessions hassle-free!
          </p>
          <Link to={'/features'} className="w-[75%] -translate-y-0 hover:-translate-y-2 transition-all duration-500 ease-in-out"><BrownButtonOnWhite text={'Discover more features'} style={{padding: '16px', fontSize:'18px'}}/></Link>
        </div>
        <div className="mt-6 lg:mt-0 basis-1/2 flex justify-center items-center">
              <img src={map} alt="people around world" loading="lazy" className="h-68 md:h-96"/>
        </div>
      </div>

      <div className="flex flex-col-reverse lg:flex-row px-6 gap-10 lg:gap-4  md:max-w-screen-md lg:max-w-screen-xl mx-auto">
        <div className="mt-6 lg:mt-0 basis-1/2 flex items-center justify-center ps-0 lg:px-10 xl:ps-16">
              <img src={effortless} alt="book and join image" className="h-36 md:h-48" loading="lazy"/>
        </div>
        <div className="basis-1/2 flex flex-col self-center bg-white rounded-lg p-10 shadow-2xl shadow-lightbg ">
          <h2 className="text-2xl font-medium text-greenbg">Effortless</h2>
          <p className="text-md xl:text-lg text-formgray mt-4 mb-8">
          Effortlessly Achieve Tasks
          Schedule sessions, and join video calls directly from your browser, on desktop or mobile. No extra downloads needed.
          </p>
          <Link to={'/features'} className="w-[75%] -translate-y-0 hover:-translate-y-2 transition-all duration-500 ease-in-out"><BrownButtonOnWhite text={'Discover more features'} style={{padding: '16px', fontSize:'18px'}}/></Link>
        </div>
      </div>

      <div className="mt-32 lg:mt-40  md:max-w-screen-md lg:max-w-screen-xl mx-auto">
        <h1 className="text-greenbg text-center text-4xl font-normal">
          How it works
        </h1>
        <div className="mt-10 lg:mt-20 p-6 flex flex-col lg:flex-row gap-8">
          <div className="basis-1/3 space-y-4 bg-white p-10 rounded-lg hover:shadow-2xl hover:shadow-lightbg transition-all duration-500 ease-in-out group">
            <h1 className="text-2xl lg:text-5xl text-darkbrown w-fit p-4 font-medium rounded-lg group-hover:bg-greenbg group-hover:text-white transition-all duration-500 ease-in-out">01</h1>
            <h2 className="text-2xl text-greenbg">Book a session</h2>
            <p className="text-md xl:text-lg text-formgray">We'll connect you with a fellow member from our vibrant community whenever you're ready to concentrate.</p>
          </div>
          <div className="basis-1/3 space-y-4 bg-white p-10 rounded-lg hover:shadow-2xl hover:shadow-lightbg transition-all duration-500 ease-in-out group">
            <h1 className="text-2xl lg:text-5xl text-darkbrown w-fit p-4 font-medium rounded-lg group-hover:bg-greenbg group-hover:text-white transition-all duration-500 ease-in-out">02</h1>
            <h2 className="text-2xl text-greenbg">Join video call</h2>
            <p className="text-md xl:text-lg text-formgray">Say hello to your partner, discuss your session goals, and let's dive into work!</p>
          </div>
          <div className="basis-1/3 space-y-4 bg-white p-10 rounded-lg hover:shadow-2xl hover:shadow-lightbg transition-all duration-500 ease-in-out group">
            <h1 className="text-2xl lg:text-5xl text-darkbrown w-fit p-4 font-medium rounded-lg group-hover:bg-greenbg group-hover:text-white transition-all duration-500 ease-in-out">03</h1>
            <h2 className="text-2xl text-greenbg">Celebrate your progress</h2>
            <p className="text-md xl:text-lg text-formgray">End the session by catching up with your partner and reveling in the progress accomplished!</p>
          </div>
        </div>
      </div>


      <div className="mt-20 lg:mt-40 px-6 text-center">
        <h1 className="text-greenbg text-center text-3xl lg:text-4xl font-normal">
          Frequently Asked Questions
        </h1>
        <FAQComponent data={data}/>
        <Link to={"/faq"}>
          <BrownButtonOnWhite
            style={{
              padding: "18px 28px",
              fontSize: "18px",
              backgroundColor: "#008080",
            }}
            text={"Have More Questions? Visit Our FAQ"}
          />
        </Link>
      </div>
      <div className="lg:flex mt-28 lg:mt-36 lg:gap-20 xl:gap-32 mx-auto w-full  md:max-w-screen-md lg:max-w-screen-xl p-6 lg:pt-10 lg:ps-10 lg:pb-16">
        <div className="basis-1/2  my-auto">
          <h1 className="text-4xl  lg:text-5xl text-textcolor leading-tight">
            Boost Your Productivity!
          </h1>
          <ul className="mt-10 ps-4 text-lg xl:text-xl leading-9 text-formgray">
            <li className="list-disc  marker:text-greenbg">
              Join FocusBuddy and connect with professionals dedicated to
              staying on task. Schedule virtual coworking sessions to keep you
              focused and accountable.
            </li>
            <li className="mt-6 list-disc marker:text-greenbg">
              <span className="text-greenbg font-medium">Sign up now</span> and
              increase your productivity by 201%. <br />
              Join a community committed to doing their best work!
            </li>
          </ul>
        </div>
        <div
          className="mt-20 lg:mt-0 relative basis-1/2 w-full bg-white pt-16 lg:pt-10 pb-14 px-8 lg:px-20 rounded-2xl"
          style={{ boxShadow: "5px 5px 0px 5px #583531" }}
        >
          <span className="absolute right-8 -top-14 text-8xl lg:text-9xl text-textcolor">
            <FaUserFriends />
          </span>
          <h1 className="text-greenbg mb-8 text-3xl font-medium">
            Sign up now
          </h1>
          <form onSubmit={handleSubmit}>
            <LocalAuth
              text={"Sign up"}
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
            />
          </form>
        </div>
      </div>
      {showMessage ? <ErrorTextToast text={errorMsg} /> : null}
    </>
  );
}
