const { Firestore } = require("@google-cloud/firestore");
const jwt = require("jsonwebtoken");

const firestore = new Firestore();
const JWT_SECRET = "2343434asaflajsdfkljalsibkei"; // Consider storing this securely

const getCollection = (collectionName) => firestore.collection(collectionName);

exports.signup = async (req, res) => {
  const { firstName, lastName, email, password, role, bu, transport } =
    req.body;
  const token = jwt.sign({ email }, JWT_SECRET);

  try {
    await getCollection("users").doc(email).set({
      firstName,
      lastName,
      email,
      password, // Note: Store hashed passwords in production
      role,
      bu,
      transport,
    });
    res.status(201).json({ message: "Data inserted successfully", token });
  } catch (err) {
    console.error("Error inserting user:", err.message);
    res.status(500).json({ error: "Error inserting data into Firestore" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userDoc = await getCollection("users").doc(email).get();
    const user = userDoc.data();

    if (!user || user.password !== password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const newToken = jwt.sign({ email: user.email }, JWT_SECRET);
    res
      .status(200)
      .json({ message: "Login successful", token: newToken, role: user.role });
  } catch (err) {
    console.error("Error fetching user data:", err.message);
    res.status(500).json({ error: "Error fetching user data" });
  }
};

exports.getBu = async (req, res) => {
  try {
    const buSnapshot = await getCollection("bu").get();
    if (buSnapshot.empty) {
      return res.status(404).json({ message: "Bu not found" });
    }
    const Bu = buSnapshot.docs.map((doc) => doc.data());
    res.status(200).json(Bu);
  } catch (err) {
    console.error("Error fetching Bu:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getAllocatedSetsAdmin = async (req, res) => {
  try {
    const allocatedSetsSnapshot = await getCollection(
      "allocatedSetsAdmin"
    ).get();
    if (allocatedSetsSnapshot.empty) {
      return res.status(404).json({ message: "Allocated sets not found" });
    }
    const allocatedSeats = allocatedSetsSnapshot.docs.map((doc) => doc.data());
    res.status(200).json(allocatedSeats);
  } catch (err) {
    console.error("Error fetching allocated seats:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getSeatingCapacityAdmin = async (req, res) => {
  try {
    const capacitySnapshot = await getCollection("seatingCapacityAdmin").get();
    if (capacitySnapshot.empty) {
      return res.status(404).json({ message: "Seating capacity not found" });
    }
    const getCapacity = capacitySnapshot.docs.map((doc) => doc.data());
    res.status(200).json(getCapacity);
  } catch (err) {
    console.error("Error fetching seating capacity:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.postSeatingCapacityAdmin = async (req, res) => {
  const requestBody = req.body;
  try {
    await getCollection("seatingCapacityAdmin").add(requestBody);
    res.status(201).json({ msg: "Created successfully" });
  } catch (err) {
    console.error("Error creating seating capacity:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateSeatingCapacityAdmin = async (req, res) => {
  const id = req.params.id;
  const { capacity } = req.body;
  try {
    if (!id) {
      return res.status(400).json({ error: "Missing id" });
    }
    const docRef = getCollection("seatingCapacityAdmin").doc(id);
    await docRef.update({ capacity });
    res.status(200).json({ msg: "Updated successfully" });
  } catch (err) {
    console.error("Error updating seating capacity:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteSeatingCapacityAdmin = async (req, res) => {
  const id = req.params.id;
  try {
    if (!id) {
      return res.status(400).json({ error: "Missing id" });
    }
    await getCollection("seatingCapacityAdmin").doc(id).delete();
    res.status(200).json({ msg: "Deleted successfully" });
  } catch (err) {
    console.error("Error deleting seating capacity:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.createAllocatedSetsAdmin = async (req, res) => {
  const requestBody = req.body;
  try {
    await getCollection("allocatedSetsAdmin").add(requestBody);
    res.status(201).json({ msg: "Created successfully" });
  } catch (err) {
    console.error("Error creating allocated sets:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getSeatingCapacityAdminByFilter = async (req, res) => {
  try {
    const { country, city, state, floor } = req.query;
    const query = getCollection("seatingCapacityAdmin")
      .where("country", "==", country)
      .where("state", "==", state)
      .where("city", "==", city)
      .where("floor", "==", parseInt(floor));

    const filteredSnapshot = await query.get();
    if (filteredSnapshot.empty) {
      return res.status(404).json({ message: "Seating capacity not found" });
    }
    const allocatedSeats = filteredSnapshot.docs.map((doc) => doc.data());
    res.status(200).json(allocatedSeats);
  } catch (err) {
    console.error("Error fetching seating capacity by filter:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getHOEFromTable = async (req, res) => {
  const id = parseInt(req.params.id, 10);

  try {
    const hoeDoc = await getCollection("hoe").doc(id.toString()).get();
    const result = hoeDoc.data();
    if (!result) {
      return res.status(404).json({ message: "HOE not found" });
    }
    res.status(200).json(result);
  } catch (err) {
    console.error("Error fetching HOE:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getManagersByHOEIdFromTable = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { campus, floor } = req.query;

  try {
    const query = getCollection("managers")
      .where("hoeId", "==", id)
      .where("campus", "==", campus)
      .where("floor", "==", parseInt(floor));

    const managersSnapshot = await query.get();
    if (managersSnapshot.empty) {
      return res.status(404).json({ message: "Managers not found" });
    }
    const result = managersSnapshot.docs.map((doc) => doc.data());
    res.status(200).json(result);
  } catch (err) {
    console.error("Error fetching managers:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateManagerData = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { seats } = req.body;

  try {
    const docRef = getCollection("managers").doc(id.toString());
    await docRef.update({ seats });
    res.status(200).json({ message: "Manager data updated successfully" });
  } catch (err) {
    console.error("Error updating manager data:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
