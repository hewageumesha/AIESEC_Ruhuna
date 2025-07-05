import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CountUp from 'react-countup';
import PropTypes from 'prop-types';

// Constants for static data
const IMAGES = [
  "image-g-1.jpg",
  "image-g-2.jpg",
  "image-g-3.jpg",
  "image-g-4.jpg",
  "image-g-5.jpg",
  "image-g-6.jpg",
  "image-g-7.jpg", 
  "image-g-6.jpg",
  "image-g-1.jpg",
  "image-g-3.jpg",
  "image-g-2.jpg",
  "image-g-5.jpg",
  "image-g-4.jpg"
];

const IMAGE_POSITIONS = [
  { gridColumn: "1", gridRow: "1" },
  { gridColumn: "2", gridRow: "1" },
  { gridColumn: "3 / span 2", gridRow: "1" },
  { gridColumn: "5", gridRow: "1" },
  { gridColumn: "2", gridRow: "2" },
  { gridColumn: "3", gridRow: "2" },
  { gridColumn: "4", gridRow: "2" },
  { gridColumn: "1", gridRow: "3" },
  { gridColumn: "2 / span 2", gridRow: "3" }
];

const INITIAL_FAQS = [
  {
    question: "What is AIESEC?",
    answer: "AIESEC is a global platform for young people to explore and develop their leadership potential. We are a non-political, independent, not-for-profit organization run by students and recent graduates of institutions of higher education. Its members are interested in world issues, leadership and management. AIESEC does not discriminate on the basis of ethnicity, gender, sexual orientation, religion or national/social origin.\n\nSince we were founded, we have engaged and developed over 1,000,000 young people who have been through an AIESEC experience. The impact of our organization can be seen through our alumni who represent business, NGO and world leaders, including one Nobel Peace Prize laureate, Martti Ahtisaari of Finland.",
    isOpen: false
  },
  {
    question: "What does AIESEC stand for?",
    answer: "AIESEC (pronounced eye-sek) was originally an acronym for Association Internationale des Étudiants en Sciences Économiques et Commerciales. AIESEC is no longer used as an acronym but simply as the name of the organization.\n\nMembers of AIESEC are known as 'AIESECers.'",
    isOpen: false
  },
  {
    question: "Youth Run",
    answer: "We are a global network of young leaders under the age of 30 who strive to better themselves and the communities around them. We are passionate about world issues, leadership development, cultural understanding and experiential learning. \n\nThe organization spans 126 countries/territories and territories and every aspect of AIESEC's operations are managed by students and recent graduates. \n\nWe have operated in this way since our inception, making us uniquely 'by young people, for young people', for over 65 years. The global leadership teams are elected by the membership annually.",
    isOpen: false
  },
  {
    question: "Independent & Non Partisan",
    answer: "AIESEC as a global network is not a subsidiary or an entity that is dependent on any other bodies in its work, sustainability or decision-making. \n\nAIESEC chooses peace above all and therefore does not have a pre-defined or officially accepted political tendency or subscription. \n\nWe are in consultative status with the United Nations Economic and Social Council (ECOSOC), affiliated with the UN DPI, member of ICMYO, and is recognised by UNESCO.",
    isOpen: false
  },
  {
    question: "Origins",
    answer: "AIESEC was founded in 1948 in 7 countries/territories in Europe by Jean Choplin (France), Bengt Sjøstrand (Sweden), and Dr. Albert Kaltenthaler (Germany). \n\nOver 77 years later we are present in 100+ countries and territories.",
    isOpen: false
  },
  {
    question: "Who can be an AIESECer?",
    answer: "Anyone who believes in the AIESEC vision, supports the mission of AIESEC, and lives by the AIESEC values is a part of the youth leadership movement, and hence is an AIESECer. They can be our partners who relate to our organizational values and vision, or it can be our parents who constantly support us to give our best to our leadership development journeys.",
    isOpen: false
  }
];

const TEAM_MEMBERS = [
  { name: "Nadith Jayasundara", role: "LCVP iGV B2B & VD", img: "LCVP1.png" },
  { name: "Tiyanie Sahabandu", role: "LCVP iGV M & IR", img: "LCVP2.png" },
  { name: "Sandaru Gangul", role: "LCVP iGT B2B & VD", img: "LCVP3.png" },
  { name: "Rukshi Withana", role: "LCVP iGT M & IR", img: "LCVP4.png" },
  { name: "Navodha Sandaru", role: "LCVP oGV B2C", img: "LCVP5.png" },
  { name: "Thisari Thamoda", role: "LCVP oGV PS", img: "LCVP6.png" },
  { name: "Dilma Salpadoru", role: "LCVP oGT B2C", img: "LCVP7.png" },
  { name: "Ranudi Uyangoda", role: "LCVP oGT PS", img: "LCVP8.png" },
  { name: "Gagana Tharupathi", role: "LCVP MKT", img: "LCVP9.png" },
  { name: "Thisura Daksina", role: "LCVP TM", img: "LCVP10.png" },
  { name: "Parami Sigera", role: "LCVP BD", img: "LCVP11.png" },
  { name: "Akila Nissanka", role: "LCVP ED", img: "LCVP12.png" },
  { name: "Lakshitha Wijethunga", role: "LCVP FnL", img: "LCVP13.png" },
  { name: "Nethma Dewni", role: "LCVP PR", img: "LCVP14.png" },
];

const HISTORY_TIMELINE = [
  {
    year: "2014",
    title: "The Beginning: Where Dreams Took Root",
    description: [
      "In 2014, a small but passionate group of students from the University of Ruhuna came together with one bold vision to create global leaders.",
      "With drive and dedication, we launched our first global volunteer project Diriya 1.0, which left a meaningful impact in our community.",
      "The chapter also sent off its first global volunteer, Varuna Kapuge, to Thailand, opening a gateway to global experiences."
    ],
    image: "/history/1948.webp"
  },
  {
    year: "2016",
    title: "Growing Stronger: The Rise to Expansion",
    description: [
      "By 2016, the chapter began gaining momentum. Under the leadership of Varuna Kapuge, we not only increased our exchange programs but made our mark on the national AIESEC platform.",
      "This term got 8 global volunteer (iGV) exchanges and a growing presence in the Sri Lankan AIESEC network.",
      "Our efforts paid off in 2017 when we were officially recognized as an Official Expansion in AIESEC Sri Lanka."
    ],
    image: "/history/1977.webp"
  },
  {
    year: "2017",
    title: "Bigger Vision, Deeper Impact",
    description: [
      "Recognition brought bigger responsibilities. From 2017 to 2019, led by Thilina Pabasara and Lahiru Sandipa, our executive boards focused on bold outreach and impactful projects.",
      "We accomplished a record 40 iGV RE and 9 oGV RE exchanges in 2017.18, and 38 iGV RE and 2 oGV RE in 2018.19.",
      "A proud moment came with our first Youth Speak Forum, uniting youth and leaders to discuss global issues.",
      "We also created our official logo, designed by Pasan Samarakkodi, symbolizing our heritage and purpose."
    ],
    image: "/history/2010.webp"
  },
  {
    year: "2019",
    title: "National Stage & Digital Innovation",
    description: [
      "From 2019 to 2020, we stepped onto the national stage. Under Dasuna Samarasekara, the chapter achieved 9 iGV and 20 oGV exchanges.",
      "We were honored with:",
      "- Most Progressive Expansion Award",
      "- Most Disruptive Outgoing Global Volunteer Award",
      "at the NLDS Awards 2019, validating our leadership and innovation.",
      "We also made our creative debut on YouTube with our first chapter roll-call video, keeping our identity alive in the digital space."
    ],
    image: "/history/2015.webp"
  },
  {
    year: "2022",
    title: "Resilience in a Pandemic",
    description: [
      "COVID-19 changed everything but not our spirit. Under the leadership of Janitha Abeysinghe and Lahiru Dasanayaka, we pivoted to virtual engagements.",
      "Key highlights:",
      "- Cultura, Expedito, and Revitalize virtual events",
      "- Leadership Development Seminar (Odyssey 1.0) in 2022",
      "- Virtual Youth Space event 2022",
      "- Prestige 1.0 - Our First Award Ceremony",
      "We won the Most Progressive Official Expansion again at NatCon 2022, closing the term with 6 IGV and 2 IGTa realizations."
    ],
    image: "/history/2025.webp"
  },
  {
    year: "2024",
    title: "From Expansion to Local Committee",
    description: [
      "The next chapter was historic. With Kavindu Bogahawatte (2022.23) and then Dineth Amarasinghe (2023.24) leading, we achieved:",
      "- Official LC Status - becoming the 7th Local Committee of AIESEC Sri Lanka",
      "- Realizations: 43 iGV, 2 iGTe, 5 iGTa, 4 iGT, and 1 oGTa",
      "- Hosted flagship events like Youth Space 3.0, Odyssey 3.0, and South Fest as our annual awurudu celebration",
      "We also received multiple national recognitions:",
      "- Activating Leadership – iGV Board (NLDS 2023)",
      "- Activating Leadership incoming Global Talent Award(NetCon 2023)",
      "- Activating Leadership incoming Global Teacher – Nominee (NetCon 2023)"
    ],
    image: "/history/2025.webp"
  }
];

const VALUES = [
  {
    title: "Demonstrating Integrity",
    description: "By doing what's right over what's easy, you develop leadership that demonstrates integrity.",
    icon: (
      <svg className="w-6 h-6 text-[#037EF3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    colorClass: "bg-blue-100 dark:bg-blue-900/30"
  },
  {
    title: "Acting Sustainably",
    description: "In various leadership roles at AIESEC, you get to make long-term decisions that build your mindset to also think of your future generations and live sustainably.",
    icon: (
      <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
    colorClass: "bg-green-100 dark:bg-green-900/30"
  },
  {
    title: "Striving for Excellence",
    description: "By taking up challenging opportunities with AIESEC, you get to continuously grow through creativity and innovation.",
    icon: (
      <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
    colorClass: "bg-yellow-100 dark:bg-yellow-900/30"
  },
  {
    title: "Activating Leadership",
    description: "At AIESEC, you get to lead by example and with empathy by taking responsibility of inspiring others to lead as well.",
    icon: (
      <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    colorClass: "bg-purple-100 dark:bg-purple-900/30"
  },
  {
    title: "Enjoying Participation",
    description: "At AIESEC, you get to celebrate and enjoy the way we are and put your youthful energy and enthusiasm in everything you do.",
    icon: (
      <svg className="w-6 h-6 text-pink-600 dark:text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    colorClass: "bg-pink-100 dark:bg-pink-900/30"
  },
  {
    title: "Living Diversity",
    description: "You get to work in inclusive spaces that allow you to truly be yourself and embrace each other's differences as a strength.",
    icon: (
      <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    colorClass: "bg-indigo-100 dark:bg-indigo-900/30"
  }
];

// Reusable Components
const SectionHeader = ({ title, description, className = "" }) => (
  <div className={`text-center mb-16 ${className}`}>
    <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{title}</h2>
    {description && <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">{description}</p>}
  </div>
);

const ValueCard = ({ title, description, icon, colorClass }) => (
  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-8 hover:shadow-md transition-shadow bg-white dark:bg-gray-800">
    <div className={`w-12 h-12 rounded-full ${colorClass} flex items-center justify-center mb-4`}>
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-3 dark:text-white">{title}</h3>
    <p className="text-gray-600 dark:text-gray-300">{description}</p>
  </div>
);

const FAQItem = ({ question, answer, isOpen, toggle }) => (
  <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800">
    <button
      className="w-full flex justify-between items-center p-6 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition"
      onClick={toggle}
      aria-expanded={isOpen}
      aria-controls={`faq-${question.replace(/\s+/g, '-')}`}
    >
      <h3 className="text-xl font-semibold dark:text-white">{question}</h3>
      <span className="text-2xl text-blue-600 dark:text-blue-400">
        {isOpen ? '-' : '+'}
      </span>
    </button>
    
    {isOpen && (
      <div id={`faq-${question.replace(/\s+/g, '-')}`} className="p-6 pt-0 bg-white dark:bg-gray-800">
        {answer.split('\n\n').map((paragraph, idx) => (
          <p key={idx} className="text-gray-600 dark:text-gray-300 mb-4 last:mb-0">
            {paragraph}
          </p>
        ))}
      </div>
    )}
  </div>
);

const TimelineItem = ({ year, title, description, image }) => (
  <div className="relative">
    {/* Vertical Timeline Line */}
    <div className="absolute left-6 h-full w-0.5 bg-[#037EF3] transform -translate-x-1/2"></div>
    
    <div className="relative pl-16 mb-16">
      {/* Year Marker */}
      <div className="absolute left-0 flex items-center">
        <div className="w-12 h-12 rounded-full bg-[#037EF3] flex items-center justify-center text-white font-bold text-lg">
          {year}
        </div>
      </div>
    
      {/* Content with Image */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <div className="md:flex gap-8">
          <div className="md:w-1/3 mb-6 md:mb-0">
            <img 
              src={image} 
              alt={title}
              className="w-full h-48 object-cover rounded-lg"
              loading="lazy"
            />
          </div>
          <div className="md:w-2/3">
            <h2 className="text-2xl font-bold mb-4 dark:text-white">{title}</h2>
            {Array.isArray(description) ? (
              <ul className="list-disc pl-6 mb-4 text-gray-600 dark:text-gray-300">
                {description.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600 dark:text-gray-300">{description}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
);

const About = () => {
  const navigate = useNavigate();
  const [faqs, setFaqs] = useState(INITIAL_FAQS);

  const toggleFaq = (index) => {
    setFaqs(prevFaqs => prevFaqs.map((faq, i) => ({
      ...faq,
      isOpen: i === index ? !faq.isOpen : false
    })));
  };

  const gridStyles = {
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)",
    gridTemplateRows: "repeat(3, 140px)",
    gap: "24px",
    justifyItems: "center",
    alignItems: "center",
    width: "100%",
    maxWidth: "1000px",
    margin: "0 auto",
    background: "#F9FAFB dark:bg-[rgb(16,23,42)]"
  };

  const imgStyle = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: "16px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.07)"
  };

  return (
    <div className="font-sans text-gray-800 dark:text-white">
      {/* Hero Section */}
      <section id="hero-section" className="py-16 px-6 dark:bg-[rgb(16,23,42)]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-12 items-center">
          <div className="md:w-1/2 text-center md:text-left">
            <div className="relative inline-block md:block">
              <div className="absolute -top-4 -left-4 w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/20 opacity-70"></div>
              <div className="absolute -bottom-4 -right-4 w-12 h-12 rounded-lg bg-yellow-100 dark:bg-yellow-900/20 opacity-70 rotate-12"></div>
              
              <div className="relative p-8 md:p-10 bg-white/80 dark:bg-gray-800/80 rounded-xl backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300">
                <h1 className="text-6xl md:text-5xl font-bold mb-10 bg-clip-text text-transparent bg-gradient-to-r from-[#037EF3] to-[#0CB9C1]">
                  By youth, for youth
                </h1>
                
                <p className="text-xl md:text-2xl mb-8 dark:text-gray-300 leading-relaxed">
                  AIESEC is a community of young people, passionately driven by one cause: <span className="font-semibold text-[#037EF3] dark:text-blue-400">peace</span> and <span className="font-semibold text-[#0CB9C1] dark:text-teal-400">fulfilment of humankind's potential</span>.
                </p>
                
                <div className="w-20 h-1 bg-gradient-to-r from-[#037EF3] to-[#0CB9C1] rounded-full mx-auto md:mx-0 mb-6"></div>
              </div>
            </div>
          </div>
          
          <div className="md:w-1/2">
            <div className="flex flex-col items-center">
              <div className="mb-10 text-center">
                <div className="mx-auto w-40 h-40 rounded-full border-4 border-white shadow-xl overflow-hidden relative">
                  <div className="absolute inset-0 rounded-full border-[3px] border-transparent bg-gradient-to-r from-[#037EF3] to-[#04BEFE] p-1 -m-1">
                    <img 
                      src="/committee/LCP.png" 
                      alt="Local Committee President" 
                      className="w-full h-full object-cover rounded-full"
                      loading="lazy"
                    />
                  </div>
                </div>
                <div className="mt-5">
                  <span className="inline-block bg-[#037EF3] text-white px-5 py-2 rounded-full text-sm font-semibold shadow-md">
                    <div>Aysha Ajward</div>
                    <div>Local Committee President</div> 
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-5 gap-10">
                {TEAM_MEMBERS.map((member, i) => (
                  <div key={i} className="flex justify-center">
                    <div className="relative group">
                      <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-full border-2 border-gray-200 overflow-hidden transition-all duration-300 group-hover:border-[#037EF3]">
                        <img 
                          src={`/committee/${member.img}`} 
                          alt={member.name} 
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 object-center"
                          loading="lazy"
                        />
                      </div>
                      <div className="text-center mt-2 space-y-1">
                        <div className="text-xs font-semibold text-gray-800 px-2 py-0.5 dark:text-gray-50">
                          {member.name}
                        </div>
                        <div className="text-[0.6rem] font-medium text-[#037EF3] bg-blue-50 rounded-full px-2 py-0.5">
                          {member.role}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <StatCard number={9} label="Faculties" duration={1} />
            <StatCard number={200} label="Active Members" duration={2} plusSign />
            <StatCard number={12} label="Annually Projects" duration={1} plusSign />
            <StatCard number={1200} label="Life Changing Experiences" duration={4} plusSign />
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 px-6 bg-white dark:bg-[rgb(16,23,42)]">
        <div className="max-w-6xl mx-auto">        
          <div className="flex flex-col lg:flex-row gap-12">
            <div className="lg:w-1/3 lg:sticky lg:top-20 lg:h-fit">
              <div className="p-8 rounded-lg">
                <h2 className="text-5xl font-bold text-center mb-12 text-[#037EF3]">10 Years of Purpose. A Lifetime of Impact.</h2>
                <p className="text-2xl text-center mb-8 dark:text-gray-300">
                  From a tiny team with a big dream to a fully-fledged Local Committee inspiring change nationally this is the legacy of AIESEC in Ruhuna.
                </p>
                <p className="text-2xl text-center mb-8 dark:text-gray-300 font-bold">
                  Empowering youth to lead, connect, and transform the world.
                </p>
                <div className="flex justify-center">
                  <div className="h-1 w-24 bg-[#037EF3]"></div>
                </div>
              </div>
            </div>

            <div className="lg:w-2/3 space-y-12">
              {HISTORY_TIMELINE.map((item, index) => (
                <TimelineItem key={index} {...item} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-6 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <SectionHeader 
            title="We create value-driven leaders" 
            description="AIESEC enables you to develop the values we believe leaders should live by." 
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {VALUES.map((value, index) => (
              <ValueCard key={index} {...value} />
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-16 px-6 bg-white dark:bg-[rgb(16,23,42)]">
        <div style={gridStyles}>
          {IMAGES.map((src, i) => (
            <div
              key={i}
              style={{
                ...IMAGE_POSITIONS[i],
                width: "100%",
                height: "100%",
                overflow: "hidden"
              }}
            >
              <img src={src} alt={`collage${i + 1}`} style={imgStyle} />
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-6 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-12">
            <div className="md:w-1/3">
              <h2 className="text-3xl font-bold mb-4 dark:text-white">FAQs</h2>
              <p className="text-xl dark:text-gray-300">
                Need some clarity on something? Maybe our frequently asked questions could help you out.
              </p>
            </div>

            <div className="md:w-2/3">
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <FAQItem 
                    key={index}
                    question={faq.question}
                    answer={faq.answer}
                    isOpen={faq.isOpen}
                    toggle={() => toggleFaq(index)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="py-16 px-6 bg-white dark:bg-[rgb(16,23,42)]">
        <div className="max-w-4xl mx-auto">
          <SectionHeader 
            title="Explore our programs for Youth" 
            description="We aim to develop leadership qualities and capabilities in young people with these programs."
          />

          <div className="border-t border-gray-200 dark:border-gray-700 my-8"></div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            <ProgramButton 
              onClick={() => navigate('/global-intern#hero-section')}
              label="Become an intern"
              borderColor="border-[#0CB9C1]"
            />
            <ProgramButton 
              onClick={() => navigate('/global-teacher#hero-section')}
              label="Become a teacher"
              borderColor="border-[#F48924]"
            />
            <ProgramButton 
              onClick={() => navigate('/global-volunteer#hero-section')}
              label="Become a volunteer"
              borderColor="border-[#F85A40]"
            />
            <ProgramButton 
              onClick={() => navigate('/become-member#hero-section')}
              label="Become a member"
              borderColor="border-[#037EF3]"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

// Small helper components
const StatCard = ({ number, label, duration, plusSign = false }) => (
  <div className="p-6">
    <div className="text-5xl font-bold text-[#037EF3] mb-2">
      <CountUp end={number} duration={duration} separator="," />
      {plusSign && '+'}
    </div>
    <div className="text-xl text-gray-600 dark:text-gray-300">{label}</div>
  </div>
);

const ProgramButton = ({ onClick, label, borderColor }) => (
  <button 
    onClick={onClick}
    className={`text-center bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border ${borderColor} rounded-lg px-6 py-4 flex items-center transition-colors`}
  >
    <span className="font-medium dark:text-white">{label}</span>
  </button>
);

// PropTypes for type checking
SectionHeader.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  className: PropTypes.string
};

ValueCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  icon: PropTypes.node.isRequired,
  colorClass: PropTypes.string.isRequired
};

FAQItem.propTypes = {
  question: PropTypes.string.isRequired,
  answer: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired
};

TimelineItem.propTypes = {
  year: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string)
  ]).isRequired,
  image: PropTypes.string.isRequired
};

StatCard.propTypes = {
  number: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired,
  duration: PropTypes.number.isRequired,
  plusSign: PropTypes.bool
};

ProgramButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  borderColor: PropTypes.string.isRequired
};

export default About;