import { getSite } from "@/lib/content";
import type { Messages } from "@/lib/messages";
import { whatsappUrl } from "@/lib/whatsapp";
import { WhatsAppIcon } from "../ui/icons";

/** Always-visible WhatsApp button: the main conversion action for this business. */
export function FloatingWhatsApp({ messages }: { messages: Messages }) {
  const site = getSite();
  return (
    <a
      href={whatsappUrl(site.phone.whatsapp, messages.whatsapp.generic)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={messages.whatsapp.floatingLabel}
      className="fixed bottom-5 right-5 z-30 grid size-14 place-items-center rounded-full bg-[#128c4a] text-white shadow-lg shadow-black/25 transition-transform hover:scale-105"
    >
      <WhatsAppIcon width={28} height={28} />
    </a>
  );
}
