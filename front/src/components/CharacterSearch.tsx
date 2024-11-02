// src/components/CharacterSearch.tsx
// CreateGraveにキャラクター検索,タイトル検索


import React, { useContext, useState } from 'react';
import { AnimeApi, Character, Anime } from '../context/AnimeApi';

const CharacterSearch: React.FC = () => {
    const [searchName, setSearchName] = useState('');
    const [searchTitle, setSearchTitle] = useState('');
  
    // useContextを使ってコンテキストを取得
    const context = useContext(AnimeApi);
    
    // contextがundefinedの場合の処理を追加
    if (!context) {
      throw new Error('CharacterSearch must be used within an ApiProvider');
    }
  
    const { characters, fetchCharacters, error, animeTitles, fetchAnimeTitles, selectedCharacter, setSelectedCharacter, selectedAnime, setSelectedAnime,  } = context;

    const handleSearch = () => {
        fetchCharacters(searchName);
    };

    const handleSearchTitle = () => {
        fetchAnimeTitles(searchTitle);
    };

    const handleSelectCharacter = (character: Character) => {
        setSelectedCharacter(character); // キャラクターを選択して状態に保存
        console.log(character)
    };

    const handleSelectAnime = (anime: Anime) => {
        setSelectedAnime(anime); // キャラクターを選択して状態に保存
        console.log(anime);
    };



    console.log("titel", animeTitles)
    return (
        <div>
            <label>キャラクター検索</label>
            <input
                type="text"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                placeholder="キャラクター名を入力"
            />
            <button onClick={handleSearch}>検索</button>

            {error && <p>{error}</p>}

            <ul
                style={{
                    maxHeight: '100px', // スクロールバーを表示するための最大高さ
                    overflowY: 'auto',   // 垂直方向にスクロールを有効化
                    border: '1px solid #ddd', // 見やすいように境界線を追加
                    padding: '10px',
                    margin: '0',
                }}
            >
                {characters.map((character: Character) => (
                    <li key={character.id}>
                        <div>
                            <label>・{character.name} </label>
                            <button onClick={() => handleSelectCharacter(character)}>決定</button>
                        </div>
                    </li>
                ))}
            </ul>

            <label>タイトル検索</label>
            <input
                type="text"
                value={searchTitle}
                onChange={(e) => setSearchTitle(e.target.value)}
                placeholder="タイトル検索"
            />
            <button onClick={handleSearchTitle}>検索</button>

            {error && <p>{error}</p>}

            <ul
                style={{
                    maxHeight: '300px', // スクロールバーを表示するための最大高さ
                    overflowY: 'auto',   // 垂直方向にスクロールを有効化
                    border: '1px solid #ddd', // 見やすいように境界線を追加
                    padding: '10px',
                    margin: '0',
                }}
            >
                {animeTitles.map((anime: Anime) => (
                    <li
                    key={anime.id}
                    style={{
                        marginBottom: '10px',
                        padding: '10px 0',
                        borderTop: '1px solid #ddd',  // 上に線を追加
                        borderBottom: '1px solid #ddd',  // 下に線を追加
                    }}
                >
                    <label>・{anime.title}</label>
                    <button onClick={() => handleSelectAnime(anime)}>決定</button>
                    <p>
                        公式サイト: <a href={anime.official_site_url} target="_blank" rel="noopener noreferrer">
                            {anime.official_site_url}
                        </a>
                    </p>
                    <img
                        src={anime.images.facebook.og_image_url}
                        alt={`${anime.title}の画像`}
                        style={{ width: '100px', height: 'auto' }}
                    />
                </li>
                ))}
            </ul>


        </div>
    );
};

export default CharacterSearch;








// characterの中身
// <li key={character.id}>
// <label>{character.name} </label>
// {/* <label>{character.name} ({character.name_en})</label> */}
// {/* <p>ニックネーム: {character.nickname} / {character.nickname_en}</p>
// <p>誕生日: {character.birthday}</p>
// <p>年齢: {character.age}</p>
// <p>血液型: {character.blood_type}</p>
// <p>身長: {character.height}</p>
// <p>体重: {character.weight}</p>
// <p>国籍: {character.nationality}</p>
// <p>肩書き: {character.occupation}</p>
// <p>紹介: {character.description}</p>
// <p>お気に入り数: {character.favorite_characters_count}</p>
// <p>kind: {character.kind}</p>
// <p>id: {character.id}</p> */}

// </li>

// animeの中身
// <li key={anime.id}>
// <label>{anime.title} ({anime.title_kana})</label>
// <div></div>
// {/* <p>メディア: {anime.media_text} / リリース時期: {anime.season_name_text}</p> */}
// {/* <p>リリース日: {anime.released_on}</p> */}
// <p>公式サイト: <a href={anime.official_site_url} target="_blank" rel="noopener noreferrer">{anime.official_site_url}</a></p>
// {/* <p>Wikipedia: <a href={anime.wikipedia_url} target="_blank" rel="noopener noreferrer">{anime.wikipedia_url}</a></p>
// <p>公式Twitter: <a href={`https://twitter.com/${anime.twitter_username}`} target="_blank" rel="noopener noreferrer">@{anime.twitter_username}</a></p>
// <p>Twitterハッシュタグ: {anime.twitter_hashtag}</p> */}
// {/* <p>エピソード数: {anime.episodes_count}</p> */}
// {/* <p>視聴者数: {anime.watchers_count}</p>
// <p>id: {anime.id}</p> */}
// <img
// src={anime.images.facebook.og_image_url}
// alt={`${anime.title}の画像`}
// style={{ width: '100px', height: 'auto' }} // 幅を100pxに設定し、高さは自動調整
// />
