import "./globals.css";

export const metadata = {
  title: "OmniScale AI Gateway",
  description: "Autonomous Cloud Infrastructure & LLM Cost Optimizer",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
