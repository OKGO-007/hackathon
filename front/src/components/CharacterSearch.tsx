// src/components/CharacterSearch.tsx
import React, { useContext, useState } from 'react';
import { AnimeApi, Character, Anime } from '../context/AnimeApi';

const CharacterSearch: React.FC = () => {
    const [searchName, setSearchName] = useState('');
    const [searchTitle, setSearchTitle] = useState('');

    const context = useContext(AnimeApi);

    if (!context) {
        throw new Error('CharacterSearch must be used within an ApiProvider');
    }

    const {
        characters,
        fetchCharacters,
        error,
        animeTitles,
        fetchAnimeTitles,
        selectedCharacter,
        setSelectedCharacter,
        selectedAnime,
        setSelectedAnime,
    } = context;

    const handleSearch = () => {
        fetchCharacters(searchName);
    };

    const handleSearchTitle = () => {
        fetchAnimeTitles(searchTitle);
    };

    const handleSelectCharacter = (character: Character) => {
        setSelectedCharacter(character);
    };

    const handleSelectAnime = (anime: Anime) => {
        setSelectedAnime(anime);
    };

    return (
        <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto', border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>

            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                <label style={{ marginRight: '10px' }}>キャラクター名:</label>
                <input
                    type="text"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                    placeholder="キャラクター名を入力"
                    style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd', flex: 1, marginRight: '10px' }}
                />
                <button onClick={handleSearch} style={{ padding: '8px 16px', borderRadius: '4px', backgroundColor: '#007bff', color: '#fff', border: 'none', cursor: 'pointer' }}>
                    検索
                </button>
            </div>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <ul style={{
                maxHeight: '150px',
                overflowY: 'auto',
                border: '1px solid #ddd',
                padding: '10px',
                listStyle: 'none',
                margin: '10px 0',
                borderRadius: '4px',
                backgroundColor: '#f9f9f9',
            }}>
                {characters.map((character: Character) => (
                    <li key={character.id} style={{ padding: '5px 0', borderBottom: '1px solid #ddd' }}>
                        <label>{character.name}</label>
                        <button onClick={() => handleSelectCharacter(character)} style={{ marginLeft: '10px', padding: '4px 8px', borderRadius: '4px', backgroundColor: '#28a745', color: '#fff', border: 'none', cursor: 'pointer' }}>
                            決定
                        </button>
                    </li>
                ))}
            </ul>

            <div style={{ display: 'flex', alignItems: 'center', marginTop: '30px', marginBottom: '20px' }}>
                <label style={{ marginRight: '10px' }}>タイトル検索:</label>
                <input
                    type="text"
                    value={searchTitle}
                    onChange={(e) => setSearchTitle(e.target.value)}
                    placeholder="タイトルを入力"
                    style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd', flex: 1, marginRight: '10px' }}
                />
                <button onClick={handleSearchTitle} style={{ padding: '8px 16px', borderRadius: '4px', backgroundColor: '#007bff', color: '#fff', border: 'none', cursor: 'pointer' }}>
                    検索
                </button>
            </div>

            <ul style={{
                maxHeight: '200px',
                overflowY: 'auto',
                border: '1px solid #ddd',
                padding: '10px',
                listStyle: 'none',
                margin: '10px 0',
                borderRadius: '4px',
                backgroundColor: '#f9f9f9',
            }}>
                {animeTitles.map((anime: Anime) => (
                    <li key={anime.id} style={{ padding: '10px 0', borderBottom: '1px solid #ddd' }}>
                        <label>{anime.title}</label>
                        <button onClick={() => handleSelectAnime(anime)} style={{ marginLeft: '10px', padding: '4px 8px', borderRadius: '4px', backgroundColor: '#28a745', color: '#fff', border: 'none', cursor: 'pointer' }}>
                            決定
                        </button>
                        <p style={{ fontSize: '0.9em', margin: '5px 0' }}>
                            公式サイト: <a href={anime.official_site_url} target="_blank" rel="noopener noreferrer" style={{ color: '#007bff' }}>{anime.official_site_url}</a>
                        </p>
                        <img src={anime.images.facebook.og_image_url} alt={`${anime.title}の画像`} style={{ width: '100px', height: 'auto', borderRadius: '4px' }} />
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CharacterSearch;
