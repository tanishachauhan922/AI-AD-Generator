// routes/templates.js

const Template = require('../models/Template');
 
// GET /api/templates -> gallery ke liye saari templates (list view)
    const templateput=async (req, res) => {
  try {
    const { category } = req.query;
    const filter = { isActive: true };
    if (category) filter.category = category;
 
    // gallery mein sirf thumbnail/name chahiye, poora 'elements' data nahi
    const templates = await Template.find(filter).select('-elements');
    res.json(templates);
  } catch (err) {
    console.error("FETCH TEMPLATES ERROR:", err);
    res.status(500).json({ error: 'Failed to fetch templates' });
  }
};
 
// GET /api/templates/:id -> ek template ka poora data (jab user select kare)
const getonetemplate=async (req, res) => {
  try {
    const template = await Template.findById(req.params.id);
    if (!template) return res.status(404).json({ error: 'Template not found' });
    res.json(template);
  // } catch (err) {
  //   res.status(500).json({ error: 'Failed to fetch template' });
  // }
  } catch (err) {
  console.error("FETCH TEMPLATES ERROR:", err);
  res.status(500).json({ error: err.message });
}
};
 //mongo db m data daalne k lie
const createTemplate = async (req, res) => {
  try {
    const newTemplate = await Template.create(req.body);
    res.status(201).json(newTemplate);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create template' });
  }
};
//to delete the template from mongodb
const deleteTemplate = async (req, res) => {
  try {
    const template = await Template.findByIdAndDelete(req.params.id);

    if (!template) {
      return res.status(404).json({ error: "Template not found" });
    }

    res.json({ message: "Template deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete template" });
  }
};
module.exports = { templateput, getonetemplate, createTemplate ,deleteTemplate };
