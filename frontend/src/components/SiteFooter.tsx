import React from 'react';
import { Phone, MessageCircle, Instagram } from 'lucide-react';

type Props = {
  onSupportTermsClick?: () => void;
  onTechSupportClick?: () => void;
  onContactsClick?: () => void; // отдельно сделаешь — сюда подключишь
};

export default function SiteFooter({
  onSupportTermsClick,
  onTechSupportClick,
  onContactsClick,
}: Props) {
  const phoneNumber = '+7 708 866 04 23';

  const call = () => (window.location.href = 'tel:+77088660423');
  const wa = () => window.open('https://wa.me/77088660423', '_blank');
  const ig = () =>
    window.open('https://www.instagram.com/parasat_business_club/', '_blank');

  return (
    <footer className="pb-footer">
      <div className="pb-footer__container">
        <div className="pb-footer__topline" />

        <div className="pb-footer__grid">
          {/* BRAND */}
          <div className="pb-footer__brand">
            <div className="pb-footer__mark">
              <div className="pb-footer__logoText">PARASAT</div>
              <div className="pb-footer__pill">BUSINESS CLUB</div>
            </div>
            <div className="pb-footer__desc">
              Закрытое сообщество предпринимателей, инвесторов и основателей. Связи, возможности и рост — в одном месте.
            </div>
          </div>

          {/* LINKS */}
          <div>
            <div className="pb-footer__blockTitle">Полезные ссылки</div>
            <div className="pb-footer__links">
              <button className="pb-footer__linkBtn" type="button" onClick={onSupportTermsClick}>
                Условия поддержки
              </button>
              <button className="pb-footer__linkBtn" type="button" onClick={onTechSupportClick}>
                Техподдержка
              </button>
            </div>
          </div>

          {/* CONTACTS */}
          <div>
            <div className="pb-footer__blockTitle">Связаться</div>

            <div className="pb-footer__contacts">
              <button className="pb-footer__contactRow" type="button" onClick={call}>
                <span className="pb-footer__iconWrap">
                  <Phone className="pb-footer__icon" />
                </span>
                <span className="pb-footer__contactText">
                  <span className="pb-footer__contactMain">{phoneNumber}</span>
                  <span className="pb-footer__contactSub">Позвонить</span>
                </span>
              </button>

              <button className="pb-footer__contactRow" type="button" onClick={wa}>
                <span className="pb-footer__iconWrap">
                  <MessageCircle className="pb-footer__icon" />
                </span>
                <span className="pb-footer__contactText">
                  <span className="pb-footer__contactMain">{phoneNumber}</span>
                  <span className="pb-footer__contactSub">WhatsApp</span>
                </span>
              </button>

              <div className="pb-footer__socialLine">
                <button className="pb-footer__socialBtn" type="button" onClick={ig} aria-label="Instagram">
                  <Instagram className="pb-footer__icon" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="pb-footer__bottom">
          <div>Все права защищены ©PARASAT, 2025</div>
          <div className="pb-footer__mini">Support • Privacy • Terms</div>
        </div>
      </div>
    </footer>
  );
}
