// Plain POST form — no client JS needed. Middleware/session cookie is cleared
// by the /auth/sign-out route, which 303-redirects to /login/.
export function SignOutButton() {
  return (
    <form action="/auth/sign-out/" method="post">
      <button
        type="submit"
        className="rounded-full border border-line px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-body transition-colors hover:border-brass hover:text-brass"
      >
        Sign out
      </button>
    </form>
  );
}
