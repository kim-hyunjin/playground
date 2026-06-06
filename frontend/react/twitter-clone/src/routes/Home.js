import React, { useEffect, useState } from 'react';
import { dbService } from 'myFirebase';
import Kweet from 'components/Kweet';
import KweetFactory from 'components/KweetFactory';

const Home = ({ userObj }) => {
        const [kweets, setKweets] = useState([]);
        // const getKweets = async () => {
        //         const dbKweets = await dbService.collection("kweets").get();
        //         dbKweets.forEach((document) => {
        //                 const kweetObject = {
        //                         ...document.data(),
        //                         id: document.id
        //                 }
        //                 setKweets(prev => [kweetObject, ...prev]) // useState로 만든 Setter에 함수를 넣으주면 이전 값을 사용할 수 있음
        //         });
        // }
        useEffect(() => {
                dbService.collection("kweets").onSnapshot(snapshot => { // firesotre에 변경사항이 생길때마다 동작할 리스너
                        const kweetArray = snapshot.docs.map(doc => ({
                                id: doc.id,
                                ...doc.data()
                        }));
                        setKweets(kweetArray);
                })
        }, [])
        
        return (
                <div className="container">
                        <KweetFactory userObj={userObj} />
                        <div style={{marginTop: 30}}>
                                {kweets.map((kweet) => (
                                        <Kweet key={kweet.id} kweetObj={kweet} isOwner={kweet.creatorId === userObj.uid} />
                                ))}
                        </div>
                </div>
        )
}
export default Home