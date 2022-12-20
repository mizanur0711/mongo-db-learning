const mongoose = require("mongoose");
mongoose
  .connect("mongodb://localhost/playground")
  .then(() => console.log("Connected to MondoDB"))
  .catch((err) => console.error("could not connect to MongoDb...", err));

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    // match: /regex/,
  },
  category: {
    type: String,
    required: true,
    enum: ["web", "mobile", "network"],
    lowecase: true,
  },
  author: String,
  tags: {
    type: Array,
    validate: {
      validator: function (v) {
        return new Promise((resolve) => {
          setTimeout(() => {
            const result = v && v.length > 0;
            resolve(result);
          }, 4000);
        });
      },
      message: "A course should have at least one tag.",
    },
  },
  date: { type: Date, default: Date.now },
  isPublished: Boolean,
  price: {
    type: Number,
    required: function () {
      return this.isPublished;
    },
    min: 10,
    max: 200,
    get: (v) => Math.round(v),
    set: (v) => Math.round(v),
  },
});

const Course = mongoose.model("Course", courseSchema);

async function createCourse() {
  const course = new Course({
    name: "Node.js course latest",
    category: "web",
    author: "miz",
    tags: ["book"],
    isPublished: true,
    price: 15,
  });
  try {
    const result = await course.save();
    console.log(result);
  } catch (ex) {
    for (field in ex.errors) console.log(ex.errors[field].message);
  }
}

createCourse();

async function getCourse() {
  const courses = await Course.find({ author: "miz", isPublished: true })
    .limit(2)
    .sort({ name: -1 });
  console.log(courses);
}

// getCourse();

async function updateCourse(id) {
  const course = await Course.findByIdAndUpdate(
    id,
    {
      $set: {
        author: "anon",
        isPublished: false,
      },
    },
    { new: true }
  );
  console.log(course);
}

//updateCourse('63a053555335f7a7afcce5ed');
