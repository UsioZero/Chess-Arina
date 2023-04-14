#include "../PositionRepresentation/Bitboard.cpp"


#pragma once


namespace KingMasks {
    static uint8_t abs_subtract(uint8_t left, uint8_t right) {
        if (left >= right) return left - right;
        return right - left;
    }
    static const std::array<Bitboard, 64> calc_masks() {
        std::array<Bitboard, 64> masks{};

        uint8_t dx;
        uint8_t dy;

        for (uint8_t x0 = 0; x0 < 8; x0 = x0 + 1) {
            for (uint8_t y0 = 0; y0 < 8; y0 = y0 + 1) {

                for (uint8_t x1 = 0; x1 < 8; x1 = x1 + 1) {
                    for (uint8_t y1 = 0; y1 < 8; y1 = y1 + 1) {

                        dx = KingMasks::abs_subtract(x0, x1);
                        dy = KingMasks::abs_subtract(y0, y1);

                        if (dx <= 1 && dy <= 1) BitboardOperations::set_1(masks[y0 * 8 + x0], y1 * 8 + x1);
                    }
                }
            }
        }

        return masks;
    }


    static const std::array<Bitboard, 64> Masks = KingMasks::calc_masks();
}
