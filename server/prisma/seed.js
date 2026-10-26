const prisma = require('../prismaClient');

async function main() {
  console.log('Seeding LocalConnect neighborhood community data...');

  // Posts / Announcements
  await prisma.post.create({
    data: { content: 'Garage sale announcement - This Saturday at 123 Maple St starting 8 AM!' }
  });
  await prisma.post.create({
    data: { content: 'Lost dog notice - Golden Retriever named "Buddy" last seen near Oak Park. Please call (555) 0192 if spotted!' }
  });
  await prisma.post.create({
    data: { content: 'Community block cleanup - Meet at the community center this Sunday at 9 AM. Gloves and bags provided!' }
  });

  // Issues / Neighborhood Alerts
  await prisma.issue.create({
    data: { title: 'Broken Streetlight', description: 'Corner of 4th and Oak is pitch black at night, making walking unsafe.' }
  });
  await prisma.issue.create({
    data: { title: 'Park Trash Bins Overflowing', description: 'Maplewood Park bins have not been emptied since weekend soccer games.' }
  });

  // Community Events
  await prisma.event.create({
    data: {
      title: 'Neighborhood Spring Clean-Up & Tree Planting',
      description: 'Join fellow neighbors to pick up litter along Oak Creek and plant 15 shade saplings. Coffee and donuts provided by Maplewood Bakery!',
      date: 'Saturday, Nov 15 • 9:00 AM',
      location: 'Maplewood Community Park Pavilion',
      organizer: 'Elena Rostova',
      category: 'Cleanup',
      attendees: 16
    }
  });
  await prisma.event.create({
    data: {
      title: 'Annual Elm Street Block Party & Potluck',
      description: 'Bring a dish or dessert! We will have live acoustic music, face painting for kids, and a grilling station.',
      date: 'Sunday, Nov 23 • 4:00 PM',
      location: 'Elm Street Cul-de-sac',
      organizer: 'Marcus Davis',
      category: 'Social',
      attendees: 32
    }
  });

  // Local Recommendations
  await prisma.recommendation.create({
    data: {
      title: "Apex Plumbing & Drain Solutions",
      category: "Plumbing",
      description: "Fixed a ruptured kitchen pipe on a Sunday morning within 30 minutes. Clear upfront pricing, polite, and spotless cleanup.",
      contact: "(555) 234-8891 • apexplumb@gmail.com",
      recommendedBy: "Sarah Jenkins",
      rating: 5,
      likes: 14
    }
  });
  await prisma.recommendation.create({
    data: {
      title: "BrightSpark Electrical Services",
      category: "Electrical",
      description: "Installed our Level 2 EV home charger and added outdoor surge protection. Fully licensed and handled city permits seamlessly.",
      contact: "(555) 782-3401",
      recommendedBy: "David Chen",
      rating: 5,
      likes: 11
    }
  });

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  });
