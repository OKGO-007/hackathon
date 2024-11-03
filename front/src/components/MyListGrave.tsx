import React, { useContext, useState } from 'react';
import Modal from 'react-modal';
import { useGrave } from '../context/GraveContext';
import { useNavigate } from 'react-router-dom';
import { db } from './Firebase';
import { doc, deleteDoc, collection, query, where, getDocs } from "firebase/firestore";
import Header from './Header';
import { useAuthContext } from '../context/useAuthContext';

Modal.setAppElement('#root');

interface Grave {
    id: string;
    characterName: string;
    animeInfo: string;
    imageUrl: string;
    timestamp: number;
    visitors: number;
    isPublic: boolean;
    userId: string;
    message: string; // 追加: メッセージフィールド
}

const ITEMS_PER_PAGE = 20; // 1ページあたりの表示数

const MyListGrave = () => {
    const { graves } = useGrave();
    const navigate = useNavigate();
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedGrave, setSelectedGrave] = useState<Grave | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const { user } = useAuthContext();

    const handleCardClick = (grave: Grave) => {
        setSelectedGrave(grave);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setSelectedGrave(null);
    };

    const Delete = async (grave: Grave) => {
        if (user) {
            try {
                const allGravesQuery = query(
                    collection(db, 'all_graves'),
                    where('userId', '==', grave.userId),
                    where('timestamp', '==', grave.timestamp)
                );
                const allGravesSnapshot = await getDocs(allGravesQuery);
                allGravesSnapshot.forEach(async (doc) => {
                    await deleteDoc(doc.ref);
                });

                const userGravesRef = collection(doc(db, 'graves', user.uid), 'grave');
                const userGravesQuery = query(
                    userGravesRef,
                    where('userId', '==', grave.userId),
                    where('timestamp', '==', grave.timestamp)
                );
                const userGravesSnapshot = await getDocs(userGravesQuery);
                userGravesSnapshot.forEach(async (doc) => {
                    await deleteDoc(doc.ref);
                });

                closeModal();
            } catch (error) {
                console.error("Error deleting grave:", error);
            }
        } else {
            console.error("User is not authenticated");
        }
    };

    const sortedGraves = graves.sort((a: Grave, b: Grave) => b.timestamp - a.timestamp);
    const totalPages = Math.ceil(sortedGraves.length / ITEMS_PER_PAGE);
    const currentGraves = sortedGraves.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    return (
        <div>
            <Header />
            <h2>お墓リスト</h2>
            {sortedGraves.length > 0 ? (
                <ul style={{ listStyleType: 'none', padding: 0, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                    {currentGraves.map((grave) => (
                        <li
                            key={grave.id}
                            style={{
                                border: '1px solid #ccc',
                                borderRadius: '8px',
                                padding: '10px',
                                display: 'flex',
                                alignItems: 'center',
                                cursor: 'pointer',
                                transition: 'transform 0.3s',
                                backgroundColor: '#f9f9f9',
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                            }}
                            onClick={() => handleCardClick(grave)}
                        >
                            <img src={grave.imageUrl} alt={grave.characterName} style={{ width: '250px', height: 'auto', borderRadius: '5px', marginRight: '20px' }} />
                            <div>
                                <h3 style={{ margin: '0' }}>{grave.characterName}</h3>
                                <p>アニメ: {grave.animeInfo}</p>
                                <p>作成日: {new Date(grave.timestamp).toLocaleDateString('ja-JP')}</p>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <p>参拝者数: {grave.visitors}</p>
                                    <p>{grave.isPublic ? '公開' : '非公開'}</p>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>お墓データはありません。</p>
            )}

            <div style={{ marginTop: '20px' }}>
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index + 1}
                        onClick={() => setCurrentPage(index + 1)}
                        style={{
                            margin: '0 5px',
                            padding: '10px',
                            backgroundColor: currentPage === index + 1 ? '#2196F3' : '#ddd',
                            color: currentPage === index + 1 ? 'white' : 'black',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                        }}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={{
                    overlay: { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
                    content: { top: '50%', left: '50%', right: 'auto', bottom: 'auto', marginRight: '-50%', transform: 'translate(-50%, -50%)', width: '80%', maxWidth: '800px', height: '600px', padding: '20px' }, // 縦に長くする
                }}
            >
                {selectedGrave && (
                    <div style={{ maxHeight: '520px', overflowY: 'auto' }}> {/* コンテンツの最大高さを設定 */}
                        <h2>{selectedGrave.characterName}</h2>
                        <img src={selectedGrave.imageUrl} alt={selectedGrave.characterName} style={{ width: '100%', height: 'auto', borderRadius: '5px', marginBottom: '20px' }} />
                        <p>アニメ: {selectedGrave.animeInfo}</p>
                        <p>作成日: {new Date(selectedGrave.timestamp).toLocaleDateString('ja-JP')}</p>
                        <p>参拝者数: {selectedGrave.visitors}</p>
                        <p>公開状態: {selectedGrave.isPublic ? '公開' : '非公開'}</p>
                        {selectedGrave.message && (
                            <p style={{ marginTop: '20px', fontStyle: 'italic', color: '#555' }}>
                                メッセージ: {selectedGrave.message}
                            </p>
                        )}
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                            <button onClick={closeModal} style={{
                                backgroundColor: '#2196F3',
                                color: 'white',
                                padding: '10px 20px',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                transition: 'background-color 0.3s',
                            }}>閉じる</button>
                            <button onClick={() => Delete(selectedGrave)} style={{
                                backgroundColor: 'red',
                                color: 'white',
                                padding: '10px 20px',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                transition: 'background-color 0.3s',
                            }}>除去</button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default MyListGrave;
