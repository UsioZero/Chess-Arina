#include <iostream>
#include <cstdint>
#include <bit>
#include <array>
#include <bitset>
#include <cstdint>
#include "../ANSI.cpp"

#pragma once

typedef uint64_t Bitboard;

namespace BitboardOperations {
    //By Index Operations
    static constexpr void set_1(Bitboard &bb, uint8_t square) {
        bb = bb | (1ull << square);
    }
    static constexpr void set_0(Bitboard &bb, uint8_t square) {
        bb = bb & (~(1ull << square));
    }
    static constexpr bool get_bit(Bitboard bb, uint8_t square) {
        return (bb & (1ull << square));
    }
    //Print bitboard
    static void print(Bitboard bb) {
        std::cout << ANSI::Green;

        for (int8_t y = 7; y >= 0; y = y - 1) {
            for (uint8_t x = 0; x < 8; x = x + 1) {
                std::cout << "|  ";

                if (BitboardOperations::get_bit(bb, y * 8 + x)) std::cout << "1";
                else std::cout << "0";

                std::cout << "  ";
            }
            std::cout << "|\n";
        }

        std::cout << ANSI::End;
    }

    //Count 1 in Bitboard

    static constexpr uint8_t count_1(Bitboard bb) {
        bb -= (bb>>1) & 0x5555555555555555llu;
        bb = ((bb>>2) & 0x3333333333333333llu ) + (bb & 0x3333333333333333llu);
        bb = ((((bb>>4) + bb) & 0x0F0F0F0F0F0F0F0Fllu) * 0x0101010101010101) >> 56;
    return bb; 
    }


    static constexpr std::array<uint8_t, 64> BitScanTable = {
            0, 47,  1, 56, 48, 27,  2, 60,
            57, 49, 41, 37, 28, 16,  3, 61,
            54, 58, 35, 52, 50, 42, 21, 44,
            38, 32, 29, 23, 17, 11,  4, 62,
            46, 55, 26, 59, 40, 36, 15, 53,
            34, 51, 20, 43, 31, 22, 10, 45,
            25, 39, 14, 33, 19, 30,  9, 24,
            13, 18,  8, 12,  7,  6,  5, 63
    };

    // Get first 1 
    static constexpr uint8_t bsf(Bitboard bb) {
        return BitboardOperations::BitScanTable[((bb ^ (bb - 1)) * 0x03f79d71b4cb0a89) >> 58];
    }
    //get last 1
    static constexpr uint8_t bsr(Bitboard bb) {
        bb = bb | (bb >> 1);
        bb = bb | (bb >> 2);
        bb = bb | (bb >> 4);
        bb = bb | (bb >> 8);
        bb = bb | (bb >> 16);
        bb = bb | (bb >> 32);
        return BitboardOperations::BitScanTable[(bb * 0x03f79d71b4cb0a89) >> 58];
    }
}
