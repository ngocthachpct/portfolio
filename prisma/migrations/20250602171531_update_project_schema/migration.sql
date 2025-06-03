/*
  Warnings:

  - You are about to drop the column `description` on the `blog_posts` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `blog_posts` table. All the data in the column will be lost.
  - You are about to drop the column `demoUrl` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `featured` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `tags` on the `projects` table. All the data in the column will be lost.
  - Made the column `imageUrl` on table `projects` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "blog_posts" DROP COLUMN "description",
DROP COLUMN "imageUrl",
ADD COLUMN     "coverImage" TEXT,
ADD COLUMN     "excerpt" TEXT;

-- AlterTable
ALTER TABLE "projects" DROP COLUMN "demoUrl",
DROP COLUMN "featured",
DROP COLUMN "tags",
ADD COLUMN     "liveUrl" TEXT,
ALTER COLUMN "imageUrl" SET NOT NULL;

-- CreateTable
CREATE TABLE "about_content" (
    "id" TEXT NOT NULL,
    "aboutTitle" TEXT NOT NULL,
    "aboutDescription" TEXT NOT NULL,
    "heading" TEXT NOT NULL,
    "skills" TEXT NOT NULL,
    "experience" TEXT NOT NULL,
    "education" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "about_content_pkey" PRIMARY KEY ("id")
);
