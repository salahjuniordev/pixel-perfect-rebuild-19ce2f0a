import { useLanguage } from "@/lib/language";
import { useResolvedSite } from "@/lib/site-settings";

export function WhatsAppFloat() {
  const { t } = useLanguage();
  const site = useResolvedSite();
  const phone = site.whatsappNumber;
  const message = encodeURIComponent(
    t(
      "Hello Salah, I'm interested in your services. Let's discuss my project!",
      "Bonjour Salah, je suis intéressé(e) par vos services. Discutons de mon projet !",
    ),
  );
  const url = `https://wa.me/${phone}?text=${message}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      aria-label={t("Chat on WhatsApp", "Discuter sur WhatsApp")}
      className="whatsapp-float"
    >
      <i className="fab fa-whatsapp" />
    </a>
  );
}
