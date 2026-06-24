import Image from "next/image";
import Link from "next/link";
import SiteNav from "./components/site-nav";

export default function Home() {
  return (
    <main className="landingShell">
      <SiteNav active="home" />
      <section className="landingHero" aria-labelledby="landing-title">
        <div className="landingCopy">
          <div className="landingProfile">
            <Image
              className="profileImage"
              src="/landing/eitan-profile.jpg"
              alt="איתן ברון"
              width={112}
              height={112}
              priority
            />
            <div className="profileMeta">
              <strong>איתן ברון</strong>
              <span>מפתח תוכנה · Full Stack · AI</span>
            </div>
          </div>
          <h1 id="landing-title">קורות חיים אינטראקטיביים למפתח תוכנה</h1>
          <p>
            כ-18 שנות ניסיון בפיתוח תוכנה, מערכות בנקאיות, Web ו-AI, מוצגים
            דרך חוויה חיה עם ייצוא, קריינות ושיחה חכמה.
          </p>
          <div className="landingActions">
            <Link className="primaryAction" href="/resume">
              כניסה לקורות החיים
            </Link>
            <a className="secondaryAction" href="mailto:eitan2007@gmail.com">
              יצירת קשר
            </a>
          </div>
        </div>
        <div className="previewStage">
          <Image
            className="resumePreviewImage"
            src="/landing/resume-preview.png"
            alt="תצוגה מקדימה של קורות החיים האינטראקטיביים"
            width={1280}
            height={900}
            priority
          />
        </div>
      </section>
      <section className="landingStrip" aria-label="תמצית">
        <p>
          ניסיון עמוק בפיתוח מערכות, ממשקי Web, אוטומציה ופתרונות AI בסביבה
          עסקית מורכבת.
        </p>
      </section>
    </main>
  );
}
