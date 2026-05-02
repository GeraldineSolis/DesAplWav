import userRepository from '../repositories/UserRepository.js';
import roleRepository from '../repositories/RoleRepository.js';
import bcrypt from 'bcryptjs';

export default async function seedUsers() {
    const adminEmail = "admin@tecsup.edu.pe";
    const existing = await userRepository.findByEmail(adminEmail);
    
    if (!existing) {
        const adminRole = await roleRepository.findByName('admin');
        const userRole = await roleRepository.findByName('user');
        const hashed = await bcrypt.hash("Admin123*", 10);
        const hashedPassword = await bcrypt.hash("Password123*", 10);
        const usersToSeed = [
            {
                name: "Admin",
                lastName: "Sistema",
                email: "admin@tecsup.edu.pe",
                password: hashed,
                phoneNumber: "999000111",
                birthdate: new Date(1990, 0, 1),
                address: "Campus Tecsup",
                roles: [adminRole._id]
            },
            {
                name: "Juan",
                lastName: "Perez",
                email: "juan.perez@tecsup.edu.pe",
                password: hashedPassword,
                phoneNumber: "987654321",
                birthdate: new Date(1995, 4, 15),
                address: "Av. Ejercito 123",
                roles: [userRole._id]
            },
            {
                name: "Maria",
                lastName: "Garcia",
                email: "m.garcia@tecsup.edu.pe",
                password: hashedPassword,
                phoneNumber: "955444333",
                birthdate: new Date(1998, 11, 20),
                address: "Calle Mercaderes 456",
                roles: [userRole._id]
            },
            {
                name: "Carlos",
                lastName: "Rodriguez",
                email: "c.rodriguez@tecsup.edu.pe",
                password: hashedPassword,
                phoneNumber: "911222333",
                birthdate: new Date(1992, 2, 10),
                address: "Urb. Yanahuara G-5",
                roles: [userRole._id]
            },
            {
                name: "Ana",
                lastName: "Martinez",
                email: "a.martinez@tecsup.edu.pe",
                password: hashedPassword,
                phoneNumber: "900888777",
                birthdate: new Date(1997, 7, 5),
                address: "Jose Luis Bustamante",
                roles: [userRole._id]
            },
            {
                name: "Luis",
                lastName: "Sanchez",
                email: "l.sanchez@tecsup.edu.pe",
                password: hashedPassword,
                phoneNumber: "944555666",
                birthdate: new Date(1994, 9, 30),
                address: "Cerro Colorado",
                roles: [userRole._id]
            }
        ];

        for (const user of usersToSeed) {
            const existing = await userRepository.findByEmail(user.email);
            if (!existing) {
                await userRepository.create(user);
                console.log(`✅ Usuario creado: ${user.email}`);
            }
        }
        console.log("Users seeded");
    }
}