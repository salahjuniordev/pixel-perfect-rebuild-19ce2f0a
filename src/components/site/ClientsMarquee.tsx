import { useLanguage } from "@/lib/language";
import logoOursBlanc from "@/assets/logo-ours-blanc.png.asset.json";
import logoKbou from "@/assets/logo-kbou.png.asset.json";
import logoMario from "@/assets/logo-mario.png.asset.json";
import logoCoachJunior from "@/assets/logo-coach-junior.png.asset.json";
import logoManey from "@/assets/logo-maney.png.asset.json";

const clients = [
  { name: "L'Ours Blanc", logo: logoOursBlanc.url },
  { name: "K Bou Fitness Club", logo: logoKbou.url },
  { name: "Mario Digital Store", logo: logoMario.url },
  { name: "Coach Junior", logo: logoCoachJunior.url },
  { name: "Maney", logo: logoManey.url },
];

export function ClientsMarquee() {
  const { language } = useLanguage();
  const doubled = [...clients, ...clients, ...clients];

  return (
    <section className="py-20 bg-white overflow-hidden border-y border-slate-100">
      <div className="container px-4 mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 text-center">
          {language === "en" ? "Some of our clients" : "Quelques-uns de nos clients"}
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
