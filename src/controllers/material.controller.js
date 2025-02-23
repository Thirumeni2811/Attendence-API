const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const {
  createMaterial,
  getMaterialById,
  getAllMaterials,
  updateMaterialById,
  deleteMaterialById,
} = require("../services/material.service");

// Create Material
const createMaterials = catchAsync(async (req, res) => {
  const material = await createMaterial(req.body);
  res.status(httpStatus.CREATED).send({
    code: httpStatus.CREATED,
    message: "Material created successfully",
    material,
  });
});

// Get Material by ID
const getMaterialByIds = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const material = await getMaterialById(req.params.materialId, userId);
  res.status(httpStatus.OK).send({ code: httpStatus.OK, material });
});

// Get All Materials
// Get All Materials with optional filters
const getAllMaterialss = catchAsync(async (req, res) => {
  const filters = {
    materialName: req.query.materialName || undefined, // Get from query parameters
    materialDescription: req.query.materialDescription || undefined, // Get from query parameters
  };

  const materials = await getAllMaterials(filters);
  res.status(httpStatus.OK).send({ code: httpStatus.OK, materials });
});
// const getAllMaterialss = catchAsync(async (req, res) => {
//   const materials = await getAllMaterials({});
//   res.status(httpStatus.OK).send({ code: httpStatus.OK, materials });
// });

// Update Material by ID
const updateMaterialByIds = catchAsync(async (req, res) => {
  const material = await updateMaterialById(req.params.materialId, req.body);
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: "Material updated successfully",
    material,
  });
});

// Delete Material by ID
const deleteMaterialByIds = catchAsync(async (req, res) => {
  await deleteMaterialById(req.params.materialId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createMaterials,
  getMaterialByIds,
  getAllMaterialss,
  updateMaterialByIds,
  deleteMaterialByIds,
};
