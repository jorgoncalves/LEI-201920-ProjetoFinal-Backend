const { Op } = require('sequelize');

// const {param1, param2, param3, {subparam1, subparam2}} = req.body

const Document_Index = require('../models/Document_Index');
const Record = require('../models/Records');
const Attachments = require('../models/Attachments');

const { moveFileRegistos } = require('./helpers/moveFileRegistos');

exports.getRecords = async (req, res, next) => {
  console.log(req.query);
  try {
    const {
      recordID,
      documentID,
      submitted_by_UserID,
      tagAno,
      tagCliente,
      tagNIF,
      tagCategoria,
      description,
    } = req.query;
    delete req.query.tagAno;
    delete req.query.tagCliente;
    delete req.query.tagNIF;
    delete req.query.tagCategoria;
    let records;
    const tags = [];
    if (tagAno) tags.push(tagAno);
    if (tagCliente) tags.push(tagCliente);
    if (tagNIF) tags.push(tagNIF);
    if (tagCategoria) tags.push(tagCategoria);
    if (tags.length <= 0)
      records = await Record.findAll({ where: { ...req.query } });
    else
      records = await Record.findAll({
        where: { tags: { [Op.contains]: tags }, ...req.query },
      });

    for await (const record of records) {
      const recordAttachments = await Attachments.findAll({
        where: { recordID: record.recordID },
      });
      records.find(
        (rec) => rec.dataValues.recordID === record.recordID
      ).dataValues.attachments = recordAttachments;
    }

    const respObj = { records };
    res.status(201).json({
      status: 201,
      message: 'Records found!',
      data: {
        ...respObj,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      status: 404,
      message: 'Records not found!',
      data: {
        error,
      },
    });
  }
};

exports.postRecord = async (req, res, next) => {
  // [ano, cliente, nif, categoria]
  try {
    const {
      documentID,
      submitted_by_UserID,
      tagAno,
      tagCliente,
      tagNIF,
      tagCategoria,
      description,
    } = req.body;
    const tagsArr = [tagAno, tagCliente, tagNIF, tagCategoria];

    const newRecord = new Record({
      documentID,
      submitted_by_UserID,
      tags: tagsArr,
      description,
    });
    const respSaveRecord = await newRecord.save();
    const recordID = respSaveRecord.recordID;
    const respAttachmentArr = [];
    if (req.files) {
      // path para multiplos ficheiros

      const docData = await Document_Index.findByPk(documentID);
      const pathArr = await moveFileRegistos(recordID, docData.name, req.files);
      for await (const { name, path } of pathArr) {
        const newAttachment = new Attachments({
          recordID,
          path,
          name,
        });
        const respAttachmentSave = await newAttachment.save();
        respAttachmentArr.push(respAttachmentSave);
      }
    }
    const respObj = { respSaveRecord, respAttachmentArr };
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
