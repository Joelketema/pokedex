import {
  formatPokemonId,
  formatDimensions,
  transformPokemonDetail,
} from "../../services/queries/pokemonQueries";
import { PokemonDetail } from "../../interfaces/pokemon";

describe("pokemonQueries utilities", () => {
  describe("formatPokemonId", () => {
    it("should format single digit IDs with padded zeros (e.g. 1 -> #001)", () => {
      expect(formatPokemonId(1)).toBe("#001");
    });

    it("should format double digit IDs with padded zeros (e.g. 25 -> #025)", () => {
      expect(formatPokemonId(25)).toBe("#025");
    });

    it("should format triple digit IDs correctly (e.g. 150 -> #150)", () => {
      expect(formatPokemonId(150)).toBe("#150");
    });
  });

  describe("formatDimensions", () => {
    it("should correctly convert height in dm and weight in hg to imperial and metric strings", () => {
      const { heightFormatted, weightFormatted } = formatDimensions(7, 69);
      expect(heightFormatted).toContain("0.7m");
      expect(weightFormatted).toContain("6.9 kg");
      expect(weightFormatted).toContain("15.2 lbs");
    });
  });

  describe("transformPokemonDetail", () => {
    it("should correctly transform raw PokeAPI PokemonDetail into FormattedPokemon", () => {
      const mockRawData: PokemonDetail = {
        id: 1,
        name: "bulbasaur",
        height: 7,
        weight: 69,
        base_experience: 64,
        types: [
          { slot: 1, type: { name: "grass", url: "" } },
          { slot: 2, type: { name: "poison", url: "" } },
        ],
        stats: [
          { base_stat: 45, effort: 0, stat: { name: "hp", url: "" } },
          { base_stat: 49, effort: 0, stat: { name: "attack", url: "" } },
          { base_stat: 49, effort: 0, stat: { name: "defense", url: "" } },
          { base_stat: 45, effort: 0, stat: { name: "speed", url: "" } },
        ],
        moves: [{ move: { name: "tackle", url: "" } }],
        sprites: {
          front_default: "https://example.com/sprite.png",
          other: {
            "official-artwork": {
              front_default: "https://example.com/artwork.png",
            },
          },
        },
      };

      const result = transformPokemonDetail(mockRawData);

      expect(result.id).toBe(1);
      expect(result.formattedId).toBe("#001");
      expect(result.displayName).toBe("Bulbasaur");
      expect(result.image).toBe("https://example.com/artwork.png");
      expect(result.types).toEqual(["grass", "poison"]);
      expect(result.stats.hp).toBe(45);
      expect(result.stats.attack).toBe(49);
    });
  });
});
