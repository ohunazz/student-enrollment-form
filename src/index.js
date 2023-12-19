import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

dotenv.config();

const prisma = new PrismaClient();
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

app.get("/health", (_, res) => {
    res.status(200).json("Success");
});

app.get("/students", async (_, res) => {
    try {
        const students = await prisma.student.findMany({
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                className: true
            }
        });

        res.status(200).json({
            data: students
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post("/students", async (req, res) => {
    const {
        body: { firstName, lastName, email, className }
    } = req;

    if (!firstName || !lastName || !email || !className) {
        res.status(400).json({
            message: "Student information is not valid!"
        });
        return;
    }

    try {
        const student = await prisma.student.create({
            data: {
                firstName,
                lastName,
                email,
                className
            }
        });

        res.status(201).json({
            data: student
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.delete("/students/:id", async (req, res) => {
    const {
        params: { id }
    } = req;

    try {
        const student = await prisma.student.findUnique({
            where: {
                id: parseInt(id)
            }
        });

        if (!student) {
            res.status(404).json({
                message: "Student not found"
            });
            return;
        }

        await prisma.student.delete({
            where: {
                id: parseInt(id)
            }
        });

        res.status(203).send();
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
});

app.put("/students/:id", async (req, res) => {
    const {
        params: { id },
        body: { firstName, lastName, email, className }
    } = req;

    if (!firstName || !lastName || !email || !className) {
        res.status(400).json({
            message: "Student information is not valid!"
        });
        return;
    }

    try {
        const student = await prisma.student.findUnique({
            where: {
                id: parseInt(id)
            }
        });

        if (!student) {
            res.status(404).json({
                message: "Student not found"
            });
            return;
        }

        const updatedStudent = await prisma.student.update({
            where: {
                id: parseInt(id)
            },
            data: {
                firstName,
                lastName,
                email,
                className
            }
        });

        res.status(200).json({
            data: updatedStudent
        });
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
});

app.listen(PORT, () => {
    console.log("Server is running on ", PORT);
});
