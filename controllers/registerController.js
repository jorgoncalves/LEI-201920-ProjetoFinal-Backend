const { Op } = require('sequelize');

// const {param1, param2, param3, {subparam1, subparam2}} = req.body

const Record = require('../models/Records');
const Attachments = require('../models/Attachments');

const { moveFileRegistos } = require('./helpers/moveFileRegistos');

exports.getRecords = async (req, res, next) => {
  try {
    const {
      recordID,
      documentID,
      submitted_by_UserID,
      tags,
      description,
    } = req.body;
    //descobrir uma solução para o tags
    delete req.body.tags;
    let records;
    if (tags !== undefined || tags.length == 0)
      records = await Record.findAll({ where: { ...req.body } });
    else
      records = await Record.findAll({
        where: { tags: { [Op.contains]: tags }, ...req.body },
      });
    const respObj = { records };
    res.status(201).json({
      status: 201,
      message: 'Record saved!',
      data: {
        ...respObj,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      status: 404,
      message: 'Record not saved!',
      data: {
        error,
      },
    });
  }
};

exports.postRecord = async (req, res, next) => {
  // [ano, cliente, nif, categoria]
  try {
    const { documentID, submitted_by_UserID, tags, description } = req.body;
    const newRecord = new Record({
      documentID,
      submitted_by_UserID,
      tags,
      description,
    });
    const respSave = await newRecord.save();
    const recordID = respSave.recordID;
    if (req.body.attachment) {
      const path = await moveFileRegistos(name, req.file.filename);
      // req.file.filename;
      // recordID
      // path
      // name
    }
    const respObj = { respSave };
    res.status(201).json({
      status: 201,
      message: 'Record saved!',
      data: {
        ...respObj,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      status: 404,
      message: 'Record not saved!',
      data: {
        error,
      },
    });
  }
};
