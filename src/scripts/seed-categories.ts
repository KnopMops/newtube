import { db } from '@/db'
import { categories } from '@/db/schema'

const categoryNames = [
	'Техника',
	'Программирование',
	'Видеоигры',
	'Экшен и приключения',
	'Симуляторы',
	'Другое',
]

async function main() {
	console.log('Seeding categories...')

	try {
		const values = categoryNames.map(name => ({
			name,
			description: `Видео по категории ${name.toLowerCase()}`,
		}))

		await db.insert(categories).values(values)

		console.log('Categories seeded successfully.')

		process.exit(1)
	} catch (error) {
		console.error('Error seeding categories:', error)
		process.exit(1)
	}
}

main()
