"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleTryResponseHandler = exports.handleCatchError = exports.formatError = void 0;
const zod_1 = require("zod");
const formatError = (error) => {
    let errors = {};
    error.errors?.map((error) => {
        errors[error.path?.[0]] = error.message;
    });
    return errors;
};
exports.formatError = formatError;
const handleCatchError = (error, res, errorMessage = "Validation Error") => {
    if (error instanceof zod_1.ZodError) {
        const formattedError = (0, exports.formatError)(error);
        return res.status(400).json({
            message: errorMessage || "validation error",
            error: formattedError,
        });
    }
    return res.status(500).json({
        message: error instanceof Error ? error.message : "An Error Occured",
        error: error instanceof Error ? error.message : "Unknown Error",
    });
};
exports.handleCatchError = handleCatchError;
const handleTryResponseHandler = (res, status = 200, message, data = null) => {
    if (data) {
        return res.status(status || 200).json({
            message: message || "Common Try Response Error Handler",
            data: data,
        });
    }
    return res.status(status || 200).json({
        message: message || "Common Try Response Error Handler",
        data: {},
    });
};
exports.handleTryResponseHandler = handleTryResponseHandler;
