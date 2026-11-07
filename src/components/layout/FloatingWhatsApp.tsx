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
      className="group fixed bottom-5 right-5 z-30 flex h-14 items-center rounded-full bg-[#128c4a] text-white shadow-lg shadow-black/25 transition-colors hover:bg-[#0f7a40] focus-visible:bg-[#0f7a40]"
    >
      {/* Label slides out to the left of the icon (the button is anchored to the right edge). */}
      <span
        aria-hidden
        className="max-w-0 overflow-hidden whitespace-nowrap pl-0 text-sm font-semibold opacity-0 transition-all duration-300 ease-out group-hover:max-w-64 group-hover:pl-5 group-hover:opacity-100 group-focus-visible:max-w-64 group-focus-visible:pl-5 group-focus-visible:opacity-100"
      >
        {messages.whatsapp.floatingLabel}
      </span>
      <span className="grid size-14 shrink-0 place-items-center">
        <WhatsAppIcon width={28} height={28} />
      </span>
    </a>
  );
}
