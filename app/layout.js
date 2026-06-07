import "./globals.css";
import Provider from "./provider";
import { Toaster } from "sonner";

export const metadata = {
  title: "AI-Interview Questioner",
  description: "AI Incorprated Interview ",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className="antialiased"
      >
        <Provider>{children}
          <Toaster />
        </Provider>
      </body>
    </html>
  );
}
