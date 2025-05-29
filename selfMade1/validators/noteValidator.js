const {z}= require("zod");

const noteValidationSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  date: z.coerce.date().optional(),
});


module.exports = {
    noteValidationSchema
};