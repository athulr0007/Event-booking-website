const User = require("../models/User");

// VIEW PROFILE
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      "name email phone location"
    );

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to load profile" });
  }
};

// UPDATE PROFILE
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, location } = req.body;

    const updated = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone, location },
      { new: true }
    ).select("name email phone location");

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to update profile" });
  }
};
