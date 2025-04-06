const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/tasks`;

const index = async () => {
  try {
    const res = await fetch(BASE_URL, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    const data = await res.json();
    console.log("Fetched tasks from backend:", data);
    return data;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
};

const show = async (taskId) => {
  try {
    const res = await fetch(`${BASE_URL}/${taskId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return res.json();
  } catch (error) {
    console.log(error);
  }
};

const create = async (taskFormData) => {
  try {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(taskFormData),
    });

    return res.json();
  } catch (error) {
    console.log(error);
  }
};

const createComment = async (taskId, commentFormData) => {
  try {
    const res = await fetch(`${BASE_URL}/${taskId}/comments`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(commentFormData),
    });

    return res.json();
  } catch (error) {
    console.log(error);
  }
};

const updateComment = async (taskId, commentId, commentFormData) => {
  try {
    const res = await fetch(`${BASE_URL}/${taskId}/comments/${commentId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(commentFormData),
    });

    // Debugging backend response
    const rawResponse = await res.text(); // Grab the raw response text
    console.log("Raw response from backend:", rawResponse); // Debugging step

    if (!res.ok) {
      throw new Error(`Failed to update comment: ${res.status}`);
    }

    return JSON.parse(rawResponse); // Ensure proper JSON parsing
  } catch (error) {
    console.error("Error updating comment:", error);
    throw error;
  }
};



const deleteTask = async (taskId) => {
  try {
    const res = await fetch(`${BASE_URL}/${taskId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return res.json();
  } catch (error) {
    console.log(error);
  }
};

const update = async (taskId, taskFormData) => {
  try {
    const res = await fetch(`${BASE_URL}/${taskId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(taskFormData),
    });
    return res.json();
  } catch (error) {
    console.log(error);
  }
};

export { index, show, create, createComment, deleteTask, update, updateComment };
