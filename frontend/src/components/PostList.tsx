import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchPostsRequest, updatePost } from "../slices/postSlice";
import "./postList.css";

import {
  TextField,
  Pagination,
  Button,
  Input,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
} from "@mui/material";
import { Post } from "../types";
import React from "react";
import { RootState } from "../store/store";

const PAGE_SIZE = 5;

const PostList = () => {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector(
    (state: RootState) => state.posts
  );

  const [search, setSearch] = useState("");
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchPostsRequest());
  }, [dispatch]);

  useEffect(() => {
    const filtered = data.filter((post: Post) =>
      post.title.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredPosts(filtered);
    setCurrentPage(1);
  }, [search, data]);

  const handleEdit = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (selectedPost) {
      setSelectedPost({ ...selectedPost, [e.target.name]: e.target.value });
    }
  };

  const saveEdit = () => {
    if (selectedPost) dispatch(updatePost(selectedPost));
    setOpen(false);
  };

  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleClickOpen = (post: Post) => {
    setSelectedPost(post);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <div className="postListMain">
      <h2>All Posts</h2>
      <Input
        placeholder="Search Post"
        onChange={(e) => setSearch(e.target.value)}
      />

      {search ? <h2>Search Post List</h2> : <h2>Post List</h2>}

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Details</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedPosts.map((post) => (
                <TableRow
                  key={post.id}
                  onClick={() => handleClickOpen(post)}
                  style={{ cursor: "pointer" }}
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

      <Pagination
        count={Math.ceil(filteredPosts.length / PAGE_SIZE)}
        page={currentPage}
        onChange={(_, value) => setCurrentPage(value)}
        className="pagination"
        showFirstButton
        showLastButton
        variant="outlined" 
        color="primary"
        shape="rounded"
      />

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit Post</DialogTitle>
        <DialogContent>
          <DialogContentText>Title</DialogContentText>
          <Input
            autoFocus
            required
            margin="dense"
            id="title"
            name="title"
            type="text"
            fullWidth
            value={selectedPost?.title || ""}
            onChange={handleEdit}
          />
          <TextField
            autoFocus
            margin="dense"
            id="body"
            name="body"
            label="Post Detail"
            type="text"
            fullWidth
            variant="standard"
            value={selectedPost?.body || ""}
            onChange={handleEdit}
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
  );
};

export default PostList;
