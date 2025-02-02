import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { myContext } from "../../utils/PrivateRoutes";
import SuccessToast from "../../Components/UI/toast-components/SuccessToast";
import DashboardInnerNav from "../../Components/navbar/DashboardInnerNav";

export default function EditProfileQuestions() {
  const { userProfile,setProfile } = useContext(myContext);
  const [success,setSuccess] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    "today-q1": userProfile.userProfileQuestions["today-q1"],
    "today-q2": userProfile.userProfileQuestions["today-q2"],
    "today-q3": userProfile.userProfileQuestions["today-q3"],
    "today-q4": userProfile.userProfileQuestions["today-q4"],
    "profile-q1": userProfile.userProfileQuestions["profile-q1"],
    "profile-q2": userProfile.userProfileQuestions["profile-q2"],
    "profile-q3": userProfile.userProfileQuestions["profile-q3"],
    "profile-q4": userProfile.userProfileQuestions["profile-q4"],
    "profile-q5": userProfile.userProfileQuestions["profile-q5"],
    "profile-q6": userProfile.userProfileQuestions["profile-q6"],
    "hiw-q1": userProfile.userProfileQuestions["hiw-q1"],
    "hiw-q2": userProfile.userProfileQuestions["hiw-q2"],
    "hiw-q3": userProfile.userProfileQuestions["hiw-q3"],
    "hiw-q4": userProfile.userProfileQuestions["hiw-q4"],
    "hiw-q5": userProfile.userProfileQuestions["hiw-q5"],
    "focusbuddy-q1": userProfile.userProfileQuestions["focusbuddy-q1"],
    "focusbuddy-q2": userProfile.userProfileQuestions["focusbuddy-q2"],
    "focusbuddy-q3": userProfile.userProfileQuestions["focusbuddy-q3"],
    "focusbuddy-q4": userProfile.userProfileQuestions["focusbuddy-q4"],
    "focusbuddy-q5": userProfile.userProfileQuestions["focusbuddy-q5"],
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleProfileQuestionsSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_PRO_URL}/api/user/saveprofilequestions`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ allQuestion: formData, email: userProfile.email }),
        }
      );
      const data = await response.json();
      // console.log(data);
      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          setProfile(data.user);
          navigate("/profile");
        }, 500);
      }
    } catch (err) {
      console.log(err);
      throw new Error("Error while saving profile questions.");
    }
  };

  return (
    <>
      <DashboardInnerNav/>
      <div className="max-w-screen-md min-h-screen mx-auto py-10">
        <div className="bg-greenbg text-3xl lg:text-4xl text-center py-6 rounded-t-md text-white ">
          {" "}
          Edit Profile
        </div>
        <div className="bg-white px-10 lg:px-16 py-10">
          <form onSubmit={handleProfileQuestionsSubmit}>
            <div>
              <h1 className="text-2xl text-greenbg font-medium">
                Today (Why I'm Here)
              </h1>

              <label
                htmlFor="today-q1"
                className="mt-6 block mb-2 text-md xl:text-lg text-textcolor"
              >
                My most important project today:
              </label>
              <textarea
                id="today-q1"
                name="today-q1"
                rows="4"
                className="block p-2.5 w-full text-md xl:text-lg bg-gray-50 rounded-lg border border-gray-300 focus:ring-greenbg focus:border-greenbg"
                placeholder="Write your thoughts here..."
                value={formData["today-q1"]}
                onChange={handleChange}
              ></textarea>

              <label
                htmlFor="today-q2"
                className="mt-6 block mb-2 text-md xl:text-lg text-textcolor"
              >
                My goal for my next session is:
              </label>
              <textarea
                id="today-q2"
                name="today-q2"
                rows="4"
                className="block p-2.5 w-full text-md xl:text-lg bg-gray-50 rounded-lg border border-gray-300 focus:ring-greenbg focus:border-greenbg"
                placeholder="Write your thoughts here..."
                value={formData["today-q2"]}
                onChange={handleChange}
              ></textarea>

              <label
                htmlFor="today-q3"
                className="mt-6 block mb-2 text-md xl:text-lg text-textcolor"
              >
                Where I am working:
              </label>
              <textarea
                id="today-q3"
                name="today-q3"
                rows="4"
                className="block p-2.5 w-full text-md xl:text-lg bg-gray-50 rounded-lg border border-gray-300 focus:ring-greenbg focus:border-greenbg"
                placeholder="Write your thoughts here..."
                value={formData["today-q3"]}
                onChange={handleChange}
              ></textarea>

              <label
                htmlFor="today-q4"
                className="mt-6 block mb-2 text-md xl:text-lg text-textcolor"
              >
                Music I'm listening to:
              </label>
              <textarea
                id="today-q4"
                name="today-q4"
                rows="4"
                className="block p-2.5 w-full text-md xl:text-lg bg-gray-50 rounded-lg border border-gray-300 focus:ring-greenbg focus:border-greenbg"
                placeholder="Write your thoughts here..."
                value={formData["today-q4"]}
                onChange={handleChange}
              ></textarea>
            </div>

            <div className="my-14">
              <h1 className="text-2xl text-greenbg font-medium">
                Profile (Who I AM)
              </h1>

              <label
                htmlFor="profile-q1"
                className="mt-6 block mb-2 text-md xl:text-lg text-textcolor"
              >
                My headline or tagline:
              </label>
              <textarea
                id="profile-q1"
                name="profile-q1"
                rows="4"
                className="block p-2.5 w-full text-md xl:text-lg bg-gray-50 rounded-lg border border-gray-300 focus:ring-greenbg focus:border-greenbg"
                placeholder="Write your thoughts here..."
                value={formData["profile-q1"]}
                onChange={handleChange}
              ></textarea>

              <label
                htmlFor="profile-q2"
                className="mt-6 block mb-2 text-md xl:text-lg text-textcolor"
              >
                Book I'm currently reading:
              </label>
              <textarea
                id="profile-q2"
                name="profile-q2"
                rows="4"
                className="block p-2.5 w-full text-md xl:text-lg bg-gray-50 rounded-lg border border-gray-300 focus:ring-greenbg focus:border-greenbg"
                placeholder="Write your thoughts here..."
                value={formData["profile-q2"]}
                onChange={handleChange}
              ></textarea>

              <label
                htmlFor="profile-q3"
                className="mt-6 block mb-2 text-md xl:text-lg text-textcolor"
              >
                Book I want to read next:
              </label>
              <textarea
                id="profile-q3"
                name="profile-q3"
                rows="4"
                className="block p-2.5 w-full text-md xl:text-lg bg-gray-50 rounded-lg border border-gray-300 focus:ring-greenbg focus:border-greenbg"
                placeholder="Write your thoughts here..."
                value={formData["profile-q3"]}
                onChange={handleChange}
              ></textarea>

              <label
                htmlFor="profile-q4"
                className="mt-6 block mb-2 text-md xl:text-lg text-textcolor"
              >
                Book that's had the biggest impact on my life:
              </label>
              <textarea
                id="profile-q4"
                name="profile-q4"
                rows="4"
                className="block p-2.5 w-full text-md xl:text-lg bg-gray-50 rounded-lg border border-gray-300 focus:ring-greenbg focus:border-greenbg"
                placeholder="Write your thoughts here..."
                value={formData["profile-q4"]}
                onChange={handleChange}
              ></textarea>

              <label
                htmlFor="profile-q5"
                className="mt-6 block mb-2 text-md xl:text-lg text-textcolor"
              >
                Influencers with biggest impact on my life:
              </label>
              <textarea
                id="profile-q5"
                name="profile-q5"
                rows="4"
                className="block p-2.5 w-full text-md xl:text-lg bg-gray-50 rounded-lg border border-gray-300 focus:ring-greenbg focus:border-greenbg"
                placeholder="Write your thoughts here..."
                value={formData["profile-q5"]}
                onChange={handleChange}
              ></textarea>

              <label
                htmlFor="profile-q6"
                className="mt-6 block mb-2 text-md xl:text-lg text-textcolor"
              >
                Favorite podcast:
              </label>
              <textarea
                id="profile-q6"
                name="profile-q6"
                rows="4"
                className="block p-2.5 w-full text-md xl:text-lg bg-gray-50 rounded-lg border border-gray-300 focus:ring-greenbg focus:border-greenbg"
                placeholder="Write your thoughts here..."
                value={formData["profile-q6"]}
                onChange={handleChange}
              ></textarea>
            </div>

            <div>
              <h1 className="text-2xl text-greenbg font-medium">How I Work</h1>

              <label
                htmlFor="hiw-q1"
                className="mt-6 block mb-2 text-md xl:text-lg text-textcolor"
              >
                My most productive time of day is:
              </label>
              <textarea
                id="hiw-q1"
                name="hiw-q1"
                rows="4"
                className="block p-2.5 w-full text-md xl:text-lg bg-gray-50 rounded-lg border border-gray-300 focus:ring-greenbg focus:border-greenbg"
                placeholder="Write your thoughts here..."
                value={formData["hiw-q1"]}
                onChange={handleChange}
              ></textarea>

              <label
                htmlFor="hiw-q2"
                className="mt-6 block mb-2 text-md xl:text-lg text-textcolor"
              >
                My least productive time of day is:
              </label>
              <textarea
                id="hiw-q2"
                name="hiw-q2"
                rows="4"
                className="block p-2.5 w-full text-md xl:text-lg bg-gray-50 rounded-lg border border-gray-300 focus:ring-greenbg focus:border-greenbg"
                placeholder="Write your thoughts here..."
                value={formData["hiw-q2"]}
                onChange={handleChange}
              ></textarea>

              <label
                htmlFor="hiw-q3"
                className="mt-6 block mb-2 text-md xl:text-lg text-textcolor"
              >
                The task or type of work I dislike most:
              </label>
              <textarea
                id="hiw-q3"
                name="hiw-q3"
                rows="4"
                className="block p-2.5 w-full text-md xl:text-lg bg-gray-50 rounded-lg border border-gray-300 focus:ring-greenbg focus:border-greenbg"
                placeholder="Write your thoughts here..."
                value={formData["hiw-q3"]}
                onChange={handleChange}
              ></textarea>

              <label
                htmlFor="hiw-q4"
                className="mt-6 block mb-2 text-md xl:text-lg text-textcolor"
              >
                Productivity app I couldn't live without:
              </label>
              <textarea
                id="hiw-q4"
                name="hiw-q4"
                rows="4"
                className="block p-2.5 w-full text-md xl:text-lg bg-gray-50 rounded-lg border border-gray-300 focus:ring-greenbg focus:border-greenbg"
                placeholder="Write your thoughts here..."
                value={formData["hiw-q4"]}
                onChange={handleChange}
              ></textarea>

              <label
                htmlFor="hiw-q5"
                className="mt-6 block mb-2 text-md xl:text-lg text-textcolor"
              >
                "Favorite" method of procrastination:
              </label>
              <textarea
                id="hiw-q5"
                name="hiw-q5"
                rows="4"
                className="block p-2.5 w-full text-md xl:text-lg bg-gray-50 rounded-lg border border-gray-300 focus:ring-greenbg focus:border-greenbg"
                placeholder="Write your thoughts here..."
                value={formData["hiw-q5"]}
                onChange={handleChange}
              ></textarea>
            </div>

            <div className="mt-14">
              <h1 className="text-2xl text-greenbg font-medium">
                How I Get The Most From FocusBuddy
              </h1>

              <label
                htmlFor="focusbuddy-q1"
                className="mt-6 block mb-2 text-md xl:text-lg text-textcolor"
              >
                My best sessions have this in common:
              </label>
              <textarea
                id="focusbuddy-q1"
                name="focusbuddy-q1"
                rows="4"
                className="block p-2.5 w-full text-md xl:text-lg bg-gray-50 rounded-lg border border-gray-300 focus:ring-greenbg focus:border-greenbg"
                placeholder="Write your thoughts here..."
                value={formData["focusbuddy-q1"]}
                onChange={handleChange}
              ></textarea>

              <label
                htmlFor="focusbuddy-q2"
                className="mt-6 block mb-2 text-md xl:text-lg text-textcolor"
              >
                I love it when my FocusBuddy partner does this:
              </label>
              <textarea
                id="focusbuddy-q2"
                name="focusbuddy-q2"
                rows="4"
                className="block p-2.5 w-full text-md xl:text-lg bg-gray-50 rounded-lg border border-gray-300 focus:ring-greenbg focus:border-greenbg"
                placeholder="Write your thoughts here..."
                value={formData["focusbuddy-q2"]}
                onChange={handleChange}
              ></textarea>

              <label
                htmlFor="focusbuddy-q3"
                className="mt-6 block mb-2 text-md xl:text-lg text-textcolor"
              >
                My biggest pet peeve is when my FocusBuddy partner does this:
              </label>
              <textarea
                id="focusbuddy-q3"
                name="focusbuddy-q3"
                rows="4"
                className="block p-2.5 w-full text-md xl:text-lg bg-gray-50 rounded-lg border border-gray-300 focus:ring-greenbg focus:border-greenbg"
                placeholder="Write your thoughts here..."
                value={formData["focusbuddy-q3"]}
                onChange={handleChange}
              ></textarea>

              <label
                htmlFor="focusbuddy-q4"
                className="mt-6 block mb-2 text-md xl:text-lg text-textcolor"
              >
                If I could add or change one thing about FocusBuddy, it would
                be:
              </label>
              <textarea
                id="focusbuddy-q4"
                name="focusbuddy-q4"
                rows="4"
                className="block p-2.5 w-full text-md xl:text-lg bg-gray-50 rounded-lg border border-gray-300 focus:ring-greenbg focus:border-greenbg"
                placeholder="Write your thoughts here..."
                value={formData["focusbuddy-q4"]}
                onChange={handleChange}
              ></textarea>

              <label
                htmlFor="focusbuddy-q5"
                className="mt-6 block mb-2 text-md xl:text-lg text-textcolor"
              >
                What are the top 1-2 tasks you use FocusBuddy for most often:
              </label>
              <textarea
                id="focusbuddy-q5"
                name="focusbuddy-q5"
                rows="4"
                className="block p-2.5 w-full text-md xl:text-lg bg-gray-50 rounded-lg border border-gray-300 focus:ring-greenbg focus:border-greenbg"
                placeholder="Write your thoughts here..."
                value={formData["focusbuddy-q5"]}
                onChange={handleChange}
              ></textarea>
            </div>
            <div className="mt-8 flex gap-4 justify-end">
              <button
                type="submit"
                className="bg-textcolor py-3 px-10 text-md xl:text-lg text-white rounded-md hover:bg-darkbrown"
              >
                Save
              </button>
              <Link
                to={"/profile"}
                className="border-2 border-textcolor rounded-md py-3 px-8 text-md xl:text-lg hover:bg-bordercolor"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
      {success ? <SuccessToast text={"Answer's saved!"}/> : null }
    
    </>

  );
}
