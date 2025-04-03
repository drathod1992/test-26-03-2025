import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./PostList.css";
import styles from "./PostList.module.scss";

import {
  TextField,
  Pagination,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Input,
} from "@mui/material";
import { RootState } from "../../store/store";
import { Post } from "../../types";
import { fetchPostsRequest, updatePost } from "../../slices/postSlice";
import Header from "../../layout/header/Header";
import Footer from "../../layout/footer/Footer";

const PAGE_SIZE = 5; // Define the number of posts per page

const PostList = () => {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector(
    (state: RootState) => state.posts
  );

  const [search, setSearch] = useState(""); // State for search input
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]); // State for filtered posts
  const [currentPage, setCurrentPage] = useState(1); // State for current page number
  const [selectedPost, setSelectedPost] = useState<Post | null>(null); // State for selected post in edit dialog
  const [open, setOpen] = useState(false); // State to control the edit dialog visibility

  // Fetch posts when component mounts
  useEffect(() => {
    dispatch(fetchPostsRequest());
  }, [dispatch]);

  // Filter posts based on search query
  useEffect(() => {
    setFilteredPosts(
      data.filter((post: Post) =>
        post.title.toLowerCase().includes(search.toLowerCase())
      )
    );
    setCurrentPage(1); // Reset to first page when search changes
  }, [search, data]);

  // Handle input change for editing post
  const handleEdit = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setSelectedPost((prev) =>
      prev ? { ...prev, [e.target.name]: e.target.value } : prev
    );
  };

  // Save edited post and close the dialog
  const saveEdit = () => {
    if (selectedPost) dispatch(updatePost(selectedPost));
    setOpen(false);
  };

  // Open the edit dialog with selected post details
  const handleClickOpen = (post: Post) => {
    setSelectedPost(post);
    setOpen(true);
  };

  // Close the edit dialog
  const handleClose = () => setOpen(false);

  // Paginate the filtered posts
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <div
      style={{ backgroundColor: "#f9f9f9", height: "95vh", overflow: "auto" }}
    >
      <Header />
      <div className={styles.postListMain}>
        <h2>Search</h2>
        <Input
          placeholder="Search Post"
          onChange={(e) => setSearch(e.target.value)}
          className={styles.searchInput}
        />
        <h2>{search ? "Search Post" : "List"}</h2>

        {/* Show loading, error, or post list */}
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : (
          <TableContainer component={Paper} sx={{ backgroundColor: "#fff" }}>
            <Table className="list-table">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Details</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedPosts.map((post, index) => (
                  <TableRow
                    key={post.id}
                    onClick={() => handleClickOpen(post)}
                    style={{
                      cursor: "pointer",
                      backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#ffffff",
                    }}
                  >
                    <TableCell>{post.id}</TableCell>
                    <TableCell>{post.title}</TableCell>
                    <TableCell>{post.body}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Pagination component */}
        <Pagination
          count={Math.ceil(filteredPosts.length / PAGE_SIZE)}
          page={currentPage}
          onChange={(_, value) => setCurrentPage(value)}
          className={styles.pagination}
          variant="outlined"
          color="primary"
          shape="rounded"
        />

        {/* Edit Dialog */}
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Edit Post</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="title"
              name="title"
              label="Title"
              type="text"
              fullWidth
              value={selectedPost?.title || ""}
              onChange={handleEdit}
              className={styles.titleInput}
            />
            <TextField
              margin="dense"
              id="body"
              name="body"
              label="Post Detail"
              type="text"
              fullWidth
              value={selectedPost?.body || ""}
              onChange={handleEdit}
              multiline
              rows={4}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={saveEdit} variant="contained">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </div>
      <Footer />
    </div>
  );
};

export default PostList;
