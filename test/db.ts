import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const message = prisma.message.create({
	data: {
		content: 'i am so cool',
		conversationId: 1,
		userId: 2
	}
}).then(console.log)
