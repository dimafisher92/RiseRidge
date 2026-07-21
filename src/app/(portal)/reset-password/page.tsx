import type { Metadata } from 'next';
import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { ResetPasswordForm } from '@/components/portal/ResetPasswordForm';

export const metadata: Metadata = {
  title: 'Reset password',
};

export default function ResetPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Link href="/" aria-label="RiseRidge home">
            <Logo />
          </Link>
        </div>

        <div className="rounded-[10px] border border-line bg-panel/40 p-7 shadow-[0_10px_34px_rgba(21,20,15,0.05)]">
          <h1 className="mb-1 font-display text-2xl font-semibold text-ink">Choose a new password</h1>
          <p className="mb-6 text-sm text-body">Set the password you’ll use to sign in to the portal.</p>
          <ResetPasswordForm />
        </div>
      </div>
    </main>
  );
}
