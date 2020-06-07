const Document_Office_Location = require('../models/Document_Office_Location');

exports.getDocsLocations = async (req, res, next) => {
  try {
    const options = req.body;
    // options contains { documentID_new, documentID_old, local, status }
    const docsLocations = await Document_Office_Location.findAll({
      where: { ...options },
    });
    const respObj = { docsLocations };
    res.status(201).json({
      status: 201,
      message: 'Locations found!',
      data: {
        ...respObj,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      status: 404,
      message: 'Locations not found!',
      data: {
        error,
      },
    });
  }
};
exports.postDocLocation = async (req, res, next) => {
  try {
    const { documentID_new, documentID_old, local, status } = req.body;
    const newDocLocation = new Document_Office_Location({
      documentID_new,
      documentID_old,
      local,
      status,
    });

    const respSave = await newDocLocation.save();

    const respObj = { respSave };
    res.status(201).json({
      status: 201,
      message: 'Locations saved!',
      data: {
        ...respObj,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      status: 404,
      message: 'Locations not saved!',
      data: {
        error,
      },
    });
  }
};

exports.updateDocLocation = async (req, res, next) => {
  try {
    const docLocationID = req.params.docLocationID;
    const options = req.body;
    // options contains { documentID_new, documentID_old, local, status }
    const oldDocLocation = await Document_Office_Location.findByPk(
      docLocationID
    );
    const updatedDocLocation = oldDocLocation;
    updatedDocLocation.dataValues = { ...oldDocLocation.dataValues, ...options };
    const respSave = await updatedDocLocation.save();
    const respObj = { respSave };
    res.status(201).json({
      status: 201,
      message: 'Locations updated!',
      data: {
        ...respObj,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      status: 404,
      message: 'Locations not updated!',
      data: {
        error,
      },
    });
  }
};
