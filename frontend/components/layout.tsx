import Header from "./header"
import Footer from "./footer"
import type { ReactNode } from "react"

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="h-full w-full dark:bg-gray-700 min-h-screen">
      <Header />
      <main style={{ minHeight: "500px" }} className="p-3 dark:bg-gray-700 h-min">{children}</main>
      <ToastContainer />
      <Footer />
    </div>
  )
}
