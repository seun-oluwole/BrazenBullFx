import { useModal } from "../context/modalContext";
import { HiArrowUpCircle, HiOutlineXCircle, HiTrash } from "react-icons/hi2";
import { supabase } from "../Utils/supabaseClient";
import { useState } from "react";
import { userAuth } from "../context/AuthContext";
import { useWallet } from "../context/WalletContextProvider";
import { v4 as uuidv4 } from "uuid";
import CustomModal from "./CustomModal";
import LoadingSpinner from "./LoadingSpinner";
import toast from "react-hot-toast";
import styles from "../Components/uploadmodal.module.css";

export default function UploadModal() {
  const [steps, setSteps] = useState(1)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const [removingPhoto, setRemovingPhoto] = useState(false)
  const { isUploadModalOpen, setIsUploadModalOpen } = useModal()
  const { userData } = userAuth()
  const { fetchImage, imageUrl } = useWallet()
  const userId = userData?.sub

  const closeModal = () => {
    setIsUploadModalOpen(false);
    setSteps(1);
  }

  const handleImageUpload = async (e) => {
    e.preventDefault()

    const file = e.target.files[0];
    if (!file) return

    const fullName = userData?.firstName + userData?.lastName
    const fileExt = file.name.split(".").pop()
    const filePath = `${fullName}-${uuidv4()}.${fileExt}`
    
    setUploadingPhoto(true)
    try {
      const { data, error: uploadError } = await supabase
      .storage
      .from("profile-images")
      .upload(filePath, file)

      if (uploadError) throw uploadError
      
      const { data: url } = supabase
      .storage
      .from("profile-images")
      .getPublicUrl(filePath);

      if (!url) return 
      const { error: updateError } = await supabase
      .from("wallet")
      .update({ image_url: url.publicUrl })
      .eq("user_id", userId)

      if (updateError) throw updateError

      toast.success("Uploaded successfully")
    } catch (error) {
      toast.error("Failed to upload photo")

    } finally {
      setUploadingPhoto(false)
      closeModal()
      await fetchImage()
    }
  }

  const handleRemoveImage = async () => {
    if (!imageUrl) return
    setRemovingPhoto(true)
    try {
      const { data: imageurl, error: fetchError } = await supabase
      .from("wallet")
      .select("image_url")
      .eq("user_id", userId)

      if (fetchError) throw fetchError

      if (imageurl[0]?.image_url) {
        const urlObj = new URL(imageurl[0]?.image_url);
        const fileName = urlObj.pathname.split('/').pop();

        const { data, error: deleteError } = await supabase
        .storage
        .from('profile-images')
        .remove([fileName])
  
        if (deleteError) throw deleteError
  
        const { error: updateError } = await supabase
        .from("wallet")
        .update({ image_url: null })
        .eq("user_id", userId)
  
        if (updateError) throw updateError

        toast.success("Deleted successfully")
      }

    } catch (error) {
      toast.error("Failed to delete photo")
    } finally {
      setRemovingPhoto(false)
      closeModal()
      await fetchImage()
    }

  }

  return (
    <CustomModal isOpen={isUploadModalOpen} onClose={closeModal}>
      <div className={styles.mainContainer}>
        <span className={styles.xContainer} onClick={closeModal}><HiOutlineXCircle className={styles.xIcon}/></span>
        <h2 className={styles.title}>Upload Photo</h2>
        <div className={styles.container}>
          {steps === 1 && (
          <>
            {!uploadingPhoto ? (
              <div className={styles.stepOneContainer}>
                <div>
                  <HiArrowUpCircle className={styles.icon}/> 
                  <label htmlFor="image-upload">
                    Upload profile photo
                    <input id="image-upload" type="file" onChange={handleImageUpload}/>
                  </label>
                </div>
                <div className={styles.removePhoto} onClick={() => setSteps((prev) => prev + 1)}>
                  <HiTrash className={styles.icon}/> Remove profile photo
                </div>
              </div>
            ) : (
              <div className={styles.spinnerContainer}>
                <LoadingSpinner />
              </div>
            )}
          </>
          )}
          {steps === 2 && (
          <div className={styles.stepTwoContainer}>
            {!removingPhoto 
            ? (  
              <>
                <h3 className={styles.subtitle}>Are you sure?</h3>
                <div className={styles.buttonContainer}>
                  <button className={styles.button} onClick={closeModal}>Cancel</button>
                  <button className={styles.removeButton} onClick={handleRemoveImage}>Yes Remove</button>
                </div>
              </>
             
            ) : (
               <div className={styles.spinnerContainer}>
                <LoadingSpinner />
              </div>
            )}
          </div>
          )}
        </div>
      </div>
    </CustomModal>
  )
}
