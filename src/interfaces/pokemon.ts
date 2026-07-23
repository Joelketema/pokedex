export interface PokemonListItem {
  name: string;
  url: string;
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListItem[];
}

export interface PokemonTypeSlot {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

export interface PokemonStatSlot {
  base_stat: number;
  effort: number;
  stat: {
    name: string;
    url: string;
  };
}

export interface PokemonMoveSlot {
  move: {
    name: string;
    url: string;
  };
}

export interface PokemonDetail {
  id: number;
  name: string;
  height: number; // in decimetres
  weight: number; // in hectograms
  base_experience: number;
  types: PokemonTypeSlot[];
  stats: PokemonStatSlot[];
  moves: PokemonMoveSlot[];
  sprites: {
    front_default: string;
    back_default?: string;
    other?: {
      "official-artwork"?: {
        front_default: string;
      };
      home?: {
        front_default: string;
      };
    };
  };
}

export interface FormattedPokemon {
  id: number;
  formattedId: string; // e.g. #001
  name: string;
  displayName: string;
  image: string;
  backImage?: string;
  types: string[];
  heightFormatted: string; // e.g. 2'04" (0.7m)
  weightFormatted: string; // e.g. 15.4 lbs (7.0 kg)
  stats: {
    hp: number;
    attack: number;
    defense: number;
    speed: number;
  };
  moves: string[];
}
