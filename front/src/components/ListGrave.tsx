import React, { useState } from 'react';
import Modal from 'react-modal';
import { useGrave } from '../context/GraveContext';
import { useNavigate } from 'react-router-dom';
import { doc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from "../components/Firebase"; // Firebase設定ファイルのインポート

Modal.setAppElement('#root');

interface Grave {
    id: string;
    imageUrl: string;
    animeInfo: string;
    animeId: string;
    characterName: string;
    characterId: string;
    visitors: number;
    isPublic: boolean;
    userId: string;
    timestamp: number;
    message: string; // messageを追加
}

const ListGrave = () => {
    const { allPublicGraves } = useGrave();
    const navigate = useNavigate();

    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedGrave, setSelectedGrave] = useState<Grave | null>(null);
    const [isAnimating, setIsAnimating] = useState(false);
    const [showVisitorsChange, setShowVisitorsChange] = useState(false);
    const [incrementAnimation, setIncrementAnimation] = useState(false);

    // ページネーション用の状態
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 20; // 1ページあたりのお墓の数

    const handleCardClick = (grave: Grave) => {
        setSelectedGrave(grave);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setSelectedGrave(null);
    };

    const handleIncrementVisitors = async (grave: Grave) => {
        if (!grave) return;

        try {
            setIsAnimating(true);
            setShowVisitorsChange(true);
            setIncrementAnimation(true);

            // 参拝者数を更新する処理...
            const allGravesQuery = query(
                collection(db, 'all_graves'),
                where('userId', '==', grave.userId),
                where('timestamp', '==', grave.timestamp)
            );
            const allGravesSnapshot = await getDocs(allGravesQuery);
            allGravesSnapshot.forEach(async (docSnap) => {
                const graveRef = doc(db, 'all_graves', docSnap.id);
                await updateDoc(graveRef, {
                    visitors: grave.visitors + 1,
                });
            });

            const userGravesRef = doc(db, 'graves', grave.userId);
            const userGraveQuery = query(
                collection(userGravesRef, 'grave'),
                where('timestamp', '==', grave.timestamp)
            );
            const userGraveSnapshot = await getDocs(userGraveQuery);
            userGraveSnapshot.forEach(async (docSnap) => {
                const userGraveRef = doc(userGravesRef, 'grave', docSnap.id);
                await updateDoc(userGraveRef, {
                    visitors: grave.visitors + 1,
                });
            });

            setSelectedGrave((prev) => prev && { ...prev, visitors: prev.visitors + 1 });

            setTimeout(() => {
                setIsAnimating(false);
                setShowVisitorsChange(false);
                setIncrementAnimation(false);
            }, 1000);
        } catch (error) {
            console.error('Error incrementing visitors:', error);
        }
    };

    // お墓のリストをページネーションで表示
    const sortedGraves = allPublicGraves.sort((a: Grave, b: Grave) => {
        return b.timestamp - a.timestamp;
    });
    const pageCount = Math.ceil(sortedGraves.length / itemsPerPage);
    const currentGraves = sortedGraves.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div>
            <h2>お墓リスト</h2>
            {currentGraves.length > 0 ? (
                <ul style={{ listStyleType: 'none', padding: 0, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                    {currentGraves.map((grave) => (
                        <li 
                            key={grave.id} 
                            style={{ 
                                border: '1px solid #ccc', 
                                padding: '10px', 
                                borderRadius: '10px',
                                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                                display: 'flex', 
                                alignItems: 'center', 
                                cursor: 'pointer',
                                transition: 'transform 0.3s',
                            }}
                            onClick={() => handleCardClick(grave)}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            <img src={grave.imageUrl} alt={grave.characterName} style={{ width: '250px', height: 'auto', borderRadius: '10px', marginRight: '20px' }} />
                            <div style={{ flex: '1' }}>
                                <h3 style={{ margin: '0', fontSize: '20px' }}>{grave.characterName}</h3>
                                <p style={{ margin: '5px 0', fontSize: '16px' }}>アニメ: {grave.animeInfo}</p>
                                <p style={{ margin: '5px 0', fontSize: '16px' }}>作成日: {new Date(grave.timestamp).toLocaleDateString('ja-JP')}</p>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <p style={{ fontSize: '16px' }}>参拝者数: {grave.visitors}</p>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>お墓データはありません。</p>
            )}

            {/* ページネーション */}
            <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
                {Array.from({ length: pageCount }, (_, index) => (
                   <button
                   key={index}
                   onClick={() => handlePageChange(index)} // ページ番号を設定する関数
                   style={{
                       margin: '0 5px',
                       padding: '10px',
                       backgroundColor: currentPage === index ? '#2196F3' : '#ddd', // 現在のページと比較
                       color: currentPage === index ? 'white' : 'black', // 色の設定
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
                    content: { 
                        top: '50%', 
                        left: '50%', 
                        right: 'auto', 
                        bottom: 'auto', 
                        marginRight: '-50%', 
                        transform: isAnimating ? 'translate(-50%, -50%) scale(1.05)' : 'translate(-50%, -50%) scale(1)', 
                        width: '90%', 
                        maxWidth: '800px', 
                        maxHeight: '90vh', 
                        overflowY: 'auto', 
                        padding: '20px',
                        transition: 'transform 0.3s ease-in-out',
                    },
                }}
            >
                {selectedGrave && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <img 
                            src={selectedGrave.imageUrl} 
                            alt={selectedGrave.characterName} 
                            style={{ width: '100%', height: 'auto', maxWidth: '500px', borderRadius: '10px', marginBottom: '20px' }} 
                        />
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                            <h2 style={{ margin: '0 0 10px 0', fontSize: '32px' }}>{selectedGrave.characterName}</h2>
                            <p style={{ margin: '0 0 5px 0', fontSize: '26px' }}>アニメ: {selectedGrave.animeInfo}</p>
                            <p style={{ margin: '0 0 5px 0', fontSize: '26px' }}>作成日: {new Date(selectedGrave.timestamp).toLocaleDateString('ja-JP')}</p>
                            <p style={{ margin: '0 0 10px 0', fontSize: '20px' }}>参拝者数: {selectedGrave.visitors}</p>
                            <p style={{ margin: '10px 0 0 0', fontSize: '20px' }}>【別れの言葉】</p>
                            {selectedGrave.message && (
                            <p style={{ marginTop: '20px', fontStyle: 'italic', color: '#555', fontSize: '20px' }}>
                                {selectedGrave.message}
                            </p>
                            )}
                            
                            <button onClick={() => handleIncrementVisitors(selectedGrave)} style={{ 
                                backgroundColor: '#2196F3', 
                                color: 'white', 
                                padding: '10px 20px', 
                                border: 'none', 
                                borderRadius: '5px', 
                                cursor: 'pointer', 
                                fontSize: '20px', 
                                marginTop: '10px',
                                transition: 'background-color 0.3s',
                            }}>
                                参拝する
                            </button>
                        </div>
                        <button onClick={closeModal} style={{ 
                            backgroundColor: '#f44336', 
                            color: 'white', 
                            padding: '10px 20px', 
                            border: 'none', 
                            borderRadius: '5px', 
                            cursor: 'pointer', 
                            fontSize: '20px', 
                            marginTop: '10px',
                            transition: 'background-color 0.3s',
                        }}>
                            閉じる
                        </button>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default ListGrave;
