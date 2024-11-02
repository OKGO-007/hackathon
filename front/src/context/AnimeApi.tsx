// src/context/AnimeApi.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import axios from 'axios';

// Character 型を定義しエクスポート
export interface Character {
    id: number;
    name: string;
    name_kana: string;
    name_en: string;
    nickname: string;
    nickname_en: string;
    birthday: string;
    age: string;
    blood_type: string;
    height: string;
    weight: string;
    nationality: string;
    occupation: string;
    description: string;
    favorite_characters_count: number;
    kind: string;
}

// Anime 型を定義しエクスポート
export interface Anime {
    id: number;
    title: string;
    title_kana: string;
    media: string;
    media_text: string;
    season_name: string;
    season_name_text: string;
    released_on: string;
    official_site_url: string;
    wikipedia_url: string;
    twitter_username: string;
    twitter_hashtag: string;
    episodes_count: number;
    watchers_count: number;
    images: {
        recommended_url: string;
        facebook: {
            og_image_url: string;
        };
        twitter: {
            mini_avatar_url: string;
            normal_avatar_url: string;
            bigger_avatar_url: string;
            original_avatar_url: string;
            image_url: string;
        };
    };
}

// コンテキストの型定義
interface CharacterContextType {
    characters: Character[];
    fetchCharacters: (name: string) => void;
    error: string | null;
    animeTitles: Anime[];
    fetchAnimeTitles: (title: string) => void;
    selectedCharacter: Character | null; // 修正: キャラクター型に変更
    setSelectedCharacter: (character: Character | null) => void; // 修正: キャラクター型に変更
    selectedAnime: Anime | null;
    setSelectedAnime: (character: Anime | null) => void; // 修正: キャラクター型に変更
}

export const AnimeApi = createContext<CharacterContextType | undefined>(undefined);

const ApiProvider = ({ children }: { children: ReactNode }) => {
    const [characters, setCharacters] = useState<Character[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [animeTitles, setAnimeTitles] = useState<Anime[]>([]);
    const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null); // 修正: Character型に変更
    const [selectedAnime, setSelectedAnime] = useState<Anime | null>(null); // 修正: Character型に変更

    const fetchCharacters = async (name: string) => {
        try {
            const response = await axios.get(
                `https://api.annict.com/v1/characters`, 
                {
                    headers: {
                        Authorization: `Bearer ${process.env.REACT_APP_ANNICT_ACCESS_TOKEN}`
                    },
                    params: {
                        filter_name: name,
                        per_page: 10
                    }
                }
            );
            setCharacters(response.data.characters);
        } catch (err) {
            setError('キャラクターの取得に失敗しました');
            console.error(err);
        }
    };

    const fetchAnimeTitles = async (title: string) => {
        try {
            const response = await axios.get(
                `https://api.annict.com/v1/works`, 
                {
                    headers: {
                        Authorization: `Bearer ${process.env.REACT_APP_ANNICT_ACCESS_TOKEN}`
                    },
                    params: {
                        filter_title: title,
                        per_page: 10
                    }
                }
            );
            setAnimeTitles(response.data.works);
        } catch (err) {
            setError('アニメタイトルの取得に失敗しました');
            console.error(err);
        }
    };

    return (
        <AnimeApi.Provider
            value={{
                characters,
                fetchCharacters,
                error,
                animeTitles,
                fetchAnimeTitles,
                selectedCharacter,
                setSelectedCharacter,
                selectedAnime, 
                setSelectedAnime, 
            }}
        >
            {children}
        </AnimeApi.Provider>
    );
};

export default ApiProvider;
