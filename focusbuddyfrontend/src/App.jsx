import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from "./ErrorFallback";
import ErrorPage from "./Pages/Error/ErrorPage.jsx";
import { PrivateRoutes } from "./utils/PrivateRoutes.jsx";
import NotFoundPage from "./Pages/NotFound/NotFoundPage.jsx";
import Loading from "./Components/UI/LoadingComponent/Loading.jsx";
import Allpartners from "./Pages/Profile/AllPartners.jsx";
import Dashboard from "./Pages/Dashboard/Dashboard.jsx";

const DashBoardContextWrapper = lazy(() =>
  import("./Pages/Dashboard/Dashboard-Context/DashboardContextWrapper.jsx")
);
const Layout = lazy(() => import("./Layout/Layout.jsx"));
const Signup = lazy(() => import("./Pages/Login-and-register/Signup.jsx"));
const Home = lazy(() => import("./Pages/Home/Home.jsx"));
const Login = lazy(() => import("./Pages/Login-and-register/Login.jsx"));
const UserProfile = lazy(() => import("./Pages/Profile/UserProfile.jsx"));
const SignupProfile = lazy(() =>
  import("./Pages/Login-and-register/SignupProfile.jsx")
);
const Privacy = lazy(() => import("./Pages/Privacy/Privacy.jsx"));
const Terms = lazy(() => import("./Pages/Terms/Terms.jsx"));
const FAQ = lazy(() => import("./Pages/FAQ/FAQ.jsx"));
const About = lazy(() => import("./Pages/About/About.jsx"));
const HowItWorks = lazy(() =>
  import("./Pages/Product/HowItWorks/HowItWorks.jsx")
);
const Features = lazy(() => import("./Pages/Product/Features/Features.jsx"));
const UseCases = lazy(() => import("./Pages/Product/UseCases/UseCases.jsx"));
const Pricing = lazy(() => import("./Pages/Product/Pricing/Pricing.jsx"));
const FocusBuddyScience = lazy(() =>
  import("./Pages/Product/Science/FocusBuddyScience.jsx")
);
const Community = lazy(() => import("./Pages/Community/Community.jsx"));
const Contact = lazy(() => import("./Pages/Contact/Contact.jsx"));
const RestPassword = lazy(() =>
  import("./Pages/Login-and-register/RestPassword.jsx")
);
const ConfirmPassword = lazy(() =>
  import("./Pages/Login-and-register/ConfirmPassword.jsx")
);
const MainProfileWithQuestions = lazy(() =>
  import("./Pages/Profile/MainProfileWithQuestions.jsx")
);
const EditProfileQuestions = lazy(() =>
  import("./Pages/Profile/EditProfileQuestions.jsx")
);
const PeopleFavorites = lazy(() =>
  import("./Pages/Profile/PeopleFavorites.jsx")
);
const SessionsList = lazy(() => import("./Pages/SessionTab/SessionsList.jsx"));
const Settings = lazy(() => import("./Pages/Profile/Settings.jsx"));
const AvailabilityCheck = lazy(() =>
  import("./Pages/Profile/AvailabilityCheck.jsx")
);
const AllFavoritesAvailability = lazy(() =>
  import("./Pages/Profile/AllFavoritesAvailability.jsx")
);
const AccountUpgrade = lazy(() =>
  import("./Pages/AccountUpgrade/AccountUpgrade.jsx")
);
const AllPartners = lazy(() => import("./Pages/Profile/AllPartners.jsx"));
const LaunchTestSession = lazy(() =>
  import("./Pages/Lauch-Test-Session/LauchTestSession.jsx")
);
const DeleteAccount = lazy(() => import('./Pages/DeleteAccount/DeleteAccount.jsx'));
const TrailEnd = lazy(() => import('./Pages/TrailEnd/TrailEnd.jsx'));
const VideoSDK = lazy(() => import('./Pages/Video-Session/VideoSDK.jsx'));
const SessionEnded = lazy(() => import('./Pages/Video-Session/SessionEnded.jsx'));
const ManageSubscription = lazy(() => import('./Pages/ManageSubscription/ManageSubscription.jsx'));
const PaymentSuccess = lazy(() => import('./Pages/PaymentSuccess/PaymentSuccess.jsx'));
const AccountBanned = lazy(() => import('./Pages/AccountBanned/AccountBanned.jsx'));
const DemoVideo  = lazy(() => import("./Pages/Video-Session/DemoVideo.jsx"));


function App() {


  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/" element={<Layout />} errorElement={<ErrorPage />}>
            <Route path="privacy" element={<Privacy />} />
            <Route path="terms" element={<Terms />} />
            <Route path="faq" element={<FAQ />} />
            <Route path="about" element={<About />} />
            <Route path="how-it-works" element={<HowItWorks />} />
            <Route path="features" element={<Features />} />
            <Route path="use-cases" element={<UseCases />} />
            <Route path="science" element={<FocusBuddyScience />} />
            <Route path="pricing" element={<Pricing />} />
            <Route path="community" element={<Community />} />
            <Route path="contact" element={<Contact />} />
            <Route path="account/trail-ended" element={<TrailEnd />} />  
            <Route path="/account/account-ban" element={<AccountBanned />} />
            <Route path="/demovideo" element={<DemoVideo />} />

          </Route>


          <Route
            path="login"
            element={<Login />}
            errorElement={<ErrorPage />}
          />
          <Route
            path="login/reset-password-request"
            element={<RestPassword />}
            errorElement={<ErrorPage />}
          />
          <Route
            path="/login/reset-password/:id/:token"
            // path="/login/reset-password/"
            element={<ConfirmPassword />}
            errorElement={<ErrorPage />}
          />
          <Route
            path="signup"
            element={<Signup />}
            errorElement={<ErrorPage />}
          >
            <Route
              path="profile"
              element={<SignupProfile />}
              errorElement={<ErrorPage />}
            />
          </Route>

         
          
          <Route path="/" element={<PrivateRoutes />}>
          {/* <Route path="/videoSDK" element={<VideoSDK />} /> */}
          <Route path="/session-ended" element={<SessionEnded />} />
            <Route
              path="dashboard"
              element={<Dashboard />}
              errorElement={<ErrorPage />}
            />
            <Route
              path="/session/test-session"
              element={<LaunchTestSession />}
            />
            <Route path="/account/upgrade" element={<AccountUpgrade />} />
            <Route path="/account/plan/success" element={<PaymentSuccess />} />
            <Route path="/account/plan/manage-subscription" element={<ManageSubscription />} />
            <Route path="/account/delete" element={<DeleteAccount />} />
            <Route
              path="profile"
              element={<UserProfile />}
              errorElement={<ErrorPage />}
            />
            <Route path="/profile/edit" element={<EditProfileQuestions />} />
            <Route path="/profile/settings" element={<Settings />} />
            <Route
              path="/profile/people/favorites"
              element={<PeopleFavorites />}
            />
            <Route
              path="/profile/people/allpartners"
              element={<AllPartners />}
            />
            <Route path="sessions-list" element={<SessionsList />} />
            <Route
              path="/sessions/:sessionId"
              element={<VideoSDK />}
              errorElement={<ErrorPage />}
            />
            <Route path="/user/:name" element={<MainProfileWithQuestions />} />
            <Route
              path="/user/:name/availability"
              element={<AvailabilityCheck />}
            />
            <Route
              path="/profile/favorites/availability"
              element={<AllFavoritesAvailability />}
            />
          </Route>

          <Route
            path="*"
            element={<NotFoundPage />}
            errorElement={<ErrorPage />}
          />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
