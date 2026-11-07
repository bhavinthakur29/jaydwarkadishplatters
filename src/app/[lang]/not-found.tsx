import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";

// Bilingual-safe: shown for any unknown URL under a locale. Kept simple and static.
export default function NotFound() {
  return (
    <section className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="font-display text-6xl font-semibold text-gold-dark">404</p>
      <h1 className="mt-4 font-display text-3xl font-semibold text-navy">Page not found</h1>
      <p className="mt-3 text-navy-deep/75">
        We couldn&apos;t find that page. Try our home page or message us on WhatsApp.
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <ButtonLink href="/" variant="navy">
          Home
        </ButtonLink>
        <Link href="/hi" className="rounded-full px-4 py-3 text-sm text-navy hover:underline">
          हिन्दी
        </Link>
        <Link href="/gu" className="rounded-full px-4 py-3 text-sm text-navy hover:underline">
          ગુજરાતી
        </Link>
      </div>
    </section>
  );
}
