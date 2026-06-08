export interface SummaryResponse {
    totalExpense: number;
    expenseCount: number;
    categoryBreakdown: {
        [key: string]: number;
    };
}