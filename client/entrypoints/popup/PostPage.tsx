import { useState, useEffect } from "react";

interface User {
  access_token: string;
  sub: string;
}

interface PostPageProps {
  user: User;
  setPage: (page: string) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

interface Post {
  linkedinPostId: string;
}

const PostPage: React.FC<PostPageProps> = ({
  user,
  setPage,
  loading,
  setLoading,
}) => {
  const [postText, setPostText] = useState<string>("");
  const [posts, setPosts] = useState<Post[]>([]);

  async function postToLinkedIn() {
    try {
      setLoading(true);
      const response = await fetch(
        "http://localhost:5000/api/posts/post-to-linkedin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: user.access_token,
            author: user.sub,
            text: postText,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      console.log("Successfully posted:", data);
      alert("Successfully posted");
      fetchPosts();
      setPostText("");
    } catch (error) {
      console.error("Error posting to LinkedIn:", (error as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function fetchPosts() {
    try {
      setLoading(true);
      const response = await fetch(
        "http://localhost:5000/api/posts/get-posts",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: user.sub }),
        }
      );

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error("Error fetching posts:", (error as Error).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPosts();
  }, [user.sub]);

  return (
    <div className="post-page-container">
      <h2>Create a New Post</h2>
      <textarea
        placeholder="Enter your LinkedIn post here..."
        value={postText}
        onChange={(e) => setPostText(e.target.value)}
        className="post-textarea"
      ></textarea>
      <button className="post-button" onClick={postToLinkedIn}>
        Post to LinkedIn
      </button>

      <h2>Total Posts From Extension : {posts?.length}</h2>
      <ul className="posts-list">
        {posts.length > 0 ? (
          posts.map((post) => (
            <li key={post.linkedinPostId} className="post-item">
              {post.linkedinPostId}
            </li>
          ))
        ) : (
          <p>No posts available</p>
        )}
      </ul>

      <button className="back-button" onClick={() => setPage("userDetails")}>
        Back to Details
      </button>
    </div>
  );
};

export default PostPage;
