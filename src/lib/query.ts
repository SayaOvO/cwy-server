import {db} from "../db";

export const getRootFiles = async (projectId: string) => {
  return db.query.filesTable.findMany({
    where: (files, { eq }) => eq(files.projectId, projectId),
  })
}

export const getChildFiles = async (parentId: string) =>  {
  return db.query.filesTable.findMany({
    where: (files, { eq }) => eq(files.parentId, parentId),
  })
}
