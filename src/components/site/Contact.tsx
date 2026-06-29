import { useState } from "react";
import { useLanguage } from "@/lib/language";

export function Contact() {
  const { t } = useLanguage();
  const [form, setForm] = useState({ name: "", email: "", topic: "", message: "" });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `Hello Salah, my name is ${form.name} (${form.email}).%0A%0ATopic: ${form.topic}%0A%0A${form.message}`;
    window.open(`https://wa.me/237683693011?text=${text}`, "_blank");
  };

  return (
    <section id="contact" className="section-padding bg-white-sec">
      <div className="container-sj">
        <div className="sec-head text-center mb-14">
          <h6>{t("Contact", "Contact")}</h6>
          <h2>{t("Get In Touch", "Contactez-Moi")}</h2>
          <div className="underline" />
        </div>
        <div className="grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5 space-y-5">
            <ContactRow icon="fa-user" label={t("Name", "Nom")} value="Salah Junior" />
            <ContactRow icon="fa-phone" label={t("Phone", "Téléphone")} value="+237 683693011" href="tel:+237683693011" />
            <ContactRow icon="fa-envelope" label="Email" value="salahjuniorncham@gmail.com" href="mailto:salahjuniorncham@gmail.com" />
            <ContactRow icon="fa-whatsapp" brand label="WhatsApp" value="+237 683693011" href="https://wa.me/237683693011" />
            <div className="pt-6">
              <h6 className="text-[--brand] text-xs uppercase tracking-[0.3em] mb-4 font-semibold">{t("Connect with me", "Retrouvez-moi sur")}</h6>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { i: "fa-facebook-f", label: "Facebook", url: "https://www.facebook.com/profile.php?id=61586199631543" },
                  { i: "fa-github", label: "Github", url: "https://github.com/salahjuniordev" },
                  { i: "fa-instagram", label: "Instagram", url: "https://www.instagram.com/salahjuniordev?igsh=MWM2bW9xdmYzNWc2dg==" },
                  { i: "fa-whatsapp", label: "WhatsApp", url: "https://wa.me/qr/T7MI47J4OXDWK1" },
                ].map((s) => (
                  <a key={s.i} href={s.url} target="_blank" rel="noreferrer" className="card-light flex items-center gap-3 !p-4">
                    <i className={`fa-brands ${s.i} text-[--brand]`} />
                    <span className="text-sm text-[--ink]">{s.label}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="lg:col-span-7">
            <div className="card-light">
              <h4 className="text-2xl font-bold text-[--ink] mb-2">{t("Send Me a Message", "Envoyez-moi un message")}</h4>
              <p className="text-sm text-[#64748b] mb-6">
                {t("Fill in the form and it'll open directly in WhatsApp — no email needed.", "Remplissez le formulaire et il s'ouvrira directement dans WhatsApp.")}
              </p>
              <form onSubmit={submit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field icon="fa-user" label={t("Your Name", "Votre Nom")} placeholder="Salah Junior" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
                  <Field icon="fa-envelope" label={t("Your Email", "Votre E-mail")} type="email" placeholder="you@example.com" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
                </div>
                <Field icon="fa-tag" label={t("Topic / Subject", "Sujet / Objet")} placeholder={t("Web Development Project", "Projet de développement web")} value={form.topic} onChange={(v) => setForm({ ...form, topic: v })} />
                <Field icon="fa-comment" label={t("Your Message", "Votre Message")} placeholder={t("Tell me about your project...", "Parlez-moi de votre projet...")} value={form.message} onChange={(v) => setForm({ ...form, message: v })} textarea />
                <button type="submit" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-white font-medium transition w-full justify-center" style={{ background: "#128c7e" }} onMouseEnter={(e) => (e.currentTarget.style.background = "#075e54")} onMouseLeave={(e) => (e.currentTarget.style.background = "#128c7e")}>
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

function ContactRow({ icon, label, value, href, brand }: { icon: string; label: string; value: string; href?: string; brand?: boolean }) {
  const prefix = brand ? "fa-brands" : "fa-solid";
  const body = (
    <div className="card-light flex items-center gap-4 !p-5">
      <div className="w-12 h-12 rounded-full bg-[--brand]/12 grid place-items-center text-[--brand]">
        <i className={`${prefix} ${icon}`} />
      </div>
      <div>
        <div className="text-xs text-slate-500 uppercase tracking-wider">{label}</div>
        <div className="text-[--ink] font-medium">{value}</div>
      </div>
    </div>
  );
  return href ? <a href={href}>{body}</a> : body;
}

function Field({ icon, label, placeholder, value, onChange, type = "text", textarea }: { icon: string; label: string; placeholder: string; value: string; onChange: (v: string) => void; type?: string; textarea?: boolean }) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-wider text-slate-500 mb-2">{label}</label>
      <div className="form-field-wrap">
        <i className={`fa-solid ${icon} field-icon`} />
        {textarea ? (
          <textarea rows={5} className="form-field" placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} required />
        ) : (
          <input type={type} className="form-field" placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} required />
        )}
      </div>
    </div>
  );
}
