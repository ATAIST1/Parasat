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
        { key: "about-us", label: "О нас", to: "about-us" },
    ],
    []
  );

  return (
    <header className="sn-nav">
      <div className="sn-nav__container">
        <div className="sn-nav__row">
          <button
            type="button"
            className="sn-nav__brand"
            onClick={() => navigateTo("home")}
            aria-label="Parasat Home"
          >
            <div className="sn-nav__brandTop">PARASAT</div>
            <div className="sn-nav__brandSub">BUSINESS CLUB</div>
          </button>

          <nav className="sn-nav__menu" aria-label="Main navigation">
            {items.map((it) => {
              const active = current === it.key || current === it.to;
              return (
                <button
                  key={it.key}
                  type="button"
                  onClick={() => {
                    if (it.key === 'home') {
                      window.open('https://parasat.club/', '_blank');
                      return;
                    }
                    navigateTo(it.to);
                  }}
                  className={`sn-nav__item ${active ? "sn-nav__item--active" : ""}`}
                >
                  {it.label}
                </button>
              );
            })}

            {isAuthed && (
              <button
                type="button"
                onClick={() => navigateTo("profile")}
                className={`sn-nav__item ${
                  current === "profile" ? "sn-nav__item--active" : ""
                }`}
              >
                Профиль
              </button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
