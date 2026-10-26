export interface SiteContent {
  hero: {
    title: string;
    subtitle: string;
    ctaText: string;
    imageUrl: string;
  };
  sections: {
    id: string;
    type: 'grid' | 'text-image' | 'news';
    title: string;
    items: {
      id: string;
      title: string;
      description: string;
      imageUrl?: string;
      link?: string;
    }[];
  }[];
  footer: {
    about: string;
    links: { label: string; url: string }[];
  };
}

export const INITIAL_CONTENT: SiteContent = {
  hero: {
    title: "Shape Your Future at PHHIPROS",
    subtitle: "Paul Herbert Higher Institute of Professional Studies - Excellence in Professional Education and Research.",
    ctaText: "Discover Our Courses",
    imageUrl: "/src/assets/images/cameroon_campus_hero_1789756140943.jpg"
  },
  sections: [
    {
      id: 'study',
      type: 'grid',
      title: 'Study with Us',
      items: [
        { id: 'ug', title: 'HND/Bachelor', description: 'Explore our wide range of professional undergraduate programs.', imageUrl: '/src/assets/images/undergrad_black_students_1789756767422.jpg', link: '/undergraduate' },
        { id: 'pg', title: 'Postgraduate', description: 'Advance your career with specialized postgraduate degrees.', imageUrl: '/src/assets/images/postgrad_black_students_1789756779076.jpg', link: '/postgraduate' },
        { id: 'vocational', title: 'Vocational', description: 'Master practical skills with our industry-leading vocational programs.', imageUrl: '/src/assets/images/vocational_fashion_design_phhipros_1789769297887.jpg', link: '/vocational' }
      ]
    },
    {
      id: 'news',
      type: 'news',
      title: 'Latest News & Events',
      items: [
        { id: 'news1', title: 'PHHIPROS Ranks Top for Student Satisfaction', description: 'National Student Survey 2026 results highlight our commitment to student success.' },
        { id: 'news2', title: 'New Professional Innovation Hub Opens', description: 'Expanding our campus facilities to support professional growth.' },
        { id: 'event1', title: 'Open Day: October 12th', description: 'Register now to visit our campus and meet our faculty.' }
      ]
    }
  ],
  footer: {
    about: "The Paul Herbert Higher Institute of Professional Studies (PHHIPROS) is committed to providing world-class professional education and fostering innovation in research.",
    links: [
      { label: "About Us", url: "/about" },
      { label: "HND/Bachelor Programs", url: "/undergraduate" },
      { label: "Postgraduate Programs", url: "/postgraduate" },
      { label: "Vocational", url: "/vocational" },
      { label: "Student FAQ & Inquiries", url: "/faq" },
      { label: "Admissions", url: "/programs" },
      { label: "Privacy Policy", url: "#" }
    ]
  }
};
