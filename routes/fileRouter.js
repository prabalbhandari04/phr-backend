'use strict';

const express = require('express');
const {uploadfile} = require('../utils/filehelper');
const {singleFileUpload, multipleFileUpload,
     getallSingleFiles, getallMultipleFiles,test,myFiles,
	addFiles,removeFile,shareFile} = require('../controllers/fileController');
const router = express.Router();

router.post('/test', test);
router.get('/my-file/:id',myFiles);
router.post('/upload/:id',uploadfile.single('file'),addFiles);
router.post('/sendfile',shareFile);
router.delete('/deletefile/:id',removeFile);

module.exports = router;
