import styles from './viewcontainer.module.css'

export default function ViewContainer({ children }) {
  return(
    <div className={styles.viewContainer}>
      { children }
    </div>
  )
}