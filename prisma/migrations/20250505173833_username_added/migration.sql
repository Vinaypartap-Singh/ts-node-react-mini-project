/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `Task` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `username` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "username" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Task_username_key" ON "Task"("username");
