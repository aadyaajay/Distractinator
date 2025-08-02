(function () {
  const currentSite = window.location.hostname;

  // Only show popup once every X milliseconds
  let lastPopupTime = 0;
  const popupCooldown = 5 * 60 * 1000; // 5 minutes

  function isYouTubeEducational() {
    const title = document.title.toLowerCase();
    const eduKeywords = [
      "ktu", "lecture", "course", "math", "science",
      "programming", "history", "study", "revision",
      "class", "coding", "python", "css", "html", "study tips",
      "exam hacks"
    ];
    return eduKeywords.some(keyword => title.includes(keyword));
  }

  setInterval(() => {
    const now = Date.now();
    if (now - lastPopupTime < popupCooldown) return;

    const isProductive =
      productiveSites.some(site => currentSite.includes(site)) ||
      (currentSite.includes("youtube.com") &&
        window.location.href.includes("/watch") &&
        isYouTubeEducational());

    if (!isProductive) return;

    // Prevent duplicate popup
    if (document.getElementById("procrastinator-popup")) return;

    lastPopupTime = now; // Update last shown time

    const siteHost = Object.keys(siteSpecificMessages).find(key =>
      currentSite.includes(key)
    );

    const msg = siteHost
      ? siteSpecificMessages[siteHost][Math.floor(Math.random() * siteSpecificMessages[siteHost].length)]
      : generalMessages[Math.floor(Math.random() * generalMessages.length)];

    if (!msg) return;

    const link = distractionLinks[Math.floor(Math.random() * distractionLinks.length)];
    const image = chrome.runtime.getURL(distractionImages[Math.floor(Math.random() * distractionImages.length)]);
    
    // Optional: play sound
    // const audio = new Audio(chrome.runtime.getURL("sounds/alert.mp3"));
    // audio.play();

    const overlay = document.createElement("div");
    overlay.id = "procrastinator-popup";
    overlay.style = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background-color: rgba(255, 255, 255, 0);
      z-index: 999999;
      display: flex;
      justify-content: center;
      align-items: center;
      backdrop-filter: blur(10px);
    `;

    const popup = document.createElement("div");
    popup.innerHTML = `
      <div class="comic-container">
        <div class="burst burst-top-left"></div>
        <div class="burst burst-bottom-right"></div>

        <div class="dramatic-popup">
          <div id="typewriter-text" style="margin-bottom: 20px;"></div>
          <img src="${image}" class="popup-image">
          <button id="procrastinate-now">GIVE UP</button>
        </div>
      </div>
    `;

    overlay.appendChild(popup);
    document.body.appendChild(overlay);

    // Typewriter animation
    const typewriter = document.getElementById("typewriter-text");
    let i = 0;
    function typeText() {
      if (i < msg.length) {
        typewriter.innerHTML += msg.charAt(i);
        i++;
        setTimeout(typeText, 40);
      }
    }
    typeText();

    document.getElementById("procrastinate-now").onclick = () => {
      window.open(link, "_blank");
      overlay.remove();
    };

    overlay.onclick = (e) => {
      if (e.target === overlay) overlay.remove();
    };

    // Inject styles
    if (!document.getElementById("drama-style")) {
      const style = document.createElement("style");
      style.id = "drama-style";
      style.innerHTML = `
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Rubik:wght@700&display=swap');

        .comic-container {
          position: relative;
          max-width: 700px;
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .dramatic-popup {
          background: #000000ff; /* Light yellow */
          color: #000;
          padding: 50px;
          border-radius: 12px;
          text-align: center;
          font-family: 'Press Start 2P', cursive;
          font-size: 18px;
          box-shadow: -6px 6px 0px #222, 6px -6px 0px #222;
          max-width: 650px;
          transform-origin: center;
          animation: wobblePopup 1s ease-in-out;
          position: relative;
          border: 4px solid orange;
        }

        .burst {
          position: absolute;
          width: 150px;
          height: 150px;
          z-index: 1;
          clip-path: polygon(
            50% 0%, 58% 30%, 100% 20%, 65% 50%, 100% 80%, 58% 70%,
            50% 100%, 42% 70%, 0% 80%, 35% 50%, 0% 20%, 42% 30%
          );
        }

        .burst-top-left {
          background-color: red;
          top: -60px;
          left: -60px;
          transform: rotate(-10deg);
        }

        .burst-bottom-right {
          background-color: orange;
          bottom: -60px;
          right: -60px;
          transform: rotate(20deg);
        }

        .popup-image {
          width: 100%;
          max-height: 300px;
          object-fit: contain;
          border-radius: 12px;
          margin: 20px 0;
        }

        #procrastinate-now {
          background: #29941f;
          color: #fff;
          font-weight: bold;
          border: 3px solid #000;
          padding: 12px 26px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 20px;
          font-family: 'Rubik', sans-serif;
          box-shadow: 3px 3px 0px #000;
          transition: transform 0.2s ease;
        }

        #procrastinate-now:hover {
          transform: scale(1.05) rotate(1deg);
        }

        @keyframes wobblePopup {
          0% { transform: scale(0.8) rotate(-4deg); opacity: 0; }
          30% { transform: scale(1.1) rotate(3deg); opacity: 1; }
          60% { transform: scale(0.95) rotate(-2deg); }
          100% { transform: scale(1) rotate(0deg); }
        }

        #procrastinator-popup {
          backdrop-filter: blur(8px);
        }
      `;
      document.head.appendChild(style);
    }
  }, 10000); // Checks every 15s but only pops up based on cooldown
})();
