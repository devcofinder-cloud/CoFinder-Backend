require("dotenv").config();

const mongoose = require("mongoose");

const User = require("./src/models/user.model");
const Post = require("./src/models/post.model");

const userEmails = [
    "arjun.sharma@example.com",
    "priya.mehta@example.com",
    "rohan.kapoor@example.com",
    "ananya.verma@example.com",
    "kabir.singh@example.com",
    "sneha.joshi@example.com",
    "aditya.malhotra@example.com",
    "ishita.rao@example.com",
    "vivek.bansal@example.com",
    "meera.nair@example.com",
    "rahul.khanna@example.com",
    "kavya.iyer@example.com",
    "manav.gupta@example.com",
    "aditi.kapoor@example.com",
    "yash.thakur@example.com",
    "simran.kaur@example.com",
    "nikhil.sethi@example.com",
    "tanya.agarwal@example.com",
    "siddharth.jain@example.com",
    "naina.arora@example.com",
];

const postTemplates = {
    Builder: [
        "Been working on a new product idea lately. The hardest part isn't writing the code, it's figuring out what actually deserves to be built.",
        "Spent the day improving the backend architecture of a side project. Clean code feels great, but simple code feels even better.",
        "There's something satisfying about turning an idea written on paper into something people can actually use.",
    ],

    Designer: [
        "Good design isn't about adding more things. It's about removing everything that doesn't need to be there.",
        "Spent some time exploring a cleaner approach to dashboard design. Small spacing and typography changes can completely change how a product feels.",
        "Working on UI concepts today. Still believe the best interfaces are the ones users understand without needing instructions.",
    ],

    Strategist: [
        "A great product doesn't start with features. It starts with understanding the problem you're actually trying to solve.",
        "Spent some time thinking about product strategy today. Sometimes the smartest move is knowing what NOT to build.",
        "Growth isn't always about doing more. Sometimes it's about doing fewer things consistently and doing them exceptionally well.",
    ],

    Creator: [
        "Creating something every day, even when nobody is watching, is probably one of the best ways to improve.",
        "Ideas are everywhere. The real challenge is turning one of them into something meaningful.",
        "Experimenting with a new content format today. Trying to focus more on storytelling and less on chasing trends.",
    ],

    Leader: [
        "Leadership isn't about having all the answers. It's about creating an environment where the team can find better answers together.",
        "One thing I've learned recently: people don't need perfect plans, they need clarity, trust, and room to execute.",
        "Building a strong team takes time. Skills matter, but attitude, ownership, and communication matter just as much.",
    ],

    Researcher: [
        "Spent the day going through research papers and taking notes. Still amazed by how much there is left to learn.",
        "The more I research a problem, the more interesting it becomes. Good questions usually lead to better solutions.",
        "Trying to get better at separating assumptions from actual evidence. It's harder than it sounds, but incredibly useful.",
    ],
};

const getRandomItems = (array, min, max) => {
    if (!array.length) return [];

    const shuffled = [...array].sort(() => Math.random() - 0.5);

    const count =
        Math.floor(Math.random() * (max - min + 1)) + min;

    return shuffled.slice(0, Math.min(count, array.length));
};

const getRandomDate = (daysAgo = 30) => {
    const now = Date.now();

    const randomTime =
        Math.floor(Math.random() * daysAgo * 24 * 60 * 60 * 1000);

    return new Date(now - randomTime);
};

const seedPosts = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB connected");

        const users = await User.find({
            email: { $in: userEmails },
        }).select("_id name email archetype");

        if (users.length !== userEmails.length) {
            console.log(
                `⚠️ Found ${users.length} users out of ${userEmails.length}`
            );
        }

        if (!users.length) {
            throw new Error(
                "No users found. Please seed users first."
            );
        }

        // ------------------------------------------------
        // OPTIONAL:
        // Agar previous seeded posts delete karne hain
        // toh neeche wali line uncomment kar dena.
        // ------------------------------------------------

        // await Post.deleteMany({});

        const posts = [];

        for (const user of users) {
            const templates =
                postTemplates[user.archetype] ||
                postTemplates.Builder;

            // Har user ke 3 posts
            for (let i = 0; i < 3; i++) {
                const content = templates[i % templates.length];

                // Current user ko like list me nahi daalenge
                const otherUsers = users.filter(
                    (u) => u._id.toString() !== user._id.toString()
                );

                // Random 1-7 likes
                const likes = getRandomItems(
                    otherUsers,
                    1,
                    7
                ).map((u) => u._id);

                const post = {
                    author: user._id,

                    content,

                    media: [],

                    likes,

                    commentsCount:
                        Math.floor(Math.random() * 15),

                    isDeleted: false,

                    createdAt: getRandomDate(45),
                    updatedAt: new Date(),
                };

                posts.push(post);
            }
        }

        const createdPosts = await Post.insertMany(posts);

        console.log(
            `\n✅ ${createdPosts.length} posts created`
        );

        console.log("\n📊 Posts by user:");

        for (const user of users) {
            const count = posts.filter(
                (post) =>
                    post.author.toString() ===
                    user._id.toString()
            ).length;

            console.log(
                `${user.name} (${user.archetype}) → ${count} posts`
            );
        }

        await mongoose.disconnect();

        console.log("\n🌱 Post seeding completed");
    } catch (error) {
        console.error(
            "\n❌ Post seeding failed:",
            error
        );

        await mongoose.disconnect();

        process.exit(1);
    }
};

seedPosts();