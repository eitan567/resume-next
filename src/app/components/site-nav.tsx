"use client";

import type { MouseEvent } from "react";
import Link from "next/link";

type SiteNavProps = {
  active: "home" | "resume";
};

type LegacyResumeWindow = Window & {
  openModal?: (which: string) => void;
};

function openLegacyContact(event: MouseEvent<HTMLButtonElement>) {
  event.preventDefault();

  const frame = document.querySelector<HTMLIFrameElement>(".legacyFrame");
  const legacyWindow = frame?.contentWindow as LegacyResumeWindow | null;

  if (legacyWindow?.openModal) {
    legacyWindow.openModal("contact");
    return;
  }

  const contactButton = frame?.contentDocument?.getElementById("btnContact");
  if (contactButton instanceof HTMLButtonElement) {
    contactButton.click();
  }
}

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
        {active === "resume" ? (
          <button className="siteNavCta" type="button" onClick={openLegacyContact}>
            יצירת קשר
          </button>
        ) : (
          <a className="siteNavCta" href="mailto:eitan2007@gmail.com">
            יצירת קשר
          </a>
        )}
      </nav>
    </header>
  );
}
