require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("./src/models/user.model");

const users = [
  {
    name: "Arjun Sharma",
    email: "arjun.sharma@example.com",
    username: "arjunsharma",
    displayName: "Arjun Sharma",
    location: "Delhi",
    age: 25,
    gender: "Male",
    archetype: "Builder",
    completionStatus: 100,
    role: "user",
    provider: "local",
    profileImageType: "avatar",
  },

  {
    name: "Priya Mehta",
    email: "priya.mehta@example.com",
    username: "priyamehta",
    displayName: "Priya Mehta",
    location: "Gurgaon",
    age: 24,
    gender: "Female",
    archetype: "Designer",
    completionStatus: 95,
    role: "user",
    provider: "local",
    profileImageType: "avatar",
  },

  {
    name: "Rohan Kapoor",
    email: "rohan.kapoor@example.com",
    username: "rohankapoor",
    displayName: "Rohan Kapoor",
    location: "Noida",
    age: 27,
    gender: "Male",
    archetype: "Strategist",
    completionStatus: 90,
    role: "user",
    provider: "local",
    profileImageType: "avatar",
  },

  {
    name: "Ananya Verma",
    email: "ananya.verma@example.com",
    username: "ananyaverma",
    displayName: "Ananya Verma",
    location: "Bangalore",
    age: 23,
    gender: "Female",
    archetype: "Creator",
    completionStatus: 100,
    role: "user",
    provider: "local",
    profileImageType: "avatar",
  },

  {
    name: "Kabir Singh",
    email: "kabir.singh@example.com",
    username: "kabirsingh",
    displayName: "Kabir Singh",
    location: "Mumbai",
    age: 28,
    gender: "Male",
    archetype: "Leader",
    completionStatus: 85,
    role: "user",
    provider: "local",
    profileImageType: "avatar",
  },

  {
    name: "Sneha Joshi",
    email: "sneha.joshi@example.com",
    username: "snehajoshi",
    displayName: "Sneha Joshi",
    location: "Pune",
    age: 26,
    gender: "Female",
    archetype: "Researcher",
    completionStatus: 92,
    role: "user",
    provider: "local",
    profileImageType: "avatar",
  },

  {
    name: "Aditya Malhotra",
    email: "aditya.malhotra@example.com",
    username: "adityamalhotra",
    displayName: "Aditya Malhotra",
    location: "Delhi",
    age: 26,
    gender: "Male",
    archetype: "Builder",
    completionStatus: 100,
    role: "user",
    provider: "local",
    profileImageType: "avatar",
  },

  {
    name: "Ishita Rao",
    email: "ishita.rao@example.com",
    username: "ishitarao",
    displayName: "Ishita Rao",
    location: "Hyderabad",
    age: 24,
    gender: "Female",
    archetype: "Creator",
    completionStatus: 88,
    role: "user",
    provider: "local",
    profileImageType: "avatar",
  },

  {
    name: "Vivek Bansal",
    email: "vivek.bansal@example.com",
    username: "vivekbansal",
    displayName: "Vivek Bansal",
    location: "Chandigarh",
    age: 29,
    gender: "Male",
    archetype: "Strategist",
    completionStatus: 96,
    role: "user",
    provider: "local",
    profileImageType: "avatar",
  },

  {
    name: "Meera Nair",
    email: "meera.nair@example.com",
    username: "meeranair",
    displayName: "Meera Nair",
    location: "Kochi",
    age: 25,
    gender: "Female",
    archetype: "Designer",
    completionStatus: 100,
    role: "user",
    provider: "local",
    profileImageType: "avatar",
  },

  {
    name: "Rahul Khanna",
    email: "rahul.khanna@example.com",
    username: "rahulkhanna",
    displayName: "Rahul Khanna",
    location: "Jaipur",
    age: 30,
    gender: "Male",
    archetype: "Leader",
    completionStatus: 82,
    role: "user",
    provider: "local",
    profileImageType: "avatar",
  },

  {
    name: "Kavya Iyer",
    email: "kavya.iyer@example.com",
    username: "kavyaiyer",
    displayName: "Kavya Iyer",
    location: "Chennai",
    age: 23,
    gender: "Female",
    archetype: "Researcher",
    completionStatus: 94,
    role: "user",
    provider: "local",
    profileImageType: "avatar",
  },

  {
    name: "Manav Gupta",
    email: "manav.gupta@example.com",
    username: "manavgupta",
    displayName: "Manav Gupta",
    location: "Lucknow",
    age: 27,
    gender: "Male",
    archetype: "Builder",
    completionStatus: 100,
    role: "user",
    provider: "local",
    profileImageType: "avatar",
  },

  {
    name: "Aditi Kapoor",
    email: "aditi.kapoor@example.com",
    username: "aditkapoor",
    displayName: "Aditi Kapoor",
    location: "Mumbai",
    age: 26,
    gender: "Female",
    archetype: "Strategist",
    completionStatus: 91,
    role: "user",
    provider: "local",
    profileImageType: "avatar",
  },

  {
    name: "Yash Thakur",
    email: "yash.thakur@example.com",
    username: "yashthakur",
    displayName: "Yash Thakur",
    location: "Dehradun",
    age: 24,
    gender: "Male",
    archetype: "Builder",
    completionStatus: 87,
    role: "user",
    provider: "local",
    profileImageType: "avatar",
  },

  {
    name: "Simran Kaur",
    email: "simran.kaur@example.com",
    username: "simrankaur",
    displayName: "Simran Kaur",
    location: "Amritsar",
    age: 25,
    gender: "Female",
    archetype: "Creator",
    completionStatus: 98,
    role: "user",
    provider: "local",
    profileImageType: "avatar",
  },

  {
    name: "Nikhil Sethi",
    email: "nikhil.sethi@example.com",
    username: "nikhilsethi",
    displayName: "Nikhil Sethi",
    location: "Gurgaon",
    age: 28,
    gender: "Male",
    archetype: "Leader",
    completionStatus: 93,
    role: "user",
    provider: "local",
    profileImageType: "avatar",
  },

  {
    name: "Tanya Agarwal",
    email: "tanya.agarwal@example.com",
    username: "tanyaagarwal",
    displayName: "Tanya Agarwal",
    location: "Bangalore",
    age: 24,
    gender: "Female",
    archetype: "Designer",
    completionStatus: 100,
    role: "user",
    provider: "local",
    profileImageType: "avatar",
  },

  {
    name: "Siddharth Jain",
    email: "siddharth.jain@example.com",
    username: "siddharthjain",
    displayName: "Siddharth Jain",
    location: "Ahmedabad",
    age: 29,
    gender: "Male",
    archetype: "Strategist",
    completionStatus: 89,
    role: "user",
    provider: "local",
    profileImageType: "avatar",
  },

  {
    name: "Naina Arora",
    email: "naina.arora@example.com",
    username: "nainaarora",
    displayName: "Naina Arora",
    location: "Delhi",
    age: 23,
    gender: "Female",
    archetype: "Creator",
    completionStatus: 97,
    role: "user",
    provider: "local",
    profileImageType: "avatar",
  },
];

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    // Optional:
    // Existing users delete karne hain toh uncomment karo.
    // await User.deleteMany({});

    const hashedPassword = await bcrypt.hash("Password@123", 10);

    const usersWithPassword = users.map((user) => ({
      ...user,
      password: hashedPassword,
    }));

    const createdUsers = await User.insertMany(usersWithPassword);

    console.log(`✅ ${createdUsers.length} users created`);

    console.log("\nLogin credentials:");
    console.log("Password for all users: Password@123");

    createdUsers.forEach((user) => {
      console.log(`${user.name} → ${user.email}`);
    });

    await mongoose.disconnect();

    console.log("\n🌱 Seeding completed");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seedUsers();