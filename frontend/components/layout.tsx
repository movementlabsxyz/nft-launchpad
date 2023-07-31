import Header from "./header"
import Footer from "./footer"
import type { ReactNode } from "react"

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main style={{ minHeight: "400px" }}>{children}</main>
      <ToastContainer />
      <Footer />
    </>
  )
}
