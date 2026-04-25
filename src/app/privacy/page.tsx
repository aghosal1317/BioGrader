export const metadata = {
  title: "Privacy Policy — BioGrader",
}

export default function PrivacyPage() {
  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "40px 24px", fontFamily: "system-ui, sans-serif", color: "#111827", lineHeight: 1.7 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Privacy Policy</h1>
      <p style={{ color: "#6b7280", marginBottom: 32 }}>Last updated: April 2025</p>

      <p>BioGrader (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) is an AI-powered AP Biology practice tool. This Privacy Policy explains how we collect, use, and protect your information.</p>

      <h2 style={{ fontSize: 20, fontWeight: 700, marginTop: 32, marginBottom: 8 }}>Information We Collect</h2>
      <ul style={{ paddingLeft: 20 }}>
        <li><strong>Account information:</strong> name, email address, and hashed password when you register.</li>
        <li><strong>Practice data:</strong> your FRQ responses, MCQ answers, scores, and time spent practicing.</li>
        <li><strong>Usage data:</strong> which questions you attempt and when, used to calculate streaks and progress statistics.</li>
      </ul>

      <h2 style={{ fontSize: 20, fontWeight: 700, marginTop: 32, marginBottom: 8 }}>How We Use Your Information</h2>
      <ul style={{ paddingLeft: 20 }}>
        <li>To provide AI grading of your FRQ responses via Claude (Anthropic).</li>
        <li>To display your progress statistics within the app.</li>
        <li>To allow teachers to monitor student progress (if you were enrolled by a teacher).</li>
        <li>To send transactional emails such as password reset links.</li>
      </ul>
      <p>We do not sell your personal information to third parties.</p>

      <h2 style={{ fontSize: 20, fontWeight: 700, marginTop: 32, marginBottom: 8 }}>Third-Party Services</h2>
      <p>BioGrader uses the following third-party services:</p>
      <ul style={{ paddingLeft: 20 }}>
        <li><strong>Anthropic Claude API</strong> — AI grading of FRQ responses. Your answer text is sent to Anthropic to generate feedback. See <a href="https://www.anthropic.com/privacy" style={{ color: "#16a34a" }}>Anthropic&rsquo;s Privacy Policy</a>.</li>
        <li><strong>Vercel</strong> — hosting and infrastructure.</li>
        <li><strong>Neon / PostgreSQL</strong> — encrypted database storage.</li>
      </ul>

      <h2 style={{ fontSize: 20, fontWeight: 700, marginTop: 32, marginBottom: 8 }}>Data Retention and Deletion</h2>
      <p>You may delete your account at any time from the Profile tab in the app. Deleting your account permanently removes all your personal data, submissions, and progress statistics from our systems.</p>

      <h2 style={{ fontSize: 20, fontWeight: 700, marginTop: 32, marginBottom: 8 }}>Children&rsquo;s Privacy</h2>
      <p>BioGrader is intended for high school students (typically ages 14–18). We do not knowingly collect personal information from children under 13 without verifiable parental consent. If you believe a child under 13 has created an account, please contact us at <a href="mailto:support@biograder.app" style={{ color: "#16a34a" }}>support@biograder.app</a>.</p>

      <h2 style={{ fontSize: 20, fontWeight: 700, marginTop: 32, marginBottom: 8 }}>Security</h2>
      <p>Passwords are hashed using bcrypt and never stored in plaintext. Session tokens are stored securely. All data is transmitted over HTTPS.</p>

      <h2 style={{ fontSize: 20, fontWeight: 700, marginTop: 32, marginBottom: 8 }}>Contact</h2>
      <p>For privacy questions or data requests, contact us at <a href="mailto:support@biograder.app" style={{ color: "#16a34a" }}>support@biograder.app</a>.</p>

      <hr style={{ margin: "40px 0", borderColor: "#e5e7eb" }} />
      <p style={{ color: "#9ca3af", fontSize: 13 }}>
        AP® Biology Free-Response Questions © College Board. All rights reserved. AP® is a registered trademark of College Board. BioGrader is not affiliated with or endorsed by College Board.
      </p>
    </main>
  )
}
