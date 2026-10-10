require('dotenv').config();
const mongoose = require('mongoose');
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
const User = require('./models/User');
const Job = require('./models/Job');

const sampleJobs = [
  // Plumbing
  { title: 'Plumber', company: 'Urban Company', location: 'Bangalore', salary: '₹15-25k/month', description: 'Fix and install pipes, faucets, and water heaters. Residential and commercial work available. Tools provided.', type: 'Full-time', category: 'Plumbing' },
  { title: 'Pipe Fitter', company: 'Bharat Plumbing Works', location: 'Mumbai', salary: '₹18-28k/month', description: 'Install and repair piping systems for water and drainage. Experience with PVC and copper pipes required.', type: 'Full-time', category: 'Plumbing' },
  { title: 'Drainage Specialist', company: 'City Sewage Board', location: 'Delhi', salary: '₹12-18k/month', description: 'Clear blocked drains and maintain sewage lines. Night shift allowance available.', type: 'Contract', category: 'Plumbing' },
  // Electrician
  { title: 'Electrician', company: 'Havells Service', location: 'Bangalore', salary: '₹18-30k/month', description: 'Install and maintain electrical wiring, switches, and appliances. Must have ITI certification.', type: 'Full-time', category: 'Electrician' },
  { title: 'Wireman', company: 'Siemens India', location: 'Pune', salary: '₹15-22k/month', description: 'Work on residential and commercial wiring projects. Basic knowledge of MCBs and distribution boards.', type: 'Full-time', category: 'Electrician' },
  { title: 'AC Technician', company: 'Voltas Service', location: 'Chennai', salary: '₹20-35k/month', description: 'Install, repair, and service split AC units. Free training provided on new models.', type: 'Full-time', category: 'Electrician' },
  // Cleaning
  { title: 'House Cleaner', company: 'Maid Brigade India', location: 'Hyderabad', salary: '₹10-15k/month', description: 'Clean homes, offices, and apartments. Flexible timings. Weekly or bi-weekly clients.', type: 'Part-time', category: 'Cleaning' },
  { title: 'Office Janitor', company: 'CBRE Facilities', location: 'Bangalore', salary: '₹12-18k/month', description: 'Maintain cleanliness of commercial office space. Morning shift 6AM-2PM. Uniform provided.', type: 'Full-time', category: 'Cleaning' },
  { title: 'Sofa & Carpet Cleaner', company: 'Urban Company', location: 'Mumbai', salary: '₹15-25k/month', description: 'Deep clean sofas, carpets, and upholstery using industrial machines. Training given.', type: 'Full-time', category: 'Cleaning' },
  // Painting
  { title: 'House Painter', company: 'Asian Paints Service', location: 'Bangalore', salary: '₹15-22k/month', description: 'Paint interior and exterior walls. Knowledge of texture finishes and waterproofing is a plus.', type: 'Full-time', category: 'Painting' },
  { title: 'Spray Painter', company: 'Berger Paints', location: 'Chennai', salary: '₹18-28k/month', description: 'Operate spray painting equipment for large projects. Experience with automotive painting preferred.', type: 'Full-time', category: 'Painting' },
  { title: 'Wall Texture Artist', company: 'Decorative Walls Studio', location: 'Mumbai', salary: '₹20-35k/month', description: 'Create decorative wall textures and finishes. Commission-based bonuses available.', type: 'Contract', category: 'Painting' },
  // Carpentry
  { title: 'Carpenter', company: 'IKEA Assembly Services', location: 'Bangalore', salary: '₹18-30k/month', description: 'Assemble furniture, install cabinets, and do custom woodwork. Own tools preferred but not required.', type: 'Full-time', category: 'Carpentry' },
  { title: 'Furniture Finisher', company: 'Wooden Street', location: 'Jaipur', salary: '₹15-25k/month', description: 'Sand, polish, and finish wooden furniture. Knowledge of varnishing and staining techniques.', type: 'Full-time', category: 'Carpentry' },
  { title: 'Cabinet Maker', company: 'Modular Kitchen India', location: 'Delhi', salary: '₹20-35k/month', description: 'Build and install modular kitchen cabinets. Experience with CNC machines is a plus.', type: 'Full-time', category: 'Carpentry' },
  // Construction
  { title: 'Mason', company: 'L&T Construction', location: 'Bangalore', salary: '₹18-30k/month', description: 'Lay bricks, blocks, and stones for building construction. Must know plastering and concrete work.', type: 'Full-time', category: 'Construction' },
  { title: 'Site Supervisor', company: 'DLF Builders', location: 'Gurgaon', salary: '₹25-40k/month', description: 'Supervise construction workers, manage materials, and ensure project timelines are met.', type: 'Full-time', category: 'Construction' },
  { title: 'Heavy Equipment Operator', company: 'JCB India', location: 'Pune', salary: '₹22-35k/month', description: 'Operate JCB, cranes, and other heavy machinery. License and 2+ years experience required.', type: 'Full-time', category: 'Construction' },
  // Driver
  { title: 'Cab Driver', company: 'Uber', location: 'Bangalore', salary: '₹20-35k/month', description: 'Drive passengers using your own car or company vehicle. Flexible hours, weekly payouts.', type: 'Part-time', category: 'Driver' },
  { title: 'Delivery Driver', company: 'Zomato', location: 'Hyderabad', salary: '₹15-25k/month', description: 'Deliver food orders on your bike/scooter. Incentives for peak hours and good ratings.', type: 'Part-time', category: 'Driver' },
  { title: 'Truck Driver', company: 'DHL Logistics', location: 'Chennai', salary: '₹25-40k/month', description: 'Transport goods between cities. Valid heavy vehicle license and 3+ years experience.', type: 'Full-time', category: 'Driver' },
  // Cook
  { title: 'Restaurant Cook', company: 'Dominos Pizza', location: 'Bangalore', salary: '₹12-20k/month', description: 'Prepare pizzas and other menu items. Fast-paced kitchen environment. Food safety training provided.', type: 'Full-time', category: 'Cook' },
  { title: 'Home Chef', company: 'FreshMenu', location: 'Mumbai', salary: '₹15-25k/month', description: 'Cook meals from home for delivery orders. Must have hygiene certification and home kitchen.', type: 'Part-time', category: 'Cook' },
  { title: 'Pastry Chef', company: 'Taj Hotels', location: 'Delhi', salary: '₹25-40k/month', description: 'Bake cakes, pastries, and desserts for 5-star hotel. Diploma in bakery preferred.', type: 'Full-time', category: 'Cook' },
  // Gardening
  { title: 'Gardener', company: 'Green Thumb Services', location: 'Bangalore', salary: '₹10-16k/month', description: 'Maintain gardens, trim plants, water lawns, and apply fertilizers. Knowledge of native plants preferred.', type: 'Full-time', category: 'Gardening' },
  { title: 'Landscape Worker', company: 'Godrej Garden City', location: 'Pune', salary: '₹14-22k/month', description: 'Assist in landscaping projects — planting, sodding, and installing irrigation systems.', type: 'Full-time', category: 'Gardening' },
  // Pest Control
  { title: 'Pest Control Technician', company: 'HiCare Pest Control', location: 'Bangalore', salary: '₹15-22k/month', description: 'Inspect premises and apply pest treatment for termites, cockroaches, and mosquitoes. Training provided.', type: 'Full-time', category: 'Pest Control' },
  { title: 'Fumigation Specialist', company: 'Rentokil PCI', location: 'Mumbai', salary: '₹18-28k/month', description: 'Carry out fumigation and rodent control for commercial clients. Certification required.', type: 'Full-time', category: 'Pest Control' },
  // Mechanic
  { title: 'Bike Mechanic', company: 'Bajaj Auto Service', location: 'Pune', salary: '₹12-20k/month', description: 'Service and repair motorcycles and scooters. Basic mechanical knowledge required.', type: 'Full-time', category: 'Mechanic' },
  { title: 'Car Mechanic', company: 'Maruti Suzuki Service', location: 'Delhi', salary: '₹18-30k/month', description: 'Diagnose and repair cars — engine, transmission, brakes. ITI or diploma in automotive preferred.', type: 'Full-time', category: 'Mechanic' },
  { title: 'Diesel Mechanic', company: 'Ashok Leyland', location: 'Chennai', salary: '₹20-32k/month', description: 'Repair and maintain diesel engines for trucks and buses. Night shift available.', type: 'Full-time', category: 'Mechanic' },
  // Labour
  { title: 'Construction Labourer', company: 'Shapoorji Pallonji', location: 'Mumbai', salary: '₹12-18k/month', description: 'General construction work — carrying materials, digging, mixing cement. Daily wage with overtime.', type: 'Full-time', category: 'Labour' },
  { title: 'Warehouse Worker', company: 'Amazon Fulfillment', location: 'Hyderabad', salary: '₹14-20k/month', description: 'Pick, pack, and ship orders in a fast-paced warehouse. Night shift allowance.', type: 'Full-time', category: 'Labour' },
  { title: 'Loading/Unloading Helper', company: 'DTDC Courier', location: 'Bangalore', salary: '₹10-15k/month', description: 'Load and unload parcels from trucks. Physically demanding role. Overtime paid.', type: 'Full-time', category: 'Labour' },
  // Security
  { title: 'Security Guard', company: 'SIS Security', location: 'Bangalore', salary: '₹12-18k/month', description: 'Monitor premises, check visitors, and patrol the building. Must be physically fit. 12-hour shifts.', type: 'Full-time', category: 'Security' },
  { title: 'CCTV Operator', company: 'G4S India', location: 'Mumbai', salary: '₹14-22k/month', description: 'Monitor CCTV cameras and report suspicious activity. Basic computer knowledge required.', type: 'Full-time', category: 'Security' },
  { title: 'Bouncer', company: 'Nightlife Security', location: 'Delhi', salary: '₹18-28k/month', description: 'Provide security at clubs and events. Must have good physique and communication skills.', type: 'Part-time', category: 'Security' },
  // Delivery
  { title: 'Delivery Boy', company: 'Swiggy', location: 'Bangalore', salary: '₹15-25k/month', description: 'Deliver food orders on your bike. Flexible timings. Sign-up bonus available.', type: 'Part-time', category: 'Delivery' },
  { title: 'Parcel Delivery Agent', company: 'Delhivery', location: 'Chennai', salary: '₹14-22k/month', description: 'Deliver e-commerce parcels within your area. Own vehicle preferred but company vehicle available.', type: 'Full-time', category: 'Delivery' },
  { title: 'Grocery Delivery Partner', company: 'BigBasket', location: 'Hyderabad', salary: '₹12-20k/month', description: 'Deliver groceries to customers. Morning shift 6AM-12PM available. Weekly pay.', type: 'Part-time', category: 'Delivery' },
  // Teaching
  { title: 'Tutor', company: 'Byjus Tutoring', location: 'Bangalore', salary: '₹15-25k/month', description: 'Teach school students (Class 1-10) subjects like Maths, Science, English. Flexible hours.', type: 'Part-time', category: 'Teaching' },
  { title: 'Computer Teacher', company: 'NIIT', location: 'Pune', salary: '₹18-30k/month', description: 'Teach basic computer skills, MS Office, and internet usage to adult learners.', type: 'Full-time', category: 'Teaching' },
  // IT
  { title: 'Software Developer', company: 'TCS', location: 'Bangalore', salary: '₹25-40 LPA', description: 'Develop web applications using Java, Spring Boot, and React. Work on enterprise projects.', type: 'Full-time', category: 'IT' },
  { title: 'Web Designer', company: 'Freelancer.com', location: 'Remote', salary: '₹20-35k/month', description: 'Design and build websites for small businesses. Knowledge of WordPress and HTML/CSS.', type: 'Remote', category: 'IT' },
  { title: 'Tech Support Executive', company: 'Wipro', location: 'Hyderabad', salary: '₹15-22k/month', description: 'Provide technical support to customers via phone and email. Night shift available.', type: 'Full-time', category: 'IT' },
  // Healthcare
  { title: 'Staff Nurse', company: 'Apollo Hospitals', location: 'Chennai', salary: '₹20-35k/month', description: 'Provide patient care, administer medications, and assist doctors. GNM or B.Sc Nursing required.', type: 'Full-time', category: 'Healthcare' },
  { title: 'Home Care Attendant', company: 'Portea Medical', location: 'Bangalore', salary: '₹12-18k/month', description: 'Take care of elderly patients at home — bathing, feeding, and medication reminders.', type: 'Full-time', category: 'Healthcare' },
  { title: 'Lab Technician', company: 'Dr. Lals Pathology', location: 'Delhi', salary: '₹15-25k/month', description: 'Collect blood and urine samples, run lab tests. DMLT certification required.', type: 'Full-time', category: 'Healthcare' },
];

async function seed() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      family: 4,
    });
    console.log('Connected to MongoDB');

    let recruiter = await User.findOne({ email: 'hr@nexova.com' });
    if (!recruiter) {
      recruiter = await User.create({
        name: 'Nexova HR',
        email: 'hr@nexova.com',
        password: 'password123',
        role: 'recruiter',
        phone: '+919999999999',
        location: 'Bangalore',
      });
      console.log('Created recruiter: hr@nexova.com / password123');
    } else {
      console.log('Using existing recruiter: hr@nexova.com');
    }

    await Job.deleteMany({});
    const jobs = await Job.insertMany(
      sampleJobs.map(job => ({ ...job, postedBy: recruiter._id }))
    );
    console.log(`Seeded ${jobs.length} jobs successfully`);

    console.log('\n--- Seed Summary ---');
    console.log(`Recruiter email: hr@nexova.com`);
    console.log(`Recruiter password: password123`);
    console.log(`Jobs created: ${jobs.length}`);
    console.log('--------------------\n');

    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err.message);
    process.exit(1);
  }
}

seed();