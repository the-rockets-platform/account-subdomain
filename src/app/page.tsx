'use client'

import { useEffect } from "react"

//@ts-expect-error
import ConfettiGenerator from "confetti-js";

export default function Home() {

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("newUser") === "Y") {
      const confetti = new ConfettiGenerator({target: "confeti-canvas", respawn: false, max: 40, size: 1.7, rotate: true, clock: 40});
      confetti.render();

      setTimeout(() => {
        const el = document.getElementById('confeti-canvas');
        if (el) {
          el.style.display = "none"
        }
        console.log("a");
        
      }, 6000);

      return () => {
        confetti.clear();
      }
    }
  }, []);

  return (
    <>
      <canvas id="confeti-canvas" className="fixed"></canvas>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <p>página inicial onde toda a mágina acontece</p>
        {/* <button onClick={() => signOut({callbackUrl: "/auth"})}>signout</button> */}
      </main>
    </>
  )
}
