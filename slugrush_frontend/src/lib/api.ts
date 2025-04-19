const BACKEND_URL = "http://localhost:8000/get/daily";

export const fetchData = async <T = any>(): Promise<T> => {
  try {
    const response = await fetch(BACKEND_URL);

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }

    const data: T = await response.json(); // now returns typed data
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error; // propagate the error so calling code knows it failed
  }
};
