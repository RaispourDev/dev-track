-- CreateTable
CREATE TABLE "LearningSession" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "durationMinutes" INTEGER NOT NULL,
    "note" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "projectId" INTEGER NOT NULL,
    CONSTRAINT "LearningSession_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
