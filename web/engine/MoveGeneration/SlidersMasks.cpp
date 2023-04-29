#include <map>
#include <functional>
#include "../PositionRepresentation/Bitboard.cpp"
#include "Direction.cpp"

#pragma once


namespace SlidersMasks {
    

    static const Bitboard calc_mask(uint8_t p, int8_t direction) {
        Bitboard mask = 0;

        int8_t x = p % 8;
        int8_t y = p / 8;

        std::map<int8_t, std::pair<int, int>> direction_map {
            {Direction::North, {0, 1}},
            {Direction::South, {0, -1}},
            {Direction::West, {-1, 0}},
            {Direction::East, {1, 0}},
            {Direction::NorthWest, {-1, 1}},
            {Direction::NorthEast, {1, 1}},
            {Direction::SouthWest, {-1, -1}},
            {Direction::SouthEast, {1, -1}}
        };

        for (; ;) {

            auto it = direction_map.find(direction);
            if (it != direction_map.end()) {
                x += it->second.first;
                y += it->second.second;
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
