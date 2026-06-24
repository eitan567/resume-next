import Link from "next/link";

type SiteNavProps = {
  active: "home" | "resume";
};

export default function SiteNav({ active }: SiteNavProps) {
  return (
    <header className="siteNav">
      <Link className="siteBrand" href="/" aria-label="איתן ברון - דף פתיחה">
        <span className="siteBrandMark" aria-hidden="true">
          א
        </span>
        <span>איתן ברון</span>
      </Link>
      <nav className="siteNavLinks" aria-label="ניווט ראשי">
        <Link
          className={`siteNavLink${active === "home" ? " isActive" : ""}`}
          href="/"
        >
          פתיחה
        </Link>
        <Link
          className={`siteNavLink${active === "resume" ? " isActive" : ""}`}
          href="/resume"
        >
          קורות חיים
        </Link>
        <a className="siteNavCta" href="mailto:eitan2007@gmail.com">
          יצירת קשר
        </a>
      </nav>
    </header>
  );
}
