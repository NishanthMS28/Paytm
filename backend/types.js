const zod = require("zod");

let signupSchema = zod.object({
    username: zod.string().email(),
    password: zod.string(),
    firstName: zod.string(),
    lastName: zod.string()
});

let signinSchema = zod.object({
    username: zod.string().email(),
    password: zod.string(),
});

let updateSchema = zod.object({
    password: zod.string().optional(),
    firstName: zod.string().optional(),
    secondName: zod.string().optional()
})

module.exports = {
    signupSchema,
    signinSchema, 
    updateSchema
  };