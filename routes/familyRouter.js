const express = require( 'express' );
const router = express.Router();
const { createFamily, getAllFamily, getOneFamily, deleteFamily, updateFamily, } = require( '../controllers/familyController' )
const upload = require('../utils/multer')


router.post( '/families', upload.fields([{name: 'childrenImage', maxCount: 5}]), createFamily )

router.get('/families', getAllFamily)

router.get('/families/:id', getOneFamily)

router.patch( '/families/:id', upload.fields( [ { name: "childrenImage", maxCount: 5 } ] ), updateFamily )

router.delete('/families/:id', deleteFamily)


module.exports = router;