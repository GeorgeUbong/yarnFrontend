import { Jost, Poppins } from "next/font/google";

export const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
  display: "swap",
});

export const jost = Jost({
  subsets: ["latin"],
  variable: "--font-jost",
  display: "swap",
});
