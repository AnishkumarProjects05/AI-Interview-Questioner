import { Inter } from "next/font/google";
import "./globals.css";
import Provider from "./provider";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "AI-Interview Questioner",
  description: "AI Incorprated Interview ",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} antialiased`}
      >
        <Provider>{children}
          <Toaster />
        </Provider>
      </body>
    </html>
  );
}
