const Document_Office_Location = require('../models/Document_Office_Location');
const Document_Index = require('../models/Document_Index');
const User_Info = require('../models/User_Info');

exports.getDocsLocations = async (req, res, next) => {
  try {
    const options = req.query;
    // options contains { documentID_new, documentID_old, local, status }
    const docsLocations = await Document_Office_Location.findAll({
      where: { ...options }
    });

    const temp = [];

    for await (const location of docsLocations) {
      const obj = { ...location.dataValues };

      const userInfo = await User_Info.findByPk(location.userID);

      obj.userName = userInfo.name;

      const docTempNew = await Document_Index.findByPk(location.documentID_new);
      console.log(docTempNew);
      obj.documentID_newName = docTempNew.dataValues.name;

      if (location.documentID_old !== null) {
        const docTempOld = await Document_Index.findByPk(
          location.documentID_old
        );
        obj.documentID_oldName = docTempOld.dataValues.name;
      }
      temp.push(obj);
    }

    const respObj = { docsLocations: temp };
    console.log(respObj);

    res.status(201).json({
      status: 201,
      message: 'Locations found!',
      data: {
        ...respObj
      }
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      status: 404,
      message: 'Locations not found!',
      data: {
        error
      }
    });
  }
};
exports.postDocLocation = async (req, res, next) => {
  try {
    const {
      locationID,
      userID,
      documentID_new,
      documentID_old,
      local,
      status
    } = req.body;
    const newDocLocation = new Document_Office_Location({
      userID,
      documentID_old,
      documentID_new,
      local,
      status
    });

    if (locationID !== undefined && documentID_old !== undefined) {
      const temp = await Document_Office_Location.findByPk(locationID);
      temp.status = 'Removed';
      temp.save();
    }

    const respSave = await newDocLocation.save();

    const respObj = { respSave };
    res.status(201).json({
      status: 201,
      message: 'Locations saved!',
      data: {
        ...respObj
      }
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      status: 404,
      message: 'Locations not saved!',
      data: {
        error
      }
    });
  }
};

exports.updateDocLocation = async (req, res, next) => {
  try {
    const docLocationID = req.params.docLocationID;
    const { status } = req.body;
    const oldDocLocation = await Document_Office_Location.findByPk(
      docLocationID
    );
    const updatedDocLocation = oldDocLocation;
    if (status) updatedDocLocation.status = status;
    const respSave = await updatedDocLocation.save();
    const respObj = { respSave };
    res.status(201).json({
      status: 201,
      message: 'Locations updated!',
      data: {
        ...respObj
      }
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      status: 404,
      message: 'Locations not updated!',
      data: {
        error
      }
    });
  }
};
