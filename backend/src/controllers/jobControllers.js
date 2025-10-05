const { prisma } = require("../db.js");

exports.createJobs = async (req, res) => {
  const { title, company, status, date, replied, tags, note } = req.body;
  try {
    const job = await prisma.jobs.create({
      data: {
        title,
        company,
        status,
        date: new Date(date),
        replied,
        tags,
        note,
        authorId: req.user.id,
      },
    });
    res.status(201).json({
      message: "Job created successfully",
      job: job,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

exports.getjobs = async (req, res) => {
  try {
    const allJobs = await prisma.jobs.findMany({
      where: {
        authorId: req.user.id,
      },
      orderBy: [
        {
          date: "desc",
        },
      ],
    });
    res
      .status(200)
      .json({ message: "get your job successfully", jobs: allJobs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

exports.deletejobs = async (req, res) => {
  const { jobId } = req.body;

  try {
    const deletejob = await prisma.jobs.delete({
      where: {
        id: Number(jobId),
      },
    });
    res.status(200).json({ message: "delete successful" }, deletejob);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

exports.updatejobs = async (req, res) => {
  const { id, title, company, status, date, replied, tags, note } = req.body;
  try {
    const updateJob = await prisma.jobs.update({
      where: {
        id: id,
      },
      data: {
        title,
        company,
        status,
        date,
        replied,
        tags,
        note,
      },
    });
    res.status(200).json({ message: "update successful" }, updateJob);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
};
