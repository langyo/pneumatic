export default (...content) => {
  if (process.env.NODE_ENV !== 'production') console.log('[Nickel Cat]', ...content);
};