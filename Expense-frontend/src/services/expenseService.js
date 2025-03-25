const API_URL = "http://localhost:8080/api/expenses";

export const getExpenses = async () => {
    const response = await fetch(API_URL);
    return response.json();
};

export const addExpense = async (expense) => {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(expense),
    });
    return response.json();
};
