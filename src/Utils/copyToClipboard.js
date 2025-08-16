import toast from "react-hot-toast";

export default async function handleCopyToClipboard(value) {
 if (!value) return
 try {
  await navigator.clipboard.writeText(value)
  toast.success("Copied!")
 } catch (error) {
  toast.error("Failed to copy.")
 }
}