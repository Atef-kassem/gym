const { Survey, SurveyResponse, Customer } = require("../Model");
const catchAsync = require("../utils/catchAsync");

exports.createSurvey = catchAsync(async (req, res) => {
  try {
    console.log('Creating survey with payload:', payload);
    const payload = req.body || {};
    console.log('Survey payload:', payload);
    
    const record = await Survey.create(payload);
    console.log('Survey created:', record.toJSON());
    
    const created = await Survey.findByPk(record.id);
    console.log('Survey retrieved:', created.toJSON());
    
    res.status(201).json({ status: "success", data: created });
  } catch (error) {
    console.error('Error creating survey:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    throw error;
  }
});

exports.getSurveys = catchAsync(async (req, res) => {
  const { q, status, type, limit = 50, offset = 0 } = req.query;
  const where = {};
  
  if (status && status !== "all") where.status = status;
  if (type) where.type = type;
  if (q) {
    where[require("sequelize").Op.or] = [
      { title: { [require("sequelize").Op.like]: `%${q}%` } },
      { description: { [require("sequelize").Op.like]: `%${q}%` } },
      { category: { [require("sequelize").Op.like]: `%${q}%` } },
    ];
  }
  
  const { rows, count } = await Survey.findAndCountAll({
    where,
    order: [["createdAt", "DESC"]],
    limit: Number(limit),
    offset: Number(offset),
  });
  
  res.status(200).json({ status: "success", data: rows, total: count });
});

exports.getSurveyById = catchAsync(async (req, res) => {
  const id = req.params.id;
  const record = await Survey.findByPk(id, {
    include: [{ model: SurveyResponse, as: "responses" }],
  });
  
  if (!record) {
    return res.status(404).json({ status: "error", message: "Survey not found" });
  }
  
  res.status(200).json({ status: "success", data: record });
});

exports.updateSurvey = catchAsync(async (req, res) => {
  const id = req.params.id;
  const [updatedCount] = await Survey.update(req.body || {}, { where: { id } });
  
  if (updatedCount === 0) {
    return res.status(404).json({ status: "error", message: "Survey not found" });
  }
  
  const updated = await Survey.findByPk(id);
  res.status(200).json({ status: "success", data: updated });
});

exports.deleteSurvey = catchAsync(async (req, res) => {
  const id = req.params.id;
  const deletedCount = await Survey.destroy({ where: { id } });
  
  if (deletedCount === 0) {
    return res.status(404).json({ status: "error", message: "Survey not found" });
  }
  
  res.status(204).json({ status: "success" });
});

exports.updateSurveyStatus = catchAsync(async (req, res) => {
  const id = req.params.id;
  const { status } = req.body;
  
  const [updatedCount] = await Survey.update({ status }, { where: { id } });
  
  if (updatedCount === 0) {
    return res.status(404).json({ status: "error", message: "Survey not found" });
  }
  
  const updated = await Survey.findByPk(id);
  res.status(200).json({ status: "success", data: updated });
});

// Survey Responses
exports.createSurveyResponse = catchAsync(async (req, res) => {
  const payload = req.body || {};
  const record = await SurveyResponse.create(payload);
  
  // Update survey response count
  if (payload.surveyId) {
    await Survey.increment('responseCount', { where: { id: payload.surveyId } });
  }
  
  const created = await SurveyResponse.findByPk(record.id, {
    include: [{ model: Survey, as: "survey" }],
  });
  
  res.status(201).json({ status: "success", data: created });
});

exports.getSurveyResponses = catchAsync(async (req, res) => {
  const { surveyId, limit = 50, offset = 0 } = req.query;
  const where = {};
  
  if (surveyId) where.surveyId = surveyId;
  
  const { rows, count } = await SurveyResponse.findAndCountAll({
    where,
    include: [{ model: Survey, as: "survey" }],
    order: [["createdAt", "DESC"]],
    limit: Number(limit),
    offset: Number(offset),
  });
  
  res.status(200).json({ status: "success", data: rows, total: count });
});

exports.getSurveyAnalytics = catchAsync(async (req, res) => {
  const surveyId = req.params.id;
  
  const survey = await Survey.findByPk(surveyId, {
    include: [{ model: SurveyResponse, as: "responses" }],
  });
  
  if (!survey) {
    return res.status(404).json({ status: "error", message: "Survey not found" });
  }
  
  const responses = survey.responses || [];
  const totalResponses = responses.length;
  
  if (totalResponses === 0) {
    return res.status(200).json({
      status: "success",
      data: {
        totalResponses: 0,
        avgRating: 0,
        npsScore: 0,
        completionRate: 0,
        sentiment: { positive: 0, negative: 0, neutral: 0 },
      },
    });
  }
  
  // Calculate analytics
  const ratings = responses
    .map(r => r.responses?.overall_rating)
    .filter(r => r && !isNaN(r));
  
  const avgRating = ratings.length > 0 ? 
    ratings.reduce((sum, r) => sum + r, 0) / ratings.length : 0;
  
  const npsScores = responses
    .map(r => r.npsScore)
    .filter(n => n && !isNaN(n));
  
  const npsScore = npsScores.length > 0 ? 
    npsScores.reduce((sum, n) => sum + n, 0) / npsScores.length : 0;
  
  const sentimentCounts = responses.reduce((acc, r) => {
    const sentiment = r.sentiment || 'neutral';
    acc[sentiment] = (acc[sentiment] || 0) + 1;
    return acc;
  }, { positive: 0, negative: 0, neutral: 0 });
  
  const completionRate = survey.targetCount > 0 ? 
    (totalResponses / survey.targetCount) * 100 : 0;
  
  res.status(200).json({
    status: "success",
    data: {
      totalResponses,
      avgRating: Math.round(avgRating * 10) / 10,
      npsScore: Math.round(npsScore),
      completionRate: Math.round(completionRate * 10) / 10,
      sentiment: sentimentCounts,
    },
  });
});
