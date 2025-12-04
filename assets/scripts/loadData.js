export async function loadData() {
  try {
    const response = await fetch('/assets/data.json');
    if (!response.ok) throw new Error('Failed to load data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};


