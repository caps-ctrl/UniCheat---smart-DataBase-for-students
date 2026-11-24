import { List } from "@/components/ui/List";
import { benefits } from "@/data/home/homePageData";
import { StudentNetwork } from "./StudentNetwork";

export function WhyUsSection() {
  return (
    <section
      id="oferta"
      className="relative scroll-mt-24 py-20 sm:py-24"
      aria-labelledby="why-us-title"
    >
      <div className="mb-10 max-w-2xl">
        <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-emerald-600">
          Razem studiuje się łatwiej
        </p>
        <h2
          id="why-us-title"
          className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl lg:text-5xl"
        >
          Dlaczego studenci wybierają{" "}
          <span className="text-emerald-600">uniCheat?</span>
        </h2>
        <p className="mt-4 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
          Wiedza, opinie i pomoc innych studentów — zebrane w jednym,
          przejrzystym miejscu.
        </p>
      </div>

      <div className="relative overflow-hidden rounded-[32px] border border-emerald-300/40 bg-gradient-to-br from-emerald-950 via-emerald-800 to-green-700 p-5 shadow-[0_24px_70px_rgba(6,78,59,0.25)] sm:p-8 lg:p-10">
        <div className="pointer-events-none absolute -top-32 right-0 h-72 w-72 rounded-full bg-lime-300/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-emerald-300/15 blur-3xl" />

        <div className="relative grid gap-8 md:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(260px,0.9fr)] lg:gap-7">
          <article className="flex flex-col items-center text-center">
            <div className="mb-5 min-h-16">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-200">
                Społeczność
              </p>
              <h3 className="mt-2 text-2xl font-bold text-white">
                Szybka wymiana notatek
              </h3>
            </div>
            <div className="h-[300px] w-full max-w-72 rounded-[40px] bg-white shadow-[0_18px_45px_rgba(2,44,34,0.3)]">
              <StudentNetwork />
            </div>
          </article>

          <article className="flex flex-col items-center text-center">
            <div className="mb-5 min-h-16">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-200">
                Sprawdzone opinie
              </p>
              <h3 className="mt-2 text-2xl font-bold text-white">
                Profile wykładowców
              </h3>
            </div>

            <div className="h-[300px] w-full max-w-72 rounded-2xl border border-white/70 bg-white/95 p-4 text-left text-emerald-950 shadow-[0_18px_45px_rgba(2,44,34,0.3)] backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="relative grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gradient-to-br from-emerald-200 to-green-500 font-bold text-emerald-950 ring-2 ring-white">
                  AK
                  <span className="absolute right-0 bottom-0 h-3 w-3 rounded-full border-2 border-white bg-lime-500" />
                </div>
                <div className="min-w-0">
                  <p className="truncate font-bold">dr Anna Kowalska</p>
                  <p className="text-xs text-emerald-700">
                    Matematyka • Wydział Informatyki
                  </p>
                </div>
              </div>

              <div className="mt-4 flex gap-2 text-xs">
                <span className="rounded-full bg-emerald-100 px-2.5 py-1 font-medium text-emerald-800">
                  ★ 4.8
                </span>
                <span className="rounded-full bg-lime-100 px-2.5 py-1 font-medium text-lime-800">
                  126 opinii
                </span>
              </div>
              {/*here*/}
              <div className="mt-3 border-t border-emerald-100 pt-3">
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-emerald-700">
                  Ostatnie komentarze
                </p>
                <ul className="space-y-2 text-xs">
                  <li className="rounded-xl bg-emerald-50 px-3 py-2">
                    <p className="font-semibold text-emerald-900">
                      Michał <span className="text-amber-500">★★★★★</span>
                    </p>
                    <p className="mt-0.5 leading-snug text-emerald-700">
                      Jasno tłumaczy i podaje dobre przykłady.
                    </p>
                  </li>
                  <li className="rounded-xl bg-lime-50 px-3 py-2">
                    <p className="font-semibold text-emerald-900">
                      Ola <span className="text-amber-500">★★★★☆</span>
                    </p>
                    <p className="mt-0.5 leading-snug text-emerald-700">
                      Konkretne zajęcia, warto robić notatki.
                    </p>
                  </li>
                </ul>
              </div>
            </div>
          </article>
          <article className="md:col-span-2">
            {/* here */}
            <div className="overflow-hidden rounded-2xl border border-white/20 bg-white/10 p-4 text-left shadow-[0_16px_40px_rgba(2,44,34,0.2)] backdrop-blur-sm sm:p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-lime-300 text-xl shadow-[0_8px_20px_rgba(163,230,53,0.2)]">
                    🔥
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-200">
                      Nieoficjalne wskazówki
                    </p>
                    <h3 className="mt-1 text-xl font-bold text-white">
                      Przecieki przed sesją
                    </h3>
                  </div>
                </div>
                <span className="w-fit rounded-full border border-lime-200/40 bg-lime-300/15 px-3 py-1 text-xs font-semibold text-lime-100">
                  2 nowe
                </span>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-white/15 bg-emerald-950/35 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-bold text-white">Bazy danych</p>
                    <span className="text-[11px] text-emerald-200">
                      12 min temu
                    </span>
                  </div>
                  <p className="mt-1 text-xs leading-5 text-emerald-100/85">
                    Warto powtórzyć JOIN-y i normalizację — podobno będą
                    kluczowe.
                  </p>
                </div>
                <div className="rounded-xl border border-white/15 bg-emerald-950/35 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-bold text-white">
                      Analiza matematyczna
                    </p>
                    <span className="text-[11px] text-emerald-200">
                      1 godz. temu
                    </span>
                  </div>
                  <p className="mt-1 text-xs leading-5 text-emerald-100/85">
                    Na ćwiczeniach mocno zaznaczono granice ciągów i pochodne.
                  </p>
                </div>
              </div>
            </div>
          </article>

          <div className="md:col-span-2 lg:col-span-1 lg:col-start-3 lg:row-start-1 lg:row-span-2 lg:border-l lg:border-white/20 lg:pl-7 [&>aside]:m-0 [&>aside]:h-full">
            {List(benefits)}
          </div>
        </div>
      </div>
    </section>
  );
}
