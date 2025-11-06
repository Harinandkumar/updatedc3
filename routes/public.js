const express = require("express");
const router = express.Router();

const Event = require("../models/Event");
const Notice = require("../models/Notice");
const Setting = require("../models/Setting");
const CoderOfMonth = require("../models/CoderOfMonth");
const TopWinner = require("../models/TopWinner"); // 🏆 New Model for results page

// 🏠 HOME ROUTE
router.get("/", async (req, res) => {
  try {
    const [events, notices, coders, examSetting] = await Promise.all([
      Event.find().sort({ date: -1 }),
      Notice.find().sort({ date: -1 }),
      CoderOfMonth.find().sort({ month: -1 }).limit(2), // Show latest 2 coders
      Setting.findOne({ key: "examLive" }),
    ]);

    const examLive = examSetting?.value || false;

    res.render("index", { events, notices, coders, examLive });
  } catch (error) {
    console.error("Error loading homepage:", error);
    res.render("index", {
      events: [],
      notices: [],
      coders: [],
      examLive: false,
    });
  }
});

// 🖼️ GALLERY ROUTE
router.get("/gallery", (req, res) => {
  res.render("gallery");
});

// 📢 TEAM PAGE
router.get("/team", (req, res) => {
  const coreMembers = [
    {
      name: "Sumit Sharma",
      role: "Core Member",
      img: "/assets/img/sumit1.jpg",
      github: "#",
      linkedin: "#",
    },
    {
      name: "Harinand Kumar",
      role: "Core Member",
      img: "/assets/img/harinand copy.jpg",
      github: "#",
      linkedin: "#",
    },
    {
      name: "Utkarsh Jha",
      role: "Core Member",
      img: "/assets/img/utkarsh.jpg",
      github: "#",
      linkedin: "#",
    },
    {
      name: "Basant Kumar",
      role: "Core Member",
      img: "/assets/img/basant.jpg",
      github: "#",
      linkedin: "#",
    },
    {
      name: "Raushan Kumar",
      role: "Core Member",
      img: "/assets/img/roushan.png",
      github: "#",
      linkedin: "#",
    },
  ];

  const coordinators = [
    {
      name: "Muskan Kumari",
      role: "Coordinator",
      img: "/assets/img/muskan.jpg",
      github: "#",
      linkedin: "#",
    },
    {
      name: "Shruti Raj",
      role: "Coordinator",
      img: "/assets/img/shruti.jpg",
      github: "#",
      linkedin: "#",
    },
  ];

  const subCoordinators = [
    {
      name: "Vishal Kriti",
      roll: "23152159003",
      img: "/assets/img/Snapchat-737430821 - Vishal Singh.jpg",
    },
    {
      name: "Prajjwal",
      roll: "23152159017",
      img: "/assets/img/IMG_20250817_194946 - PRAJJWAL.jpg",
    },
    {
      name: "Kajal Kumari",
      roll: "23152159047",
      img: "/assets/img/kumari kajal - Kajal Kumari.jpg",
    },
    {
      name: "Pushkar Kumar",
      roll: "23152159032",
      img: "/assets/img/DP.jpg - pushkar kumar.png",
    },
    {
      name: "Sonam Yadav",
      roll: "23152159040",
      img: "/assets/img/sonam yadav  - Sonam Yadav.jpg",
    },
    {
      name: "Ehetesham Alam",
      roll: "23104159009",
      img: "/assets/img/IMG-20230530-WA0001 - Ehetesham Alam.jpg",
    },
    {
      name: "Bhupendra Kumar",
      roll: "23104159002",
      img: "/assets/img/compressed photo - bhuvi yara.jpg",
    },
  ];

  res.render("team", { coreMembers, coordinators, subCoordinators });
});

// ⚡ EVENTS API
router.get("/allevents", async (req, res) => {
  try {
    const events = await Event.find().sort({ date: -1 });
    res.json(events);
  } catch (err) {
    console.error("Error fetching events:", err);
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

// 📢 NOTICES API
router.get("/api/notices", async (req, res) => {
  try {
    const notices = await Notice.find().sort({ date: -1 });
    res.json(notices);
  } catch (err) {
    console.error("Error fetching notices:", err);
    res.status(500).json({ error: "Failed to fetch notices" });
  }
});

// 👑 CODER OF THE MONTH API
router.get("/api/coders", async (req, res) => {
  try {
    const coders = await CoderOfMonth.find().sort({ month: -1 });
    res.json(coders);
  } catch (err) {
    console.error("Error fetching coders:", err);
    res.status(500).json({ error: "Failed to fetch coders" });
  }
});

// 🧠 EXAM PAGE (optional)
router.get("/exam", (req, res) => {
  res.render("exam"); // Make sure views/exam.ejs exists
});

// 🏆 RESULTS PAGE (All Top 3 per event)
router.get("/results", async (req, res) => {
  try {
    const winners = await TopWinner.find().sort({ date: -1 });
    res.render("results", { winners });
  } catch (err) {
    console.error("Error loading results:", err);
    res.render("results", { winners: [] });
  }
});

module.exports = router;
