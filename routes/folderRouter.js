const router = require('express').Router();
const {createFolder,getMyFolders
,subFolders,deleteFolder} = require('../controllers/folderController');


router.get('/myfolders/:id',getMyFolders);
router.get('/sub-folder/:id',subFolders);
router.post('/create-folder/:id',createFolder);
router.delete('/delete-folder/:id',deleteFolder);

module.exports = router;