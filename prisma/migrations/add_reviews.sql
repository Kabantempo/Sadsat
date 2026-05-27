-- Migration : ajout table reviews
CREATE TABLE IF NOT EXISTS `reviews` (
  `id`          VARCHAR(191) NOT NULL,
  `productId`   VARCHAR(191) NOT NULL,
  `productName` VARCHAR(191) NOT NULL,
  `authorName`  VARCHAR(191) NOT NULL,
  `authorEmail` VARCHAR(191) NOT NULL,
  `rating`      INT NOT NULL,
  `comment`     LONGTEXT NOT NULL,
  `status`      VARCHAR(191) NOT NULL DEFAULT 'approuvé',
  `createdAt`   VARCHAR(191) NOT NULL,
  `updatedAt`   VARCHAR(191) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `reviews_productId_authorEmail_key` (`productId`, `authorEmail`),
  KEY `reviews_productId_idx` (`productId`),
  KEY `reviews_authorEmail_idx` (`authorEmail`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
