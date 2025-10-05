const { prisma } = require("../db.js");

exports.addEvents = async (req, res) => {
  const { title, note, startDate, endDate, allDay } = req.body;
  try {
    const event = await prisma.events.create({
      data: {
        title: title,
        note: note,
        startDate: startDate,
        endDate: endDate,
        allDay,
        authorId: req.user.id,
      },
    });
    res.status(201).json({ message: "create event successful", event });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

exports.getEvents = async (req, res) => {
  try {
    const allEvents = await prisma.events.findMany({
      where: {
        authorId: req.user.id,
      },
      orderBy: [
        {
          startDate: "desc",
        },
      ],
    });
    res
      .status(200)
      .json({ message: "get all events successfull", events: allEvents });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

exports.updateEvents = async (req, res) => {
  const { id, title, startDate, endDate, allDay, note } = req.body;
  try {
    const events = await prisma.events.update({
      where: {
        id: id,
      },
      data: {
        title,
        startDate,
        endDate,
        allDay,
        note,
      },
    });
    res.status(200).json({ message: "update success", events });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

exports.deleteEvents = async (req, res) => {
  const { eventId } = req.body;
  try {
    const deleteEvent = await prisma.events.delete({
      where: {
        id: eventId,
      },
    });
    res.status(200).json({ message: "delete successs" }, deleteEvent);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
};
