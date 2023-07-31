import { signIn } from "next-auth/react"

export default function AccessDenied() {
  return (
    <>
      <h3>Access Denied</h3>
      <p>
        <a
          href="/api/auth/signin"
          onClick={(e) => {
            e.preventDefault()
            signIn()
          }}
        >
          You must be signed in to view this page
        </a>
      </p>
    </>
  )
}
