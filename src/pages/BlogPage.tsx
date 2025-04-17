
import React, { useState, useEffect, useRef } from 'react';

interface BlogPost {
  id: number;
  title: string;
  content: string;
  author: string;
}

const BlogPage: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const hasMounted = useRef(false);

  useEffect(() => {
    const storedPosts = localStorage.getItem('dyslexiaBlogPosts');
    if (storedPosts) {
      setPosts(JSON.parse(storedPosts));
    }
  }, []);

  useEffect(() => {
    if (hasMounted.current) {
      localStorage.setItem('dyslexiaBlogPosts', JSON.stringify(posts));
    } else {
      hasMounted.current = true;
    }
  }, [posts]);

  const handleAddPost = () => {
    if (newTitle.trim() && newContent.trim() && newAuthor.trim()) {
      const newPost: BlogPost = {
        id: Date.now(),
        title: newTitle,
        content: newContent,
        author: newAuthor
      };
      setPosts([newPost, ...posts]);
      setNewTitle('');
      setNewContent('');
      setNewAuthor('');
    }
  };

  const handleDeletePost = (id: number) => {
    setPosts(posts.filter(post => post.id !== id));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-purple-600 mb-4">📝Blog for Parents</h2>
       <h4 className='text-lg text-pink-400 mb-4'>Share your stories, questions, and experiences with other parents.</h4>
      <div className="bg-gray-100 p-4 rounded-xl shadow mb-6">
        <h3 className="text-xl font-semibold mb-2">Add a New Blog Post</h3>
        <input
          placeholder="Author Name"
          value={newAuthor}
          onChange={e => setNewAuthor(e.target.value)}
          className="mb-2 w-full p-2 border rounded"
        />
        <input
          placeholder="Blog Title"
          value={newTitle}
          onChange={e => setNewTitle(e.target.value)}
          className="mb-2 w-full p-2 border rounded"
        />
        <textarea
          placeholder="Write your story or question..."
          value={newContent}
          onChange={e => setNewContent(e.target.value)}
          className="mb-2 w-full p-2 border rounded"
          rows={4}
        />
        <button
          onClick={handleAddPost}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          Post Blog
        </button>
      </div>

      {posts.map(post => (
        <div key={post.id} className="mb-4 border rounded shadow p-4 bg-white">
          <h4 className="text-xl font-semibold text-purple-700 mb-1">{post.title}</h4>
          <p className="text-sm text-gray-500 mb-2">by {post.author}</p>
          <p className="text-gray-800 mb-3">{post.content}</p>
          <button
            onClick={() => handleDeletePost(post.id)}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

export default BlogPage;
