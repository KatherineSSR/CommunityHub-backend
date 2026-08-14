const Category = require('../models/Category');

// GET /api/categories
const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.json({ success: true, data: categories });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener las categorías' });
    }
};

// POST /api/categories
const createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name) {
            return res.status(400).json({ success: false, message: 'El nombre de la categoría es obligatorio' });
        }

        const newCategory = await Category.create({ name, description });
        res.status(201).json({ success: true, message: 'Categoría creada exitosamente', data: newCategory });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ success: false, message: 'Ya existe una categoría con este nombre' });
        }
        res.status(500).json({ success: false, message: 'Error al crear la categoría' });
    }
};

// PUT /api/categories/:id
const updateCategory = async (req, res) => {
    try {
        const { name, description } = req.body;

        if (name !== undefined && name.trim() === '') {
            return res.status(400).json({ success: false, message: 'El nombre de la categoría no puede estar vacío' });
        }

        const updatedCategory = await Category.findByIdAndUpdate(
            req.params.id,
            { name, description },
            { new: true, runValidators: true }
        );

        if (!updatedCategory) {
            return res.status(404).json({ success: false, message: 'Categoría no encontrada' });
        }

        res.json({ success: true, message: 'Categoría actualizada', data: updatedCategory });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ success: false, message: 'Ya existe una categoría con este nombre' });
        }
        res.status(500).json({ success: false, message: 'Error al actualizar la categoría' });
    }
};

// DELETE /api/categories/:id
const deleteCategory = async (req, res) => {
    try {
        const deletedCategory = await Category.findByIdAndDelete(req.params.id);

        if (!deletedCategory) {
            return res.status(404).json({ success: false, message: 'Categoría no encontrada' });
        }

        res.json({ success: true, message: 'Categoría eliminada exitosamente' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al eliminar la categoría' });
    }
};

module.exports = { getAllCategories, createCategory, updateCategory, deleteCategory };
