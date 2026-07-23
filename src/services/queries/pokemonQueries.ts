import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { apiClient } from "../api/apiClient";
import {
  PokemonListResponse,
  PokemonDetail,
  FormattedPokemon,
} from "../../interfaces/pokemon";

// Helper to format ID like #001
export const formatPokemonId = (id: number): string => {
  return `#${id.toString().padStart(3, "0")}`;
};

// Helper to format height and weight
export const formatDimensions = (heightDm: number, weightHg: number) => {
  const meters = (heightDm / 10).toFixed(1);
  const totalInches = Math.round(heightDm * 3.93701);
  const feet = Math.floor(totalInches / 12);
  const inches = totalInches % 12;
  const heightFormatted = `${feet}'${inches.toString().padStart(2, "0")}" (${meters}m)`;

  const kg = (weightHg / 10).toFixed(1);
  const lbs = (weightHg * 0.220462).toFixed(1);
  const weightFormatted = `${lbs} lbs (${kg} kg)`;

  return { heightFormatted, weightFormatted };
};

// Transform raw API response to FormattedPokemon
export const transformPokemonDetail = (data: PokemonDetail): FormattedPokemon => {
  const { heightFormatted, weightFormatted } = formatDimensions(
    data.height,
    data.weight
  );

  const getStat = (statName: string): number => {
    const slot = data.stats.find((s) => s.stat.name === statName);
    return slot ? slot.base_stat : 0;
  };

  const image =
    data.sprites.other?.["official-artwork"]?.front_default ||
    data.sprites.other?.home?.front_default ||
    data.sprites.front_default ||
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${data.id}.png`;

  const backImage =
    data.sprites.back_default ||
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/${data.id}.png`;

  return {
    id: data.id,
    formattedId: formatPokemonId(data.id),
    name: data.name,
    displayName: data.name.charAt(0).toUpperCase() + data.name.slice(1),
    image,
    backImage,
    types: data.types.map((t) => t.type.name),
    heightFormatted,
    weightFormatted,
    stats: {
      hp: getStat("hp"),
      attack: getStat("attack"),
      defense: getStat("defense"),
      speed: getStat("speed"),
    },
    moves: data.moves.map((m) => m.move.name),
  };
};

// Fetch single Pokemon details by name or ID using apiClient
export const fetchPokemonDetail = async (nameOrId: string | number): Promise<FormattedPokemon> => {
  const response = await apiClient<any, PokemonDetail>({
    url: `pokemon/${nameOrId.toString().toLowerCase()}`,
    method: "GET",
  });
  return transformPokemonDetail(response.data);
};

// Hook to fetch Pokemon List with pagination
export const useGetPokemonList = (limit = 20) => {
  return useInfiniteQuery({
    queryKey: ["pokemonList", limit],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await apiClient<any, PokemonListResponse>({
        url: "pokemon",
        method: "GET",
        params: {
          limit,
          offset: pageParam,
        },
      });

      // Fetch details for each item in parallel to get images, types, and stats
      const itemsWithDetails = await Promise.all(
        response.data.results.map(async (item) => {
          try {
            return await fetchPokemonDetail(item.name);
          } catch (e) {
            // Fallback if detail fetch fails for an individual pokemon
            return null;
          }
        })
      );

      const validDetails = itemsWithDetails.filter(
        (item): item is FormattedPokemon => item !== null
      );

      return {
        results: validDetails,
        nextOffset: pageParam + limit,
        hasMore: !!response.data.next,
      };
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.nextOffset : undefined),
  });
};

// Hook to fetch single Pokemon by name/ID for detail screen or search
export const useGetPokemonDetail = (nameOrId: string | number) => {
  return useQuery({
    queryKey: ["pokemonDetail", nameOrId],
    queryFn: () => fetchPokemonDetail(nameOrId),
    enabled: !!nameOrId,
  });
};
