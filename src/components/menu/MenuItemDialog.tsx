import { formatINR } from "@/lib/format";
import { getImage } from "@/lib/images";
import { buildItemEnquiryMessage } from "@/lib/whatsapp";
import type { MenuItem } from "@/types";
import { Dialog } from "@/components/dialogs/Dialog";
import { Picture } from "@/components/media/Picture";
import { MenuBadges } from "@/components/menu/MenuBadges";
import { DietaryLabels, UnavailableNote } from "@/components/menu/DietaryLabels";
import { WhatsAppButton } from "@/components/buttons/WhatsAppButton";

interface MenuItemDialogProps {
  item: MenuItem | null;
  onClose: () => void;
}

/**
 * The item detail overlay (PRD §6.6).
 *
 * A bottom sheet on small screens and a centred panel on desktop, so it is easy
 * to dismiss with a thumb on mobile without reaching for a corner.
 */
export function MenuItemDialog({ item, onClose }: MenuItemDialogProps) {
  const image = getImage(item?.imageKey);

  return (
    <Dialog open={item !== null} onClose={onClose} labelledBy="menu-item-title" variant="sheet">
      {item && (
        <div className="flex flex-col md:flex-row">
          {image && (
            <Picture
              image={image}
              alt={item.name}
              aspect="4 / 3"
              sizes="(min-width: 768px) 480px, 100vw"
              priority
              className="w-full shrink-0 bg-sand md:aspect-auto md:w-[45%] md:self-stretch"
            />
          )}

          <div className="flex flex-1 flex-col gap-5 p-6 pt-7 md:p-9">
            <div className="flex flex-col gap-4">
              <MenuBadges badges={item.badges} />
              <div className="flex items-baseline justify-between gap-6">
                <h2
                  id="menu-item-title"
                  className="font-display text-[clamp(1.75rem,4vw,2.5rem)] leading-[1.05] tracking-[-0.015em]"
                >
                  {item.name}
                </h2>
                <p className="numeric shrink-0 text-lg font-medium text-coffee">
                  {formatINR(item.price)}
                </p>
              </div>
            </div>

            <p className="text-[0.9375rem] leading-relaxed text-espresso/70">{item.description}</p>

            <div className="flex flex-col gap-3 border-t border-taupe/70 pt-5">
              <div>
                <h3 className="text-micro font-medium tracking-[0.16em] text-espresso/70 uppercase">
                  Dietary information
                </h3>
                {item.dietaryLabels.length > 0 ? (
                  <DietaryLabels labels={item.dietaryLabels} className="mt-2" />
                ) : (
                  <p className="mt-2 text-caption text-espresso/70">
                    No dietary labels have been provided for this item. Please ask the team before
                    ordering.
                  </p>
                )}
              </div>

              {!item.isAvailable && <UnavailableNote note={item.availabilityNote} className="mt-1" />}
            </div>

            <div className="mt-auto pt-2">
              {item.isAvailable ? (
                <WhatsAppButton
                  message={buildItemEnquiryMessage(item.name, formatINR(item.price))}
                  variant="primary"
                  size="lg"
                  className="[--whatsapp-context:light]"
                >
                  Ask about this item
                </WhatsAppButton>
              ) : (
                <p className="text-caption text-espresso/70">
                  This item isn&rsquo;t available at the moment — message us and we&rsquo;ll let you
                  know when it returns.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </Dialog>
  );
}
