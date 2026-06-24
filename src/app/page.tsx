import Link from "next/link";
import SiteNav from "./components/site-nav";

export default function Home() {
  return (
    <main className="landingShell">
      <SiteNav active="home" />
      <section className="landingHero" aria-labelledby="landing-title">
        <div className="landingCopy">
          <h1 id="landing-title">קורות חיים אינטראקטיביים שמרגישים חיים</h1>
          <p>
            חוויה עברית, קולית וחכמה שמציגה ניסיון, יכולות וסיפור מקצועי
            במקום עוד מסמך סטטי.
          </p>
          <div className="landingActions">
            <Link className="primaryAction" href="/resume">
              לצפייה בקורות החיים
            </Link>
            <a className="secondaryAction" href="mailto:eitan2007@gmail.com">
              יצירת קשר
            </a>
          </div>
        </div>
        <div className="heroVisual" aria-hidden="true">
          <div className="visualDocument">
            <div className="visualHeader">
              <span />
              <span />
              <span />
            </div>
            <div className="visualTitle" />
            <div className="visualLine wide" />
            <div className="visualLine" />
            <div className="visualSignal">
              <i />
              <i />
              <i />
              <i />
              <i />
            </div>
            <div className="visualGrid">
              <span />
              <span />
              <span />
              <span />
            </div>
          </div>
        </div>
      </section>
      <section className="landingStrip" aria-label="תמצית">
        <p>מפתח Full Stack עם ניסיון ב־AI, מערכות Web, אוטומציה וחוויות מוצר אינטראקטיביות.</p>
      </section>
    </main>
  );
}
