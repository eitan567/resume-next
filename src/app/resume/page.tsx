import SiteNav from "../components/site-nav";

export default function ResumePage() {
  return (
    <main className="resumeShell">
      <SiteNav active="resume" />
      <section className="resumeFrameWrap" aria-label="קורות החיים האינטראקטיביים">
        <iframe
          className="legacyFrame"
          src="/legacy/index.html"
          title="קורות חיים - גרסת Legacy"
        />
      </section>
    </main>
  );
}
