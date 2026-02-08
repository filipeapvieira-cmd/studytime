import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function PrivacyPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-8 md:py-12 flex flex-col gap-8 text-neutral-300">
      {/* Back button */}
      <div className="mb-4">
        <Link
          href="/"
          className={`${buttonVariants({ variant: "ghost", size: "sm" })} text-neutral-400 hover:text-white pl-0`}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
      </div>

      <div className="space-y-4">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
          Study Time customer{" "}
          <span className="text-blue-400">privacy notice</span>
        </h1>
        <p className="text-lg text-neutral-400 leading-relaxed">
          This privacy notice tells you what to expect us to do with your
          personal information.
        </p>
      </div>

      {/* Table of Contents */}
      <div className="bg-neutral-900/50 p-6 rounded-lg border border-neutral-800">
        <h2 className="text-xl font-semibold text-white mb-4">Contents</h2>
        <ul className="grid gap-2 text-blue-400 list-disc list-inside">
          <li>
            <a href="#contact" className="hover:underline">
              Contact details
            </a>
          </li>
          <li>
            <a href="#collection" className="hover:underline">
              What information we collect, use, and why
            </a>
          </li>
          <li>
            <a href="#lawful-basis" className="hover:underline">
              Lawful bases and data protection rights
            </a>
          </li>
          <li>
            <a href="#sources" className="hover:underline">
              Where we get personal information from
            </a>
          </li>
          <li>
            <a href="#retention" className="hover:underline">
              How long we keep information
            </a>
          </li>
          <li>
            <a href="#sharing" className="hover:underline">
              Who we share information with
            </a>
          </li>
          <li>
            <a href="#international" className="hover:underline">
              Sharing information outside the UK
            </a>
          </li>
          <li>
            <a href="#complaints" className="hover:underline">
              How to complain
            </a>
          </li>
        </ul>
      </div>

      <section id="contact" className="space-y-4 pt-4">
        <h2 className="text-2xl font-bold text-white">Contact details</h2>
        <div className="bg-neutral-900/30 p-4 rounded-md border border-neutral-800">
          <h3 className="font-semibold text-white">Email</h3>
          <a
            href="mailto:admin@studytime.biz"
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            admin@studytime.biz
          </a>
        </div>
      </section>

      <section id="collection" className="space-y-4 pt-4">
        <h2 className="text-2xl font-bold text-white">
          What information we collect, use, and why
        </h2>
        <p>
          We collect or use the following information for student education and
          welfare:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-neutral-300">
          <li>Names and contact details for students/children</li>
          <li>Account access information</li>
          <li>Progress reports</li>
        </ul>
      </section>

      <section id="lawful-basis" className="space-y-4 pt-4">
        <h2 className="text-2xl font-bold text-white">
          Lawful bases and data protection rights
        </h2>
        <p>
          Under UK data protection law, we must have a “lawful basis” for
          collecting and using your personal information. There is a list of
          possible lawful bases in the UK GDPR. You can find out more about
          lawful bases on the{" "}
          <Link
            href="https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/lawful-basis/"
            target="_blank"
            className="text-blue-400 hover:underline"
          >
            ICO’s website
          </Link>
          .
        </p>
        <p>
          Which lawful basis we rely on may affect your data protection rights
          which are set out in brief below. You can find out more about your
          data protection rights and the exemptions which may apply on the ICO’s
          website:
        </p>
        <div className="space-y-4 mt-4">
          <div className="border-l-2 border-blue-500 pl-4 py-1">
            <strong className="text-white block mb-1">
              Your right of access
            </strong>
            You have the right to ask us for copies of your personal
            information. You can request other information such as details about
            where we get personal information from and who we share personal
            information with. There are some exemptions which means you may not
            receive all the information you ask for.{" "}
            <Link
              href="https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/individual-rights/individual-rights/right-of-access/"
              target="_blank"
              className="text-blue-400 hover:underline"
            >
              Read more about the right of access.
            </Link>
          </div>
          <div className="border-l-2 border-blue-500 pl-4 py-1">
            <strong className="text-white block mb-1">
              Your right to rectification
            </strong>
            You have the right to ask us to correct or delete personal
            information you think is inaccurate or incomplete.{" "}
            <Link
              href="https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/individual-rights/individual-rights/right-to-rectification/"
              target="_blank"
              className="text-blue-400 hover:underline"
            >
              Read more about the right to rectification.
            </Link>
          </div>
          <div className="border-l-2 border-blue-500 pl-4 py-1">
            <strong className="text-white block mb-1">
              Your right to erasure
            </strong>
            You have the right to ask us to delete your personal information.{" "}
            <Link
              href="https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/individual-rights/individual-rights/right-to-erasure/"
              target="_blank"
              className="text-blue-400 hover:underline"
            >
              Read more about the right to erasure.
            </Link>
          </div>
          <div className="border-l-2 border-blue-500 pl-4 py-1">
            <strong className="text-white block mb-1">
              Your right to restriction of processing
            </strong>
            You have the right to ask us to limit how we can use your personal
            information.{" "}
            <Link
              href="https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/individual-rights/individual-rights/right-to-restriction-of-processing/"
              target="_blank"
              className="text-blue-400 hover:underline"
            >
              Read more about the right to restriction of processing.
            </Link>
          </div>
          <div className="border-l-2 border-blue-500 pl-4 py-1">
            <strong className="text-white block mb-1">
              Your right to object to processing
            </strong>
            You have the right to object to the processing of your personal
            data.{" "}
            <Link
              href="https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/individual-rights/individual-rights/right-to-object-to-processing/"
              target="_blank"
              className="text-blue-400 hover:underline"
            >
              Read more about the right to object to processing.
            </Link>
          </div>
          <div className="border-l-2 border-blue-500 pl-4 py-1">
            <strong className="text-white block mb-1">
              Your right to data portability
            </strong>
            You have the right to ask that we transfer the personal information
            you gave us to another organisation, or to you.{" "}
            <Link
              href="https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/individual-rights/individual-rights/right-to-data-portability/"
              target="_blank"
              className="text-blue-400 hover:underline"
            >
              Read more about the right to data portability.
            </Link>
          </div>
          <div className="border-l-2 border-blue-500 pl-4 py-1">
            <strong className="text-white block mb-1">
              Your right to withdraw consent
            </strong>
            When we use consent as our lawful basis you have the right to
            withdraw your consent at any time.{" "}
            <Link
              href="https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/lawful-basis/consent/"
              target="_blank"
              className="text-blue-400 hover:underline"
            >
              Read more about the right to withdraw consent.
            </Link>
          </div>
        </div>
        <p className="mt-4">
          If you make a request, we must respond to you without undue delay and
          in any event within one month.
        </p>
        <p>
          To make a data protection rights request, please contact us using the
          contact details at the top of this privacy notice.
        </p>

        <h3 className="text-xl font-semibold text-white mt-6">
          Our lawful bases for the collection and use of your data
        </h3>
        <p>
          Our lawful bases for collecting or using personal information for
          student education and welfare are:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong className="text-white">Contract</strong> - we have to
            collect or use the information so we can enter into or carry out a
            contract with you. All of your data protection rights may apply
            except the right to object.
          </li>
        </ul>
      </section>

      <section id="sources" className="space-y-4 pt-4">
        <h2 className="text-2xl font-bold text-white">
          Where we get personal information from
        </h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Directly from you</li>
        </ul>
      </section>

      <section id="retention" className="space-y-4 pt-4">
        <h2 className="text-2xl font-bold text-white">
          How long we keep information
        </h2>
        <p>
          Personal information stored in the Study Time database (including user
          account details and study session records such as duration, topics,
          and reflective notes) is kept only for as long as the user maintains
          an active account and the information is needed to provide the
          service. When an account is deleted, or when the service is retired,
          the associated database records are deleted or permanently anonymised
          within a reasonable period, unless a longer retention period is
          required for security, troubleshooting, or legal compliance.
        </p>
      </section>

      <section id="sharing" className="space-y-4 pt-4">
        <h2 className="text-2xl font-bold text-white">
          Who we share information with
        </h2>
        <h3 className="text-xl font-semibold text-white">Data processors</h3>

        <div className="grid md:grid-cols-2 gap-6 mt-4">
          <div className="bg-neutral-900/30 p-6 rounded-lg border border-neutral-800">
            <h4 className="font-bold text-white text-lg mb-2">
              Vercel (hosting)
            </h4>
            <p className="text-sm">
              This data processor does the following activities for us: Hosts
              the Study Time application and delivers it to users over HTTPS.
              Processes limited technical and operational data necessary to run
              the service (e.g., request handling and service logs).
            </p>
          </div>

          <div className="bg-neutral-900/30 p-6 rounded-lg border border-neutral-800">
            <h4 className="font-bold text-white text-lg mb-2">
              Neon (database hosting)
            </h4>
            <p className="text-sm">
              This data processor does the following activities for us: Stores
              and processes Study Time application data in a PostgreSQL
              database, including user account records and study session data.
            </p>
          </div>
        </div>
      </section>

      <section id="international" className="space-y-4 pt-4">
        <h2 className="text-2xl font-bold text-white">
          Sharing information outside the UK
        </h2>
        <p>
          Where necessary, we will transfer personal information outside of the
          UK. When doing so, we comply with the UK GDPR, making sure appropriate
          safeguards are in place.
        </p>
        <p>
          For further information or to obtain a copy of the appropriate
          safeguard for any of the transfers below, please contact us using the
          contact information provided above.
        </p>

        <div className="space-y-6 mt-4">
          <div className="bg-neutral-900/30 p-6 rounded-lg border border-neutral-800">
            <h4 className="font-bold text-white text-lg mb-2">Vercel</h4>
            <dl className="grid gap-2 text-sm">
              <div className="grid md:grid-cols-3 gap-4 items-center">
                <dt className="text-neutral-500">Category of recipient:</dt>
                <dd className="md:col-span-2 text-neutral-300">
                  Cloud hosting / web application platform (hosting and delivery
                  provider)
                </dd>
              </div>
              <div className="grid md:grid-cols-3 gap-4 items-center">
                <dt className="text-neutral-500">
                  Country the personal information is sent to:
                </dt>
                <dd className="md:col-span-2 text-neutral-300">
                  United States / international (global processing)
                </dd>
              </div>
              <div className="grid md:grid-cols-3 gap-4 items-center">
                <dt className="text-neutral-500">
                  How the transfer complies with UK data protection law:
                </dt>
                <dd className="md:col-span-2 text-neutral-300">
                  The International Data Transfer Agreement (IDTA)
                </dd>
              </div>
            </dl>
          </div>

          <div className="bg-neutral-900/30 p-6 rounded-lg border border-neutral-800">
            <h4 className="font-bold text-white text-lg mb-2">Neon</h4>
            <dl className="grid gap-2 text-sm">
              <div className="grid md:grid-cols-3 gap-4 items-center">
                <dt className="text-neutral-500">Category of recipient:</dt>
                <dd className="md:col-span-2 text-neutral-300">
                  Managed database provider (PostgreSQL hosting)
                </dd>
              </div>
              <div className="grid md:grid-cols-3 gap-4 items-center">
                <dt className="text-neutral-500">
                  Country the personal information is sent to:
                </dt>
                <dd className="md:col-span-2 text-neutral-300">
                  United States
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <p className="mt-4 text-sm text-neutral-500 italic">
          Where necessary, our data processors may share personal information
          outside of the UK. When doing so, they comply with the UK GDPR, making
          sure appropriate safeguards are in place.
        </p>
      </section>

      <section id="complaints" className="space-y-4 pt-4 pb-8">
        <h2 className="text-2xl font-bold text-white">How to complain</h2>
        <p>
          If you have any concerns about our use of your personal data, you can
          make a complaint to us using the contact details at the top of this
          privacy notice.
        </p>
        <p>
          If you remain unhappy with how we’ve used your data after raising a
          complaint with us, you can also complain to the ICO.
        </p>

        <div className="bg-neutral-900/30 p-6 rounded-lg border border-neutral-800 mt-4">
          <h3 className="font-semibold text-white mb-2">The ICO’s address:</h3>
          <address className="not-italic text-neutral-300 mb-4">
            Information Commissioner’s Office
            <br />
            Wycliffe House
            <br />
            Water Lane
            <br />
            Wilmslow
            <br />
            Cheshire
            <br />
            SK9 5AF
          </address>
          <div className="grid gap-1">
            <div>
              <span className="text-neutral-500 inline-block w-32">
                Helpline number:
              </span>{" "}
              <span className="text-white">0303 123 1113</span>
            </div>
            <div>
              <span className="text-neutral-500 inline-block w-32">
                Website:
              </span>{" "}
              <Link
                href="https://www.ico.org.uk/make-a-complaint"
                target="_blank"
                className="text-blue-400 hover:underline"
              >
                https://www.ico.org.uk/make-a-complaint
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="text-sm text-neutral-500 pt-8 border-t border-neutral-800">
        Last updated:{" "}
        {new Date().toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </div>
    </main>
  );
}
