// prisma/seed.ts
import prisma from '../lib/prisma'; // Adjust path to your lib/prisma.ts

async function main() {
    console.log('Start seeding...');

    const accounts = [
        { name: 'Cash', type: 'ASSET' },
        { name: 'Inventory', type: 'ASSET' },
        { name: 'Owner Equity', type: 'EQUITY' },
        { name: 'Sales Revenue', type: 'REVENUE' },
        { name: 'Rent Expense', type: 'EXPENSE' },
    ];

    for (const account of accounts) {
        const created = await prisma.account.create({
            data: account,
        });
        console.log(`Created account: ${created.name}`);
    }

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error('Error during seeding:', e);
        process.exit(1);
    })
    .finally(async () => {
        // This is crucial in Prisma 7 with Driver Adapters
        await prisma.$disconnect();
    });