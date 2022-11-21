const mongoose = require("mongoose");

const connectDB = async() => {
	try
	{
		const db ="mongodb+srv://ken:123456m@cluster0.muj64p4.mongodb.net/?retryWrites=true&w=majority"
		await mongoose.connect(db);
		console.log("MongoDB connected...");
	}
	catch(err)
	{
		console.log(err);
		process.exit(1);
	}
}

module.exports = connectDB;