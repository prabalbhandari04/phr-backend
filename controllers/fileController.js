'use strict';
const File = require('../models/fileModel');
const path = require('path');
const fs = require('fs');
const User = require('../models/userModel');
const sendMail = require('../utils/sendMail')


const myFiles = async(req,res) =>{
	try {
		const {id} = req.params;
		const files = await File.find({user:id,parent:true}).sort('-createdAt');
		res.json(files);
	} catch(err) {
		return res.status(500).json({msg:err.message});
	}
} 

const test = async(req,res) =>{
	res.send('test');
} 

const addFiles = async(req,res) =>{
	try {
		if(!req.file) return res.status(400).json({msg:'No Files selected'});
		const {id} = req.params;
		const fileURL = `${process.env.BASE_URL}/files/${req.file.filename}`;
		const newFile = await File.create({
			user:id,
			fileurl:fileURL,
			fileSize:req.file.size,
			parent : true,
			// parent:id ? false : true,
			folderid:id
		});
		
		res.json(newFile);
	} catch(err) {
		return res.status(500).json({msg:err.message});
	}
}

const removeFile = async(req,res) =>{
	try {
		const {id} = req.params;
		const exists = await File.findById(id);
		if(!exists) return res.status(400).json({msg:'File Not Found!'});
		const plan = await Plan.findOne({user:req.user._id});
		if(!plan) return res.status(400).json({msg:'Failed to fetch active plan'});
		const filename = exists.fileurl.split('files/')[1];
		const pathinfo = path.join(__dirname,`../../uploads/files/${filename}`);
		if(fs.existsSync(pathinfo)){
			fs.unlink(pathinfo,(err)=>{
				if(err) console.log(err);
			})
		}
		plan.used = plan.used - exists.fileSize;
		plan.remainingStorage = plan.remainingStorage + exists.fileSize;
		const updated = await plan.save();
		await File.findByIdAndDelete(id);
		res.json({
			msg:'File Deleted!',
			updated
		})
	} catch(err) {
		return res.status(500).json({msg:err.message});
	}
}

const shareFile = async(req,res) =>{
	try {
		const {email,url} = req.body;
		if(!email || !url) return res.status(400).json({msg:'Please Provide necessary fields!'});
		const filename = url.split('files/')[1];

		sendMail(email, url, "Here is the file")
		res.status(200).json({msg:'File Shared Successfully!'});
	} catch(err) {
		return res.status(500).json({msg:err.message});
	}
}



const singleFileUpload = async (req, res, next) => {
    try{
        const file = new SingleFile({
            fileName: req.file.originalname,
            filePath: req.file.path,
            fileType: req.file.mimetype,
            fileSize: fileSizeFormatter(req.file.size, 2) // 0.00
        });
        await file.save();
        console.log(file);
        res.status(201).send('File Uploaded Successfully');
    }catch(error) {
        res.status(400).send(error.message);
    }
}
const multipleFileUpload = async (req, res, next) => {
    try{
        let filesArray = [];
        req.files.forEach(element => {
            const file = {
                fileName: element.originalname,
                filePath: element.path,
                fileType: element.mimetype,
                fileSize: fileSizeFormatter(element.size, 2)
            }
            filesArray.push(file);
        });
        const multipleFiles = new MultipleFile({
            title: req.body.title,
            files: filesArray 
        });
        await multipleFiles.save();
        res.status(201).send('Files Uploaded Successfully');
    }catch(error) {
        res.status(400).send(error.message);
    }
}

const getallSingleFiles = async (req, res, next) => {
    try{
        const files = await SingleFile.find();
        res.status(200).send(files);
    }catch(error) {
        res.status(400).send(error.message);
    }
}
const getallMultipleFiles = async (req, res, next) => {
    try{
        const files = await MultipleFile.find();
        res.status(200).send(files);
    }catch(error) {
        res.status(400).send(error.message);
    }
}

const fileSizeFormatter = (bytes, decimal) => {
    if(bytes === 0){
        return '0 Bytes';
    }
    const dm = decimal || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'YB', 'ZB'];
    const index = Math.floor(Math.log(bytes) / Math.log(1000));
    return parseFloat((bytes / Math.pow(1000, index)).toFixed(dm)) + ' ' + sizes[index];

}


module.exports = {
	test,
	myFiles,
	addFiles,
	removeFile,
	shareFile,
	singleFileUpload,
  multipleFileUpload,
  getallSingleFiles,
  getallMultipleFiles
}


