import { getSite } from "@/lib/content";
import type { Messages } from "@/lib/messages";
import { telUrl, whatsappUrl } from "@/lib/whatsapp";
import { ButtonLink } from "../ui/Button";
import { PhoneIcon, WhatsAppIcon } from "../ui/icons";
import { Reveal } from "../ui/Motion";

type Props = {
  messages: Messages;
  title: string;
  body: string;
  /** Pre-filled WhatsApp text. */
  whatsappMessage: string;
  whatsappLabel: string;
};

/** Closing call-to-action: WhatsApp (primary) + call. */
export function CtaBand({ messages, title, body, whatsappMessage, whatsappLabel }: Props) {
  const site = getSite();
  return (
    <section className="pattern-navy text-cream">
      <Reveal className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
        <h2 className="font-display text-3xl font-semibold sm:text-4xl">{title}</h2>
        <p className="mx-auto mt-4 max-w-xl text-cream/80">{body}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <ButtonLink
            href={whatsappUrl(site.phone.whatsapp, whatsappMessage)}
            external
            variant="gold"
            icon={<WhatsAppIcon />}
          >
            {whatsappLabel}
          </ButtonLink>
          <ButtonLink href={telUrl(site.phone.e164)} variant="outlineLight" icon={<PhoneIcon />}>
            {messages.contact.call}: {site.phone.display}
          </ButtonLink>
        </div>
      </Reveal>
    </section>
  );
}
