import React, { useEffect, useCallback } from 'react';
import '../styles/modal.scss'
import YoutubePlayer from './YoutubePlayer';


const Modal = ({ isOpen, closeModal, videoKey }) => {
   const handleModalClick = (event) => {
      if (event.target.classList.contains('modal')) {
        closeModal();
      }
   };

   const handleKeyDown = useCallback(
      (event) => {
        if (event.key === 'Escape') {
          closeModal();
        }
      },
      [closeModal]
    );
  
    useEffect(() => {
      if (isOpen) {
        document.body.classList.add('modal-opened');
        window.addEventListener('keydown', handleKeyDown);
      } else {
        document.body.classList.remove('modal-opened');
      }
  
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        document.body.classList.remove('modal-opened');
      };
    }, [isOpen, handleKeyDown]);
  
   if (!isOpen) {
     return null;
   }
 
   return (
     <div className="modal" onClick={handleModalClick}>
       <div className="modal-content">
         <div className="close-modal" onClick={closeModal}>
           &times;
         </div>
         {videoKey ? (
           <div className="youtube-player">
             <YoutubePlayer videoKey={videoKey} />
           </div>
         ) : (
           <div className="no-trailer-message">
             <h6>No trailer available. Try another movie.</h6>
           </div>
         )}
       </div>
     </div>
   );
 };

export default Modal;