export type ChannelType = "lecture" | "lab" | "exercises";

export type SubjectChannel = {
  type: ChannelType;
  label: string;
};

export type Subject = {
  name: string;
  slug: string;
  channels: SubjectChannel[];
  theme: "sand" | "blue" | "ink" | "violet";
  icon: "sigma" | "atom" | "code" | "flask";
};

export type Semester = {
  number: number;
  subjects: Subject[];
};

export const semesters: Semester[] = [
  {
    number: 1,
    subjects: [
      {
        name: "Matematyka stosowana ze statystyką",
        slug: "matematyka-stosowana-ze-statystyka",
        theme: "sand",
        icon: "sigma",
        channels: [
          {
            type: "lecture",
            label: "📖 Wykład",
          },
          {
            type: "lab",
            label: "🧮 Laboratorium",
          },
        ],
      },

      {
        name: "Fizyka dla informatyków",
        slug: "fizyka-dla-informatykow",
        theme: "blue",
        icon: "atom",
        channels: [
          {
            type: "lecture",
            label: "📖 Wykład",
          },
          {
            type: "lab",
            label: "🧪 Laboratorium",
          },
        ],
      },

      {
        name: "Algebra liniowa",
        slug: "algebra-liniowa",
        theme: "violet",
        icon: "sigma",
        channels: [
          {
            type: "lecture",
            label: "📖 Wykład",
          },
          {
            type: "exercises",
            label: "✏️ Ćwiczenia",
          },
        ],
      },

      {
        name: "Algorytmy 1",
        slug: "algorytmy-1",
        theme: "ink",
        icon: "code",
        channels: [
          {
            type: "lecture",
            label: "📖 Wykład",
          },
          {
            type: "lab",
            label: "💻 Laboratorium",
          },
        ],
      },
    ],
  },

  {
    number: 2,
    subjects: [],
  },
  {
    number: 3,
    subjects: [
      {
        name: "Algorytmy 2",
        slug: "algorytmy-2",
        theme: "ink",
        icon: "code",
        channels: [
          {
            type: "lecture",
            label: "📖 Wykład",
          },
          {
            type: "lab",
            label: "💻 Laboratorium",
          },
        ],
      },

      {
        name: "Architektura systemów komputerowych",
        slug: "architektura-systemow-komputerowych",
        theme: "blue",
        icon: "atom",
        channels: [
          {
            type: "lecture",
            label: "📖 Wykład",
          },
          {
            type: "lab",
            label: "💻 Laboratorium",
          },
        ],
      },

      {
        name: "Bazy danych 1",
        slug: "bazy-danych-1",
        theme: "ink",
        icon: "code",
        channels: [
          {
            type: "lecture",
            label: "📖 Wykład",
          },
          {
            type: "lab",
            label: "💻 Laboratorium",
          },
        ],
      },

      {
        name: "Język Java",
        slug: "jezyk-java",
        theme: "ink",
        icon: "code",
        channels: [
          {
            type: "lecture",
            label: "📖 Wykład",
          },
          {
            type: "lab",
            label: "💻 Laboratorium",
          },
        ],
      },

      {
        name: "Sieci komputerowe",
        slug: "sieci-komputerowe",
        theme: "blue",
        icon: "atom",
        channels: [
          {
            type: "lecture",
            label: "📖 Wykład",
          },
          {
            type: "lab",
            label: "💻 Laboratorium",
          },
        ],
      },

      {
        name: "Systemy operacyjne",
        slug: "systemy-operacyjne",
        theme: "ink",
        icon: "code",
        channels: [
          {
            type: "lecture",
            label: "📖 Wykład",
          },
          {
            type: "lab",
            label: "💻 Laboratorium",
          },
        ],
      },
    ],
  },
];
