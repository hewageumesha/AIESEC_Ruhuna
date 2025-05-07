import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CountUp from 'react-countup';

export default function About() {
    const navigate = useNavigate();

    // FAQ data with toggle state
    const [faqs, setFaqs] = useState([
      {
        question: "What is AIESEC?",
        answer: "AIESEC is a global platform for young people to explore and develop their leadership potential. We are a non-political, independent, not-for-profit organization run by students and recent graduates of institutions of higher education. Its members are interested in world issues, leadership and management. AIESEC does not discriminate on the basis of ethnicity, gender, sexual orientation, religion or national/social origin.\n\n Since we were founded, we have engaged and developed over 1,000,000 young people who have been through an AIESEC experience. The impact of our organization can be seen through our alumni who represent business, NGO and world leaders, including one Nobel Peace Prize laureate, Martti Ahtisaari of Finland.",
        isOpen: false
      },
      {
        question: "What does AIESEC stand for?",
        answer: "AIESEC (pronounced eye-sek) was originally an acronym for Association Internationale des Étudiants en Sciences Économiques et Commerciales.AIESEC is no longer used as an acronym but simply as the name of the organization.\n\nMembers of AIESEC are known as 'AIESECers.'",
        isOpen: false
      },
      {
        question: "Youth Run",
        answer: "We are a global network of young leaders under the age of 30 who strive to better themselves and the communities around them. We are passionate about world issues, leadership development, cultural understanding and experiential learning. \n\n The organization spans 126 countries/territories and territories and every aspect of AIESEC’s operations are managed by students and recent graduates. \n\n We have operated in this way since our inception, making us uniquely “by young people, for young people”, for over 65 years. The global leadership teams are elected by the membership annually.",
        isOpen: false
      },
      {
        question: "Independent & Non Partisan",
        answer: "AIESEC as a global network is not a subsidiary or an entity that is dependent on any other bodies in its work, sustainability or decision-making. \n\n AIESEC chooses peace above all and therefore does not have a pre-defined or officially accepted political tendency or subscription. \n\n We are in consultative status with the United Nations Economic and Social Council (ECOSOC), affiliated with the UN DPI, member of ICMYO, and is recognised by UNESCO.",
        isOpen: false
      },
      {
        question: "Origins",
        answer: "AIESEC was founded in 1948 in 7 countries/territories in Europe by Jean Choplin (France), Bengt Sjøstrand (Sweden), and Dr. Albert Kaltenthaler (Germany). \n\n Over 77 years later we are present in 100+ countries and territories.",
        isOpen: false
      },
      {
        question: "Who can be an AIESECer?",
        answer: "Anyone who believes in the AIESEC vision, supports the mission of AIESEC, and lives by the AIESEC values is a part of the youth leadership movement, and hence is an AIESECer. They can be our partners who relate to our organizational values and vision, or it can be our parents who constantly support us to give our best to our leadership development journeys.",
        isOpen: false
      }
    ]);
  
    // Toggle FAQ answer visibility
    const toggleFaq = (index) => {
      setFaqs(faqs.map((faq, i) => {
        if (i === index) {
          return { ...faq, isOpen: !faq.isOpen };
        }
        return faq;
      }));
    };
  return (
    <div className="font-sans text-gray-800">
      {/* Hero Section */}
      <section className="bg-blue-50 py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[#037EF3]">By youth, for youth</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-8">
            AIESEC is a community of young people, passionately driven by one cause: peace and fulfilment of humankind's potential.
          </p>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            
            <div className="p-6">
              <div className="text-5xl font-bold text-[#037EF3] mb-2">
                <CountUp end={100} duration={2} />+
              </div>
              <div className="text-xl text-gray-600">Countries & Territories</div>
            </div>

            <div className="p-6">
              <div className="text-5xl font-bold text-[#037EF3] mb-2">
                <CountUp end={5000} duration={3} separator="," />+
              </div>
              <div className="text-xl text-gray-600">Partner Organizations</div>
            </div>

            <div className="p-6">
              <div className="text-5xl font-bold text-[#037EF3] mb-2">
                <CountUp end={30000} duration={4} separator="," />+
              </div>
              <div className="text-xl text-gray-600">Experiences Every Year</div>
            </div>

          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">        
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Left side - Fixed content */}
            <div className="lg:w-1/3 lg:sticky lg:top-20 lg:h-fit">
              <div className="p-8 rounded-lg">
              <h2 className="text-5xl font-bold text-center mb-12 text-[#037EF3]">Our Story</h2>
                <p className="text-2xl text-center mb-8">
                AIESEC's story started in 1948, <span className="font-bold">77 years ago</span>.
                </p>
                <div className="flex justify-center">
                  <div className="h-1 w-24 bg-[#037EF3]"></div>
                </div>
              </div>
            </div>

            {/* Right side - Scrollable history */}
            <div className="lg:w-2/3 space-y-12">
              {/* History Item 1 */}
              <div className="relative">
              {/* Vertical Timeline Line */}
                <div className="absolute left-6 h-full w-0.5 bg-[#037EF3] transform -translate-x-1/2"></div>
                
                {/* Timeline Item - 1948 */}
                <div className="relative pl-16 mb-16">
                  {/* Year Marker */}
                  <div className="absolute left-0 flex items-center">
                    <div className="w-12 h-12 rounded-full bg-[#037EF3] flex items-center justify-center text-white font-bold text-lg">
                      1948
                    </div>
                  </div>
                
                  {/* Content with Image */}
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="md:flex gap-8">
                      <div className="md:w-1/3 mb-6 md:mb-0">
                        <img 
                          src="/1948.webp" 
                          alt="AIESEC founders in 1948"
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      </div>
                      <div className="md:w-2/3">
                        <h2 className="text-2xl font-bold mb-4">AIESEC was established</h2>
                        <p className="text-gray-600 mb-4">
                        AIESEC was established in 1948 after World War II, where seven youth across seven countries/territories had a dream of building cross-cultural understanding across nations. They hoped to change the world, one person and one internship at a time.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Timeline Item - 1977 */}
                <div className="relative pl-16 mb-16">
                  {/* Year Marker */}
                  <div className="absolute left-0 flex items-center">
                    <div className="w-12 h-12 rounded-full bg-[#037EF3] flex items-center justify-center text-white font-bold text-lg">
                      1977
                    </div>
                  </div>
                  
                  {/* Content with Image */}
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="md:flex gap-8">
                      <div className="md:w-1/3 mb-6 md:mb-0">
                        <img 
                          src="/1977.webp" 
                          alt="AIESEC global expansion in 1977"
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      </div>
                      <div className="md:w-2/3">
                        <h2 className="text-2xl font-bold mb-4">Spread across 6 continents</h2>
                        <p className="text-gray-600 mb-4">
                        By 1977, AIESEC was present in 50 countries/territories across six continents! To this date, over 40,000 young people around the world had participated in a leadership development experience.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Timeline Item - 2010*/}
                <div className="relative pl-16">
                  {/* Year Marker */}
                  <div className="absolute left-0 flex items-center">
                    <div className="w-12 h-12 rounded-full bg-[#037EF3] flex items-center justify-center text-white font-bold text-lg">
                      2010
                    </div>
                  </div>
                  
                  {/* Content with Image */}
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="md:flex gap-8">
                      <div className="md:w-1/3 mb-6 md:mb-0">
                        <img 
                          src="/2010.webp" 
                          alt="AIESEC experiences in 2010"
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      </div>
                      <div className="md:w-2/3">
                        <h2 className="text-2xl font-bold mb-4">Over 10,000 experiences that year</h2>
                        <p className="text-gray-600">
                        In 2010, AIESEC crosses 10,000 experiences delivered in one year alone for the first time. By now, over 230,000 experiences have been provided, all facilitated by youth for youth.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Timeline Item - 2015*/}
                <div className="relative pl-16">
                  {/* Year Marker */}
                  <div className="absolute left-0 flex items-center">
                    <div className="w-12 h-12 rounded-full bg-[#037EF3] flex items-center justify-center text-white font-bold text-lg">
                      2015
                    </div>
                  </div>
                  
                  {/* Content with Image */}
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="md:flex gap-8">
                      <div className="md:w-1/3 mb-6 md:mb-0">
                        <img 
                          src="/2015.webp" 
                          alt="AIESEC’s youth leaders in 2015"
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      </div>
                      <div className="md:w-2/3">
                        <h2 className="text-2xl font-bold mb-4">Implementing the SDGs</h2>
                        <p className="text-gray-600">
                        In 2015, AIESEC’s youth leaders from 126 countries/territories and territories in collaboration with the Office of the Secretary-General's Envoy on Youth gathered at the United Nations Headquarters to promote and drive youth participation in implementing the Sustainable Development Goals (SDGs). The relevance and contribution of AIESEC is clearer than ever.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Timeline Item - 2025*/}
                <div className="relative pl-16">
                  {/* Year Marker */}
                  <div className="absolute left-0 flex items-center">
                    <div className="w-12 h-12 rounded-full bg-[#037EF3] flex items-center justify-center text-white font-bold text-lg">
                      2025
                    </div>
                  </div>
                  
                  {/* Content with Image */}
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="md:flex gap-8">
                      <div className="md:w-1/3 mb-6 md:mb-0">
                        <img 
                          src="/2025.webp" 
                          alt="AIESEC global network in 2025"
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      </div>
                      <div className="md:w-2/3">
                        <h2 className="text-2xl font-bold mb-4">Youth leadership movement</h2>
                        <p className="text-gray-600">
                        In sum, AIESEC is a global network of people that simply believe that youth leadership is not an option, but our responsibility.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">We create value-driven leaders</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              AIESEC enables you to develop the values we believe leaders should live by.
            </p>
          </div>

          {/* Values Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Demonstrating Integrity */}
            <div className="border border-gray-200 rounded-lg p-8 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[#037EF3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Demonstrating Integrity</h3>
              <p className="text-gray-600">
                By doing what's right over what's easy, you develop leadership that demonstrates integrity.
              </p>
            </div>

            {/* Acting Sustainably */}
            <div className="border border-gray-200 rounded-lg p-8 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Acting Sustainably</h3>
              <p className="text-gray-600">
                In various leadership roles at AIESEC, you get to make long-term decisions that build your mindset to also think of your future generations and live sustainably.
              </p>
            </div>

            {/* Striving for Excellence */}
            <div className="border border-gray-200 rounded-lg p-8 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Striving for Excellence</h3>
              <p className="text-gray-600">
                By taking up challenging opportunities with AIESEC, you get to continuously grow through creativity and innovation.
              </p>
            </div>

            {/* Activating Leadership */}
            <div className="border border-gray-200 rounded-lg p-8 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Activating Leadership</h3>
              <p className="text-gray-600">
                At AIESEC, you get to lead by example and with empathy by taking responsibility of inspiring others to lead as well.
              </p>
            </div>

            {/* Enjoying Participation */}
            <div className="border border-gray-200 rounded-lg p-8 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Enjoying Participation</h3>
              <p className="text-gray-600">
                At AIESEC, you get to celebrate and enjoy the way we are and put your youthful energy and enthusiasm in everything you do.
              </p>
            </div>

            {/* Living Diversity */}
            <div className="border border-gray-200 rounded-lg p-8 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Living Diversity</h3>
              <p className="text-gray-600">
                You get to work in inclusive spaces that allow you to truly be yourself and embrace each other's differences as a strength.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-12">
            {/* Left side - Title and description */}
            <div className="md:w-1/3">
              <h2 className="text-3xl font-bold mb-4">FAQs</h2>
              <p className="text-xl">
                Need some clarity on something? Maybe our frequently asked questions could help you out.
              </p>
            </div>

            {/* Right side - FAQ items */}
            <div className="md:w-2/3">
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      className="w-full flex justify-between items-center p-6 text-left hover:bg-gray-100 transition"
                      onClick={() => toggleFaq(index)}
                    >
                      <h3 className="text-xl font-semibold">{faq.question}</h3>
                      <span className="text-2xl text-blue-600">
                        {faq.isOpen ? '-' : '+'}
                      </span>
                    </button>
                    
                    {faq.isOpen && (
                      <div className="p-6 pt-0 bg-white">
                        {faq.answer.split('\n\n').map((paragraph, idx) => (
                          <p key={idx} className="text-gray-600 mb-4 last:mb-0">
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Explore our programs for Youth</h2>
            <p className="text-xl text-gray-600">
              We aim to develop leadership qualities and capabilities in young people with these programs.
            </p>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 my-8"></div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            <button 
              onClick={() => navigate('/global-intern')}
              className="text-center bg-white hover:bg-gray-50 border border-[#0CB9C1] rounded-lg px-6 py-4 flex items-center transition-colors">
              <span className="font-medium">Become an intern</span>
            </button>
                
            <button 
              onClick={() => navigate('/global-teacher')}
              className="text-center bg-white hover:bg-gray-50 border border-[#F48924] rounded-lg px-6 py-4 flex items-center transition-colors">
              <span className="font-medium">Become a teacher</span>
            </button>

            <button 
              onClick={() => navigate('/global-volunteer')}
              className="text-center bg-white hover:bg-gray-50 border border-[#F85A40] rounded-lg px-6 py-4 flex items-center transition-colors">
              <span className="font-medium">Become a volunteer</span>
            </button>

            <button
              onClick={() => navigate('/become-member')} 
              className="text-center bg-white hover:bg-gray-50 border border-[#037EF3] rounded-lg px-6 py-4 flex items-center transition-colors">
              <span className="font-medium">Become a member</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};