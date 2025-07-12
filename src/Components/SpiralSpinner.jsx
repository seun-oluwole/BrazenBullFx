import './spiralspinner.css'

export default function SpiralSpinner({ height, width }) {
  const styles = {
    height: `${height}px`,
    width: `${width}px`,
  };

  return (
    <span className="loader" style={styles}></span>
  );
}
