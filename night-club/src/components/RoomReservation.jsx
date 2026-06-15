import React from "react";
import { useLanguage } from "../i18n/LanguageContext";

export default function RoomReservation() {
  const { t } = useLanguage();

  const roomFeatures = [
    "Private house",
    "Private room",
    "Weekly rentals",
    "Monthly rental",
    "Long-term rental",
    "Bed linen + towels",
    "Own doorbell",
    "Wi-Fi",
    "Satellite TV + LCD TV",
    "Ladies' restroom",
    "Separate guest toilet",
    "Shower for sole use",
  ];

  const outdoorFeatures = [
    "discreet entrance",
    "Women's parking spaces",
    "Guest parking spaces",
    "Free parking in front of the house",
  ];

  const positionFeatures = [
    "City center, industrial area, near train station",
    "Max. 10 min walk: bus stop, pharmacy, bank, post office",
    "Supermarket, hairdresser, nail salon, tanning salon, gym, restaurant, cafe",
  ];

  return (
    <section className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-[#e4007c] relative font-sans">
      {/* Top horizontal line */}
      <div className="w-full h-[1px] bg-black/20 mb-8 max-w-[600px] mx-auto"></div>

      {/* Title */}
      <h2 className="text-center text-3xl sm:text-4xl lg:text-[40px] text-black mb-6 font-normal tracking-wide" style={{fontFamily: 'Times New Roman, Times, serif'}}>
        ROOM RESERVATION
      </h2>

      {/* Decorative line with star */}
      <div className="flex items-center justify-center gap-4 mb-10 max-w-[600px] mx-auto">
        <div className="flex-1 h-[1px] bg-black/30"></div>
        <div className="text-white text-lg">★</div>
        <div className="flex-1 h-[1px] bg-black/30"></div>
      </div>

      {/* Subtitle */}
      <h3 className="text-center text-base sm:text-[17px] font-bold text-black mb-4 tracking-wide">
        PASCHA BROTHEL BRAUNAU AM INN & SALZBURG
      </h3>

      {/* Description */}
      <div className="text-center mb-16 max-w-3xl mx-auto">
        <p className="text-sm sm:text-[15px] text-black mb-2 font-medium">
          Beautiful, approved rooms for rent to self-employed women
        </p>
        <p className="text-sm sm:text-[15px] text-black mb-2">
          – 100% private & discreet –
        </p>
        <p className="text-sm sm:text-[15px] text-black mt-4 font-medium">
          Deposit payable upon arrival!
        </p>
      </div>

      {/* Three Column Layout */}
      <div className="flex flex-col md:flex-row justify-center items-start gap-8 md:gap-0 mb-20 max-w-5xl mx-auto px-4">
        {/* ROOM Column */}
        <div className="flex-1 w-full md:px-8">
          <h4 className="text-base sm:text-[17px] font-bold text-black mb-6 uppercase">
            ROOM
          </h4>
          <ul className="space-y-2.5">
            {roomFeatures.map((feature, idx) => (
              <li
                key={idx}
                className="text-sm sm:text-[15px] text-black flex items-start gap-3"
              >
                <svg className="w-3.5 h-3.5 text-white shrink-0 mt-[3px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Separator */}
        <div className="hidden md:block w-[1px] bg-white/40 self-stretch min-h-[250px] my-2"></div>

        {/* OUTDOOR AREA Column */}
        <div className="flex-1 w-full md:px-8">
          <h4 className="text-base sm:text-[17px] font-bold text-black mb-6 uppercase">
            OUTDOOR AREA
          </h4>
          <ul className="space-y-2.5">
            {outdoorFeatures.map((feature, idx) => (
              <li
                key={idx}
                className="text-sm sm:text-[15px] text-black flex items-start gap-3"
              >
                <svg className="w-3.5 h-3.5 text-white shrink-0 mt-[3px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Separator */}
        <div className="hidden md:block w-[1px] bg-white/40 self-stretch min-h-[250px] my-2"></div>

        {/* POSITION Column */}
        <div className="flex-1 w-full md:px-8">
          <h4 className="text-base sm:text-[17px] font-bold text-black mb-6 uppercase">
            POSITION
          </h4>
          <ul className="space-y-2.5">
            {positionFeatures.map((feature, idx) => (
              <li
                key={idx}
                className="text-sm sm:text-[15px] text-black flex items-start gap-3"
              >
                <svg className="w-3.5 h-3.5 text-white shrink-0 mt-[3px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* NOTICE Section */}
      <div className="mb-16 max-w-4xl mx-auto px-4">
        <h4 className="text-base sm:text-[17px] font-bold text-black text-center mb-6">
          NOTICE
        </h4>
        <p className="text-sm sm:text-[15px] text-black text-center mb-6 leading-relaxed">
          At the Pascha brothel only women with official registration certificates work. The women provide sexual services
          independently, in their own names and for their own account.
        </p>
        <p className="text-sm sm:text-[15px] text-black text-center leading-relaxed">
          The company is in no way involved in the service relationship with the prostitutes and cannot influence it. All agreements
          regarding the type of services, the amount of compensation, and the method of payment, as well as complaints about
          sexual services, take place solely between the clients and the self-employed women.
        </p>
      </div>

      {/* Bottom decorative line with star */}
      <div className="flex items-center justify-center gap-4 max-w-[600px] mx-auto">
        <div className="flex-1 h-[1px] bg-black/30"></div>
        <div className="text-white text-lg">★</div>
        <div className="flex-1 h-[1px] bg-black/30"></div>
      </div>
    </section>
  );
}
