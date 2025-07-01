import './loadingspinner.css'
export default function LoadingSpinner({height, width}) {
  const styles = {
    height: `${height}px`,
    width: `${width}px`
  }

  return (
    <div className="lds-ring" style={styles}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
}
