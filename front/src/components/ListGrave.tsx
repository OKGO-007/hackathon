import React, { useState } from 'react';
import Modal from 'react-modal';
import { useGrave } from '../context/GraveContext';
import { useNavigate } from 'react-router-dom';

Modal.setAppElement('#root');

interface Grave {
  id: string;
  characterName: string;
  animeInfo: string;
  imageUrl: string;
  timestamp: number;
  visitors: number;
  isPublic: boolean;
}



const ListGrave = () => {
  const { allPublicGraves } = useGrave();
  const navigate = useNavigate();

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedGrave, setSelectedGrave] = useState<Grave | null>(null);

  const handleCardClick = (grave: Grave) => {
    setSelectedGrave(grave);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedGrave(null);
  };

  const sortedGraves = allPublicGraves.sort((a: Grave, b: Grave) => {
    return b.timestamp - a.timestamp;
  });

  return (
    <div>
      <h2>お墓リスト</h2>
      {sortedGraves.length > 0 ? (
        <ul style={{ listStyleType: 'none', padding: 0, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
          {sortedGraves.map((grave) => (
            <li 
              key={grave.id} 
              style={{ 
                border: '1px solid #ccc', 
                padding: '10px', 
                display: 'flex', 
                alignItems: 'center', 
                cursor: 'pointer'
              }}
              onClick={() => handleCardClick(grave)}
            >
              <img src={grave.imageUrl} alt={grave.characterName} style={{ width: '250px', height: 'auto', marginRight: '20px' }} />
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

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={{
          overlay: { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
          content: { top: '50%', left: '50%', right: 'auto', bottom: 'auto', marginRight: '-50%', transform: 'translate(-50%, -50%)', width: '80%', maxWidth: '500px', padding: '20px' },
        }}
      >
        {selectedGrave && (
          <div>
            <h2>{selectedGrave.characterName}</h2>
            <img src={selectedGrave.imageUrl} alt={selectedGrave.characterName} style={{ width: '100%', height: 'auto', marginBottom: '20px' }} />
            <p>アニメ: {selectedGrave.animeInfo}</p>
            <p>作成日: {new Date(selectedGrave.timestamp).toLocaleDateString('ja-JP')}</p>
            <p>参拝者数: {selectedGrave.visitors}</p>
            <p>公開状態: {selectedGrave.isPublic ? '公開' : '非公開'}</p>
            <button onClick={closeModal} style={{ marginTop: '20px' }}>閉じる</button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ListGrave;
