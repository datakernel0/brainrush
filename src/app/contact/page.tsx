export const metadata = {
  title: "Contact BrainRush",
  description: "Contact the BrainRush team with questions or feedback.",
  alternates: { canonical: "/contact/" },
};

export default function Contact() {
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL;

  return (
    <div className="container">
      <div className="page-hero">
        <span className="eyebrow">GET IN TOUCH</span>
        <h1>We&apos;d love to hear from you.</h1>
        <p>Feedback, bug reports, and ideas help make BrainRush better.</p>
      </div>
      <section className="content-card">
        <h2>Contact</h2>
        {email ? (
          <p>
            Send us a message at{" "}
            <a className="plain-link" href={`mailto:${email}`}>
              {email}
            </a>
            .
          </p>
        ) : (
          <p>
            Our public contact email has not been configured yet. Set{" "}
            <code>NEXT_PUBLIC_CONTACT_EMAIL</code> in your deployment environment.
          </p>
        )}
        <p>
          Please include the game name, device, and browser if you&apos;re reporting a technical issue. Do not send passwords or sensitive personal information.
        </p>
      </section>
    </div>
  );
}
