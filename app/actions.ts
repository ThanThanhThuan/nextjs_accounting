"use server"
import prisma from "@/lib/prisma"

export async function getTrialBalance() {
    const accounts = await prisma.account.findMany({
        include: {
            entries: true
        }
    });

    const report = accounts.map(account => {
        let totalDebit = 0;
        let totalCredit = 0;

        account.entries.forEach(entry => {
            const amt = Number(entry.amount);
            if (entry.type === 'DEBIT') totalDebit += amt;
            else totalCredit += amt;
        });

        // Accounting Logic: Determine if the net balance is a Debit or a Credit
        // Assets/Expenses usually have Debit balances.
        // Liabilities/Equity/Revenue usually have Credit balances.
        let netDebit = 0;
        let netCredit = 0;

        const diff = totalDebit - totalCredit;

        if (diff > 0) {
            netDebit = diff;
        } else if (diff < 0) {
            netCredit = Math.abs(diff);
        }

        return {
            id: account.id,
            name: account.name,
            type: account.type,
            debit: netDebit,
            credit: netCredit
        };
    });

    return report;
}

export async function getLedgerData(accountId: number) {
    const account = await prisma.account.findUnique({
        where: { id: accountId },
        include: {
            entries: {
                include: {
                    transaction: true
                },
                orderBy: {
                    transaction: { date: 'asc' }
                }
            }
        }
    });

    return account;
}

export async function getAccounts() {
    return await prisma.account.findMany();
}

export async function createTransaction(description: string, entries: { accountId: number, amount: number, type: string }[]) {
    // 1. Validate Balance
    const totalDebits = entries.filter(e => e.type === 'DEBIT').reduce((sum, e) => sum + e.amount, 0);
    const totalCredits = entries.filter(e => e.type === 'CREDIT').reduce((sum, e) => sum + e.amount, 0);

    if (totalDebits !== totalCredits) {
        throw new Error("Transaction Unbalanced: Debits must equal Credits");
    }

    // 2. Save to SQL Server
    return await prisma.$transaction(async (tx) => {
        return await tx.journalTransaction.create({
            data: {
                description,
                entries: {
                    create: entries.map(e => ({
                        amount: e.amount,
                        type: e.type,
                        accountId: e.accountId
                    }))
                }
            }
        });
    });
}