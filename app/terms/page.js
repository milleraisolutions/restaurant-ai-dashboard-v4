export default function TermsPage() {
  return (
    <div style={pageStyle}>
      <div style={backgroundGlowOne} />
      <div style={backgroundGlowTwo} />

      <div style={containerStyle}>
        <div style={cardStyle}>
          <div style={eyebrow}>SERVEN LEGAL</div>

          <h1 style={title}>Terms of Service</h1>
          <p style={updatedText}>Last Updated: April 6, 2026</p>

          <p style={introText}>
            These Terms of Service govern your access to and use of Serven.
            By using the platform, selecting a subscription plan, or completing
            checkout, you agree to these terms.
          </p>

          <div style={section}>
            <h2 style={sectionTitle}>1. Platform Overview</h2>
            <p style={sectionText}>
              Serven provides restaurant analytics, forecasting, AI insights,
              optimization tools, reporting features, and related services
              designed to help restaurant operators improve visibility,
              performance, and profitability.
            </p>
          </div>

          <div style={section}>
            <h2 style={sectionTitle}>2. Subscription Plans</h2>
            <p style={sectionText}>
              Serven offers subscription-based access to its platform through
              Starter, Growth, and Pro AI plans.
            </p>
            <ul style={listStyle}>
              <li style={listItem}>
                <strong>Starter:</strong> billed monthly and may be canceled at
                any time before the next billing cycle.
              </li>
              <li style={listItem}>
                <strong>Growth:</strong> available in 6-month and 12-month
                commitment terms and billed monthly during the selected term.
              </li>
              <li style={listItem}>
                <strong>Pro AI:</strong> available in 6-month and 12-month
                commitment terms and billed monthly during the selected term.
              </li>
            </ul>
          </div>

          <div style={section}>
            <h2 style={sectionTitle}>3. Commitment Terms</h2>
            <p style={sectionText}>
              By selecting a Growth or Pro AI plan, you agree to the full
              commitment period associated with that plan.
            </p>
            <p style={sectionText}>
              If you choose a 6-month plan, you are responsible for 6 monthly
              payments. If you choose a 12-month plan, you are responsible for
              12 monthly payments.
            </p>
          </div>

          <div style={section}>
            <h2 style={sectionTitle}>4. Cancellation Policy</h2>
            <ul style={listStyle}>
              <li style={listItem}>
                <strong>Starter:</strong> may be canceled at any time, and future
                billing will stop at the end of the current billing period.
              </li>
              <li style={listItem}>
                <strong>Growth and Pro AI:</strong> cancellation will stop
                automatic renewal after the current term ends, but does not
                remove your obligation to complete all remaining payments in your
                selected commitment period.
              </li>
            </ul>
          </div>

          <div style={section}>
            <h2 style={sectionTitle}>5. Refund Policy</h2>
            <p style={sectionText}>
              All payments are non-refundable. This includes partial billing
              periods, prepaid time, and remaining commitment terms.
            </p>
          </div>

          <div style={section}>
            <h2 style={sectionTitle}>6. Data Usage</h2>
            <p style={sectionText}>
              Serven uses restaurant data you provide or connect in order to
              generate analytics, reports, AI insights, forecasts, and
              recommendations.
            </p>
            <p style={sectionText}>
              Serven does not sell your data. Data is used solely for
              platform functionality, service delivery, internal improvement, and
              product performance.
            </p>
          </div>

          <div style={section}>
            <h2 style={sectionTitle}>7. No Guarantee of Results</h2>
            <p style={sectionText}>
              Serven provides tools, insights, and recommendations intended
              to support decision-making. Actual financial, operational, or
              business outcomes may vary based on implementation, market
              conditions, restaurant operations, and other factors beyond our
              control.
            </p>
          </div>

          <div style={section}>
            <h2 style={sectionTitle}>8. Account Responsibility</h2>
            <p style={sectionText}>
              You are responsible for maintaining the confidentiality of your
              account, login credentials, and the accuracy of the data you
              provide to the platform.
            </p>
          </div>

          <div style={section}>
            <h2 style={sectionTitle}>9. Changes to Terms</h2>
            <p style={sectionText}>
              Serven may update these Terms of Service from time to time.
              Continued use of the platform after updates become effective
              constitutes acceptance of the revised terms.
            </p>
          </div>

          {/* 🔥 NEW REQUIRED SMS SECTION */}
          <div style={section}>
            <h2 style={sectionTitle}>10. SMS and Email Communications</h2>
            <p style={sectionText}>
              By opting in through a restaurant website, loyalty program,
              in-store signup, or promotional form, you consent to receive SMS
              and email communications related to promotions, offers, updates,
              and marketing campaigns.
            </p>
            <p style={sectionText}>
              Message frequency may vary. Message and data rates may apply. You
              can opt out of SMS communications at any time by replying STOP.
              For help, reply HELP.
            </p>
            <p style={sectionText}>
              Serven is not responsible for delayed or undelivered messages.
            </p>
          </div>

          <div style={section}>
            <h2 style={sectionTitle}>11. Contact</h2>
            <p style={sectionText}>
              For billing, legal, or support questions, contact:
            </p>
            <p style={contactText}>hello@servenai.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const pageStyle = {
  width: "100vw",
  minHeight: "100vh",
  padding: "60px 20px 80px",
  position: "relative",
  overflow: "hidden",
  background: `
    radial-gradient(circle at top, rgba(109,61,245,0.12), transparent 40%),
    linear-gradient(180deg, #f8fafc 0%, #eef2ff 45%, #ffffff 100%)
  `,
  marginLeft: "calc(-50vw + 50%)",
  paddingLeft: "max(20px, calc((100vw - 900px) / 2))",
  paddingRight: "max(20px, calc((100vw - 900px) / 2))",
  boxSizing: "border-box",
};

const backgroundGlowOne = {
  position: "absolute",
  top: "-100px",
  left: "-100px",
  width: "360px",
  height: "360px",
  borderRadius: "999px",
  background: "rgba(79,70,229,0.12)",
  filter: "blur(90px)",
  pointerEvents: "none",
};

const backgroundGlowTwo = {
  position: "absolute",
  top: "120px",
  right: "-100px",
  width: "320px",
  height: "320px",
  borderRadius: "999px",
  background: "rgba(168,85,247,0.12)",
  filter: "blur(90px)",
  pointerEvents: "none",
};

const containerStyle = {
  maxWidth: "900px",
  margin: "0 auto",
  position: "relative",
  zIndex: 1,
};

const cardStyle = {
  background: "rgba(255,255,255,0.92)",
  border: "1px solid #e2e8f0",
  borderRadius: "28px",
  boxShadow: "0 24px 60px rgba(15,23,42,0.08)",
  padding: "40px 32px",
  backdropFilter: "blur(10px)",
};

const eyebrow = {
  fontSize: "12px",
  fontWeight: "800",
  letterSpacing: "0.08em",
  color: "#6D3DF5",
  marginBottom: "14px",
};

const title = {
  fontSize: "42px",
  lineHeight: 1.1,
  fontWeight: "900",
  color: "#0f172a",
  margin: "0 0 10px 0",
};

const updatedText = {
  fontSize: "14px",
  color: "#64748b",
  marginBottom: "24px",
};

const introText = {
  fontSize: "16px",
  lineHeight: 1.8,
  color: "#475569",
  marginBottom: "30px",
};

const section = {
  marginBottom: "28px",
};

const sectionTitle = {
  fontSize: "22px",
  fontWeight: "800",
  color: "#0f172a",
  margin: "0 0 10px 0",
};

const sectionText = {
  fontSize: "15px",
  lineHeight: 1.8,
  color: "#475569",
  margin: "0 0 12px 0",
};

const listStyle = {
  margin: "0",
  paddingLeft: "20px",
};

const listItem = {
  fontSize: "15px",
  lineHeight: 1.8,
  color: "#475569",
  marginBottom: "8px",
};

const contactText = {
  fontSize: "16px",
  fontWeight: "700",
  color: "#6D3DF5",
  margin: 0,
};