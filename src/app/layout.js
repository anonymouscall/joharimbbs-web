import "./globals.css";
import Providers from "../components/Providers";
import Navbar from "../components/Navbar";

export const metadata = {
  title: "Johari MBBS | Premium Medical Education",
  description: "Master MBBS with ease. Premium modules, courses, and clinical anatomy.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
