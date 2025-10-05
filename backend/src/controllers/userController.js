const { prisma } = require("../db.js");

exports.updateProfile = async (req, res) => {
  const { fullName, lastName, gender, phone, country, timezone } = req.body;
  try {
    const dataUser = await prisma.user.update({
      where: {
        id: req.user.id,
      },
      data: {
        username: fullName,
        lastname: lastName,
        gender,
        phone,
        country,
        timezone,
      },
    });
    res
      .status(200)
      .json({ message: "updateProfilesuccess", profile: dataUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Cant get userData" });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const userData = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
    });
    res.status(200).json({ message: "get user Data success", user: userData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Cant get userData" });
  }
};
