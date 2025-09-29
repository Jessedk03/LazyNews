export async function getArticles() {
  try {
    const response = await fetch(`http://192.168.200.225:8080/api/index`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    return await response.json();
  } catch (error) {
    console.error(error);
  }
}
