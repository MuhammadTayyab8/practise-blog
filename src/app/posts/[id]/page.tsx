import React from 'react';
import styles from '../postDetail.module.css';

const PostDetailPage = async ({ params }: { params: { id: string } }) => {
  try {
    // Fetch the individual post by its ID
    const res = await fetch(`https://dev-codescode.pantheonsite.io/wp-json/wp/v2/posts/${params.id}`);
    if (!res.ok) {
      throw new Error('Post not found');
    }
    const post = await res.json();

    return (
      <div className={styles.container}>
        <div className={styles.post}>
          <h1 className={styles.title} dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
          <div className={styles.content} dangerouslySetInnerHTML={{ __html: post.content.rendered }} />
        </div>
      </div>
    );
  } catch {
    return (
      <div className={styles.error}>
        <h1>Post not found</h1>
        <p>Sorry, the post you are looking for doesn't exist.</p>
      </div>
    );
  }
};

export default PostDetailPage;
