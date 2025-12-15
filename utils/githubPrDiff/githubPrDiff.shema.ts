// src/lib/github-diff.schema.ts
import * as z from "zod";

export const LineTypeSchema = z.enum(["delete", "add"]);
export type LineType = z.infer<typeof LineTypeSchema>;

export const LineItemSchema = z.object({
  line: z.number().int().nullable(),
  text: z.string(),
  type: LineTypeSchema,
});
export type LineItem = z.infer<typeof LineItemSchema>;

export const FileStatusSchema = z.enum(["modified", "deleted"]);
export type FileStatus = z.infer<typeof FileStatusSchema>;

export const FileDiffSchema = z.object({
  status: FileStatusSchema,
  old: z.array(LineItemSchema),
  new: z.array(LineItemSchema),
});
export type FileDiff = z.infer<typeof FileDiffSchema>;

export const DiffsSchema = z.record(z.string(), FileDiffSchema);
export type Diffs = z.infer<typeof DiffsSchema>;
