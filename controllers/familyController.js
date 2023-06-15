const express = require( 'express' );
const fs = require('fs')
const familyModel = require( '../models/familyModel' );


// create a family profile
const createFamily = async (req, res) => {
        // const { fatherName, motherName, children } = req.body;
        const filenames = req.files["childrenImage"].map((file) => file.filename);
      
        const family = new familyModel({
            fatherName: req.body.fatherName,
            motherName: req.body.motherName,
            children: req.body.children.split(','),
            childrenImage: filenames,
        })
    try {
        const savedFamily = await family.save();
        if ( !savedFamily ) {
            res.status( 400 ).json( {
                message: "Family profile was not saved."
            })
        } else {
            res.status( 201 ).json( {
                message: "Family profile created successfully",
                data: savedFamily
            })
        }
    } catch ( e ) {
        res.status( 500 ).json( {
            message: e.message
        })
    }
}



// get all family profiles
const getAllFamily = async (req, res) => {
    try {
        const family = await familyModel.find()
        if (family.length === 0) {
            res.status(404).json({
                message: "There is currently no family profile in the data base"
            }) 
        } else{
            res.status(200).json({
                message: "Family profiles",
                data: family,
                total: `Total family in the database is: ${family.length}`
            })
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

// get a family profile
const getOneFamily = async (req, res) => {
    const familyId = req.params.id
    const family = await familyModel.findById(familyId)
    try {
        if (!family) {
            res.status(404).json({
                message: "Family profile not found"
            }) 
        } else{
            res.status(200).json({
                message: "Family profile showing",
                data: family
            })
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}


// update a family profile
const updateFamily = async (req, res) => {
    const familyId = req.params.id;
    const family = await familyModel.findById(familyId);
    try {
      if (!family) {
        return res.status(404).json({
          message: "Family profile not found",
        });
      }
  
      const { fatherName, motherName, children } = req.body;
      const bodyData = {
        fatherName: fatherName || family.fatherName,
        motherName: motherName || family.motherName,
        children: children || family.children,
        childrenImage: family.childrenImage,
      };
  
      if (req.files && req.files["childrenImage"]) {
        const oldImagePaths = family.childrenImage.map(
          (filename) => `uploads/${filename}`
        );
  
        // Delete existing images
        oldImagePaths.forEach((path) => {
          if (fs.existsSync(path)) {
            fs.unlinkSync(path);
          }
        });
  
        // Assign new image filenames
        bodyData.childrenImage = req.files["childrenImage"].map(
          (file) => file.filename
        );
      }
  
      const updatedFamily = await familyModel.findByIdAndUpdate(
        familyId,
        bodyData,
        { new: true }
      );
  
      if (updatedFamily) {
        res.status(200).json({
          message: "Family profile updated successfully",
          data: updatedFamily,
        });
      } else {
        res.status(404).json({
          message: "Family profile not found",
        });
      }
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };
  
  

// Delete a family profile
const deleteFamily = async (req, res) => {
    const familyId = req.params.id;
    try {
      const family = await familyModel.findById(familyId);
      if (!family) {
        return res.status(404).json({
          message: "Family profile not found",
        });
      }
  
      // Delete the child images
      for (const filename of family.childrenImage) {
        const imagePath = `uploads/${filename}`;
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }
  
      // Delete the family profile
      const deletedFamily = await familyModel.findByIdAndDelete(familyId);
      if (deletedFamily) {
        res.status(200).json({
          message: "Family profile deleted successfully",
        });
      } else {
        res.status(404).json({
          message: "Failed to delete family profile",
        });
      }
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };
  


module.exports = {
    createFamily,
    getAllFamily,
    getOneFamily,
    updateFamily,
    deleteFamily,
}