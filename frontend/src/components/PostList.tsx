import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchPostsRequest, updatePost } from "../slices/postSlice";
import { RootState } from "../store";
import "./postList.css";

import {TextField, Pagination, Button } from "@mui/material";
import { Post } from "../types";

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

  const handleEdit = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedPost) {
      setSelectedPost({ ...selectedPost, title: e.target.value });
    }
  };

  const saveEdit = () => {
    if (selectedPost) dispatch(updatePost(selectedPost));
    setSelectedPost(null);
  };

  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <div>
      <h1>Posts</h1>
      <TextField
        label="Search by title"
        variant="outlined"
        onChange={(e) => setSearch(e.target.value)}
      />

      <h2>Search Results</h2>
      <ul>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : (
          paginatedPosts.map((post) => (
            <li
              key={post.id}
              className="postListItem"
              onClick={() => setSelectedPost(post)}
            >
              {post.title}
            </li>
          ))
        )}
      </ul>

      {selectedPost && (
        <div className="editPost">
          <h2>Edit Post Form</h2>
          <TextField value={selectedPost.title} onChange={handleEdit} />
          <Button variant="contained" onClick={saveEdit}>
            Save
          </Button>
        </div>
      )}

      <Pagination
        count={Math.ceil(filteredPosts.length / PAGE_SIZE)}
        page={currentPage}
        onChange={(_, value) => setCurrentPage(value)}
      />
    </div>
  );
};

export default PostList;
