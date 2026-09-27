"use client";

import { Icon } from "@/components/ui/Icon";
import { motion, useReducedMotion } from "framer-motion";

const values = [
  {
    icon: "users" as const,
    title: "Studenci dla studentów",
    description:
      "Budujemy rozwiązania na podstawie problemów, które sami znamy z zajęć, projektów i sesji.",
  },
  {
    icon: "book" as const,
    title: "Wiedza bez chaosu",
    description:
      "Porządkujemy materiały i doświadczenia tak, aby ważne informacje zawsze były pod ręką.",
  },
  {
    icon: "message" as const,
    title: "Otwarta społeczność",
    description:
      "Każda notatka, opinia i odpowiedź sprawia, że kolejnej osobie studiuje się trochę łatwiej.",
  },
];

export function AboutUsSection() {
  const shouldReduceMotion = useReducedMotion();
  const entranceTransition = {
    duration: shouldReduceMotion ? 0 : 0.8,
    ease: [0.22, 1, 0.36, 1] as const,
  };

  return (
    <motion.section
      id="o-nas"
      aria-labelledby="about-us-title"
      className="relative overflow-hidden -mt-[40vh] "
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.05 }}
    >
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-stretch lg:gap-10">
        <motion.div
          className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-emerald-950 via-emerald-800 to-green-700 p-7 text-white shadow-[0_24px_70px_rgba(6,78,59,0.22)] sm:p-10 lg:p-12"
          variants={{
            hidden: shouldReduceMotion
              ? { opacity: 1 }
              : { opacity: 0, x: "-110vw" },
            visible: { opacity: 1, x: 0 },
          }}
          transition={entranceTransition}
        >
          <div className="pointer-events-none absolute -top-24 -right-20 h-64 w-64 rounded-full bg-lime-300/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-28 -left-20 h-64 w-64 rounded-full bg-emerald-300/15 blur-3xl" />

          <div className="relative flex h-full min-h-[430px] flex-col">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-200">
              Poznaj uniCheat
            </p>
            <h2
              id="about-us-title"
              className="mt-4 max-w-lg text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl"
            >
              Tworzymy miejsce, którego sami potrzebowaliśmy.
            </h2>
            <p className="mt-6 max-w-xl text-base leading-7 text-emerald-50/80 sm:text-lg">
              uniCheat powstał z prostej obserwacji: wartościowa wiedza jest
              wszędzie, ale trudno do niej dotrzeć. Łączymy ją w jednej,
              przyjaznej przestrzeni stworzonej z myślą o studentach.
            </p>

            <div className="mt-auto pt-10">
              <div className="flex items-center gap-4 border-t border-white/15 pt-6">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-lime-300 font-black text-emerald-950">
                  uC
                </div>
                <div>
                  <p className="font-extrabold">Lokalnie i po studencku</p>
                  <p className="mt-1 text-sm text-emerald-100/70">
                    Projekt rozwijany blisko społeczności studenckiej
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="rounded-[32px] border border-emerald-100 bg-white p-6 shadow-[0_24px_70px_rgba(31,46,77,0.08)] sm:p-8 lg:p-10"
          variants={{
            hidden: shouldReduceMotion
              ? { opacity: 1 }
              : { opacity: 0, x: "110vw" },
            visible: { opacity: 1, x: 0 },
          }}
          transition={entranceTransition}
        >
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-600">
            Co jest dla nas ważne
          </p>
          <h3 className="mt-3 max-w-xl text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
            Technologia ma ułatwiać studia, a nie dodawać kolejny obowiązek.
          </h3>

          <ul className="mt-8 divide-y divide-emerald-100">
            {values.map((value, index) => (
              <li
                key={value.title}
                className="group grid gap-4 py-6 first:pt-0 last:pb-0 sm:grid-cols-[auto_1fr_auto] sm:items-start"
              >
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-700 transition-colors group-hover:bg-emerald-100">
                  <Icon name={value.icon} size={23} />
                </span>
                <div>
                  <h4 className="text-lg font-extrabold text-slate-950">
                    {value.title}
                  </h4>
                  <p className="mt-2 max-w-lg text-sm leading-6 text-slate-600 sm:text-base">
                    {value.description}
                  </p>
                </div>
                <span
                  aria-hidden="true"
                  className="hidden text-sm font-black text-emerald-200 sm:block"
                >
                  0{index + 1}
                </span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </motion.section>
  );
}
