-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_username_fkey";

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_username_fkey" FOREIGN KEY ("username") REFERENCES "User"("username") ON DELETE CASCADE ON UPDATE CASCADE;
