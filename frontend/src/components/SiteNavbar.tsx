import { useMemo } from "react";

type NavItem = { key: string; label: string; to: any };

export default function SiteNavbar({
  navigateTo,
  current,
  isAuthed,
}: {
  navigateTo: (screen: any) => void;
  current?: string;
  isAuthed: boolean;
}) {
  const items = useMemo<NavItem[]>(
    () => [
      { key: "home", label: "Главная", to: "home" },
      { key: "parasat", label: "Parasat", to: "parasat" },
      { key: "feed", label: "Лента", to: "feed" },
      { key: "chats", label: "Чаты", to: "chats" },
      { key: "about", label: "О нас", to: "about" },
    ],
    []
  );

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="w-full backdrop-blur-xl bg-[#0a2cff]/70 shadow-[0_8px_30px_rgba(0,0,0,0.25)]">
        <div
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "18px 18px",
          }}
        >
          <div className="mx-auto max-w-6xl px-4">
            <div className="relative h-16 flex items-center justify-center">
              {/* LEFT BRAND — БОЛЬШЕ, В ДВЕ СТРОКИ */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 leading-none">
                <div
                  className="text-white text-[26px] tracking-[0.18em]"
                  style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                >
                  PARASAT
                </div>
                <div
                  className="text-white/90 text-[14px] tracking-[0.32em] mt-0.5"
                  style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                >
                  BUSINESS&nbsp;CLUB
                </div>
              </div>

              {/* CENTER NAV — ДРУГОЙ, МЯГКИЙ ШРИФТ */}
              <nav
                className="flex items-center text-[17px] tracking-wide text-white"
                style={{
                  fontFamily: "'Manrope', system-ui, sans-serif",
                  fontWeight: 600,
                }}
              >
                {items.map((it, idx) => {
                  const active = current === it.key || current === it.to;

                  return (
                    <div key={it.key} className="flex items-center">
                      <button
                        onClick={() => navigateTo(it.to)}
                        className={`relative px-3 py-1 transition-colors ${
                          active
                            ? "text-white"
                            : "text-white/80 hover:text-white"
                        }`}
                      >
                        {it.label}

                        {active && (
                          <span className="absolute left-3 right-3 -bottom-1 h-[2px] bg-white/80 rounded-full" />
                        )}
                      </button>

                      {idx !== items.length - 1 && (
                        <span className="mx-2 text-white/40 text-lg select-none">
                          •
                        </span>
                      )}
                    </div>
                  );
                })}

                {isAuthed && (
                  <>
                    <span className="mx-2 text-white/40 text-lg select-none">
                      •
                    </span>
                    <button onClick={() => navigateTo("profile")} className="relative px-3 py-1 text-white/80 hover:text-white transition-colors">
                      Профиль
                    </button>
                  </>
                )}
              </nav>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
