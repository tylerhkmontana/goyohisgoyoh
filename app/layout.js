import localFont from "next/font/local";
import Link from "next/link";
import Image from "next/image";
import TopNav from "@/components/top-nav";
import styles from "./layout.module.css";
import "@/styles/theme.css";
import "./globals.css";


const courier = localFont({
  src: "../fonts/Courier/CourierPrime-Regular.ttf",
  variable: "--font-courier",  
  display: "swap",
})

const pretendard = localFont({
  src: "../fonts/Pretendard/public/variable/PretendardVariable.ttf",
  variable: "--font-pretendard",  
  display: "swap",
})

const inter = localFont({
  src: "../fonts/Inter/InterVariable.ttf",
  variable: "--font-inter",  
  display: "swap",
})

export const metadata = {
  title: "goyohisgoyoh",
  description: "goyohisgoyoh's portfolio website",
  icons: {
    icon: [{ url: "/logo.png", type: "image/png" }],
    apple: [{ url: "/logo.png", type: "image/png" }],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${courier.variable} ${pretendard.variable} ${inter.variable}`}>
      <body>
        {
          
        }
        <TopNav />
        <Link href="/" className={styles.logo}><Image src="/logo.png" alt="GOYOH Logo" width={50} height={50} /></Link>
        {children}
        <footer>&copy; 2026 GOYOH</footer>
      </body>
    </html>
  );
}
