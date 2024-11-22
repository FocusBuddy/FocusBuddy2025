import { Link } from "react-router-dom"
import FAQComponent from '../../Components/FAQComponent/FAQComponent';
import FooterJoinButton from "../../Components/FooterJoinButton/FooterJoinButton"


const data = [
    {
      question: "Who can benefit from FocusBuddy?",
      answer:
        "FocusBuddy is ideal for individuals seeking to boost their productivity and accomplish tasks efficiently.",
    },
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
      question: "Is FocusBuddy free?",
      answer:
        "We have 7 days Trial period after that you need to buy subscription.",
    },
    {
      question: "What’s it like working with a stranger?",
      answer:
        "Many users find that their partner doesn't feel like a stranger once the session begins. Remember, you're not socializing or collaborating extensively with your partner; you exchange greetings at the start, state your tasks, and bid farewell at the end.",
    },
    {
      question: "What if I'm feeling anxious or hesitant to give it a try?",
      answer:
        "It's normal to feel nervous, but our community is welcoming and understanding. We encourage you to take the leap and try a 50-minutes session.",
    },
    {
      question: "Do I need to keep the video on the whole time?",
      answer:
        "Please maintain your video on throughout the session, ensuring your visibility within the frame. If your activity involves movement (e.g., cooking or exercising), position your camera accordingly so your partner can observe while you concentrate on your tasks. If you need to step away briefly, inform your partner via chat and return promptly, keeping your video active.",
    },
    {
      question: "Do I need to keep the audio on the whole time?",
      answer:
        "No, it's not mandatory. While some users opt to mute both their own and their partner's mic for focused work, others find hearing their partner's activity enhances productivity and accountability. If you're engaging in activities like watching a video, listening to music, or making a phone call, please do mute yourself to avoid disrupting your partner.",
    },
    {
      question: "What if I prefer using FocusBuddy in a quiet or shared environment?",
      answer:
        "Activate Quiet Mode when working in a serene or collaborative environment, like a library or office, while using FocusBuddy. Your partner will be notified of your Quiet Mode status, allowing you to utilize the in-session text chat to share updates on your goals and progress.",
    },
    {
      question: "Do I have to download another video call app?",
      answer:
        "No additional app downloads required. Simply schedule and participate in sessions directly on FocusBuddy. Plus, we'll send calendar invites to ensure your FocusBuddy sessions seamlessly integrate with your schedule.",
    },
    {
      question: "What tools are essential for beginning?",
      answer:
        "All you need is a computer or mobile device with a camera and microphone, and an internet connection.",
    },
    {
      question: "What if I don’t have a camera?",
      answer:
        "A camera is necessary to use FocusBuddy.",
    },
    {
      question: "How does FocusBuddy protect my privacy?",
      answer:
        "We prioritize safeguarding your personal data through a range of security protocols. Your personally identifiable information is not sold, traded, or shared with external parties. Sessions are not recorded. For further details, refer to our privacy policy.Our Community Guidelines outline the conduct expected from every member. Should you have any inquiries, feel free to reach out – we're here to assist you.",
    },
    {
      question: "How long is a session?",
      answer:
        "FocusBuddy offers three session duration options: 25, 50, and 75 minutes.",
    },
    {
      question: "What if I don’t get a partner?",
      answer:
        "More than 99% of bookings are successfully paired with a partner. In the unlikely event that you aren't matched, you can schedule a session for the next available time slot, just 15 minutes later.",
    },
    {
      question: "What measures are in place to ensure accountability?",
      answer:
        "Accountability is enforced by FocusBuddy and its community members. If you’re late or don’t show, FocusBuddy can detect it and your timeliness score will be reduced, and your account can also be frozen. ",
    },
    {
      question: "Can I listen to music?",
      answer:
        "Yes. However, if you plan to listen to music or watch videos, make sure to mute your microphone.",
    },
    {
      question: "What if I have an idea for a new feature?",
      answer:
        "We’d love to hear your idea. FocusBuddy is continuously evolving, and your desired features are likely on our roadmap. Thank you for your understanding as we work on enhancements.Interested in expediting the process? Spread the word about FocusBuddy among your friends to aid our expansion, or reach out to us directly with your suggestions.",
    },
    {
      question: "I have more questions!",
      answer:
        "Visit our contact page.",
    },
    {
      question: "Can I chat with my partner?",
      answer:
        "Conversation with your partner is limited to the start and finish of your session. At the beginning, it's great to introduce yourself and discuss your objectives. At the end, it's encouraged to debrief and inquire about your partner's experience. Should you wish to engage further, you can propose it after the session. However, please note that any sales pitches or proposals, business-related or otherwise, are not permitted during FocusBuddy sessions.",
    },
  ];

export default function FAQ(){
    return(
        <div className="p-6 lg:p-10 mt-10 mb-40 mx-auto max-w-screen-2xl">
            <h1 className="text-greenbg text-center text-4xl md:text-5xl font-normal">
                Frequently Asked Questions
            </h1>
            <p className="text-md xl:text-lg leading-8 text-center mt-8">Have a different question and can’t find the answer you’re looking for? Reach out <br/> to our support team by <a  href="mailto:rupeshchincholkar14@gmail.com" className="text-[#DE3535] hover:text-greenbg font-medium text-xl">sending us an email</a> and we’ll get back to you as soon as we can.</p>

                <FAQComponent data={data}/>
            <FooterJoinButton/>
        </div>
    )
}