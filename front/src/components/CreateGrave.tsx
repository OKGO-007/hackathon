import React, { useRef, useState } from 'react';
import { CirclePicker } from 'react-color';
import Header from './Header';

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
};

const CreateGrave = () => {
  const [images, setImages] = useState<ImageData[]>([]);
  const [currentImageId, setCurrentImageId] = useState<number | null>(null);
  const dragOffset = useRef<Position>({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const [background, setBackground] = useState<string | null>(null);
  const [background_colore, setBackground_colore] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);


  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  

  const handleMouseDown = (event: React.MouseEvent, id: number) => {
    setCurrentImageId(id);
    const image = images.find((img) => img.id === id);
    if (!image) return;

    dragOffset.current = {
      x: event.clientX - image.position.x,
      y: event.clientY - image.position.y,
    };

    isDragging.current = true;
    event.preventDefault();
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!isDragging.current || currentImageId === null) return;

    const newPosition = {
      x: event.clientX - dragOffset.current.x,
      y: event.clientY - dragOffset.current.y,
    };

    setImages((prevImages) =>
      prevImages.map((img) =>
        img.id === currentImageId ? { ...img, position: newPosition } : img
      )
    );
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const rotateImage = (angle: number) => {
    if (currentImageId === null) return;

    setImages((prevImages) =>
      prevImages.map((img) =>
        img.id === currentImageId ? { ...img, rotate: img.rotate + angle } : img
      )
    );
  };

  const enlargeImage = () => {
    if (currentImageId === null) return;

    setImages((prevImages) =>
      prevImages.map((img) =>
        img.id === currentImageId ? { ...img, scale: img.scale + 0.1 } : img
      )
    );
  };

  const shrinkImage = () => {
    if (currentImageId === null) return;

    setImages((prevImages) =>
      prevImages.map((img) =>
        img.id === currentImageId ? { ...img, scale: img.scale - 0.1 } : img
      )
    );
  };

  const bringImageForward = () => {
    if (currentImageId === null) return;

    setImages((prevImages) => {
      const index = prevImages.findIndex((img) => img.id === currentImageId);
      if (index === -1 || index === prevImages.length - 1) return prevImages;

      const newImages = [...prevImages];
      const [selectedImage] = newImages.splice(index, 1);
      newImages.push(selectedImage);

      return newImages;
    });
  };

  const sendImageBackward = () => {
    if (currentImageId === null) return;

    setImages((prevImages) => {
      const index = prevImages.findIndex((img) => img.id === currentImageId);
      if (index === -1 || index === 0) return prevImages;

      const newImages = [...prevImages];
      const [selectedImage] = newImages.splice(index, 1);
      newImages.unshift(selectedImage);

      return newImages;
    });
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImages((prevImages) => [
        ...prevImages,
        {
          id: Date.now(),
          src: imageUrl,
          position: { x: 100, y: 100 },
          rotate: 0,
          scale: 1,
        },
      ]);
    }
  };

  const handleCancel = () => {
    setCurrentImageId(null);
  };

  const handleBackgroundChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const backgroundUrl = URL.createObjectURL(file);
      setBackground(`url(${backgroundUrl})`);
    }
  };

  const handleBackgroundColorChange = (color: string) => {
    setBackground_colore(color);
    console.log("color",color)
  };


  const handleImageDelete = () =>{
    if (currentImageId === null) return;
    setImages((prevImages) =>
      prevImages.filter((img) => img.id !== currentImageId)
    );
    // 選択状態を解除
    setCurrentImageId(null);
  };


  return (
    <div>
      <Header />
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f0f0f0',
        overflow: 'hidden',
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div
        style={{
          width: 600,
          height: 600,
          position: 'relative',
          backgroundColor: background_colore ?? '#ccc',
          overflow: 'hidden',
          backgroundImage: background ?? 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {images.map((image) => (
          <div
            key={image.id}
            onMouseDown={(e) => handleMouseDown(e, image.id)}
            style={{
              width: 100 * image.scale,
              height: 100 * image.scale,
              position: 'absolute',
              top: image.position.y,
              left: image.position.x,
              cursor: 'move',
              transform: `rotate(${image.rotate}deg)`,
              transformOrigin: 'center',
              border: currentImageId === image.id ? '1px solid rgba(0, 0, 255, 0.5)' : 'none',
            }}
          >
            <img
              src={image.src}
              alt="draggable"
              style={{ width: '100%', height: '100%' }}
            />
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '20px' }}>
        <p>画像編集</p>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        <button onClick={handleImageDelete}>選択画像除去</button>
        <button onClick={() => rotateImage(20)} style={{ marginTop: '10px' }}>20度回転</button>
        <button onClick={() => rotateImage(-20)}>20度逆回転</button>
        <button onClick={enlargeImage} style={{ marginTop: '10px' }}>拡大</button>
        <button onClick={shrinkImage}>縮小</button>
        <button onClick={bringImageForward} style={{ marginTop: '10px' }}>前に移動</button>
        <button onClick={sendImageBackward}>後ろに移動</button>
        <button onClick={handleCancel}>選択解除</button>
        <p>背景もしくは背景色を選択</p>
        <input type="file" accept="image/*" onChange={handleBackgroundChange} style={{ marginTop: '10px' }} />

        <div style={{ marginTop: '10px' }}>
          <CirclePicker onChangeComplete={(color) => handleBackgroundColorChange(color.hex)} />
        </div>
      </div>
    </div>
    </div>
  );
};

export default CreateGrave;
