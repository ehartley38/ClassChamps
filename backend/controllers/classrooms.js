const classroomsRouter = require("express").Router();
const Classroom = require("../models/classroom");

let toolFile = require("../utils/tools");
const User = require("../models/user");
const Assignment = require("../models/assignment");
const AssignmentSubmission = require("../models/assignmentSubmission");

// USED
classroomsRouter.post("/", async (request, response) => {
  const body = request.body;

  const user = request.user;

  const classroom = new Classroom({
    owners: [user._id],
    roomName: body.roomName,
  });

  try {
    // Add the classroom document here
    const savedClassroom = await classroom.save();
    // And the classroom reference in the user document here
    user.classrooms = user.classrooms.concat(savedClassroom._id);
    await user.save();

    response.status(201).json(savedClassroom);
  } catch (error) {
    response.status(400).json(error);
  }
});

// USED
classroomsRouter.get("/teacherClassrooms", async (request, response) => {
  const user = request.user;
  const classrooms = await Classroom.find({ owners: user._id });

  response.json(classrooms);
});

// USED
classroomsRouter.get("/studentClassrooms", async (request, response) => {
  const user = request.user;
  const classrooms = await Classroom.find({ students: user._id }).populate(
    "assignmentIds"
  );

  response.json(classrooms);
});

// USED
classroomsRouter.get("/:id", async (request, response) => {
  const id = request.params.id;
  const classroom = await Classroom.findById(id).populate("students").exec();

  response.json(classroom);
});

// USED
classroomsRouter.delete("/:id", async (request, response) => {
  const user = request.user;

  try {
    const classroom = await Classroom.findById(request.params.id);
    if (classroom.owners.includes(user._id)) {
      await Classroom.findByIdAndRemove(request.params.id);
      user.classrooms.pull(request.params.id);
      await user.save();

      const assignmentsToDelete = await Assignment.find({
        classroomId: request.params.id,
      });

      const assignmentIdsToDelete = assignmentsToDelete.map((assignment) => {
        assignment._id;
      });

      //Delete the assignments
      const deletedAssignments = await Assignment.deleteMany({
        classroomId: request.params.id,
      });

      //Delete the assignment submissions
      await AssignmentSubmission.deleteMany({
        assignmentId: { $in: assignmentIdsToDelete },
      });

      response.status(204).end();
    }
    response.status(401).end();
  } catch (err) {
    response.status(400).end();
  }
});

// USED
// Generate a room code for a given classroom
classroomsRouter.put("/:id/generate-code", async (request, response) => {
  const user = request.user;
  const body = request.body;
  const ownersArray = Object.values(body.owners);
  let isTest = body.isTest; // Used for testing

  if (ownersArray.includes(user.id)) {
    let unique = false;
    while (unique === false) {
      let code = isTest ? "123456" : toolFile.generateCode(6);
      isTest = false;

      try {
        const updatedClassroom = await Classroom.findOneAndUpdate(
          { _id: body.id },
          { roomCode: code },
          { new: true }
        ).populate("students");
        unique = true;
        response.status(200).json(updatedClassroom).end();
      } catch (err) {
        console.log(err);
      }
    }
  } else {
    response.status(401).end();
  }
});

// USED
// Add the user to the classroom using the room code
classroomsRouter.put("/join", async (request, response) => {
  const user = request.user;
  const code = request.body.roomCode.toUpperCase();

  try {
    const classroom = await Classroom.findOne({ roomCode: code });
    if (!classroom) {
      //throw new Error('Invalid classroom code')
      return response.sendStatus(404); //Not found
    } else {
      if (classroom.students.includes(user.id)) {
        return response
          .status(200)
          .json({ message: "User already registered in class" });
      }

      classroom.students = classroom.students.concat(user._id);
      user.classrooms = user.classrooms.concat(classroom._id);
      await classroom.save();
      await user.save();

      response.json(classroom);
    }
  } catch (err) {
    response.status(500).json({ message: "Internal server error" });
    console.log(err);
  }
});

//USED
// Remove a student from a class
classroomsRouter.put(
  "/:classId/removeUser/:userId",
  async (request, response) => {
    const user = request.user;
    const classId = request.params.classId;
    const userId = request.params.userId;
    const classroom = await Classroom.findById(classId);
    const student = await User.findById(userId);

    if (classroom.owners.includes(user._id)) {
      classroom.students.pull(userId);
      await classroom.save();

      student.classrooms.pull(classId);
      await student.save();

      response.status(200).end();
    } else {
      response.status(401).end();
    }
  }
);

module.exports = classroomsRouter;
