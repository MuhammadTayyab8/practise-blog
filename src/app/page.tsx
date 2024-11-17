'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

type Post = {
  id: number;
  title: { rendered: string };
  excerpt: { rendered: string };
  featured_media: number;
  imageUrl: string | null;
};

const PostsPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const postsRes = await fetch(
        'https://dev-codescode.pantheonsite.io/wp-json/wp/v2/posts?_=' + Date.now(),
        { cache: 'no-store' }
      );
      if (!postsRes.ok) throw new Error('Failed to fetch posts');
      const postsData: Post[] = await postsRes.json();

      const updatedPosts = await Promise.all(
        postsData.map(async (post) => {
          if (post.featured_media) {
            const mediaRes = await fetch(
              `https://dev-codescode.pantheonsite.io/wp-json/wp/v2/media/${post.featured_media}`
            );
            if (mediaRes.ok) {
              const media = await mediaRes.json();
              return { ...post, imageUrl: media.source_url };
            }
          }
          return { ...post, imageUrl: null };
        })
      );

      setPosts(updatedPosts);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
    const interval = setInterval(fetchPosts, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Latest Posts</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className={styles.postsGrid}>
          {posts.map((post) => (
            <div key={post.id} className={styles.postBox}>
              <Link href={`/posts/${post.id}`}>

                  {post.imageUrl && (
                    <img src={post.imageUrl} alt={post.title.rendered} className={styles.postImage} />
                  )}
                  <h2
                    className={styles.postTitle}
                    dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                  />
                  <div
                    className={styles.excerpt}
                    dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
                  />

              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostsPage;
