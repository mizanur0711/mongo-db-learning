const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/playground')
    .then(()=> console.log('Connected to MondoDB '))
    .catch(err=>console.error('could not connect to MongoDb...',err));

    const courseSchema = new mongoose.Schema({
        name:String,
        author:String,
        tags:[String],
        date: {type:Date, default:Date.now},
        isPublished: Boolean
    });

    const Course = mongoose.model('Course',courseSchema);
    

    async function createCourse(){
        const course = new Course({
            name:'Node.js course latest',
            author: 'miz',
            tags:['node','backend'],
            isPublished:true
        });

        const result = await course.save();
        console.log(result);
    }

    //createCourse();

    async function getCourse(){
        const courses = await Course
        .find({author: 'miz',isPublished: true})
        .limit(2)
        .sort({name: -1});
        console.log(courses);
    }

    getCourse();

    async function updateCourse(id){
        const course = await Course.findByIdAndUpdate(id,{
            $set:{
                author: 'anon',
                isPublished: false
            }
        },{new:true});
        console.log(course);
    }

    updateCourse('63a053555335f7a7afcce5ed');