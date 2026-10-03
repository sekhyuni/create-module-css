export const ProfileCard = () => {
  return (
    <div className={styles.card}>
      <img className={styles.avatar} src="/avatar.png" alt="" />
      <div className={styles.info}>
        <h2 className={styles.name}>sekhyuni</h2>
        <p className={styles.role}>Frontend Developer</p>
      </div>
      <button type="button" className={styles.followButton}>
        Follow
      </button>
    </div>
  );
};
