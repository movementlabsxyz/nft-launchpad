import Link from "next/link"
import { signIn, signOut, useSession } from "next-auth/react"
import styles from "./header.module.css"
import { useEffect, useState } from "react"

// The approach used in this component shows how to build a sign in and sign out
// component that works on pages which support both client and server side
// rendering, and avoids any flash incorrect content on initial page load.
export default function Header() {
  const { data: session, status } = useSession()
  const loading = status === "loading"

  const [navStatus, setNavStatus] = useState(0);

  useEffect(() => {
    console.log("navStatus =", navStatus);
  }, [navStatus]);

  return (
    <header>
      <nav className="bg-white border-gray-200 dark:bg-gray-900 border-b-2">
        <div className="flex flex-wrap items-center justify-between mx-auto p-4">
        <a href="/" className="flex items-center">
            <MvmtLogo/>
        </a>
        <div className="flex md:order-2">
          <button type="button" data-collapse-toggle="navbar-search" aria-controls="navbar-search" aria-expanded="false" className="md:hidden text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5 mr-1" >
            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
            </svg>
            <span className="sr-only">Search</span>
          </button>
          <div className="relative hidden md:block">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
              </svg>
              <span className="sr-only">Search icon</span>
            </div>
            <input type="text" id="search-navbar" className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search..."/>
          </div>
          <button data-collapse-toggle="navbar-search" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-search" aria-expanded="false">
              <span className="sr-only">Open main menu</span>
              <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15"/>
              </svg>
          </button>
        </div>
          <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-search">
            <div className="relative mt-3 md:hidden">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                </svg>
              </div>
              <input type="text" id="search-navbar" className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search..."/>
            </div>
            <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              <li>
                <Link href="/" className={(navStatus == 0 ? "text-blue-700" : "text-gray-900") + " block py-2 pl-3 pr-4  rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"} aria-current="page"
                  onClick={() => setNavStatus(0)}
                >Home</Link>
              </li>
              <li>
                <Link href="/creators" className={(navStatus == 1 ? "text-blue-700" : "text-gray-900") + " block py-2 pl-3 pr-4  rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"}
                  onClick={() => setNavStatus(1)}
                >Creators</Link>
              </li>
              <li>
                <Link href="/admins" className={(navStatus == 2 ? "text-blue-700" : "text-gray-900") + " block py-2 pl-3 pr-4  rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"}
                  onClick={() => setNavStatus(2)}
                >Admins</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  )  
}

const MvmtLogo = () => (  
  <svg width="221" height="36" viewBox="0 0 221 36" fill="black" xmlns="http://www.w3.org/2000/svg">
    <path d="M58.072 27.4209V6.9809H65.296L69.496 17.7609H70.056L74.228 6.9809H81.592V27.4209H76.44V9.9769L77.252 10.0329L71.988 23.3049H67.256L61.964 10.0329L62.832 9.9769V27.4209H58.072ZM93.2199 27.9809C91.8572 27.9809 90.6439 27.7756 89.5799 27.3649C88.5159 26.9542 87.6105 26.3849 86.8639 25.6569C86.1359 24.9289 85.5759 24.0889 85.1839 23.1369C84.8105 22.1849 84.6239 21.1676 84.6239 20.0849V19.4129C84.6239 18.2929 84.8199 17.2476 85.2119 16.2769C85.6225 15.3062 86.2012 14.4569 86.9479 13.7289C87.6945 13.0009 88.5999 12.4316 89.6639 12.0209C90.7279 11.6102 91.9132 11.4049 93.2199 11.4049C94.5452 11.4049 95.7305 11.6102 96.7759 12.0209C97.8399 12.4316 98.7452 13.0009 99.4919 13.7289C100.239 14.4569 100.808 15.3062 101.2 16.2769C101.611 17.2476 101.816 18.2929 101.816 19.4129V20.0849C101.816 21.1676 101.62 22.1849 101.228 23.1369C100.855 24.0889 100.295 24.9289 99.5479 25.6569C98.8199 26.3849 97.9239 26.9542 96.8599 27.3649C95.7959 27.7756 94.5825 27.9809 93.2199 27.9809ZM93.2199 23.7249C94.0039 23.7249 94.6479 23.5569 95.1519 23.2209C95.6745 22.8849 96.0665 22.4182 96.3279 21.8209C96.5892 21.2049 96.7199 20.5142 96.7199 19.7489C96.7199 18.9462 96.5799 18.2462 96.2999 17.6489C96.0385 17.0329 95.6465 16.5476 95.1239 16.1929C94.6012 15.8382 93.9665 15.6609 93.2199 15.6609C92.4732 15.6609 91.8385 15.8382 91.3159 16.1929C90.7932 16.5476 90.3919 17.0329 90.1119 17.6489C89.8505 18.2462 89.7199 18.9462 89.7199 19.7489C89.7199 20.5142 89.8505 21.2049 90.1119 21.8209C90.3732 22.4182 90.7652 22.8849 91.2879 23.2209C91.8105 23.5569 92.4545 23.7249 93.2199 23.7249ZM107.135 27.4209L102.711 11.9649H107.919L112.035 27.4209H107.135ZM108.759 27.4209V23.1649H113.715V27.4209H108.759ZM110.551 27.4209L114.051 11.9649H118.923L115.115 27.4209H110.551ZM128.155 27.9809C126.848 27.9809 125.691 27.7569 124.683 27.3089C123.675 26.8609 122.825 26.2542 122.135 25.4889C121.444 24.7236 120.912 23.8649 120.539 22.9129C120.184 21.9609 120.007 20.9809 120.007 19.9729V19.4129C120.007 18.3676 120.184 17.3689 120.539 16.4169C120.912 15.4462 121.435 14.5876 122.107 13.8409C122.797 13.0942 123.637 12.5062 124.627 12.0769C125.616 11.6289 126.736 11.4049 127.987 11.4049C129.648 11.4049 131.057 11.7782 132.215 12.5249C133.372 13.2716 134.259 14.2609 134.875 15.4929C135.491 16.7062 135.799 18.0316 135.799 19.4689V21.0929H122.135V18.3489H132.859L131.095 19.5809C131.095 18.7036 130.973 17.9662 130.731 17.3689C130.507 16.7529 130.161 16.2862 129.695 15.9689C129.247 15.6516 128.677 15.4929 127.987 15.4929C127.315 15.4929 126.727 15.6516 126.223 15.9689C125.737 16.2676 125.364 16.7342 125.103 17.3689C124.841 17.9849 124.711 18.7689 124.711 19.7209C124.711 20.5796 124.832 21.3262 125.075 21.9609C125.317 22.5769 125.691 23.0529 126.195 23.3889C126.699 23.7249 127.352 23.8929 128.155 23.8929C128.864 23.8929 129.443 23.7716 129.891 23.5289C130.357 23.2862 130.684 22.9596 130.871 22.5489H135.519C135.295 23.5942 134.847 24.5276 134.175 25.3489C133.521 26.1702 132.681 26.8142 131.655 27.2809C130.647 27.7476 129.48 27.9809 128.155 27.9809ZM138.485 27.4209V11.9649H142.517V18.6289H142.293C142.293 17.0236 142.489 15.6982 142.881 14.6529C143.291 13.5889 143.889 12.7956 144.673 12.2729C145.457 11.7316 146.418 11.4609 147.557 11.4609H147.781C148.938 11.4609 149.899 11.7316 150.665 12.2729C151.449 12.7956 152.037 13.5889 152.429 14.6529C152.839 15.6982 153.045 17.0236 153.045 18.6289H151.869C151.869 17.0236 152.065 15.6982 152.457 14.6529C152.867 13.5889 153.465 12.7956 154.249 12.2729C155.033 11.7316 155.994 11.4609 157.133 11.4609H157.357C158.514 11.4609 159.485 11.7316 160.269 12.2729C161.071 12.7956 161.678 13.5889 162.089 14.6529C162.518 15.6982 162.733 17.0236 162.733 18.6289V27.4209H157.637V18.4889C157.637 17.7796 157.441 17.1916 157.049 16.7249C156.675 16.2396 156.134 15.9969 155.425 15.9969C154.715 15.9969 154.155 16.2396 153.745 16.7249C153.353 17.1916 153.157 17.7982 153.157 18.5449V27.4209H148.061V18.4889C148.061 17.7796 147.865 17.1916 147.473 16.7249C147.099 16.2396 146.558 15.9969 145.849 15.9969C145.139 15.9969 144.579 16.2396 144.169 16.7249C143.777 17.1916 143.581 17.7982 143.581 18.5449V27.4209H138.485ZM173.409 27.9809C172.102 27.9809 170.945 27.7569 169.937 27.3089C168.929 26.8609 168.079 26.2542 167.389 25.4889C166.698 24.7236 166.166 23.8649 165.793 22.9129C165.438 21.9609 165.261 20.9809 165.261 19.9729V19.4129C165.261 18.3676 165.438 17.3689 165.793 16.4169C166.166 15.4462 166.689 14.5876 167.361 13.8409C168.051 13.0942 168.891 12.5062 169.881 12.0769C170.87 11.6289 171.99 11.4049 173.241 11.4049C174.902 11.4049 176.311 11.7782 177.469 12.5249C178.626 13.2716 179.513 14.2609 180.129 15.4929C180.745 16.7062 181.053 18.0316 181.053 19.4689V21.0929H167.389V18.3489H178.113L176.349 19.5809C176.349 18.7036 176.227 17.9662 175.985 17.3689C175.761 16.7529 175.415 16.2862 174.949 15.9689C174.501 15.6516 173.931 15.4929 173.241 15.4929C172.569 15.4929 171.981 15.6516 171.477 15.9689C170.991 16.2676 170.618 16.7342 170.357 17.3689C170.095 17.9849 169.965 18.7689 169.965 19.7209C169.965 20.5796 170.086 21.3262 170.329 21.9609C170.571 22.5769 170.945 23.0529 171.449 23.3889C171.953 23.7249 172.606 23.8929 173.409 23.8929C174.118 23.8929 174.697 23.7716 175.145 23.5289C175.611 23.2862 175.938 22.9596 176.125 22.5489H180.773C180.549 23.5942 180.101 24.5276 179.429 25.3489C178.775 26.1702 177.935 26.8142 176.909 27.2809C175.901 27.7476 174.734 27.9809 173.409 27.9809ZM183.739 27.4209V11.9649H187.771V18.6009H187.547C187.547 16.9956 187.752 15.6702 188.163 14.6249C188.573 13.5609 189.18 12.7676 189.983 12.2449C190.804 11.7222 191.793 11.4609 192.951 11.4609H193.175C194.929 11.4609 196.283 12.0489 197.235 13.2249C198.205 14.3822 198.691 16.1649 198.691 18.5729V27.4209H193.595V18.4329C193.595 17.7236 193.38 17.1449 192.951 16.6969C192.54 16.2302 191.971 15.9969 191.243 15.9969C190.515 15.9969 189.927 16.2302 189.479 16.6969C189.049 17.1449 188.835 17.7422 188.835 18.4889V27.4209H183.739ZM209.478 27.6449C207.798 27.6449 206.454 27.4396 205.446 27.0289C204.456 26.6182 203.738 25.9369 203.29 24.9849C202.842 24.0329 202.618 22.7449 202.618 21.1209L202.646 7.9329H207.35L207.322 21.2609C207.322 21.9516 207.499 22.4836 207.854 22.8569C208.227 23.2116 208.759 23.3889 209.45 23.3889H211.578V27.6449H209.478ZM200.378 15.6609V11.9649H211.578V15.6609H200.378ZM213.581 27.4209V21.8769H219.069V27.4209H213.581Z" />
    <circle cx="3.87842" cy="5.87826" r="2.74235" transform="rotate(45 3.87842 5.87826)" />
    <circle cx="9.48022" cy="11.3636" r="2.74235" transform="rotate(45 9.48022 11.3636)" />
    <circle cx="3.87842" cy="17.1517" r="2.74235" transform="rotate(45 3.87842 17.1517)" />
    <circle cx="15.082" cy="17.1517" r="2.74235" transform="rotate(45 15.082 17.1517)" />
    <circle cx="3.87842" cy="28.1214" r="2.74235" transform="rotate(45 3.87842 28.1214)" />
    <circle cx="37.49" cy="5.87826" r="2.74235" transform="rotate(45 37.49 5.87826)" />
    <circle cx="31.8879" cy="11.3636" r="2.74235" transform="rotate(45 31.8879 11.3636)" />
    <circle cx="26.2859" cy="17.1517" r="2.74235" transform="rotate(45 26.2859 17.1517)" />
    <circle cx="20.6841" cy="22.6371" r="2.74235" transform="rotate(45 20.6841 22.6371)" />
    <circle cx="37.49" cy="17.1517" r="2.74235" transform="rotate(45 37.49 17.1517)" />
    <circle cx="37.49" cy="28.1214" r="2.74235" transform="rotate(45 37.49 28.1214)" />
  </svg>
)