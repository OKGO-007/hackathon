//墓に直接文字を入れるよりテキストを動かして入れたほうが楽かも

import React, { useRef, useState } from 'react';
import { CirclePicker } from 'react-color';
import Header from './Header';
import SelectGrave from './SelectGrave';
import html2canvas from 'html2canvas';
import { fontOptions } from './Font/fonts.js'; // fontOptionsをインポート

import InputColor from 'react-input-color';

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
  textWrite: Boolean;
  textFont: string;
};


const imageOptions = [
  { label: 'お墓', src: '/images/osoushiki_ohaka.png' },
  // { label: 'bousi', src: '/images/cap.png' },
  { label: 'お墓2', src: '/images/tombstone-151488_640.png' },
  // 他の画像も同様に追加
];

const CreateGrave = () => {
  const [images, setImages] = useState<ImageData[]>([]);
  const [currentImageId, setCurrentImageId] = useState<number | null>(null);
  const dragOffset = useRef<Position>({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const [background, setBackground] = useState<string | null>(null);
  const [background_colore, setBackground_colore] = useState<string | null>(null);

  const [selectedImageSrc, setSelectedImageSrc] = useState<string | null>(null);

  const moveIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const [selectedFont, setSelectedFont] = useState(fontOptions[0].value); // デフォルトフォントを設定
  const [isFrameEnabled, setIsFrameEnabled] = useState<Boolean | null>(false);  //文字のフレームをありかなしか

  const [nameMoveWidth, setNameMoveWidth] = useState<number| null>(1);//名前の移動px数

  // 色関連
  const [colorText, setColorText] = useState('#000000');
  const [colorBack, setColorBack] = useState('#ccc');
  const [colorFrame, setColorFrame] = useState("#000000")
 

  
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
    // 追加: 移動インターバルをクリア
    if (moveIntervalRef.current) {
      clearInterval(moveIntervalRef.current);
      moveIntervalRef.current = null;
    }
  };

  const rotateImage = (angle: number) => {
    if (currentImageId === null) return;

    setImages((prevImages) =>
      prevImages.map((img) =>
        img.id === currentImageId ? { ...img, rotate: img.rotate + angle } : img
      )
    );
  };

  const handleImageResize = (id: number, scaleChange: number) => {
    setImages((prevImages) =>
      prevImages.map((img) => {
        if (img.id === id) {
          const newScale = Math.max(0.1, img.scale + scaleChange);
          
          return { ...img, scale: newScale};
        }
        return img;
      })
    );
  };

  const enlargeImage = () => {
    if (currentImageId === null) return;
    handleImageResize(currentImageId, 0.1);
  };

  const shrinkImage = () => {
    if (currentImageId === null) return;
    handleImageResize(currentImageId, -0.1);
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
          text: "",

          textDirection: 'horizontal',
          textPosition: { x: 0, y: 0 },
          textScale: 1,
          textWrite: false,
          textFont: "",
        },
      ]);
    }
  };

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
        textWrite: true,
        textFont: "",
      },
    ]);
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





  //下記に墓関連の挿入とテキスト入力を行う関数などを書く
  const handleTextChange = (text: string) => {
    if (currentImageId === null) return;


    setImages((prevImages) =>
      prevImages.map((img) =>
        img.id === currentImageId && img.textWrite ? { ...img, text } : img
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

  // 新規: ボタンの長押しによる移動
  const handleMoveText = (dx: number, dy: number) => {
    moveText(dx, dy);
    moveIntervalRef.current = setInterval(() => moveText(dx, dy), 100); // 100ミリ秒ごとに移動
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

  const handleSaveAsImage = async () => {
    const element = document.getElementById('capture-area'); // キャプチャするエリアのIDを指定
  
    // elementがnullでないことを確認
    if (!element) {
      console.error("Element with ID 'capture-area' not found.");
      return;
    }
  
    const canvas = await html2canvas(element);
    const dataURL = canvas.toDataURL('image/png'); // PNG形式の画像データを取得
  
    // 画像として保存する
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'captured-image.png';
    link.click();
  };


  const moveWidth = (move: number) =>{
    setNameMoveWidth(move)
  };

  const handleFrameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsFrameEnabled(event.target.checked); // チェックボックスの状態を更新
  };
 
  return (
    <div>
      <Header />
      
    <div
      style={{
        width: '100vw',
        height: '90vh',
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
        id="capture-area"
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
            <div
              style={{
                position: 'absolute',
                top: image.textPosition.y,
                left: image.textPosition.x,
                whiteSpace: image.textDirection === 'horizontal' ? 'nowrap' : 'normal',
                writingMode: image.textDirection === 'vertical' ? 'vertical-rl' : 'horizontal-tb',
                fontSize: 16 * image.textScale,
                fontFamily: selectedFont,
                color: colorText,
                textShadow: isFrameEnabled
                ? `
                -1px -1px 0 ${colorFrame},  
                1px -1px 0 ${colorFrame},
                -1px  1px 0 ${colorFrame},
                  1px  1px 0 ${colorFrame}
                `
              : 'none', // 縁取りが無効な場合はなし
              }}
            >
              {image.text}
            </div>
          </div>
        ))}
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '400px', width: '100%',marginLeft: '50px', maxHeight: '600px', overflowY: 'auto' }}>
        {/* 墓石編集 */}
        <label style={{ marginTop: '20px' }} >画像選択</label>
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
              <label >墓石の名前:</label>
              <select
                id="font-select"
                value={selectedFont}
                onChange={(e) => setSelectedFont(e.target.value)}
              >
                {fontOptions.map((font) => (
                  <option key={font.value} value={font.value}>
                    {font.label}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="画像に表示するテキスト"
                onChange={(e) => handleTextChange(e.target.value)}
              />

              <label>名前の色:</label>
              <InputColor
                initialValue={colorText} // 文字列型で渡す
                onChange={(value) => setColorText(value.hex)} // valueは{ hex: string; rgb: { r: number; g: number; b: number; a: number; } }の形式
              />

              <div>
                <label>名前の枠色: </label>
                <input
                type="checkbox"
                checked={Boolean(isFrameEnabled)}
                onChange={handleFrameChange}
                />
                <label>有無 </label>
             </div>
              <InputColor
                initialValue={colorFrame} // 文字列型で渡す
                onChange={(value) => setColorFrame(value.hex)} // valueは{ hex: string; rgb: { r: number; g: number; b: number; a: number; } }の形式
              />


              <label>名前の向き:</label>
              <select
                onChange={(e) => handleTextDirectionChange(e.target.value as 'horizontal' | 'vertical')}
              >
                <option value="horizontal">横</option>
                <option value="vertical">縦</option>
              </select>
              <label>名前の移動:</label>
              <div >
                <button 
                  onMouseDown={() => handleMoveText(0, -Number(nameMoveWidth))} 
                  onMouseUp={handleMouseUp} 
                  onMouseLeave={handleMouseUp}
                >
                  上
                </button>
                <button 
                  onMouseDown={() => handleMoveText(0, Number(nameMoveWidth))} 
                  onMouseUp={handleMouseUp} 
                  onMouseLeave={handleMouseUp}
                >
                  下
                </button>
                <button 
                  onMouseDown={() => handleMoveText(-Number(nameMoveWidth), 0)} 
                  onMouseUp={handleMouseUp} 
                  onMouseLeave={handleMouseUp}
                >
                  左
                </button>
                <button 
                  onMouseDown={() => handleMoveText(Number(nameMoveWidth), 0)} 
                  onMouseUp={handleMouseUp} 
                  onMouseLeave={handleMouseUp}
                >
                  右
                </button>

                <label style={{ marginLeft: '20px', fontSize: '10px' }}>移動ピクセル:</label>
                <input
                  type="number"
                  placeholder="px"
                  value={Number(nameMoveWidth)}
                  onChange={(e) => moveWidth(Number(e.target.value))} // 値を数値に変換
                />
              </div>
              <label>名前の大きさ:</label>
              <div>
                {/* style={{ marginTop: '10px' }} */}
                <button onClick={() => scaleText(0.1)}>拡大</button>
                <button onClick={() => scaleText(-0.1)}>縮小</button>
              </div>
            </>
          )}

        <label style={{ marginTop: '20px' }} >画像編集</label>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        <button onClick={handleCancel}>選択解除</button>
        <label>回転:</label>
        <button onClick={() => rotateImage(20)} >20度回転</button>
        <button onClick={() => rotateImage(-20)}>20度逆回転</button>
        <label>拡大縮小:</label>
        <button onClick={enlargeImage} >拡大</button>
        <button onClick={shrinkImage}>縮小</button>
        <label>レイヤー変更:</label>
        <button onClick={bringImageForward} >前に移動</button>
        <button onClick={sendImageBackward}>後ろに移動</button>
        <label style={{ marginTop: '10px' }}>画像除去:</label>
        <button onClick={handleImageDelete}>選択画像除去</button>
        <label style={{ marginTop: '20px' }} >背景もしくは背景色を選択</label>

        <label style={{ marginRight: '20px' }}>背景画像: </label>
        <input type="file" accept="image/*" onChange={handleBackgroundChange} style={{ marginTop: '10px' }} />

        <InputColor
          initialValue={colorBack} // 文字列型で渡す
          onChange={(value) => setBackground_colore(value.hex)} // valueは{ hex: string; rgb: { r: number; g: number; b: number; a: number; } }の形式
        />


        {/* 画像として保存ボタン */}
        <label style={{ marginTop: '20px' }} >画像の保存</label>
        <button onClick={handleSaveAsImage}>保存する</button>
      </div>
    </div>

    </div>
  );
};

export default CreateGrave;
