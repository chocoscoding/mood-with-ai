const createURL = (path: string) => {
  return window.location.origin + path;
};

export const newEntry = async () => {
  //run api call

  const res = await fetch(createURL("/api/entry"), {
    method: "POST",
    body: JSON.stringify({ content: "new entry" }),
  });

  if (res.ok) {
    const data = await res.json();
    return data;
  }
};
