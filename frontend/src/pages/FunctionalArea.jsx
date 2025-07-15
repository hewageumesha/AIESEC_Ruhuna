import React, { useState } from 'react';
import { motion } from 'framer-motion';

const FunctionalAreas = () => {
  const [activeArea, setActiveArea] = useState('front');

  const frontOfficeData = [
    {
      id: 1,
      title: 'What Is the Front Office?',
      description: `The Front Office of AIESEC in Ruhuna is the part of the organization that directly interacts with the public and executes AIESEC’s global exchange programs. This includes both hosting young people from other countries in Sri Lanka and sending local youth abroad for volunteering, internships, or teaching experiences. The Front Office works with various external stakeholders such as students, parents, NGOs, companies, and schools. It’s where the actual impact of AIESEC is brought to life. 
      \n\n  The Front Office is made up of several key functions. Each one plays a role in making the exchange journey smooth and meaningful whether it’s a Sri Lankan student going to volunteer in Egypt, or a teacher from Brazil coming to work in Matara. Below is a breakdown of what each function in the Front Office is responsible for.`
    },
    {
      id: 2,
      title: 'Incoming Global Volunteer (iGV)',
      description: `This function focuses on bringing international volunteers to Sri Lanka. These volunteers participate in social impact projects, often connected to the United Nations Sustainable Development Goals (SDGs). 
      \n iGV is responsible for creating partnerships with local NGOs, schools, or community projects that can host these volunteers. They take care of all the logistics from signing partnership agreements to planning volunteer activities, and even making sure airport pickups and accommodation are ready. 
      \n They also manage expectations between the host organization and the volunteers and resolve any conflicts that might come up. After the project ends, the team collects feedback and creates reports about the outcomes and impact.`,
      responsibilities: [
        'Partner with NGOs and local organizations for volunteering projects',
        'Manage volunteer arrival, accommodation, and support',
        'Monitor project delivery and collect impact feedback',
        'Lead volunteer engagement activities',
        'Handle legal and financial documentation for projects'
      ]
    },
    {
      id: 3,
      title: 'Incoming Global Talent & Teacher (iGT/iGTe)',
      description: `This function handles bringing international interns and teachers to work in Sri Lanka, typically in local companies, schools, or institutions. The goal is to provide a valuable professional experience for the intern and help the company gain global perspectives.
      \n The team reaches out to organizations that are interested in hiring skilled young people from other countries. They handle all the formalities including creating job descriptions, conducting meetings, preparing contracts, and supporting the intern’s visa process.
      \n They also make sure the internship or teaching experience runs smoothly and is beneficial for both sides, and they are responsible for final evaluations and success stories at the end of each placement.`,
      responsibilities: [
        'Connect with companies and schools to provide internship/teaching opportunities',
        'Finalize contracts and visa support for international interns',
        'Provide onboarding, support, and follow-ups during the internship',
        'Ensure a professional and productive experience for both intern and host',
        'Track and showcase the outcomes of each placement'
      ]    
    },
    {
      id: 4,
      title: 'Outgoing Global Volunteer (oGV)',
      description: `This function helps Sri Lankan youth go abroad to volunteer in social impact projects. oGV members promote these international opportunities through school/university campaigns and online platforms, helping young people understand the benefits of volunteering abroad.
      \n They guide applicants through the entire process from initial interest to departure. This includes screening, coaching, visa support, and pre-departure preparation. Once the participant is abroad, oGV continues to track their progress and ensures they have support if needed.
      \n After returning home, participants are encouraged to share their stories and reflections to inspire more youth to take part in global volunteering.`,
      responsibilities: [
        'Promote international volunteer opportunities to local youth',
        'Handle applicant screening, documentation, and visa support',
        'Organize awareness and attraction events',
        'Track volunteer experience while abroad',
        'Collect stories and reflections after their return'
      ]
    },
    {
      id: 5,
      title: 'Outgoing Global Talent / Teacher (oGT/oGTe)',
      description: `This function works to send Sri Lankan students and recent graduates abroad for internships and teaching opportunities. These opportunities are designed to improve the professional skills of youth while giving them international exposure.
      \n The team connects with potential participants, especially in collaboration with university career services and clubs. They help applicants prepare resumes, match with relevant opportunities, and go through the application process.
      \n They also assist with logistics like visas, contracts, and orientation sessions. After the program, they gather feedback and success stories to measure the long-term impact.`,
      responsibilities: [
        'Promote international internships and teaching opportunities',
        'Work with career services to find interested applicants',
        'Assist with resume building, matching, and application follow-ups',
        'Manage legal and visa processes',
        'Organize pre-departure seminars and collect post-experience feedback'
      ]
    }
  ];

  const backOfficeData = [
    {
      id: 1,
      title: 'What Is the Back Office',
      description: `While the Front Office is busy running the exchange programs and interacting with the outside world, the Back Office functions make sure everything is running properly behind the scenes. They handle the internal operations of AIESEC in Ruhuna, such as managing finances, recruiting and developing members, building partnerships, promoting AIESEC’s brand, and ensuring legal compliance. 
      \n\n The Back Office might not interact with exchange participants directly, but without them, no program could run successfully. They provide the stability, planning, and resources needed to deliver quality experiences.
      \n\n Here’s a closer look at the key Back Office functions.`
    },
    {
      id: 2,
      title: 'Business Development (BD)',
      description: `BD is responsible for finding and managing partnerships and sponsorships that help sustain AIESEC projects. This includes companies, travel agencies, media partners, and more.
      \n They create proposals, conduct meetings, finalize contracts, and maintain professional relationships. They also work closely with the exchange teams to offer special services such as ticketing support or accommodation deals. BD ensures that partners receive the value they expect and helps the entity grow financially and strategically.`,
      responsibilities: [
        'Identify and approach potential partners',
        'Develop sponsorship proposals and finalize legal agreements',
        'Manage partner expectations and value delivery',
        'Contribute to the entity’s budget through monetary partnerships'
      ]
    },
    {
      id: 3,
      title: 'Finance & Legal',
      description: `This function manages all the financial and legal operations of AIESEC in Ruhuna. They handle budgeting, expenses, and income tracking. They ensure every project is financially sustainable and that all legal documents are properly handled.
      \n They also work on compliance with local regulations and university policies. During audits or financial reviews, this team is in charge of providing reports and verifying documentation.`,
      responsibilities: [
        'Prepare and manage entity budgets and financial records',
        'Ensure financial accountability and sustainability',
        'Handle all legal paperwork and audit processes',
        'Maintain compliance with national laws and university regulations'
      ]
    },
    {
      id: 4,
      title: 'Talent Management (TM)',
      description: `TM is the Human Resources function of AIESEC. They recruit new members, assign them to teams, and plan education and leadership development programs. TM also tracks member performance and conducts reviews to help people grow in their roles.
      \n They are responsible for organizing internal events such as summits, local committee meetings, and learning sessions. They keep the AIESEC team motivated, recognized, and engaged.`,
      responsibilities: [
        'Plan and execute recruitment cycles',
        'Provide internal training and leadership development',
        'Monitor member performance and engagement',
        'Handle recognition, rewards, and internal HR needs'
      ]
    },
    {
      id: 5,
      title: 'Expansions Management',
      description: `This team supports smaller AIESEC units called Initiative Groups (iGs), especially in nearby universities or new regions. They help iGs with recruitment, education, event planning, and leadership transitions.
      \n They ensure that iGs follow the AIESEC model while allowing them to grow independently. They also support these groups in reporting their performance and connecting with the main entity.`,
      responsibilities: [
        'Support iG formation and university partnerships',
        'Guide iGs in recruitment, events, and leadership planning',
        'Coordinate reporting and reviews for performance tracking',
        'Assist iGs with legal, financial, and HR needs'
      ]
    },
    {
      id: 6,
      title: 'Marketing',
      description: `The Marketing team is in charge of AIESEC’s visual identity, storytelling, and promotions. They design campaigns that showcase what AIESEC does and why it matters both for exchange participants and members.
      \n They manage social media, create posters and videos, and plan content strategies to engage audiences. They also support other teams by promoting their events, successes, and impact stories.`,
      responsibilities: [
        'Design and run branding campaigns',
        'Manage digital platforms and visual content',
        'Support recruitment and exchange promotions',
        'Create content that showcases AIESEC’s value and impact'
      ]
    },
    {
      id: 7,
      title: 'Public Relations (PR)',
      description: `PR is responsible for maintaining AIESEC’s public image and relationships with external stakeholders, including universities, media outlets, and alumni.
      \n They organize campaigns and forums to raise awareness about youth leadership, connect with alumni, and build external partnerships. They ensure that AIESEC is well-represented in both traditional and digital media.`,
      responsibilities: [
        'Handle university and media relations',
        'Plan external campaigns and public events',
        'Coordinate alumni engagement and community outreach',
        'Contribute to national and global PR efforts'
      ]
    }
  ];

  const dataToDisplay = activeArea === 'front' ? frontOfficeData : backOfficeData;
  const currentData = activeArea === 'front' ? frontOfficeData : backOfficeData;

  const introItem = currentData.find(item => item.id === 1);
  const cardItems = currentData.filter(item => item.id !== 1);

  return (
    <div className="py-16 px-6 bg-gradient-to-b from-[#f0f4ff] to-white dark:from-gray-900 dark:to-black font-sans">
      <div className="max-w-7xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#037EF3] to-[#0CB9C1]"
        >
          Discover Our Functional Areas
        </motion.h2>

        <p className="text-lg mb-10 text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Explore how AIESEC in Ruhuna works — both publicly through exchanges and internally through strong operations.
        </p>

        <div className="flex justify-center gap-6 mb-12 flex-wrap">
          <button
            onClick={() => setActiveArea('front')}
            className={`px-6 py-3 rounded-full font-medium text-white bg-gradient-to-r from-[#037EF3] to-[#0CB9C1] hover:opacity-90 transition
              ${activeArea === 'front' ? '' : 'opacity-50'}`}
          >
            Front Office
          </button>
          <button
            onClick={() => setActiveArea('back')}
            className={`px-6 py-3 rounded-full font-medium text-white bg-gradient-to-r from-[#037EF3] to-[#0CB9C1] hover:opacity-90 transition
              ${activeArea === 'back' ? '' : 'opacity-50'}`}
          >
            Back Office
          </button>
        </div>

        {/* Intro Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-12 p-6 bg-gradient-to-r from-[#037EF3] to-[#0CB9C1] rounded-3xl text-white max-w-4xl mx-auto shadow-lg"
        >
          <h3 className="text-2xl font-bold mb-3">{introItem.title}</h3>
          <p className="whitespace-pre-line">{introItem.description}</p>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 text-left">
          {cardItems.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl p-6 shadow-md hover:shadow-xl transition-all duration-300"
            >
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{item.title}</h3>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{item.description}</p>
              {item.responsibilities && (
                <>
                  <p className="mt-3 font-bold text-gray-800 dark:text-gray-200">Main Responsibilities:</p>
                  <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
                    {item.responsibilities.map((res, index) => (
                      <li key={index}>{res}</li>
                    ))}
                  </ul>
                </>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FunctionalAreas;
