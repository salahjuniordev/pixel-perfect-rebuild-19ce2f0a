import { useState } from "react";
import { useLanguage } from "@/lib/language";

const socials = [
  { key: "facebook", icon: "fa-facebook-f", label: "Facebook", url: "https://www.facebook.com/profile.php?id=61586199631543", bg: "#1877F2", brand: true },
  { key: "github", icon: "fa-github", label: "Github", url: "https://github.com/salahjuniordev", bg: "#111827", brand: true },
  { key: "instagram", icon: "fa-instagram", label: "Instagram", url: "https://www.instagram.com/salahjuniordev", bg: "linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)", brand: true },
  { key: "whatsapp", icon: "fa-whatsapp", label: "WhatsApp", url: "https://wa.me/qr/T7MI47J4OXDWK1", bg: "#25D366", brand: true },
];

export function Contact() {
  const { t } = useLanguage();
  const [form, setForm] = useState({ name: "", email: "", topic: "", message: "" });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `Hello Salah, my name is ${form.name} (${form.email}).%0A%0ATopic: ${form.topic}%0A%0A${form.message}`;
    window.open(`https://wa.me/237683693011?text=${text}`, "_blank");
  };

  return (
    <section id="contact" className="contact-section">
      <div className="container-sj">
        <div className="services-head">
          <h2 className="services-title">{t("Get In Touch", "Contactez-Moi")}</h2>
          <div className="services-underline"><span /><span className="dot" /><span /></div>
        </div>

        <div className="grid lg:grid-cols-12 gap-10 items-start">
          {/* LEFT: info + socials */}
          <div className="lg:col-span-5 space-y-7">
            <ContactInfo icon="fa-user" label={t("Name", "Nom")} value="Salah Junior" />
            <ContactInfo icon="fa-phone" label={t("Phone", "Téléphone")} value="+237 683693011" href="tel:+237683693011" />
            <ContactInfo icon="fa-envelope" label="Email" value="salahjuniorncham@gmail.com" href="mailto:salahjuniorncham@gmail.com" />
            <ContactInfo icon="fa-whatsapp" brand label="WhatsApp" value="+237 683693011" href="https://wa.me/237683693011" />

            <div className="pt-4">
              <h3 className="contact-connect-title">{t("Connect with me", "Retrouvez-moi sur")}</h3>
              <div className="grid grid-cols-2 gap-4">
                {socials.map((s) => (
                  <a key={s.key} href={s.url} target="_blank" rel="noreferrer" className="contact-social-card">
                    <span className="contact-social-icon" style={{ background: s.bg }}>
                      <i className={`fa-brands ${s.icon}`} />
                    </span>
                    <span className="contact-social-label">{s.label}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: dark form card */}
          <div className="lg:col-span-7">
            <div className="contact-form-card">
              <h3 className="contact-form-title">{t("Send Me a Message", "Envoyez-moi un message")}</h3>
              <p className="contact-form-sub">
                {t("Fill in the form and it'll open directly in WhatsApp — no email needed.", "Remplissez le formulaire et il s'ouvrira directement dans WhatsApp.")}
              </p>
              <form onSubmit={submit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <Field icon="fa-user" label={t("Your Name", "Votre Nom")} placeholder="Salah Junior" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
                  <Field icon="fa-envelope" label={t("Your Email", "Votre E-mail")} type="email" placeholder="you@example.com" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
                </div>
                <Field icon="fa-tag" label={t("Topic / Subject", "Sujet / Objet")} placeholder={t("Web Development Project", "Projet de développement web")} value={form.topic} onChange={(v) => setForm({ ...form, topic: v })} />
                <Field icon="fa-comment" label={t("Your Message", "Votre Message")} placeholder={t("Tell me about your project...", "Parlez-moi de votre projet...")} value={form.message} onChange={(v) => setForm({ ...form, message: v })} textarea />
                <button type="submit" className="contact-submit-btn">
                  <i className="fa-brands fa-whatsapp" /> {t("Send via WhatsApp", "Envoyer via WhatsApp")}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactInfo({ icon, brand, label, value, href }: { icon: string; brand?: boolean; label: string; value: string; href?: string }) {
  const prefix = brand ? "fa-brands" : "fa-solid";
  const inner = (
    <div className="contact-info-row">
      <span className="contact-info-icon"><i className={`${prefix} ${icon}`} /></span>
      <div>
        <div className="contact-info-label">{label}</div>
        <div className="contact-info-value">{value}</div>
      </div>
    </div>
  );
  return href ? <a href={href} className="block">{inner}</a> : inner;
}

function Field({ icon, label, placeholder, value, onChange, type = "text", textarea }: { icon: string; label: string; placeholder: string; value: string; onChange: (v: string) => void; type?: string; textarea?: boolean }) {
  return (
    <div>
      <label className="contact-field-label">{label}</label>
      <div className="contact-field-wrap">
        <i className={`fa-solid ${icon} contact-field-icon`} />
        {textarea ? (
          <textarea rows={5} className="contact-field" placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} required maxLength={1000} />
        ) : (
          <input type={type} className="contact-field" placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} required maxLength={type === "email" ? 255 : 200} />
        )}
      </div>
    </div>
  );
}
