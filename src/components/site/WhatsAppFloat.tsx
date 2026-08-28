export function WhatsAppFloat() {
  const phone = "237683693011";
  const message = encodeURIComponent("Hello Salah, I'm interested in your services. Let's discuss my project!");
  const url = `https://wa.me/${phone}?text=${message}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="whatsapp-float"
    >
      <i className="fab fa-whatsapp" />
    </a>
  );
}
