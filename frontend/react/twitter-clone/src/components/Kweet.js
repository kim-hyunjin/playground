import { dbService, storageService } from 'myFirebase';
import React, { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";


const Kweet = ({ kweetObj, isOwner }) => {
        const [editing, setEditing] = useState(false);
        const [newKweet, setNewKweet] = useState(kweetObj.text);
        const onDeleteClick = async () => {
                const ok = window.confirm("Are you sure you want to delete this kweet?");
                if (ok) {
                        await dbService.doc(`kweets/${kweetObj.id}`).delete();
                        await storageService.refFromURL(kweetObj.attachmentUrl).delete();
                }
        };
        const toggleEditing = () => setEditing(prev => !prev);
        const onChange = (event) => {
                const { target: { value } } = event;
                setNewKweet(value);
        }
        const onSubmit = async (event) => {
                event.preventDefault();
                await dbService.doc(`kweets/${kweetObj.id}`).update({
                        text: newKweet
                });
                setEditing(false);
        }


        return (
                <div className="nweet">
                        {editing ?
                                <>
                                        <form onSubmit={onSubmit} className="container nweetEdit">
                                                <input type="text" 
                                                        value={newKweet} 
                                                        required 
                                                        onChange={onChange} 
                                                        autoFocus 
                                                        className="formInput" />
                                                <input type="submit" value="Update Kweet" className="formBtn" />
                                        </form>
                                        <span onClick={toggleEditing} className="formBtn cancelBtn">Cancel</span>
                                </> :
                                <>
                                        <h4>{kweetObj.text}</h4>
                                        {kweetObj.attachmentUrl && <img src={kweetObj.attachmentUrl} />}
                                        {isOwner && (
                                                <div class="nweet__actions">
                                                <span onClick={onDeleteClick}>
                                                  <FontAwesomeIcon icon={faTrash} />
                                                </span>
                                                <span onClick={toggleEditing}>
                                                  <FontAwesomeIcon icon={faPencilAlt} />
                                                </span>
                                              </div>
                                        )}
                                </>
                        }
                </div>
        )
};

export default Kweet;