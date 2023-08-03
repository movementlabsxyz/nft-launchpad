import Link from "next/link"
import styles from "./footer.module.css"
import packageJSON from "../package.json"

export default function Footer() {
  return (
    <footer className="dark:text-gray-600 dark:bg-black p-10 w-full">
      <hr className="dark:border-0"/>
      <ul>
        <li>
          Copyright @ 2023.  Movementlabs.xyz
        </li>
      </ul>
    </footer>
  )
}
