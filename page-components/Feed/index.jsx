import { Button } from '@/components/Button';
import { Spacer } from '@/components/Layout';
import styles from './Feed.module.css';
import Poster from './Poster';
import PostList from './PostList';

export const Feed = () => {
  return (
    <div className={styles.root}>
      <Spacer size={1} axis="vertical" />
      <Poster />
      <Button>Aws</Button>
      <PostList />
    </div>
  );
};
