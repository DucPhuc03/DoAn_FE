export async function createInterest(interest) {
  const { data } = await axios.post("/api/interest", { categoryIds: interest });
  return data;
}

export async function createVecForUser(id) {
  const { data } = await axios.post(`/embedding/user/${id}`);
  return data;
}
