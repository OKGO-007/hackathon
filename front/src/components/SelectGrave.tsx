import React, { useState } from 'react';

type Position = {
  x: number;
  y: number;
};

type ImageData = {
  id: number;
  src: string;
  position: Position;
  rotate: number;
  scale: number;
  text: string;
  textDirection: 'horizontal' | 'vertical';
  textPosition: Position;
  textScale: number;
};

const imageOptions = [
  { label: 'お墓', src: '/images/osoushiki_ohaka.png' },
  { label: 'bousi', src: '/images/cap.png' },
  { label: 'お墓2', src: '/images/tombstone-151488_640.png' },
  // 他の画像も同様に追加
];

const SelectGrave = () => {
  const [images, setImages] = useState<ImageData[]>([]);
  const [currentImageId, setCurrentImageId] = useState<number | null>(null);
  const [selectedImageSrc, setSelectedImageSrc] = useState<string | null>(null);

  const handleInsertImage = () => {
    if (!selectedImageSrc) return;

    setImages((prevImages) => [
      ...prevImages,
      {
        id: Date.now(),
        src: selectedImageSrc,
        position: { x: 100, y: 100 },
        rotate: 0,
        scale: 1,
        text: '',
        textDirection: 'horizontal',
        textPosition: { x: 0, y: 0 },
        textScale: 1,
      },
    ]);
  };

  const moveImage = (dx: number, dy: number) => {
    if (currentImageId === null) return;

    setImages((prevImages) =>
      prevImages.map((img) =>
        img.id === currentImageId
          ? {
              ...img,
              position: {
                x: img.position.x + dx,
                y: img.position.y + dy,
              },
            }
          : img
      )
    );
  };

  const handleTextChange = (text: string) => {
    if (currentImageId === null) return;

    setImages((prevImages) =>
      prevImages.map((img) =>
        img.id === currentImageId ? { ...img, text } : img
      )
    );
  };

  const handleTextDirectionChange = (direction: 'horizontal' | 'vertical') => {
    if (currentImageId === null) return;

    setImages((prevImages) =>
      prevImages.map((img) =>
        img.id === currentImageId ? { ...img, textDirection: direction } : img
      )
    );
  };

  const moveText = (dx: number, dy: number) => {
    if (currentImageId === null) return;

    setImages((prevImages) =>
      prevImages.map((img) =>
        img.id === currentImageId
          ? {
              ...img,
              textPosition: {
                x: img.textPosition.x + dx,
                y: img.textPosition.y + dy,
              },
            }
          : img
      )
    );
  };

  const scaleText = (scaleChange: number) => {
    if (currentImageId === null) return;

    setImages((prevImages) =>
      prevImages.map((img) =>
        img.id === currentImageId
          ? { ...img, textScale: Math.max(0.1, img.textScale + scaleChange) }
          : img
      )
    );
  };

  return (
    <div>
      <div
      >
        <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '20px' }}>
          <p>画像選択</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', maxWidth: '200px' }}>
            {imageOptions.map((option) => (
              <div
                key={option.src}
                onClick={() => setSelectedImageSrc(option.src)}
                style={{
                  cursor: 'pointer',
                  margin: '5px',
                  border: selectedImageSrc === option.src ? '2px solid blue' : 'none',
                  borderRadius: '5px',
                }}
              >
                <img
                  src={option.src}
                  alt={option.label}
                  style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                />
              </div>
            ))}
          </div>

          <button onClick={handleInsertImage} disabled={!selectedImageSrc}>
            選択した画像を挿入
          </button>
          
          {currentImageId !== null && (
            <>
              <div style={{ marginTop: '20px' }}>
                <p>画像移動</p>
                <button onClick={() => moveImage(0, -10)}>上</button>
                <button onClick={() => moveImage(0, 10)}>下</button>
                <button onClick={() => moveImage(-10, 0)}>左</button>
                <button onClick={() => moveImage(10, 0)}>右</button>
              </div>
              <input
                type="text"
                placeholder="画像に表示するテキスト"
                onChange={(e) => handleTextChange(e.target.value)}
                style={{ marginTop: '10px' }}
              />
              <select
                onChange={(e) => handleTextDirectionChange(e.target.value as 'horizontal' | 'vertical')}
                style={{ marginTop: '10px' }}
              >
                <option value="horizontal">横</option>
                <option value="vertical">縦</option>
              </select>
              <div style={{ marginTop: '20px' }}>
                <p>テキスト移動</p>
                <button onClick={() => moveText(0, -1)}>上</button>
                <button onClick={() => moveText(0, 1)}>下</button>
                <button onClick={() => moveText(-1, 0)}>左</button>
                <button onClick={() => moveText(1, 0)}>右</button>
              </div>
              <div style={{ marginTop: '10px' }}>
                <p>テキスト拡大・縮小</p>
                <button onClick={() => scaleText(0.1)}>拡大</button>
                <button onClick={() => scaleText(-0.1)}>縮小</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SelectGrave;
