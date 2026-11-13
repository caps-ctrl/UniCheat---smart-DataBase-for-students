"use client";

import {
  BadgeCheck,
  BookOpen,
  ChevronUp,
  Clock3,
  Flame,
  GraduationCap,
  MessageCircle,
  PenLine,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import styles from "./spolecznosc.module.css";

const categories = [
  { label: "Wszystkie", icon: Sparkles },
  { label: "Nauka", icon: BookOpen },
  { label: "Organizacja", icon: Clock3 },
  { label: "Życie studenckie", icon: Users },
  { label: "Praktyki i praca", icon: GraduationCap },
];

const initialPosts = [
  {
    id: 1,
    title: "Jak najlepiej przygotować się do kolokwium z algorytmów?",
    excerpt:
      "Mam dwa tygodnie do kolokwium. Czy warto skupić się bardziej na zadaniach z list, czy na teorii z wykładów?",
    category: "Nauka",
    tags: ["Algorytmy", "Informatyka", "3 semestr"],
    author: "Kacper M.",
    initials: "KM",
    time: "12 min temu",
    votes: 24,
    answers: 8,
    solved: true,
    hot: true,
  },
  {
    id: 2,
    title: "Zapisy na lektoraty — którą grupę polecacie?",
    excerpt:
      "Szukam grupy z angielskiego B2, najlepiej w godzinach popołudniowych. Jak wyglądają zajęcia i zaliczenie?",
    category: "Organizacja",
    tags: ["Lektorat", "Zapisy"],
    author: "Ola W.",
    initials: "OW",
    time: "38 min temu",
    votes: 11,
    answers: 5,
    solved: false,
    hot: false,
  },
  {
    id: 3,
    title: "Pierwsze praktyki frontendowe w Szczecinie",
    excerpt:
      "Gdzie warto aplikować bez komercyjnego doświadczenia? Mam kilka projektów w React i podstawy TypeScript.",
    category: "Praktyki i praca",
    tags: ["Frontend", "Praktyki", "React"],
    author: "Michał P.",
    initials: "MP",
    time: "1 godz. temu",
    votes: 37,
    answers: 14,
    solved: false,
    hot: true,
  },
  {
    id: 4,
    title: "Koło naukowe robotyki — nabór nowych osób",
    excerpt:
      "W przyszłym tygodniu organizujemy spotkanie otwarte. Nie musisz mieć doświadczenia, wystarczy ciekawość i chęć nauki.",
    category: "Życie studenckie",
    tags: ["Koło naukowe", "Robotyka"],
    author: "Natalia K.",
    initials: "NK",
    time: "3 godz. temu",
    votes: 42,
    answers: 9,
    solved: false,
    hot: true,
  },
  {
    id: 5,
    title: "Materiały do mechaniki budowli — czego brakuje?",
    excerpt:
      "Tworzę wspólne opracowanie wzorów i przykładów. Dajcie znać, które działy sprawiają Wam najwięcej problemów.",
    category: "Nauka",
    tags: ["Budownictwo", "Mechanika"],
    author: "Bartek S.",
    initials: "BS",
    time: "wczoraj",
    votes: 19,
    answers: 12,
    solved: true,
    hot: false,
  },
];

export default function CommunityForum() {
  const [activeCategory, setActiveCategory] = useState("Wszystkie");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("Najnowsze");
  const [votes, setVotes] = useState<Record<number, boolean>>({});

  const visiblePosts = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("pl");
    const filtered = initialPosts.filter((post) => {
      const matchesCategory =
        activeCategory === "Wszystkie" || post.category === activeCategory;
      const searchable = [post.title, post.excerpt, ...post.tags]
        .join(" ")
        .toLocaleLowerCase("pl");

      return matchesCategory && searchable.includes(normalizedQuery);
    });

    return [...filtered].sort((a, b) => {
      if (sort === "Popularne") return b.votes - a.votes;
      if (sort === "Najwięcej odpowiedzi") return b.answers - a.answers;
      return a.id - b.id;
    });
  }, [activeCategory, query, sort]);

  return (
    <div className={styles.forumLayout}>
      <section className={styles.forum} aria-labelledby="forum-title">
        <div className={styles.forumHeader}>
          <div>
            <h2 id="forum-title">Dyskusje społeczności</h2>
            <p>Znajdź temat albo rozpocznij własną rozmowę.</p>
          </div>
          <button className={styles.newPostButton} type="button">
            <PenLine size={17} aria-hidden="true" />
            Nowy post
          </button>
        </div>

        <label className={styles.search}>
          <Search size={19} aria-hidden="true" />
          <span className={styles.visuallyHidden}>Szukaj dyskusji</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Szukaj pytania, kierunku lub przedmiotu..."
          />
        </label>

        <div className={styles.categories} aria-label="Kategorie dyskusji">
          {categories.map((category) => {
            const Icon = category.icon;
            const isActive = activeCategory === category.label;

            return (
              <button
                key={category.label}
                type="button"
                className={isActive ? styles.categoryActive : styles.category}
                aria-pressed={isActive}
                onClick={() => setActiveCategory(category.label)}
              >
                <Icon size={15} aria-hidden="true" />
                {category.label}
              </button>
            );
          })}
        </div>

        <div className={styles.resultsHeader}>
          <span>
            <strong>{visiblePosts.length}</strong> aktywnych dyskusji
          </span>
          <label>
            <span>Sortuj:</span>
            <select value={sort} onChange={(event) => setSort(event.target.value)}>
              <option>Najnowsze</option>
              <option>Popularne</option>
              <option>Najwięcej odpowiedzi</option>
            </select>
          </label>
        </div>

        {visiblePosts.length > 0 ? (
          <div className={styles.postList}>
            {visiblePosts.map((post) => {
              const hasVoted = Boolean(votes[post.id]);

              return (
                <article className={styles.post} key={post.id}>
                  <button
                    type="button"
                    className={hasVoted ? styles.voteActive : styles.vote}
                    aria-label={
                      hasVoted
                        ? `Cofnij głos na: ${post.title}`
                        : `Oddaj głos na: ${post.title}`
                    }
                    aria-pressed={hasVoted}
                    onClick={() =>
                      setVotes((current) => ({
                        ...current,
                        [post.id]: !current[post.id],
                      }))
                    }
                  >
                    <ChevronUp size={20} aria-hidden="true" />
                    <strong>{post.votes + (hasVoted ? 1 : 0)}</strong>
                  </button>

                  <div className={styles.postContent}>
                    <div className={styles.postMeta}>
                      <span className={styles.avatar} aria-hidden="true">
                        {post.initials}
                      </span>
                      <span><strong>{post.author}</strong> · {post.time}</span>
                      <span className={styles.categoryBadge}>{post.category}</span>
                      {post.hot && (
                        <span className={styles.hotBadge}>
                          <Flame size={12} aria-hidden="true" />
                          Popularne
                        </span>
                      )}
                    </div>
                    <h3>{post.title}</h3>
                    <p>{post.excerpt}</p>
                    <div className={styles.postFooter}>
                      <div className={styles.tags}>
                        {post.tags.map((tag) => <span key={tag}>{tag}</span>)}
                      </div>
                      <span className={styles.answers}>
                        <MessageCircle size={15} aria-hidden="true" />
                        {post.answers} odpowiedzi
                        {post.solved && (
                          <small>
                            <BadgeCheck size={14} aria-hidden="true" />
                            Rozwiązane
                          </small>
                        )}
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <Search size={28} aria-hidden="true" />
            <h3>Nie znaleźliśmy takiej dyskusji</h3>
            <p>Spróbuj innej frazy albo zmień kategorię.</p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setActiveCategory("Wszystkie");
              }}
            >
              Pokaż wszystkie dyskusje
            </button>
          </div>
        )}
      </section>

      <aside className={styles.sidebar}>
        <section className={styles.sidebarCard}>
          <div className={styles.sidebarHeading}>
            <Flame size={18} aria-hidden="true" />
            <h2>Popularne teraz</h2>
          </div>
          <ol className={styles.trendingList}>
            <li>
              <span>01</span>
              <div><strong>#sesja-letnia</strong><small>128 postów</small></div>
            </li>
            <li>
              <span>02</span>
              <div><strong>#praktyki-2026</strong><small>94 posty</small></div>
            </li>
            <li>
              <span>03</span>
              <div><strong>#algorytmy</strong><small>76 postów</small></div>
            </li>
            <li>
              <span>04</span>
              <div><strong>#akademik</strong><small>51 postów</small></div>
            </li>
          </ol>
        </section>

        <section className={styles.rulesCard}>
          <ShieldCheck size={22} aria-hidden="true" />
          <h2>Dobra społeczność zaczyna się od szacunku</h2>
          <p>
            Pisz rzeczowo, pomagaj innym i nie publikuj materiałów naruszających
            prawa autorów ani zasady uczelni.
          </p>
          <button type="button">Poznaj zasady</button>
        </section>

        <section className={styles.onlineCard}>
          <span className={styles.onlineDot} />
          <div>
            <strong>184 osoby online</strong>
            <p>Średni czas odpowiedzi: 18 minut</p>
          </div>
        </section>
      </aside>
    </div>
  );
}
