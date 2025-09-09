import { useState, useEffect } from "react";
import MainLayout from "./layouts/MainLayout";
import AddNotePage from "./pages/AddNotePage";
import EditNotePage from "./pages/EditNotePage";
import HomePage from "./pages/HomePage";
import NoteDetailPage from "./pages/NoteDetailPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import api from "./api";

const App = () => {
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filterText, setFilterText] = useState("");
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  // Create axios instance
  const axiosInstance = axios.create({
    baseURL: "http://127.0.0.1:8080/", // Ensure backend is running on this port
  });

  // Add token to every request
  axiosInstance.interceptors.request.use((config) => {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // Filters
  const handleFilterText = (val) => {
    setFilterText(val);
  };

  const handleSearchText = (val) => {
    setSearchText(val);
  };

  const filteredNotes =
    filterText === "BUSINESS"
      ? notes.filter((note) => note.category === "BUSINESS")
      : filterText === "PERSONAL"
      ? notes.filter((note) => note.category === "PERSONAL")
      : filterText === "IMPORTANT"
      ? notes.filter((note) => note.category === "IMPORTANT")
      : notes;

  // Fetch notes
  useEffect(() => {
    if (!token) return;

    setIsLoading(true);
    axiosInstance
      .get("notes/")
      .then((res) => {
        setNotes(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching notes:", err.message);
        setIsLoading(false);
      });
  }, [token]);

  // Search notes
  useEffect(() => {
    if (searchText.length < 3 || !token) return;

    api
      .get(`notes-search/?search=${searchText}`)
      .then((res) => {
        setNotes(res.data);
      })
      .catch((err) => console.error("Error searching notes:", err.message));
  }, [searchText, token]);

  // CRUD operations
  const addNote = (data) => {
    api
      .post("notes/", data)
      .then((res) => {
        setNotes([...notes, res.data]);
        toast.success("A new note has been added");
      })
      .catch((err) => console.error("Error adding note:", err.message));
  };

  const updateNote = (data, slug) => {
    api
      .put(`notes/${slug}/`, data)
      .then((res) => {
        setNotes(notes.map((n) => (n.slug === slug ? res.data : n)));
        toast.success("Note updated successfully");
      })
      .catch((err) => console.error("Error updating note:", err.message));
  };

  const deleteNote = (slug) => {
    api
      .delete(`notes/${slug}/`)
      .then(() => {
        setNotes(notes.filter((n) => n.slug !== slug));
        toast.success("Note deleted");
      })
      .catch((err) => console.error("Error deleting note:", err.message));
  };

  // Authentication
  const loginUser = (newToken) => {
    try {
      console.log("Login token:", newToken);
      const decoded = jwtDecode(newToken);
      console.log("Decoded token:", decoded);
      setToken(newToken);
      setUser(decoded);
      localStorage.setItem("token", newToken);
    } catch (err) {
      console.error("Invalid token:", err);
      logoutUser();
    }
  };

  const logoutUser = () => {
    console.log("Logging out user");
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    toast.info("Logged out");
  };

  // Auto-login if token exists
  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch {
        logoutUser();
      }
    }
  }, [token]);

  // Router setup
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        {!token ? (
          <>
            <Route
              path="/"
              element={<Login onLogin={loginUser} token={token} />}
            >
              <Route
                path="login"
                element={<Login onLogin={loginUser} token={token} />}
              />
              <Route path="register" element={<Register />} />
              <Route
                path="*"
                element={<Login onLogin={loginUser} token={token} />}
              />
            </Route>
          </>
        ) : (
          <Route
            path="/"
            element={
              <MainLayout
                searchText={searchText}
                handleSearchText={handleSearchText}
                onLogout={logoutUser}
                user={user}
              />
            }
          >
            <Route
              index
              element={
                <HomePage
                  notes={filteredNotes}
                  loading={isLoading}
                  handleFilterText={handleFilterText}
                />
              }
            />
            <Route
              path="add-note"
              element={<AddNotePage addNote={addNote} />}
            />
            <Route
              path="edit-note/:slug"
              element={<EditNotePage updateNote={updateNote} />}
            />
            <Route
              path="notes/:slug"
              element={<NoteDetailPage deleteNote={deleteNote} />}
            />
          </Route>
        )}
      </>
    )
  );

  return <RouterProvider router={router} />;
};

export default App;
