let students = [
    { id: 1, name: "Ana", grade: 18 },
    { id: 2, name: "Luis", grade: 14 },
    { id: 3, name: "Pedro", grade: 16 }
];

function getAll() {
    return students;
}

function getById(id) {
    return students.find(s => s.id === id);
}

function create(student) {
    const requiredFields = ["name", "email", "course", "phone"];

    for (const field of requiredFields) {
        if (!student[field] || student[field].toString().trim() === "") {
            throw new Error(`El campo '${field}' es obligatorio.`);
        }
    }

    student.id = students.length + 1;
    students.push(student);
    return student;
}

function update(id, updateData) {
    const index = students.findIndex(s => s.id === id);
    if (index !== -1) {
        students[index] = { ...students[index], ...updateData };
        return students[index];
    }
    return null;
}

function remove(id) {
    const index = students.findIndex(s => s.id === id);
    if (index !== -1) {
        return students.splice(index, 1)[0];
    }
    return null;
}

function listByStatus(status) {
    return students.filter(s => 
        s.status && s.status.toLowerCase() === status.toLowerCase()
    );
}

function listByGrade(minGpa) {
    return students.filter(s => s.gpa >= minGpa);
}

module.exports = { getAll, getById, create, update, remove, listByStatus, listByGrade };