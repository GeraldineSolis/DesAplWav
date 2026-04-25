import User from "../models/User.js";

const seedUser = async () => {
    try {
        const adminEmail = "admin@socialdev.com";
        const existingUser = await User.findOne({ email: adminEmail });

        if (!existingUser) {
            await User.create({
                _id: "65f1a2b3c4d5e6f7a8b9c0d1", 
                name: "Admin",
                lastName: "Tecsup",
                email: adminEmail,
                age: 25,
                password: "Password123*",
                phoneNumber: "999888777"
            });
            console.log("✅ [Seeder]: Usuario base creado exitosamente.");
        } else {
            console.log("ℹ️ [Seeder]: El usuario base ya existe.");
        }
    } catch (error) {
        console.error("❌ [Seeder Error]:", error.message);
    }
};

export default seedUser;