import React, { useEffect, useState } from 'react';
import { authService, dbService } from 'myFirebase';
import { useHistory } from 'react-router-dom';

const Profile =  ({userObj, refreshUser}) => {
        const history = useHistory();
        const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
        const onLogOutClick = () => {
                authService.signOut();
                history.push('/');
        }
        const getMyKweets = async () => {
                const kweets = await dbService
                .collection("kweets")
                .where("creatorId", "==", userObj.uid)
                .orderBy("createdAt")
                .get();
                console.log(kweets.docs.map((doc) => doc.data()));
        };
        useEffect(() => {
                getMyKweets();
        }, []);
        const onChange = (event) => {
                const {target:{value}} = event;
                setNewDisplayName(value);
        };
        const onSubmit = async (event) => {
                event.preventDefault();
                if(userObj.displayName !== newDisplayName) {
                        await userObj.updateProfile({
                                displayName: newDisplayName
                        });
                        refreshUser();
                }
        };
        return (
                <div className="container">
                        <form onSubmit={onSubmit} className="profileForm">
                                <input 
                                        type="text" 
                                        placeholder="Display name" 
                                        value={newDisplayName} 
                                        onChange={onChange} 
                                        autoFocus 
                                        className="formInput" />
                                <input 
                                        type="submit" 
                                        value="Update Profile" 
                                        className="formBtn" 
                                        style={{marginTop: 10}} />
                        </form>
                        <span className="formBtn cancelBtn logOut" onClick={onLogOutClick}>
                                Log out
                        </span>
                </div>
        )
}

export default Profile;