import templates from "../data/templates.js";

export function getTemplates(req, res) {
    res.json(templates);
}