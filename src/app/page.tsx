import pkg from "../../package.json";

const sourceRepo = "eitan567/resume-next";

function shortCommit(sha: string | undefined) {
  return sha ? sha.slice(0, 7) : "local";
}

export default function Home() {
  const vercelRepoOwner = process.env.VERCEL_GIT_REPO_OWNER;
  const vercelRepoSlug = process.env.VERCEL_GIT_REPO_SLUG;
  const vercelRepo =
    vercelRepoOwner && vercelRepoSlug
      ? `${vercelRepoOwner}/${vercelRepoSlug}`
      : "manual/local";
  const commitRef = process.env.VERCEL_GIT_COMMIT_REF || "local";
  const commitSha = shortCommit(process.env.VERCEL_GIT_COMMIT_SHA);

  return (
    <main className="legacyHost">
      <aside
        aria-label={`Deployment version resume-next ${pkg.version} from ${sourceRepo}`}
        className="deploymentBadge"
        dir="ltr"
      >
        <strong>resume-next v{pkg.version}</strong>
        <span>src {sourceRepo}</span>
        <span>
          vc {vercelRepo} {commitRef}@{commitSha}
        </span>
      </aside>
      <iframe
        className="legacyFrame"
        src="/legacy/index.html"
        title="קורות חיים - גרסת Legacy"
      />
    </main>
  );
}
