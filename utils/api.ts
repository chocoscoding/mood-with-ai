// Creates a URL based on the current window location and given path
const createURL = (path: string) => {
  return window.location.origin + path;
};

// Function to create a new entry in the journal
export const newEntry = async () => {
  // Make a POST request to the create entry API
  const res = await fetch(
    new Request(createURL("/api/journal"), {
      method: "POST",
      body: JSON.stringify({ content: "new entry" }),
    })
  );

  if (res.ok) {
    const data = await res.json();
    console.log(data);
    return data;
  }
};

// Function to update an existing entry in the journal
export const updateEntry = async ({ content, id }: { content: string; id: string }) => {
  // Make a PATCH request to the update entry API
  const res = await fetch(
    new Request(createURL("/api/journal/" + id), {
      method: "PATCH",
      body: JSON.stringify({ content }),
    })
  );

  if (res.ok) {
    const data = await res.json();
    console.log(data);
    return data;
  }
};

// Function to ask a question
export const askQuestion = async (question: string) => {
  // Make a POST request to the ask question API
  const res = await fetch(
    new Request(createURL(`/api/question`), {
      method: "POST",
      body: JSON.stringify({ question }),
    })
  );

  if (res.ok) {
    return res.json();
  } else {
    throw new Error("Something went wrong on API server!");
  }
};

// Function to delete an entry from the journal
export const deleteEntry = async (id: string) => {
  // Make a DELETE request to the delete entry API
  const res = await fetch(
    new Request(createURL(`/api/journal/${id}`), {
      method: "DELETE",
    })
  );

  if (res.ok) {
    console.log(res);
    return res.json();
  } else {
    throw new Error("Something went wrong on API server!");
  }
};
