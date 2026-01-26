import { MenuItem, EventItem, StaffMember, ArtPiece } from './types';

export const LOGO_URL = "/assets/logo/Olkkari-simple.png";

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 1,
    name: 'Beef Tartar',
    price: '16€',
    description: 'Classic hand-cut beef with capers, shallots, and organic egg yolk.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAdvdwLq8QD1mvmPIWFxkmBGaZ6U0xc2PAp7YOPI8mZuRq9LWf1Qght-TQ84IOCP8AlQMpKRVoKTy4Hp8mOGbgmTpxKc2vslREUcSl-3-LkPIVEsomPOPlo28hmqKKUAIZYr12-jkBFF7Vh39RLBG0JY9WojoIyJol6_U1xsq3Qq8QUEEGrg08cbORjvl24epKEvU62kfUADFG49y1gYj6LfdudYy8rb3hhLIJbyfgxLybdKq7mBspTQ5AAuCcVdvHFvkFb_i29glw',
    isChefChoice: true
  },
  {
    id: 2,
    name: 'Slow-Roasted Brisket',
    price: '28€',
    description: '12-hour smoked beef brisket with root vegetables and red wine jus.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD0NutMWGLPEXuzCykNSMTeM8F9kU9RRB3y1QdF9GrfX-kdiY1s94APONMp-PUsrAm3d8dwk4N8vKESx5F53CHdF46x8_dczqKfpW0NBaK56uPG8i1o64niTOxb-SnToz0io146wadKALpj7aGkPGgrcHLTum04kTfIA0UsyBQcy-eivgx5uZi8LQXsbAAgCLk30k0XKHJJkBWD9LatPLvs7y0lXJU3T_xrGiIeJADgKLAnWtU6vu1tT1ti-eMcMdFjlHUP4-hDIEE'
  },
  {
    id: 3,
    name: 'Arctic Char',
    price: '26€',
    description: 'Pan-seared char with almond butter, asparagus, and dill potatoes.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCAbxaPzvLiqcuzxAFRw_jBkMpwCIhxjb4-ZPxLED9rzfKuLCFKcuHXvhZFVYvAOIXuwomVKsXfwWPh94wLjLlb8uqMJ3RygtDetB0WiHg9A7efqdpBd_ziQW__rKZvI1XRFZY5DBFm03dxdlkLpzEu4hB41C4-56TNwWz7HJxHW7W7iX4ZETMw0o6Uu06N-kS7UwOtYvWBUjTjQACOuY-BcoR8SYfbEVxbuJ6POCDef3MSXmT2rQweO1ZG66sJ5qD42bp--GpGcj8',
    tags: ['Sustainable']
  }
];

export const EVENTS: EventItem[] = [
  {
    id: 1,
    title: 'Jazz Night: Helsinki Trio',
    date: 'Friday, Oct 20',
    time: '20:00',
    description: 'A soulful journey through Nordic jazz with the city\'s most talented trio.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAiYyYsWm42SbEEgVaoCxbDw6PN6FsxLPLCOJzzRBiq4ZzWO5K18BvQa0dDBhzNBzT7tQLvHvLvmCcaLKwWbSZRoR3TXQsbATfXZBE-GSY-mVHYqm-xBZgMiTNFF6UcwPLTVez1VkCcep_Nv0g6dU3hDCsC2U3CbbyJ2VgDtd8i6yP0PIPyPyRxot3zBJV1bNCL4iMLEsyyJc0BAS5AS-JQavimAuu9J68ucHfg14fdVAt7Gu1mgvEpFZ_wzw-DEmYkD5wfm5neKAA',
    type: 'Music',
    isTonight: true
  },
  {
    id: 2,
    title: 'Soulful Saturdays with Elena',
    date: 'Saturday, Oct 21',
    time: '21:00',
    description: 'Intimate acoustic session featuring Elena\'s powerful vocals and piano.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDsKkwNt9u5-nfyd6csRut2PuqsDRvzIJ3QhKV9Bif6ShVqhGTYIYc3GrkxvWThwNsNqNW6GDjkSt3s3-zPMfrSyqNi68dy9E7V4PscJcMApZN3Cdd-96xhb6CdqRGRV9POi0ztn9cICE_vSMg4SxIgl87pjcGfQ4E_XBJmExwH3ubyGATGbrD1k0lCephWP5HllZDr_8GCc19XNqhSggH8WQ04FDeA8BJIgdOPqlmQgq6uRj9Bwi_SyTtkkBQrwKcDCxkuiwBZ7sQ',
    type: 'Music'
  },
  {
    id: 3,
    title: 'Vinyl Groove Sessions',
    date: 'Wednesday, Oct 25',
    time: '19:30',
    description: 'Relax with curated vinyl tracks from Helsinki\'s underground scene.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDeVXPBs3ZCi0gBYYU1LmzdhmeP882oL0e9_8A4M18kN3232_K5Pj2a6LcBG1FcK6iTlJKktuRcyQaXYfOIhBs6_HiokIy07lt5JeWtfWHfDB8odce6nREGYX3dHwSBHMyiTEWQx5HQzbzNvj9E8M154GQ7ZURqjMne54xik1YeSUDraWtFErkRKpuTvI2KKOT_0sCo8FIZnkUyWBBNZ-OhH8bCXVSAkqRUEY4_3LOyRFYiiYMupR0rJ0pu9h_AMeh7JjoAq9HGe8I',
    type: 'Music'
  }
];

export const STAFF: StaffMember[] = [
  {
    id: 1,
    name: 'Anthonio Maimon',
    role: 'Head Chef • Mediterranean Fusion',
    description: 'Bringing 15 years of Michelin-star experience to your private kitchen. Expert in seasonal local ingredients and artistic plating.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAweH9I317Euc7_DzfnMVim7FfWe0TFGGi5960MJ_i2jRnq-66aJ0FjSY3WE02m-j8KYKbcI1GZf1ou9D2sSOuhpf46DpeAbVlkvUZYLhbTsGcElVuueTta0m_rtEqAMfKtKcUFEY1LanbW7sxRS03K_xN-dv9Koj_uLtkorvOwscb0_SSa8bv0amjwFgwM-Tx01fwqahBhKue5x3TQP3sSEDpwlphCaYZh6AN738qftpMuc90_9iCG2BwG_qOOd4ZGVaDO2_6wezE',
    rate: '€120',
    badge: 'PREMIUM'
  },
  {
    id: 2,
    name: 'Sarah J.',
    role: 'Lead Mixologist • Craft Cocktails',
    description: 'Specializing in bespoke infusions and cocktail pairings for high-end dinner parties. Master of mixology storytelling.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCJ5o2g3oVlnDFJfusPvRfB9gGstdw7iOlP4aalls9GpdJ6BdFJWm6peWOK5JaKirv-VJCYsZD5SgjQavqJ2R3eL3iXPHYa9aLWWtqb9F2dz6zoA4Ueta2LeeFOHmAPSi5-KUoJulVm8hy6ITgGlob-RoQeiYVaAVILEjo0N4JtaOlYljj6HB7IrdmSlOHDcCv6WV7fO6XjImaqpHJA-dRJbYzn_GifFBxqIL3xl1poGv-vT-X7AzuH9mXMFPd_aqLXB0D9gef1740',
    rate: '€85',
    badge: 'FEATURED'
  }
];

export const ART: ArtPiece[] = [
  {
    id: 1,
    title: 'Azure Horizon',
    medium: 'Acrylic on Canvas, 100x120cm',
    price: '€1,250',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuArk6P1x-dBqlYbvloPQg9q8gEGEd73Q2Y56szyQeFUgx5SPHv-rc-gIkPYoky6ZVDavEof14k9jIs-V-UIGs9bcxk24XQ3frZwywP7-HWFtUananAep0iVQhEUOiTiLQyUSCY_ftMxO3iBOFr9P1t0VhPrAXmZYx4qCVimbfP-b2AqnXOPH2_ppbBxEJMYZ2HTgWcTOsXUiena8CGxpIBgs4scVlhxAZoNzjg2ZDpmJYQ_ddLUttuFnYpairPt4v3VgvJ_4TOU3m0'
  },
  {
    id: 2,
    title: 'Midnight in Helsinki',
    medium: 'Mixed Media, 80x80cm',
    price: '€890',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBBqxD95uQZoaqQ1FUrlXoodb4oFaTqic2qPOYzXrp0teAcENDwAeUrUDVHt5qgTtVqp-vi3Brs1WRXR_3zhjUqSi-A-WVhlar97qtqElE_0gBJNBh5Fw7wgr8ESSVzNDnB6okzDShcv_uuH0oKM3RDVBBJbKHxQfrd99MDTkb_fsGFtrAiKsfQyPEafL1gNSFQIQNCKTub3fTCnODgZC9ABI38SC3Mijusq3iqEv2ZpS6ClfeT3GKJ0LvhSE9hj8XlC5HTziGIRzY'
  },
  {
    id: 3,
    title: 'Olkkari Warmth',
    medium: 'Oil on Wood, 60x100cm',
    price: '€1,100',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuASJYoLsYBHMo5HLSUu9K_au1RL43daCnyEwNX-Xb7x31-b4YsoVCahWegsEnIp7HDKLYBnXnT0uscms_gP1hetSJMFk3KWPp1yIyU1Q714id9X3bZfRJeBXZhkIH-mnZOEnvsbkePKX1ByrlKVbpBdi6fkClSfvuGWzKYGjW8N1G0tJLClBs6LWD7DJTzRcDvhRPcNcaaz2FQ-jTOjMj-hooDlY5UD-Pd6retJoF_jvz394gqZfBNWjvtdXzlFrfGu8y5-eAmNU6c'
  }
];