const express = require("express");
const router = express.Router();
const middleware = require("../middleware/index.js");
const User = require("../models/user.js");
const Donation = require("../models/donation.js");

router.get("/recipient/dashboard", middleware.ensurerecipientLoggedIn, async (req,res) => {
	const recipientId = req.user._id;
	const numAssignedDonations = await Donation.countDocuments({ recipient: recipientId, status: "assigned" });
	const numCollectedDonations = await Donation.countDocuments({ recipient: recipientId, status: "collected" });
	res.render("recipient/dashboard", {
		title: "Dashboard",
		numAssignedDonations, numCollectedDonations
	});
});

router.get("/recipient/collections/pending", middleware.ensurerecipientLoggedIn, async (req,res) => {
	try
	{
		const pendingCollections = await Donation.find({ recipient: req.user._id, status: "assigned" }).populate("donor");
		res.render("recipient/pendingCollections", { title: "Pending Collections", pendingCollections });
	}
	catch(err)
	{
		console.log(err);
		req.flash("error", "Some error occurred on the server.")
		res.redirect("back");
	}
});

router.get("/recipient/collections/previous", middleware.ensurerecipientLoggedIn, async (req,res) => {
	try
	{
		const previousCollections = await Donation.find({ recipient: req.user._id, status: "collected" }).populate("donor");
		res.render("recipient/previousCollections", { title: "Previous Collections", previousCollections });
	}
	catch(err)
	{
		console.log(err);
		req.flash("error", "Some error occurred on the server.")
		res.redirect("back");
	}
});

router.get("/recipient/collection/view/:collectionId", middleware.ensurerecipientLoggedIn, async (req,res) => {
	try
	{
		const collectionId = req.params.collectionId;
		const collection = await Donation.findById(collectionId).populate("donor");
		res.render("recipient/collection", { title: "Collection details", collection });
	}
	catch(err)
	{
		console.log(err);
		req.flash("error", "Some error occurred on the server.")
		res.redirect("back");
	}
});

router.get("/recipient/collection/collect/:collectionId", middleware.ensurerecipientLoggedIn, async (req,res) => {
	try
	{
		const collectionId = req.params.collectionId;
		await Donation.findByIdAndUpdate(collectionId, { status: "collected", collectionTime: Date.now() });
		req.flash("success", "Donation collected successfully");
		res.redirect(`/recipient/collection/view/${collectionId}`);
	}
	catch(err)
	{
		console.log(err);
		req.flash("error", "Some error occurred on the server.")
		res.redirect("back");
	}
});



router.get("/recipient/profile", middleware.ensurerecipientLoggedIn, (req,res) => {
	res.render("recipient/profile", { title: "My Profile" });
});

router.put("/recipient/profile", middleware.ensurerecipientLoggedIn, async (req,res) => {
	try
	{
		const id = req.user._id;
		const updateObj = req.body.recipient;	// updateObj: {firstName, lastName, gender, address, phone}
		await User.findByIdAndUpdate(id, updateObj);
		
		req.flash("success", "Profile updated successfully");
		res.redirect("/recipient/profile");
	}
	catch(err)
	{
		console.log(err);
		req.flash("error", "Some error occurred on the server.")
		res.redirect("back");
	}
	
});


module.exports = router;