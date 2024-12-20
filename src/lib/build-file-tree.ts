import {filesTable} from "../db/schema";

export type FileWithChildren = typeof filesTable.$inferInsert & {
  children: typeof filesTable.$inferInsert
}
export const buildFileTree = (files: typeof filesTable.$inferInsert[]) => {
  const fileMap = new Map();
  const rootFiles: FileWithChildren[] = [];
  files.forEach((file) => {
   fileMap.set(file.id, {
     ...file,
     children: [],
   });
  })
  files.forEach((file) => {
    const fileWithChildren = fileMap.get(file.id);
    if (file.parentId) {
      const parent = fileMap.get(file.parentId);
      if (parent) {
        parent.children.push(fileWithChildren);
      }
    } else {
      rootFiles.push(fileWithChildren);
    }
  })
  return rootFiles;
}
