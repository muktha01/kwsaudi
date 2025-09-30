// pages/login.js
import Head from 'next/head'
import Image from 'next/image'
export default function Login() {
  return (
    <>
      <Head>
        <title>login | Kw Saudi Arabia NEW</title>
      </Head>
      <div className="min-h-screen flex flex-col justify-center items-center bg-white text-black px-4 py-10">
        {/* LOGIN Text */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light tracking-wider mb-4 md:mb-6 lg:mb-10">
          LOGIN
        </h1>

        {/* Red underline */}
        <div className="w-24 sm:w-32 md:w-40 lg:w-48 h-[2px] bg-[rgb(206,32,39,255)] mb-6 md:mb-10 lg:mb-12" />

        {/* Google Login Button */}
        <button
          className="flex items-center justify-center border border-gray-300 px-4 sm:px-6 lg:px-8 py-2 lg:py-3 rounded-md shadow-sm hover:shadow-md transition-all text-sm sm:text-base lg:text-lg gap-2"
        >
        <div className="relative w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6">
  <Image
    src="https://developers.google.com/identity/images/g-logo.png"
    alt="Google"
    fill
    className="object-contain"
  />
</div>

          <span>Log in with Google</span>
        </button>

        {/* Bottom note */}
        <p className="mt-8 md:mt-10 text-[10px] sm:text-xs lg:text-sm text-center text-black/80 tracking-wide uppercase">
          Use only official KW mail ID only
        </p>
      </div>
    </>
  )
}
