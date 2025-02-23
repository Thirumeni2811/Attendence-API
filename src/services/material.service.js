const httpStatus = require("http-status");
const Material = require("../models/material.model");
const ApiError = require("../utils/ApiError");

// Create Material
const createMaterial = async (materialBody) => {
  return Material.create(materialBody);
};

// Get Material by ID
const getMaterialById = async (materialId) => {
  const material = await Material.findById(materialId);
  if (!material) {
    throw new ApiError(httpStatus.NOT_FOUND, "Material not found");
  }
  return material;
};

// Get All Materials with optional filters for materialName and materialDescription
const getAllMaterials = async (filters = {}) => {
  const query = {};

  // Apply partial matching filter on materialName
  if (filters.materialName) {
    query.materialName = { $regex: filters.materialName, $options: "i" }; // Case-insensitive partial match
  }

  // Apply partial matching filter on materialDescription
  if (filters.materialDescription) {
    query.materialDescription = {
      $regex: filters.materialDescription,
      $options: "i",
    }; // Case-insensitive partial match
  }

  return Material.find(query);
};
// const getAllMaterials = async (filter = {}) => {
//   return Material.find(filter);
// };

// Update Material by ID
const updateMaterialById = async (materialId, updateBody) => {
  const material = await getMaterialById(materialId);
  Object.assign(material, updateBody);
  await material.save();
  return material;
};

// Delete Material by ID
const deleteMaterialById = async (materialId) => {
  const material = await getMaterialById(materialId);
  await material.remove();
  return material;
};

module.exports = {
  createMaterial,
  getMaterialById,
  getAllMaterials,
  updateMaterialById,
  deleteMaterialById,
};
