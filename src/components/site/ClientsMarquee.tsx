import { useLanguage } from "@/lib/language";

const clients = [
  { name: "L'Ours Blanc", logo: "/assets/clients/logo-ours-blanc.png" },
  { name: "K Bou Fitness Club", logo: "/assets/clients/logo-kbou.jpg" },
  { name: "Mario Digital Store", logo: "/assets/clients/logo-mario.png" },
  { name: "Coach Junior", logo: "/assets/clients/logo-coach-junior.png" },
  { name: "Maney", logo: "/assets/clients/logo-maney.png" },
];

export function ClientsMarquee() {
  const { lang } = useLanguage();
  const doubled = [...clients, ...clients, ...clients];

  return (
    <section className="py-20 bg-white overflow-hidden border-y border-slate-100">
      <div className="container px-4 mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 text-center">
          {lang === "en" ? "Some of our clients" : "Quelques-uns de nos clients"}
        </h2>
      </div>

      <div className="relative flex w-full overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap py-4">
          {doubled.map((client, i) => (
            <div
              key={i}
              className="flex items-center justify-center mx-8 md:mx-16 w-32 md:w-48 grayscale hover:grayscale-0 transition-all duration-300"
            >
              <img
                src={client.logo}
                alt={client.name}
                title={client.name}
                className="max-h-16 md:max-h-24 w-auto object-contain"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
