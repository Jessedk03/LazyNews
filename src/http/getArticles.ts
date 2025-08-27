
export async function getArticles() {
    try {
        const response = await fetch(`http://localhost:5063/api/index`, {
            method: 'GET',
            headers: {"Content-Type": "application/json"}
        });

        return await response.json();
    } catch (error) {
        console.error(error);
    }
}