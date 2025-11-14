"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.comparePassword = exports.hashPassword = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const SALT_ROUNDS = 10;
const hashPassword = (plainText) => bcryptjs_1.default.hash(plainText, SALT_ROUNDS);
exports.hashPassword = hashPassword;
const comparePassword = (plainText, hash) => bcryptjs_1.default.compare(plainText, hash);
exports.comparePassword = comparePassword;
//# sourceMappingURL=password.js.map