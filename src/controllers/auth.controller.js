const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const { loginService, registerService } = require("../services/auth.service");

exports.register = asyncHandler(async (req, res) => {

    const user = await registerService(req.body);

    res.status(201).json(
        new ApiResponse(
            201,
            "User registered successfully",
            user
        )
    );

});

exports.login = asyncHandler(async (req, res) => {

    const user = await loginService(req.body);

    res.status(200).json(
        new ApiResponse(
            200,
            "Login successful",
            user
        )
    );

});