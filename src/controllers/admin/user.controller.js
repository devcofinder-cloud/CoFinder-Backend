const {
  getAllUsersService,
  getUserByIdService,
  createUserService,
  updateUserService,
  deleteUserService,
} = require("../../services/admin/user.service");


// GET /api/admin/users
const getAllUsers = async (req, res, next) => {
  try {
    const result = await getAllUsersService(req.query);

    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};


// GET /api/admin/users/:id
const getUserById = async (req, res, next) => {
  try {
    const user = await getUserByIdService(req.params.id);

    res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};


// POST /api/admin/users
const createUser = async (req, res, next) => {
  try {
    const user = await createUserService(req.body);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};


// PATCH /api/admin/users/:id
const updateUser = async (req, res, next) => {
  try {
    const user = await updateUserService(
      req.params.id,
      req.body
    );

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};


// DELETE /api/admin/users/:id
const deleteUser = async (req, res, next) => {
  try {
    const result = await deleteUserService(req.params.id);

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};


module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};