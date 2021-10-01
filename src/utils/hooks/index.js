export function getConfig(token) {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
}
