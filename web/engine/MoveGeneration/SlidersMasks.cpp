#include "../PositionRepresentation/Bitboard.cpp"
#include "Direction.cpp"


#pragma once


namespace SlidersMasks {
    

    static const Bitboard calc_mask(uint8_t p, int8_t direction) {
        Bitboard mask = 0;

        int8_t x = p % 8;
        int8_t y = p / 8;

        for (; ;) {
            switch (direction) {
                case Direction::North: y = y + 1; break;
                case Direction::South: y = y - 1; break;
                case Direction::West: x = x - 1; break;
                case Direction::East: x = x + 1; break;

                case Direction::NorthWest: y = y + 1; x = x - 1; break;
                case Direction::NorthEast: y = y + 1; x = x + 1; break;
                case Direction::SouthWest: y = y - 1; x = x - 1; break;
                case Direction::SouthEast: y = y - 1; x = x + 1; break;
            }

            if (x > 7 || x < 0 || y > 7 || y < 0) break;

            BitboardOperations::set_1(mask, y * 8 + x);
        }

        return mask;
    }


    static const std::array<std::array<Bitboard, 8>, 64> calc_masks() {
        std::array<std::array<Bitboard, 8>, 64> masks{};

        for (uint8_t i = 0; i < 64; i = i + 1) {
            for (uint8_t j = 0; j < 8; j = j + 1) masks[i][j] = SlidersMasks::calc_mask(i, j);
        }

        return masks;
    }


    static const std::array<std::array<Bitboard, 8>, 64> Masks = SlidersMasks::calc_masks();
};
