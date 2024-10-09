export default function AccountBanned() {
    return (
      <div className="min-w-screen">
        <div className="mt-20 max-w-6xl mx-auto px-6 xl:px-0">
          <h1 className="text-greenbg font-medium text-center text-4xl md:text-5xl">
            Your Account Has Been Banned Due to Attendance Score!
          </h1>
          <p className="mt-10 text-lg xl:text-xl text-center leading-9 text-textcolor">
            Thank you for exploring our content during your trial period.
          </p>
  
          <p className="mt-10 text-lg xl:text-xl text-center text-textcolor">
            We regret to inform you that your account has been canceled as your
            attendance score has dropped to 0%. As mentioned in our policy,
            maintaining regular attendance is crucial for both your progress and
            the integrity of our community. Unfortunately, reaching a 0%
            attendance score has resulted in the permanent closure of your
            account.
          </p>
  
          <p className="mt-6 text-lg xl:text-xl text-center leading-9 text-textcolor">
            If you believe this action was taken in error or if you have any
            concerns, please do not hesitate to reach out to our support team at{" "}
            <a
              href="mailto:rupeshchincholkar14@gmail.com"
              className="underline underline-offset-8 text-textcolor"
            >
              [Support Team].
            </a>
          </p>
          <p className="mt-6 text-lg xl:text-xl text-center leading-9 text-textcolor">
            We appreciate your participation in our sessions and are here to help
            if needed.
          </p>
        </div>
      </div>
    );
  }
  