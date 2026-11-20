import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 8000;
const mongo_url = process.env.MONGO_URI || "mongodb+srv://amruthakande0_db_user:2bNmUKwwhRO2XqQk@cluster0.xzvaat5.mongodb.net/fsd_db?retryWrites=true&w=majority";

mongoose.connect(mongo_url).then(() => {
    console.log("Connected to MongoDB Atlas");
}).catch((err) => {
    console.error("Problem while connecting to MongoDB:", err);
});

const movieSchema = new mongoose.Schema({
    title: { type: String, required: true },
    director: String,
    category: { type: String, required: true },
    year: { type: Number, required: true }
});
const Movie = mongoose.model("Movie", movieSchema);

app.get("/", (req, res) => {
    res.json({ message: "Mongoose Express API is live and healthy", status: "OK", docs: "/api/v1/movies" });
});

app.post("/api/v1/movies", (req, res) => {
    const newMovie = new Movie(req.body);
    newMovie.save().then((result) => {
        res.status(201).json({ message: "Movie created successfully", data: result });
    }).catch((err) => {
        res.status(500).json({ message: "Problem while creating movie", error: err.message });
    });
});

app.get("/api/v1/movies", (req, res) => {
    const { category } = req.query;
    const filter = category ? { category } : {};
    Movie.find(filter).then((result) => {
        res.status(200).json({ message: "Movies retrieved successfully", data: result });
    }).catch((err) => {
        res.status(500).json({ message: "Problem while retrieving movies", error: err.message });
    });
});

app.get("/api/v1/movies/:id", (req, res) => {
    Movie.findById(req.params.id).then((result) => {
        if (!result) return res.status(404).json({ message: "Movie not found" });
        res.status(200).json({ message: "Movie retrieved successfully", data: result });
    }).catch((err) => {
        res.status(500).json({ message: "Problem while retrieving movie", error: err.message });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
